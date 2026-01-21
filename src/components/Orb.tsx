import { motion } from 'framer-motion';

export const Orb = ({ volume, active }: { volume: number; active: boolean }) => {
    // Volume is typically 0.0 to 1.0 (RMS), but might be small. Scale it up.
    const scale = 1 + Math.min(volume * 5, 1.5);

    return (
        <div className="relative flex items-center justify-center w-[300px] h-[300px]">
            {/* Core */}
            <motion.div
                animate={{
                    scale: active ? scale : 1,
                    opacity: active ? 1 : 0.5,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative z-10 w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_60px_rgba(99,102,241,0.6)]"
            />

            {/* Outer Glow Ring 1 */}
            <motion.div
                animate={{
                    scale: active ? scale * 1.2 : 1.1,
                    opacity: active ? 0.4 : 0.1,
                }}
                className="absolute w-32 h-32 rounded-full bg-indigo-500 blur-xl"
            />

            {/* Breathing Ring when idle */}
            {!active && (
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="absolute w-40 h-40 rounded-full border border-white/10"
                />
            )}
        </div>
    );
};
