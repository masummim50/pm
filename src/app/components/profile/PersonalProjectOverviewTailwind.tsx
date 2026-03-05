/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { formatDataArray } from "../../lib/dateFunctions";
import { BarChart } from "@mui/x-charts";
import { SpinnerWithText } from "../loadingSkeletons/SpinnerWithText";
import { motion } from "framer-motion";
import {
    LayoutGrid,
    Layers,
    Users,
    Activity,
    CheckCircle,
    Clock
} from "lucide-react";

interface PersonalProjectOverviewProps {
    isLoading: boolean;
    showRandom: boolean;
    allProjects?: any[];
}

const PersonalProjectOverviewTailwind = ({
    isLoading,
    showRandom,
    allProjects,
}: PersonalProjectOverviewProps) => {
    const [dates, setDates] = useState<string[]>([]);
    const [values, setValues] = useState<number[]>([]);
    const [randomValue] = useState<number[]>(() =>
        Array.from({ length: 30 }, () => Math.floor(Math.random() * 21))
    );

    // Calculate Analytics
    const totalProjects = allProjects?.length || 0;
    const activeProjects = allProjects?.filter(p => !p.status).length || 0; // Assuming status: false means active/pending
    const completedProjects = allProjects?.filter(p => p.status).length || 0;
    const totalParticipants = allProjects?.reduce((acc, p) => acc + (p.participants?.length || 0), 0) || 0;

    useEffect(() => {
        if (allProjects) {
            // Group completions by date for the chart
            const chartData: Record<string, number> = {};
            allProjects.forEach(project => {
                const date = project.updatedAt?.split("T")[0];
                if (date) {
                    chartData[date] = (chartData[date] || 0) + 1;
                }
            });

            const { dates: d, values: v } = formatDataArray(chartData);
            setDates(d);
            if (showRandom) {
                setValues(randomValue);
            } else {
                setValues(v);
            }
        }
    }, [allProjects, showRandom, randomValue]);

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

    if (isLoading) return <SpinnerWithText height={300} text="Loading project insights..." />;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative border border-white/5 rounded-[2.5rem] p-8 bg-neutral-900/40 backdrop-blur-3xl shadow-2xl overflow-hidden"
        >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <LayoutGrid className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Project Momentum</h2>
                        <p className="text-sm text-neutral-400">Personal repository velocity and team impact</p>
                    </div>
                </div>
                <div className="px-4 py-1.5 bg-neutral-950/50 border border-white/10 text-purple-400 text-[10px] font-black rounded-full tracking-[0.2em] uppercase">
                    Portfolio Analytics
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {/* Metric Card: Total Projects */}
                <motion.div variants={itemVariants} className="bg-neutral-950/30 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-colors group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-purple-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                            <Layers className="w-5 h-5 text-purple-400" />
                        </div>
                    </div>
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Total Repos</p>
                    <h3 className="text-3xl font-black text-white">{totalProjects}</h3>
                    <div className="flex items-center gap-2 mt-4 text-[10px] text-neutral-500 uppercase font-black tracking-tighter">
                        <span>{activeProjects} Active</span>
                        <span className="w-1 h-1 bg-neutral-700 rounded-full" />
                        <span>{completedProjects} Shipped</span>
                    </div>
                </motion.div>

                {/* Metric Card: Participants */}
                <motion.div variants={itemVariants} className="bg-neutral-950/30 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-colors group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                            <Users className="w-5 h-5 text-blue-400" />
                        </div>
                    </div>
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Collaborators</p>
                    <h3 className="text-3xl font-black text-white">{totalParticipants}</h3>
                    <p className="text-[10px] text-blue-400/60 font-medium mt-2">Network reach across projects</p>
                </motion.div>

                {/* Metric Card: Active Ratio */}
                <motion.div variants={itemVariants} className="bg-neutral-950/30 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-colors group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                            <Activity className="w-5 h-5 text-indigo-400" />
                        </div>
                    </div>
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Active Status</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-white">{totalProjects > 0 ? Math.round((activeProjects / totalProjects) * 100) : 0}%</h3>
                        <span className="text-[10px] text-neutral-500 font-bold tracking-tighter uppercase">Ratio</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full mt-6 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${totalProjects > 0 ? (activeProjects / totalProjects) * 100 : 0}%` }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                        />
                    </div>
                </motion.div>

                {/* Metric Card: Shipment Status */}
                <motion.div variants={itemVariants} className="bg-neutral-950/30 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-colors group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                        </div>
                    </div>
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Archived</p>
                    <h3 className="text-3xl font-black text-white">{completedProjects}</h3>
                    <div className="mt-6 flex -space-x-3 items-center">
                        {[...Array(Math.min(4, completedProjects))].map((_, i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-[3px] border-neutral-900 bg-neutral-800 flex items-center justify-center shadow-lg">
                                <Clock className="w-4 h-4 text-emerald-400" />
                            </div>
                        ))}
                        {completedProjects > 4 && (
                            <div className="w-8 h-8 rounded-full border-[3px] border-neutral-900 bg-neutral-800 flex items-center justify-center text-[10px] text-neutral-400 font-black">
                                +{completedProjects - 4}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Main Chart Section */}
            <motion.div variants={itemVariants} className="bg-neutral-950/50 border border-white/5 rounded-[2rem] p-8 shadow-inner">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                            <Activity className="w-4 h-4 text-purple-400" />
                        </div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest">Velocity History</h4>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                            <span className="text-[10px] text-neutral-400 font-black uppercase tracking-wider">Project Updates</span>
                        </div>
                    </div>
                </div>

                <div className="h-[300px] w-full chart-container bg-neutral-900/20 rounded-xl p-4 border border-white/5">
                    {dates.length > 0 ? (
                        <BarChart
                            xAxis={[{
                                id: "sl",
                                data: dates,
                                scaleType: "band",
                            }]}
                            series={[{
                                data: values,
                                label: "Aggregate Updates",
                                color: '#a855f7',
                            }]}
                            height={300}
                            margin={{ top: 10, right: 10, bottom: 20, left: 30 }}
                            slotProps={{
                                legend: { hidden: true }
                            }}
                        />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-neutral-700 border-2 border-dashed border-white/5 rounded-2xl">
                            <LayoutGrid className="w-16 h-16 mb-4 opacity-10" />
                            <p className="text-sm font-medium">No project update history available</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default PersonalProjectOverviewTailwind;
