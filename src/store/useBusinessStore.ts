import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BusinessProfile {
    companyName: string;
    industry: string;
    about: string;
    services: string;
    location: string;
    faq: string;
    agentName: string;
}

interface BusinessStore {
    profile: BusinessProfile;
    setProfile: (profile: Partial<BusinessProfile>) => void;
    reset: () => void;
}

const INITIAL_STATE: BusinessProfile = {
    companyName: '',
    industry: '',
    about: '',
    services: '',
    location: '',
    faq: '',
    agentName: 'Eva',
};

export const useBusinessStore = create<BusinessStore>()(
    persist(
        (set) => ({
            profile: INITIAL_STATE,
            setProfile: (updates) =>
                set((state) => ({
                    profile: { ...state.profile, ...updates },
                })),
            reset: () => set({ profile: INITIAL_STATE }),
        }),
        {
            name: 'voice-agent-storage',
        }
    )
);
