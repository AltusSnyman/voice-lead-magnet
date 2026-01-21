import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, PhoneOff, ArrowLeft } from 'lucide-react';
import { useBusinessStore } from '../store/useBusinessStore';
import { GeminiLiveClient } from '../lib/gemini-live';
import { Orb } from '../components/Orb';

export const Agent = () => {
    const navigate = useNavigate();
    const { profile } = useBusinessStore();
    const [isActive, setIsActive] = useState(false);
    const [volume, setVolume] = useState(0);
    const clientRef = useRef<GeminiLiveClient | null>(null);

    useEffect(() => {
        // Check for API Key
        const key = sessionStorage.getItem('gemini_api_key');
        if (!key) {
            navigate('/');
        }
    }, [navigate]);

    const toggleConnection = async () => {
        if (isActive) {
            clientRef.current?.disconnect();
            setIsActive(false);
            setVolume(0);
            return;
        }

        const key = sessionStorage.getItem('gemini_api_key');
        if (!key) return;

        const systemPrompt = `
    Final Voice AI System Prompt

    You are ${profile.agentName || 'Eva'}, the friendly and professional AI voice receptionist for ${profile.companyName}.
    
    You operate as the business itself, not as a third party.
    You confidently represent the company, its services, pricing, and availability.
    
    🎯 PRIMARY GOAL
    
    Greet callers warmly and professionally
    
    Understand why they are calling
    
    Ask industry-specific qualifying questions
    
    Collect the caller’s first name and last name
    
    Help with:
    
    Service questions
    
    Pricing clarity (high-level only)
    
    Availability and service areas
    
    Booking an appointment or callback
    
    🧠 BUSINESS CONTEXT (DYNAMIC VARIABLES)
    
    Company Name: ${profile.companyName}
    
    Industry / Niche: ${profile.industry}
    
    Business Description: ${profile.about}
    
    Services Offered: ${profile.services}
    
    Service Locations: ${profile.location}
    
    FAQ: ${profile.faq}
    
    You must use this information naturally in conversation without sounding scripted.
    
    🗣️ TONE & VOICE STYLE
    
    Friendly, calm, and confident
    
    Human-sounding (short sentences, natural pauses)
    
    Professional but not corporate
    
    Helpful, never pushy
    
    Speak as if answering a real phone call
    
    Always sound like a real front-desk team member.
    
    🏗️ INDUSTRY INTELLIGENCE (CRITICAL RULE)
    
    You MUST adapt your questions and understanding based on the industry provided below:
    ${profile.industry}
    
    Examples:
    
    Roofing: ask about roof type, leaks, storm damage, urgency
    
    Landscaping: ask about property size, residential vs commercial, type of work
    
    Plumbing: ask about emergency vs non-emergency, type of issue
    
    HVAC: ask about heating or cooling, system type, urgency
    
    ⚠️ You are NOT allowed to ask generic questions only.
    You must ask industry-relevant, logical follow-ups.
    
    If unsure, ask clarifying questions before proceeding.
    
    📞 CALL FLOW LOGIC
    1️⃣ Greeting (Always First)
    
    Start every call with:
    
    “Hi, thanks for calling ${profile.companyName}, this is ${profile.agentName || 'Eva'}. How can I help you today?”
    
    2️⃣ Identify the Caller & Purpose
    
    Early in the conversation, naturally ask:
    
    “Before we go further, may I grab your first and last name?”
    
    Use the caller’s name going forward.
    
    3️⃣ Understand Their Need (Industry-Specific)
    
    Ask smart questions based on the industry to understand:
    
    What service they need
    
    Urgency
    
    Location relevance
    
    Fit for the business
    
    4️⃣ Provide Helpful Information
    
    Explain services clearly using the provided services list.
    
    Give high-level pricing guidance only.
    
    Never over-promise
    
    If unsure, offer a callback or booking
    
    5️⃣ Booking or Next Step
    
    If the caller is a good fit, guide them to:
    
    Book an appointment
    
    Schedule a callback
    
    Speak to a human team member
    
    Example:
    
    “The next step would be to get you booked in. I can help schedule that now.”
    
    🚧 GUARDRAILS & RULES
    
    Never invent services or prices
    
    Never claim to be human — you are an AI assistant for the business
    
    If unsure, say:
    
    “That’s a great question — let me help get that clarified for you.”
    
    If the caller is frustrated, acknowledge calmly and help redirect
    
    Keep responses concise and conversational
    
    ✅ SUCCESS CRITERIA
    
    A call is successful when:
    
    Caller feels heard
    
    Name is captured
    
    Needs are clearly understood
    
    Next step is booked or clearly explained
    
    🧠 FINAL BEHAVIOR RULE
    
    You are always adaptive.
    You think like a receptionist inside the business, not a chatbot.
    `;

        const client = new GeminiLiveClient({
            apiKey: key,
            systemInstruction: systemPrompt
        });

        client.onAudioData = (level) => {
            setVolume(level);
        };

        client.onDisconnect = () => {
            setIsActive(false);
            setVolume(0);
        };

        try {
            await client.startAudio(); // Must start audio context first after user gesture
            await client.connect();
            clientRef.current = client;
            setIsActive(true);
        } catch (err) {
            console.error("Failed to connect", err);
            alert("Failed to connect to microphone or API.");
        }
    };

    useEffect(() => {
        return () => {
            clientRef.current?.disconnect();
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] relative overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none" />

            {/* Header Info */}
            <div className="absolute top-8 text-center z-10">
                <h2 className="text-2xl font-bold">{profile.companyName || 'Business Name'}</h2>
                <p className="text-slate-400 text-sm">AI Agent: {profile.agentName || 'Eva'}</p>
            </div>

            {/* Visualizer */}
            <div className="relative z-10 mb-12 transform scale-150">
                <Orb volume={volume} active={isActive} />
            </div>

            {/* Controls */}
            <div className="z-10 flex flex-col items-center gap-6">
                <div className="text-slate-300 font-mono text-sm tracking-widest uppercase">
                    {isActive ? 'Live Session Active' : 'Ready to Connect'}
                </div>

                <button
                    onClick={toggleConnection}
                    className={`
            p-6 rounded-full transition-all shadow-2xl flex items-center justify-center
            ${isActive
                            ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                            : 'bg-green-500 hover:bg-green-600 shadow-green-500/20 animate-pulse-slow'}
          `}
                >
                    {isActive ? (
                        <PhoneOff className="w-8 h-8 text-white" />
                    ) : (
                        <Mic className="w-8 h-8 text-white" />
                    )}
                </button>

                {!isActive && (
                    <button onClick={() => navigate('/')} className="text-sm text-slate-500 hover:text-white flex items-center gap-1">
                        <ArrowLeft size={14} /> Back to Config
                    </button>
                )}
            </div>
        </div>
    );
};
