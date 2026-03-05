/* eslint-disable @typescript-eslint/no-unused-vars */
import { motion } from "framer-motion";
import { Users2 } from "lucide-react";

const TeamProjectOverviewTailwind = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative border border-white/5 rounded-[2.5rem] p-12 bg-neutral-900/40 backdrop-blur-3xl shadow-xl flex flex-col items-center justify-center min-h-[200px] overflow-hidden group"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />

            <div className="absolute top-6 right-8 px-3 py-1 bg-yellow-500/10 text-yellow-400 text-[10px] font-bold rounded-full border border-yellow-500/20 tracking-wider uppercase">
                Collaboration Engine
            </div>

            <div className="w-16 h-16 bg-neutral-950/50 border border-white/5 rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                <Users2 className="w-8 h-8 text-yellow-500/50" />
            </div>

            <p className="text-neutral-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Internal Alpha</p>
            <p className="text-neutral-400 font-medium italic text-sm">Team analytics pipeline coming soon...</p>

            <div className="mt-6 flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-neutral-900 bg-neutral-800" />
                ))}
            </div>
        </motion.div>
    );
};

export default TeamProjectOverviewTailwind;
