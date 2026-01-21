import { arrayBufferToBase64, floatTo16BitPCM, resampleTo16kHZ } from './audio-utils';

type GeminiConfig = {
    apiKey: string;
    systemInstruction?: string;
};

export class GeminiLiveClient {
    private ws: WebSocket | null = null;
    private audioContext: AudioContext | null = null;
    private mediaStream: MediaStream | null = null;
    private processor: ScriptProcessorNode | null = null;
    private inputSource: MediaStreamAudioSourceNode | null = null;
    public get recording(): boolean {
        return this.isRecording;
    }
    private isRecording = false;
    private initialConfig: GeminiConfig;

    public onAudioData: (level: number) => void = () => { };
    public onDisconnect: () => void = () => { };
    public onConnect: () => void = () => { };

    constructor(config: GeminiConfig) {
        this.initialConfig = config;
    }

    async connect() {
        const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${this.initialConfig.apiKey}`;

        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
            console.log('Connected to Gemini Live');
            this.sendInitialSetup();
            this.onConnect();
        };

        this.ws.onmessage = async (event) => {
            await this.handleMessage(event);
        };

        this.ws.onerror = (err) => {
            console.error('Gemini WS Error:', err);
        };

        this.ws.onclose = () => {
            console.log('Gemini WS Closed');
            this.onDisconnect();
        };
    }

    private sendInitialSetup() {
        if (!this.ws) return;

        const setupMessage = {
            setup: {
                model: "models/gemini-2.5-flash-native-audio-preview-12-2025",
                generation_config: {
                    response_modalities: ["AUDIO"],
                    speech_config: {
                        voice_config: {
                            prebuilt_voice_config: {
                                voice_name: "Aoede" // Valid names: Aoede, Charon, Fenrir, Kore, Puck
                            }
                        }
                    }
                },
                system_instruction: {
                    parts: [{ text: this.initialConfig.systemInstruction || "You are a helpful assistant." }]
                }
            }
        };

        this.ws.send(JSON.stringify(setupMessage));
    }

    async startAudio() {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
            sampleRate: 24000, // Matching Gemini output rate usually helps
        });

        try {
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000
                }
            });

            this.inputSource = this.audioContext.createMediaStreamSource(this.mediaStream);
            this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

            this.inputSource.connect(this.processor);
            this.processor.connect(this.audioContext.destination);

            this.processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);

                // Calculate volume for visualizer
                let sum = 0;
                for (let i = 0; i < inputData.length; i++) {
                    sum += inputData[i] * inputData[i];
                }
                const rms = Math.sqrt(sum / inputData.length);
                this.onAudioData(rms);

                // Send to Gemini
                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                    const resampled = resampleTo16kHZ(inputData, this.audioContext!.sampleRate);
                    const pcm16 = floatTo16BitPCM(resampled);
                    const base64Audio = arrayBufferToBase64(pcm16);

                    this.ws.send(JSON.stringify({
                        realtime_input: {
                            media_chunks: [{
                                mime_type: "audio/pcm",
                                data: base64Audio
                            }]
                        }
                    }));
                }
            };

            this.isRecording = true;

        } catch (err) {
            console.error('Error accessing microphone:', err);
        }
    }

    private async handleMessage(event: MessageEvent) {
        let data;
        if (event.data instanceof Blob) {
            const text = await event.data.text();
            data = JSON.parse(text);
        } else {
            data = JSON.parse(event.data);
        }

        if (data.serverContent?.modelTurn?.parts) {
            for (const part of data.serverContent.modelTurn.parts) {
                if (part.inlineData?.data) {
                    this.playAudioChunk(part.inlineData.data);
                }
            }
        }
    }

    private nextStartTime = 0;

    private playAudioChunk(base64Audio: string) {
        if (!this.audioContext) return;

        const binaryString = window.atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const int16 = new Int16Array(bytes.buffer);
        const float32 = new Float32Array(int16.length);
        for (let i = 0; i < int16.length; i++) {
            float32[i] = int16[i] / 32768.0;
        }

        const buffer = this.audioContext.createBuffer(1, float32.length, 24000);
        buffer.getChannelData(0).set(float32);

        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);

        const currentTime = this.audioContext.currentTime;
        if (this.nextStartTime < currentTime) {
            this.nextStartTime = currentTime;
        }

        source.start(this.nextStartTime);
        this.nextStartTime += buffer.duration;
    }

    disconnect() {
        this.isRecording = false;
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }
        if (this.processor) {
            this.processor.disconnect();
            this.processor = null;
        }
        if (this.inputSource) {
            this.inputSource.disconnect();
            this.inputSource = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }
}
