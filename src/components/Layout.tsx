import type { ReactNode } from 'react';
import { Bot, Sparkles } from 'lucide-react';

export const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
            </div>

            <nav className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">VoiceGen</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                            <Sparkles className="w-3 h-3 text-yellow-400" />
                            Gemini 2.0 Flash
                        </span>
                    </div>
                </div>
            </nav>

            <main className="relative z-10">
                {children}
            </main>
        </div>
    );
};
