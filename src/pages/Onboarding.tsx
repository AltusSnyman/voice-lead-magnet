import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, MessageSquare, MapPin, BadgeDollarSign, User } from 'lucide-react';
import { useBusinessStore } from '../store/useBusinessStore';
import { useState } from 'react';

export const Onboarding = () => {
    const navigate = useNavigate();
    const { profile, setProfile } = useBusinessStore();
    // NOTE: API Key must be entered by the user.
    const [apiKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKey) {
            // Save API Key to session storage to avoid persisting it in local storage forever if we don't want to
            sessionStorage.setItem('gemini_api_key', apiKey);
        }
        navigate('/agent');
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
                    Build Your Voice Agent
                </h1>
                <p className="text-slate-400 text-lg">
                    Configure your business profile and let our AI embody your brand.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Business Identity */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Building2 className="text-indigo-400" />
                        Business Identity
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Company Name</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                                placeholder="Acme Plumbing"
                                value={profile.companyName}
                                onChange={(e) => setProfile({ companyName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Industry</label>
                            <input
                                type="text"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                                placeholder="Home Services"
                                value={profile.industry}
                                onChange={(e) => setProfile({ industry: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="mt-6 space-y-2">
                        <label className="text-sm font-medium text-slate-300">About the Business</label>
                        <textarea
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600 min-h-[100px]"
                            placeholder="We are a family-owned plumbing business serving the greater Seattle area since 1995..."
                            value={profile.about}
                            onChange={(e) => setProfile({ about: e.target.value })}
                        />
                    </div>
                </div>

                {/* Section 2: Knowledge Base */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <BadgeDollarSign className="text-purple-400" />
                        Services & Pricing
                    </h2>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Details</label>
                        <textarea
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-slate-600 min-h-[120px]"
                            placeholder={`- Drain Cleaning: $150\n- Water Heater Repair: $300+\n- Emergency Callout: $99`}
                            value={profile.services}
                            onChange={(e) => setProfile({ services: e.target.value })}
                        />
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex gap-2 items-center"><MapPin size={16} /> Service Area / Location</label>
                            <input
                                type="text"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                                placeholder="Downtown & Suburbs"
                                value={profile.location}
                                onChange={(e) => setProfile({ location: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex gap-2 items-center"><MessageSquare size={16} /> Common FAQs</label>
                            <textarea
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-slate-600 min-h-[120px]"
                                placeholder="Do you offer 24/7 service?"
                                value={profile.faq}
                                onChange={(e) => setProfile({ faq: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Section 3: Agent Personality & Config */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <User className="text-pink-400" />
                        Agent Configuration
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Agent Name</label>
                            <input
                                type="text"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all placeholder:text-slate-600"
                                placeholder="Eva"
                                value={profile.agentName}
                                onChange={(e) => setProfile({ agentName: e.target.value })}
                            />
                        </div>


                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    Launch Voice Agent <ArrowRight className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};
