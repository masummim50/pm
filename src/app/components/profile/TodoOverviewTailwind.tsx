/* eslint-disable @typescript-eslint/no-explicit-any */
import { BarChart } from "@mui/x-charts/BarChart";
import { SpinnerWithText } from "../loadingSkeletons/SpinnerWithText";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    TrendingUp,
    Target,
    BarChart3
} from "lucide-react";

interface TodoOverviewProps {
    isLoading: boolean;
    dates: string[];
    values: number[];
    allTodos?: {
        pending: any[];
        completed: any[];
    };
}

const TodoOverviewTailwind = ({
    isLoading,
    dates,
    values,
    allTodos,
}: TodoOverviewProps) => {
    // Calculate Analytics
    const totalPending = allTodos?.pending?.length || 0;
    const totalCompleted = allTodos?.completed?.length || 0;
    const totalTasks = totalPending + totalCompleted;

    const completionRate = totalTasks > 0
        ? Math.round((totalCompleted / totalTasks) * 100)
        : 0;

    // Priority Breakdown
    const highPriority = allTodos?.pending?.filter(t => t.priority === 3).length || 0;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (isLoading) return <SpinnerWithText height={300} text="Analyzing your productivity..." />;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative border border-white/5 rounded-[2.5rem] p-8 bg-neutral-900/40 backdrop-blur-3xl overflow-hidden shadow-2xl"
        >
            {/* Dynamic Background Blurs */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Focus & Velocity</h2>
                        <p className="text-sm text-neutral-400">Personalized productivity benchmarks</p>
                    </div>
                </div>
                <div className="px-4 py-1.5 bg-neutral-950/50 border border-white/10 text-blue-400 text-[10px] font-black rounded-full tracking-[0.2em] uppercase">
                    System Operational
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {/* Metric Card: Completion Rate */}
                <motion.div variants={itemVariants} className="bg-neutral-950/30 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-colors group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-green-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                        </div>
                    </div>
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Success Rate</p>
                    <h3 className="text-3xl font-black text-white">{completionRate}%</h3>
                    <div className="w-full bg-white/5 h-2 rounded-full mt-6 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${completionRate}%` }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500 rounded-full"
                        />
                    </div>
                </motion.div>

                {/* Metric Card: High Priority */}
                <motion.div variants={itemVariants} className="bg-neutral-950/30 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-colors group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-red-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                        </div>
                    </div>
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Critical Load</p>
                    <h3 className="text-3xl font-black text-white">{highPriority}</h3>
                    <p className="text-[10px] text-red-400/60 font-medium mt-2">Requires immediate attention</p>
                    <div className="flex gap-1.5 mt-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full ${i < highPriority ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-white/5'}`} />
                        ))}
                    </div>
                </motion.div>

                {/* Metric Card: Daily Capacity */}
                <motion.div variants={itemVariants} className="bg-neutral-950/30 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-colors group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                        </div>
                    </div>
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Total Impact</p>
                    <h3 className="text-3xl font-black text-white">{totalTasks}</h3>
                    <p className="text-[10px] text-blue-400/60 font-medium mt-2">Active task lifecycle</p>
                </motion.div>

                {/* Metric Card: Total Completed */}
                <motion.div variants={itemVariants} className="bg-neutral-950/30 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-colors group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                            <BarChart3 className="w-5 h-5 text-indigo-400" />
                        </div>
                    </div>
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1">Throughput</p>
                    <h3 className="text-3xl font-black text-white">{totalCompleted}</h3>
                    <div className="mt-6 flex -space-x-3 items-center">
                        {[...Array(Math.min(4, totalCompleted))].map((_, i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-[3px] border-neutral-900 bg-neutral-800 flex items-center justify-center shadow-lg">
                                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                            </div>
                        ))}
                        {totalCompleted > 4 && (
                            <div className="w-8 h-8 rounded-full border-[3px] border-neutral-900 bg-neutral-800 flex items-center justify-center text-[10px] text-neutral-400 font-black">
                                +{totalCompleted - 4}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Main Chart Section */}
            <motion.div variants={itemVariants} className="bg-neutral-950/50 border border-white/5 rounded-[2rem] p-8 shadow-inner">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                            <Clock className="w-4 h-4 text-blue-400" />
                        </div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest">Momentum Tracker</h4>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            <span className="text-[10px] text-neutral-400 font-black uppercase tracking-wider">Completion Density</span>
                        </div>
                    </div>
                </div>

                <div className="h-[300px] w-full chart-container bg-neutral-900/20 rounded-xl p-4">
                    {dates.length > 0 ? (
                        <BarChart
                            xAxis={[{
                                id: "barCategories",
                                data: dates,
                                scaleType: "band",
                            }]}
                            series={[{
                                data: values,
                                label: "Daily Completions",
                                color: '#3b82f6',
                            }]}
                            height={300}
                            margin={{ top: 10, right: 10, bottom: 20, left: 30 }}
                            slotProps={{
                                legend: { hidden: true }
                            }}
                        />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-neutral-700 border-2 border-dashed border-white/5 rounded-2xl">
                            <BarChart3 className="w-16 h-16 mb-4 opacity-10" />
                            <p className="text-sm font-medium">No activity data available</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TodoOverviewTailwind;
