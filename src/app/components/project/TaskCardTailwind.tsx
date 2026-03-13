import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
    Play,
    Pause,
    CheckCircle2,
    RotateCcw,
    Trash2,
    Edit3,
    XCircle,
    ChevronDown,
    ChevronUp,
    Target,
    Clock,
    Layers,
    User
} from "lucide-react";
import {
    useCompleteTaskMutation,
    useDeleteTaskByIdMutation,
    usePauseTaskMutation,
    useStartTaskMutation,
    useUpdateTaskByIdMutation,
} from "../../redux/features/task/taskApi";
import { RootState } from "../../redux/store";
import SubTaskContainer from "./SubTaskContainer";
import AssignTaskModal from "./AssignTaskModal";
import TaskStatus from "./TaskStatus";
import MemberNameCard from "./MemberNameCard";
import SpentTime from "./SpentTime";
import { subtaskType } from "./SubTaskCardTailwind";
import { taskType } from "./project.interface";

type taskCardPropsType = {
    task: taskType;
    projectId: string;
    type: string;
    projectUser: string;
    taskIndex: number;
};

const TaskCardTailwind = ({
    task,
    projectId,
    type,
    projectUser,
    taskIndex,
}: taskCardPropsType) => {
    const user = useSelector((state: RootState) => state.user);
    const [updateTask] = useUpdateTaskByIdMutation();
    const [deleteTask] = useDeleteTaskByIdMutation();

    const [taskTitle, setTaskTitle] = useState(task.title);
    const [expanded, setExpanded] = useState(false);
    const [edit, setEdit] = useState(false);
    const editField = useRef<HTMLInputElement>(null);

    const [startTask, { isLoading: startTaskLoading }] = useStartTaskMutation();
    const [pauseTask, { isLoading: pauseTaskLoading }] = usePauseTaskMutation();
    const [completeTask, { isLoading: completeTaskLoading }] = useCompleteTaskMutation();

    const handleDeleteTask = () => deleteTask({ projectid: projectId, taskid: task._id });

    const handleUpdateTask = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            updateTask({
                projectId,
                taskId: task._id,
                taskIndex,
                data: { title: taskTitle },
            });
            setEdit(false);
        }
    };

    const handleStartTask = () => startTask({ projectId, taskid: task._id });
    const handlePauseTask = () => pauseTask({ projectId, taskid: task._id, data: task.time });
    const handleResumeTask = () => startTask({ projectId, taskid: task._id });
    const handleCompleteTask = () => completeTask({ projectId, taskid: task._id, data: task });

    const progressValue = () => {
        if (!task.subtasks || task.subtasks.length === 0) return 0;
        const completedNumber = task.subtasks.filter((sub: subtaskType) => sub.status === "complete");
        return (100 / task.subtasks.length) * completedNumber.length;
    };

    const statusConfig = {
        ideal: { border: "border-white/5", text: "text-neutral-500", bg: "bg-neutral-900/40", glow: "", accent: "bg-neutral-500" },
        running: { border: "border-blue-500/30", text: "text-blue-400", bg: "bg-blue-500/5", glow: "shadow-[0_0_30px_rgba(59,130,246,0.1)]", accent: "bg-blue-500" },
        paused: { border: "border-amber-500/30", text: "text-amber-400", bg: "bg-amber-500/5", glow: "shadow-[0_0_30px_rgba(245,158,11,0.1)]", accent: "bg-amber-500" },
        complete: { border: "border-emerald-500/30", text: "text-emerald-400", bg: "bg-emerald-500/5", glow: "shadow-[0_0_30px_rgba(16,185,129,0.1)]", accent: "bg-emerald-500" },
    };

    const currentStatus = task.status;
    const config = statusConfig[currentStatus as keyof typeof statusConfig] || statusConfig.ideal;
    const progress = progressValue();

    return (
        <div className={` hover:bg-blue-300/10 
      relative overflow-hidden rounded-[2.5rem] border backdrop-blur-xl p-6 mb-4 transition-all duration-500 group
      ${config.bg} ${config.border} ${config.glow} hover:border-white/10
    `}>
            {/* Decorative Accent Bar */}
            <div className={`absolute top-0 left-0 w-1 h-full opacity-50 ${config.accent}`} />

            <div className="flex flex-col gap-6">
                {/* Header: Title & Actions */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        {edit ? (
                            <div className="relative group/input">
                                <input
                                    autoFocus
                                    className="w-full bg-neutral-950/80 border border-blue-500/30 rounded-2xl px-5 py-3 text-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold"
                                    value={taskTitle}
                                    onKeyDown={handleUpdateTask}
                                    onChange={(e) => setTaskTitle(e.target.value)}
                                    ref={editField}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-neutral-500">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Enter to Save</span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <div className="flex items-center gap-3 text-neutral-500 mb-1">
                                    <Target className={`w-4 h-4 ${config.text}`} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Objective #{taskIndex + 1}</span>
                                </div>
                                <h3 className={`text-xl font-bold tracking-tight transition-all ${currentStatus === 'complete' ? 'text-neutral-500 line-through' : 'text-white'}`}>
                                    {task.title}
                                </h3>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 bg-neutral-950/40 p-1.5 rounded-2xl border border-white/5">
                        {type === "team" && task.assignedTo?._id === user.id ? (
                            <TaskButtons
                                status={currentStatus}
                                onStart={handleStartTask}
                                onPause={handlePauseTask}
                                onResume={handleResumeTask}
                                onComplete={handleCompleteTask}
                                loading={startTaskLoading || pauseTaskLoading || completeTaskLoading}
                                hasSubtasks={task.subtasks.length > 0}
                            />
                        ) : type === "team" && task.subtasks.length === 0 && <TaskStatus status={currentStatus} />}

                        {type === "personal" && (
                            <TaskButtons
                                status={currentStatus}
                                onStart={handleStartTask}
                                onPause={handlePauseTask}
                                onResume={handleResumeTask}
                                onComplete={handleCompleteTask}
                                loading={startTaskLoading || pauseTaskLoading || completeTaskLoading}
                                hasSubtasks={task.subtasks.length > 0}
                            />
                        )}

                        {projectUser === user.id && (
                            <div className="flex items-center gap-1 border-l border-white/10 pl-1.5">
                                {edit ? (
                                    <button onClick={() => setEdit(false)} className="p-2.5 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button onClick={() => setEdit(true)} className="p-2.5 text-neutral-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all">
                                        <Edit3 className="w-5 h-5" />
                                    </button>
                                )}
                                <button onClick={handleDeleteTask} className="p-2.5 text-neutral-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all" disabled={edit}>
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress Section (if subtasks exist) */}
                {task.subtasks.length > 0 && (
                    <div className="bg-neutral-950/30 rounded-[1.5rem] p-5 border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-neutral-400">
                                <Layers className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Decomposition Progress</span>
                            </div>
                            <span className={`text-xs font-black tracking-widest ${progress === 100 ? 'text-emerald-400' : 'text-blue-400'}`}>
                                {progress.toFixed(0)}%
                            </span>
                        </div>

                        <div className="relative h-2 w-full bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${progress === 100 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]'}`}
                            />
                        </div>
                    </div>
                )}

                {/* Meta Section: Assigned To & Time Spent */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-4">

                        {type === "team" && !task.assignedTo && projectUser === user.id && task.subtasks.length === 0 && (
                            <AssignTaskModal
                                projectId={projectId}
                                taskid={task._id}
                                taskIndex={taskIndex}
                                type="task"
                                setExpanded={setExpanded}
                            />
                        )}

                        {type === "team" && task.assignedTo && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-950 rounded-xl border border-white/5">
                                <User className="w-3.5 h-3.5 text-neutral-500" />
                                <span className="text-[11px] font-bold text-neutral-400">
                                    <MemberNameCard name={task.assignedTo.name} />
                                </span>
                            </div>
                        )}

                        {(task.time.totalTime > 0 || task.status === "running") && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-950 rounded-xl border border-white/5">
                                <Clock className="w-3.5 h-3.5 text-blue-400" />
                                <SpentTime time={task.time} status={task.status} />
                            </div>
                        )}
                    </div>

                    {/* Subtask Trigger Button */}
                    {(!task.assignedTo && task.status === 'ideal') && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className={`
                        flex items-center gap-2 px-5 py-2 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all
                        ${expanded ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'}
                    `}
                        >
                            <Layers className="w-4 h-4" />
                            <span>Subtasks</span>
                            <div className={`px-1.5 py-0.5 rounded-md text-[10px] ${expanded ? 'bg-white/20' : 'bg-neutral-900 text-neutral-500'}`}>
                                {task.subtasks.length}
                            </div>
                            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    )}
                </div>

                {/* Subtask Container Collapse */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 bg-neutral-950/50 rounded-[2rem] border border-white/5 mt-2">
                                <SubTaskContainer
                                    subtasks={task.subtasks}
                                    taskId={task._id}
                                    taskindex={taskIndex}
                                    projectUser={projectUser}
                                    projecttype={type}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const TaskButtons = ({
    status, onStart, onPause, onResume, onComplete, loading, hasSubtasks
}: {
    status: string, onStart: () => void, onPause: () => void, onResume: () => void, onComplete: () => void, loading: boolean, hasSubtasks: boolean
}) => {
    if (hasSubtasks) return null;

    if (status === "ideal") {
        return (
            <button
                disabled={loading}
                onClick={onStart}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
            >
                <Play className="w-4 h-4 fill-current" />
                Activate
            </button>
        );
    }

    if (status === "running") {
        return (
            <div className="flex items-center gap-1.5">
                <button
                    disabled={loading}
                    onClick={onPause}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all"
                >
                    <Pause className="w-4 h-4 fill-current" />
                    Hold
                </button>
                <button
                    disabled={loading}
                    onClick={onComplete}
                    className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
                >
                    <CheckCircle2 className="w-5 h-5" />
                </button>
            </div>
        );
    }

    if (status === "paused") {
        return (
            <div className="flex items-center gap-1.5">
                <button
                    disabled={loading}
                    onClick={onResume}
                    className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-amber-600 transition-all"
                >
                    <RotateCcw className="w-4 h-4" />
                    Resume
                </button>
                <button
                    disabled={loading}
                    onClick={onComplete}
                    className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
                >
                    <CheckCircle2 className="w-5 h-5" />
                </button>
            </div>
        );
    }

    if (status === "complete") {
        return (
            <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl font-black text-xs uppercase tracking-[0.2em]">
                <CheckCircle2 className="w-4 h-4" />
                Synchronized
            </div>
        );
    }

    return null;
}

export default TaskCardTailwind;
