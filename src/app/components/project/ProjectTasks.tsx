/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useEffect, useRef, useState } from "react";
import { Plus, Sparkles, RotateCcw, LayoutGrid, Target } from "lucide-react";
import TaskCard from "./TaskCardTailwind";
import { projectType, taskType } from "./project.interface";
import { useAddNewTaskMutation } from "../../redux/features/task/taskApi";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import NoItemFound from "./NoItemFound";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useChangeProjectStatusMutation } from "../../redux/features/project/project.api";
import { useAppSelector } from "../../redux/hooks";
import TaskSortButtons from "./TaskSortButtons";
import FilteredItemNotFound from "./FilteredItemNotFound";
import { subtaskType } from "./SubTaskCardTailwind";
import { getCurrentTimeString } from "../../lib/dateFunctions";

const ProjectTasks = ({ project }: { project: projectType }) => {
  const [parent] = useAutoAnimate();
  const { _id: projectId, tasks, type } = project;
  const [addNewTask, { isSuccess: taskAddingSuccess, isLoading: addingTask }] = useAddNewTaskMutation();
  const [title, setTitle] = useState("");

  const handleAddNewTask = () => {
    if (!title.trim()) return;
    addNewTask({ id: projectId, data: { title } });
  };

  const checkEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddNewTask();
    }
  };

  const taskRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (taskAddingSuccess) {
      setTitle("");
    }
  }, [taskAddingSuccess]);

  const user = useSelector((state: RootState) => state.user);
  const [changeProjectStatus, { isLoading: changeStatusLoading }] = useChangeProjectStatusMutation();

  const handleChangeStatus = () => {
    changeProjectStatus({ id: project._id, data: { status: "pending" } });
  };

  const isFilter = useAppSelector((state: RootState) => state.filter.filter);
  const taskType = useAppSelector((state: RootState) => state.filter.taskType);

  const typeFilterFunction = (task: taskType) => {
    if (taskType !== "") {
      if (task.subtasks.length > 0) {
        return task.subtasks.some((s: subtaskType) => s.status === taskType) ? task : null;
      } else {
        return task.status === taskType ? task : null;
      }
    }
    return task;
  };

  const addRandomTask = () => {
    const randomTitle = `Task -- ${getCurrentTimeString()}`;
    setTitle(randomTitle);
  };

  let count = 0;

  return (
    <div className="space-y-8">
      {/* Action Bar: Create Task / Re-open Project */}
      {project.user === user.id && project.status !== "complete" && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mt-6">
          <div className="relative flex-1 group">
            <input
              autoFocus
              ref={taskRef}
              className="w-full h-14 bg-neutral-900 border border-white/5 rounded-3xl px-6 pr-14 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-bold"
              placeholder="Declare a new high-level objective..."
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              onKeyDown={checkEnterPress}
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-blue-500 transition-colors">
              <Target className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={addingTask || !title.trim()}
              onClick={handleAddNewTask}
              className="flex-1 md:flex-none h-14 px-8 bg-blue-500 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {addingTask ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[3px]" />
                  Add Objective
                </>
              )}
            </button>
            <button
              onClick={addRandomTask}
              className="h-14 px-5 bg-neutral-900 border border-white/5 text-neutral-400 rounded-[2rem] hover:bg-neutral-800 hover:text-white transition-all shadow-lg active:scale-95"
              title="Ghost Objective"
            >
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {project.status === "complete" && (
        <button
          disabled={changeStatusLoading}
          onClick={handleChangeStatus}
          className="flex items-center gap-2 h-14 px-8 bg-neutral-800/50 text-neutral-400 border border-white/5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-neutral-800 hover:text-white transition-all group active:scale-95"
        >
          {changeStatusLoading ? (
            <div className="w-4 h-4 border-2 border-neutral-500/30 border-t-neutral-500 rounded-full animate-spin" />
          ) : (
            <>
              <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Re-open System
            </>
          )}
        </button>
      )}

      {/* Tasks List Container */}
      <div className="space-y-6">
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[3rem] bg-neutral-900/10">
            <LayoutGrid className="w-12 h-12 text-neutral-800 mb-4" />
            <NoItemFound title="Objective" />
          </div>
        )}

        {tasks.length > 1 && (
          <div className="flex justify-between items-center bg-neutral-950/40 p-4 rounded-3xl border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-neutral-500">
              <LayoutGrid className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Active Stack: {tasks.length} Items</span>
            </div>
            <TaskSortButtons type={type} />
          </div>
        )}

        <div ref={parent} className="space-y-4 min-h-[50vh]">
          {tasks
            ?.filter((t: any) => {
              if (isFilter) {
                if (t.subtasks.length > 0) {
                  return t.subtasks.some((s: any) => s.assignedTo?._id === user.id);
                }
                return user.id === t.assignedTo?._id;
              }
              return true;
            })
            .filter(typeFilterFunction)
            .map((task: taskType, index: number) => {
              if (task) {
                count++;
              }
              return (
                <TaskCard
                  key={task?._id}
                  projectId={projectId}
                  type={type}
                  task={task}
                  projectUser={project.user}
                  taskIndex={index}
                />
              );
            })}
        </div>

        {(isFilter || taskType) && count === 0 && (
          <div className="py-20">
            <FilteredItemNotFound title={taskType} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTasks;
