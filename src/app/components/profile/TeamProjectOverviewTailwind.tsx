/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { Users2, Shield, Activity, Globe, Send } from "lucide-react";
import { SpinnerWithText } from "../loadingSkeletons/SpinnerWithText";

interface TeamProjectOverviewProps {
    isLoading: boolean;
    allTeamProjects?: any[];
}

const TeamProjectOverviewTailwind = ({
    isLoading,
    allTeamProjects,
}: TeamProjectOverviewProps) => {
    // Calculate Analytics
    const totalTeamProjects = allTeamProjects?.length || 0;

    // Flatten all participants to get a unique member count
    const allMembers = allTeamProjects?.reduce((acc: any[], p: any) => {
        return [...acc, ...(p.participants || [])];
    }, []) || [];

    const uniqueMembers = Array.from(new Set(allMembers.map((m: any) => m._id || m))).length;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (isLoading) return <SpinnerWithText height={300} text="Syncing collaboration pulse..." />;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative border border-white/5 rounded-[2.5rem] p-8 bg-neutral-900/40 backdrop-blur-3xl shadow-2xl overflow-hidden"
        >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Users2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Collaboration Engine</h2>
                        <p className="text-sm text-neutral-400">Team health and shared repository metrics</p>
                    </div>
                </div>
                <div className="px-4 py-1.5 bg-neutral-950/50 border border-white/10 text-amber-400 text-[10px] font-black rounded-full tracking-[0.2em] uppercase">
                    Network Status: Active
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {/* Metric Card: Total Projects */}
                <motion.div variants={itemVariants} className="bg-neutral-950/30 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-colors group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-amber-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                            <Shield className="w-5 h-5 text-amber-400" />
                        </div>
                    </div>
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Team Repos</p>
                    <h3 className="text-3xl font-black text-white">{totalTeamProjects}</h3>
                    <p className="text-[10px] text-amber-400/60 font-medium mt-2">Collective intelligence hubs</p>
                </motion.div>

                {/* Metric Card: Unique Collaborators */}
                <motion.div variants={itemVariants} className="bg-neutral-950/30 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-colors group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                            <Globe className="w-5 h-5 text-blue-400" />
                        </div>
                    </div>
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Global Network</p>
                    <h3 className="text-3xl font-black text-white">{uniqueMembers}</h3>
                    <p className="text-[10px] text-blue-400/60 font-medium mt-2">Active contributors synced</p>
                </motion.div>

                {/* Metric Card: Team Activity */}
                <motion.div variants={itemVariants} className="bg-neutral-950/30 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-colors group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-orange-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                            <Activity className="w-5 h-5 text-orange-400" />
                        </div>
                    </div>
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Project Output</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-white">{totalTeamProjects > 0 ? 100 : 0}%</h3>
                        <span className="text-[10px] text-neutral-500 font-bold tracking-tighter uppercase">Integrity</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full mt-6 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Team Activity Visualization */}
            <motion.div variants={itemVariants} className="bg-neutral-950/50 border border-white/5 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-amber-500/5 rounded-[2rem] border border-white/5 flex items-center justify-center mb-6">
                    <Send className="w-8 h-8 text-amber-500/40" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2 tracking-tight">Real-time Pulse Feed</h4>
                <p className="text-sm text-neutral-500 max-w-sm mb-8">Currently aggregating collaboration signals across your {totalTeamProjects} team projects.</p>

                <div className="flex -space-x-4 items-center">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-12 h-12 rounded-full border-4 border-neutral-900 bg-neutral-800 flex items-center justify-center shadow-2xl relative group">
                            <Users2 className="w-5 h-5 text-neutral-600 group-hover:text-amber-500 transition-colors" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-900" />
                        </div>
                    ))}
                    <div className="w-12 h-12 rounded-full border-4 border-neutral-900 bg-neutral-950 flex items-center justify-center text-[11px] text-neutral-500 font-black tracking-tighter">
                        +12
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TeamProjectOverviewTailwind;
