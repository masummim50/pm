import React, { useState } from "react";
import { Plus, Zap, Sparkles } from "lucide-react";
import SubTaskCard, { subtaskType } from "./SubTaskCardTailwind";
import { useLocation, useParams } from "react-router-dom";
import { useCreateSubTaskMutation } from "../../redux/features/subtask/subtaskApi";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useGetPersonalProjectByIdQuery } from "../../redux/features/project/project.api";
import SubtaskSortButtons from "./SubtaskSortButtons";
import { getCurrentTimeString } from "../../lib/dateFunctions";

const SubTaskContainer = ({
  taskId,
  subtasks,
  projectUser,
  taskindex,
  projecttype,
}: {
  taskId: string;
  subtasks: subtaskType[];
  projectUser: string;
  taskindex: number;
  projecttype: string;
}) => {
  const { id } = useParams();
  const { data } = useGetPersonalProjectByIdQuery(id);
  const [parent] = useAutoAnimate();
  const user = useSelector((state: RootState) => state.user);
  const filter = useSelector((state: RootState) => state.filter.filter);
  const taskType = useSelector((state: RootState) => state.filter.taskType);
  const { pathname } = useLocation();
  const projectId = pathname.split("/")[3];
  const [createSubTask, { isLoading: createSubtaskLoading }] = useCreateSubTaskMutation();
  const [subTask, setSubTask] = useState("");

  const handleKeyChange = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateSubTask();
    }
  };

  const handleCreateSubTask = () => {
    if (!subTask.trim()) return;
    createSubTask({
      projectId,
      taskId,
      data: { title: subTask, parentTask: taskId },
    });
    setSubTask("");
  };

  const addRandomSubTask = () => {
    const randomTitle = `SubTask -- ${getCurrentTimeString()}`;
    setSubTask(randomTitle);
  };

  return (
    <div className="space-y-4">
      {user.id === projectUser && data?.data?.status !== "complete" && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 group">
              <input
                className="w-full h-12 bg-neutral-900 border border-white/5 rounded-2xl px-5 pr-12 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                placeholder="Break down this objective..."
                onKeyDown={handleKeyChange}
                value={subTask}
                onChange={(e) => setSubTask(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-blue-500 transition-colors">
                <Plus className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={createSubtaskLoading || !subTask.trim()}
                onClick={handleCreateSubTask}
                className="flex-1 sm:flex-none h-12 px-6 bg-blue-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {createSubtaskLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                ) : (
                  "Create"
                )}
              </button>
              <button
                onClick={addRandomSubTask}
                className="h-12 px-4 bg-neutral-900 border border-white/5 text-neutral-400 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-neutral-800 hover:text-white transition-all"
                title="Generate Random Subtask"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>

          {createSubtaskLoading && (
            <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 animate-progress w-[40%]" />
            </div>
          )}
        </div>
      )}

      <div ref={parent} className="space-y-2 pt-2 border-t border-white/5">
        {subtasks?.length > 1 && (
          <div className="flex justify-end mb-4">
            <SubtaskSortButtons taskIndex={taskindex} />
          </div>
        )}

        {subtasks
          ?.filter((s) => {
            if (filter) {
              return user.id === s.assignedTo?._id;
            }
            return true;
          })
          .filter((s) => {
            if (taskType) {
              return s.status === taskType;
            }
            return true;
          })
          .map((subtask: subtaskType, index: number) => (
            <SubTaskCard
              projectUser={projectUser}
              taskindex={taskindex}
              subtaskindex={index}
              key={subtask._id}
              subtask={subtask}
              type={projecttype}
            />
          ))}

        {subtasks?.length === 0 && !createSubtaskLoading && (
          <div className="flex flex-col items-center justify-center py-10 text-neutral-600 border-2 border-dashed border-white/5 rounded-[2rem]">
            <Zap className="w-8 h-8 mb-3 opacity-20" />
            <p className="text-xs font-bold uppercase tracking-widest opacity-40">No subtasks defined yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubTaskContainer;
