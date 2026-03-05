/* eslint-disable @typescript-eslint/no-unused-vars */
import { useGetJournalOverviewQuery } from "../../redux/features/journal/journalApi";
import { getLast30Days } from "../../lib/dateFunctions";
import { Box, Skeleton, Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import { BookOpen, Calendar } from "lucide-react";

const JournalOverviewTailwind = () => {
    const { data, isLoading } = useGetJournalOverviewQuery(undefined);
    const lastDates = getLast30Days();

    const chooseBackgroundColor = (date: string) => {
        const words = data?.data?.data[date];
        if (words) {
            const opacity = words / data?.data?.maxWords;
            // Using a more vibrant green for the heatmap
            return `rgba(34, 197, 94, ${Math.max(0.1, opacity)})`;
        } else {
            return "rgba(255, 255, 255, 0.03)";
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    if (isLoading) return <Box className="p-8"><Skeleton variant="rectangular" height={300} className="rounded-3xl bg-neutral-900/40" /></Box>;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative border border-white/5 rounded-[2.5rem] p-8 bg-neutral-900/40 backdrop-blur-3xl shadow-xl overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Journal Activity</h2>
                        <p className="text-sm text-neutral-400">Your writing consistency over the last 30 days</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-neutral-950/50 border border-white/10 rounded-full">
                    <Calendar className="w-3 h-3 text-green-400" />
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">30 Day Span</span>
                </div>
            </div>

            <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-15 gap-2">
                {lastDates.map((d, index) => (
                    <Tooltip
                        key={index}
                        arrow
                        title={
                            <div className="p-2 text-xs font-medium">
                                <p className="text-neutral-400 mb-1">{d}</p>
                                <p className="text-white font-bold">{data?.data?.data[d] || 0} words written</p>
                            </div>
                        }
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.01 }}
                            className="aspect-square rounded-lg border border-white/5 cursor-pointer relative group overflow-hidden"
                            style={{ background: chooseBackgroundColor(d) }}
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    </Tooltip>
                ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Less</span>
                    <div className="flex gap-1">
                        {[0.1, 0.4, 0.7, 1.0].map(op => (
                            <div key={op} className="w-3 h-3 rounded-sm" style={{ background: `rgba(34, 197, 94, ${op})` }} />
                        ))}
                    </div>
                    <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">More</span>
                </div>
                <p className="text-[10px] text-neutral-500 font-medium italic">Peak intensity measured in words/day</p>
            </div>
        </motion.div>
    );
};

export default JournalOverviewTailwind;
