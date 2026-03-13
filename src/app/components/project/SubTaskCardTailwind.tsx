import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Trash2,
    Edit3,
    XCircle,
    Play,
    Pause,
    CheckCircle2,
    RotateCcw,
    User,
    Clock
} from "lucide-react";
import {
    useCompleteSubTaskMutation,
    useDeleteSubTaskByIdMutation,
    useEditSubTaskByIdMutation,
    useStartSubTaskMutation,
    usePauseSubTaskMutation,
} from "../../redux/features/subtask/subtaskApi";
import { RootState } from "../../redux/store";
import AssignTaskModal from "./AssignTaskModal";
import TaskStatus from "./TaskStatus";
import MemberNameCard from "./MemberNameCard";
import SpentTime from "./SpentTime";

export type subtaskType = {
    _id: string;
    title: string;
    parentTask: string;
    status: 'ideal' | 'paused' | 'running' | 'complete';
    time: {
        startTime: number;
        totalTime: number;
    };
    createdAt: string;
    updatedAt: string;
    assignedTo: {
        _id: string;
        name: string;
        email: string;
    };
};

const SubTaskCardTailwind = ({
    projectUser,
    subtask,
    subtaskindex,
    taskindex,
    type,
}: {
    subtask: subtaskType;
    subtaskindex: number;
    taskindex: number;
    projectUser: string;
    type: string;
}) => {
    const user = useSelector((state: RootState) => state.user);
    const { pathname } = useLocation();
    const projectId = pathname.split("/")[3];

    const [deleteSubTask] = useDeleteSubTaskByIdMutation();
    const [editSubTask] = useEditSubTaskByIdMutation();
    const [startTask, { isLoading: startSubtaskLoading }] = useStartSubTaskMutation();
    const [pauseTask, { isLoading: pauseSubtaskLoading }] = usePauseSubTaskMutation();
    const [completeTask, { isLoading: completeSubtaskLoading }] = useCompleteSubTaskMutation();

    const [taskTitle, setTaskTitle] = useState(subtask.title);
    const [edit, setEdit] = useState(false);
    const editField = useRef<HTMLInputElement>(null);

    const handleDelete = () => {
        console.log("handledelete clicked");
        deleteSubTask({
            projectId,
            subtaskId: subtask._id,
            taskId: subtask.parentTask,
        });
    };

    const handleEditFieldPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            editSubTask({
                projectId,
                subtaskId: subtask._id,
                taskindex,
                subtaskindex,
                data: { title: taskTitle },
            });
            setEdit(false);
        }
    };

    const handleStartTask = () => startTask({ projectId, subTaskId: subtask._id });
    const handlePauseTask = () => pauseTask({ projectId, subTaskId: subtask._id, data: subtask.time });
    const handleResumeTask = () => startTask({ projectId, subTaskId: subtask._id });
    const handleCompleteTask = () =>
        completeTask({
            projectId,
            subTaskId: subtask._id,
            data: { ...subtask.time, status: subtask.status },
        });

    const statusConfig = {
        ideal: { border: "border-white/5", text: "text-neutral-500", bg: "bg-neutral-900/20", glow: "" },
        running: { border: "border-blue-500/30", text: "text-blue-400", bg: "bg-blue-500/5", glow: "shadow-[0_0_15px_rgba(59,130,246,0.1)]" },
        paused: { border: "border-amber-500/30", text: "text-amber-400", bg: "bg-amber-500/5", glow: "shadow-[0_0_15px_rgba(245,158,11,0.1)]" },
        complete: { border: "border-emerald-500/30", text: "text-emerald-400", bg: "bg-emerald-500/5", glow: "shadow-[0_0_15px_rgba(16,185,129,0.1)]" },
    };

    const config = statusConfig[subtask.status] || statusConfig.ideal;

    return (
        <div className={`
      relative overflow-hidden rounded-2xl border backdrop-blur-md p-3 mb-2 transition-all duration-300 group
      ${config.bg} ${config.border} ${config.glow} hover:border-white/20
    `}>
            <div className="flex items-center justify-between gap-4">
                {/* Title & Edit Field */}
                <div className="flex-1 min-w-0">
                    {edit ? (
                        <input
                            autoFocus
                            className="w-full bg-neutral-950/50 border border-blue-500/30 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                            value={taskTitle}
                            onKeyDown={handleEditFieldPress}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            ref={editField}
                        />
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${subtask.status === 'running' ? 'bg-blue-500 animate-pulse' : 'bg-neutral-700'}`} />
                            <p className={`text-sm font-medium truncate ${subtask.status === 'complete' ? 'text-neutral-500 line-through' : 'text-neutral-300'}`}>
                                {subtask.title}
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1">
                        {type === "team" && subtask.assignedTo?._id === user.id ? (
                            <RenderButtons
                                status={subtask.status}
                                onStart={handleStartTask}
                                onPause={handlePauseTask}
                                onResume={handleResumeTask}
                                onComplete={handleCompleteTask}
                                loading={startSubtaskLoading || pauseSubtaskLoading || completeSubtaskLoading}
                            />
                        ) : type === "team" && <TaskStatus status={subtask.status} />}

                        {type === "personal" && (
                            <RenderButtons
                                status={subtask.status}
                                onStart={handleStartTask}
                                onPause={handlePauseTask}
                                onResume={handleResumeTask}
                                onComplete={handleCompleteTask}
                                loading={startSubtaskLoading || pauseSubtaskLoading || completeSubtaskLoading}
                            />
                        )}
                    </div>

                    {projectUser === user.id && (
                        <div className="flex items-center gap-1 ml-2 border-l border-white/5 pl-2">
                            {edit ? (
                                <button onClick={() => setEdit(false)} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors">
                                    <XCircle className="w-4 h-4" />
                                </button>
                            ) : (
                                subtask.status !== "complete" && (
                                    <button onClick={() => setEdit(true)} className="p-1.5 text-neutral-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                )
                            )}
                            <button
                                onClick={handleDelete}
                                className="p-1.5 text-neutral-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                                disabled={edit}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Info */}
            <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {type === "team" && (
                        <div className="flex items-center gap-1.5">
                            {subtask.assignedTo ? (
                                <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                                    <User className="w-3 h-3" />
                                    <MemberNameCard name={subtask.assignedTo.name} />
                                </div>
                            ) : (
                                <AssignTaskModal
                                    projectId={projectId}
                                    taskid="taskid"
                                    taskIndex={taskindex}
                                    type="subtask"
                                    subtaskid={subtask._id}
                                    subtaskIndex={subtaskindex}
                                />
                            )}
                        </div>
                    )}

                    {(subtask.time.totalTime > 0 || subtask.status === "running") && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                            <Clock className="w-3 h-3" />
                            <SpentTime time={subtask.time} status={subtask.status} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const RenderButtons = ({
    status, onStart, onPause, onResume, onComplete, loading
}: {
    status: string, onStart: () => void, onPause: () => void, onResume: () => void, onComplete: () => void, loading: boolean
}) => {
    if (status === "ideal") {
        return (
            <button
                disabled={loading}
                onClick={onStart}
                className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
            >
                <Play className="w-3 h-3 fill-current" />
                Start
            </button>
        );
    }
    if (status === "running") {
        return (
            <div className="flex items-center gap-1">
                <button
                    disabled={loading}
                    onClick={onPause}
                    className="p-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
                    title="Pause"
                >
                    <Pause className="w-3 h-3 fill-current" />
                </button>
                <button
                    disabled={loading}
                    onClick={onComplete}
                    className="p-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"
                    title="Complete"
                >
                    <CheckCircle2 className="w-3 h-3" />
                </button>
            </div>
        );
    }
    if (status === "paused") {
        return (
            <div className="flex items-center gap-1">
                <button
                    disabled={loading}
                    onClick={onResume}
                    className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all"
                >
                    <RotateCcw className="w-3 h-3" />
                    Resume
                </button>
                <button
                    disabled={loading}
                    onClick={onComplete}
                    className="p-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"
                    title="Complete"
                >
                    <CheckCircle2 className="w-3 h-3" />
                </button>
            </div>
        );
    }
    if (status === "complete") {
        return (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                Done
            </div>
        );
    }
    return null;
};

export default SubTaskCardTailwind;
