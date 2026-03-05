/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useDrop } from "react-dnd/dist/hooks";
import { todoType } from "./todo.interface";
import {
  useCompleteTodoMutation,
  useDeleteAllPendingTodosMutation,
} from "../../redux/features/todo/todo.api";
import TodoCard from "./TodoCard";
import { itemType } from "./CompleteSection";
import { useState } from "react";
import {
  Trash2,
  ArrowUpDown,
  Loader2,
  Target,
  Sparkles
} from "lucide-react";

const PendingSection = ({
  todos,
}: {
  todos: todoType[];
}) => {
  const [sortNumber, setSortNumber] = useState(0);

  function compareFunction(a: todoType, b: todoType) {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    switch (sortNumber) {
      case 0:
        return dateB.getTime() - dateA.getTime();
      case 1:
        return dateA.getTime() - dateB.getTime();
      case 2:
        return a.priority - b.priority;
      case 3:
        return b.priority - a.priority;
      default:
        return 1;
    }
  }

  const handleSortClicked = () => {
    if (sortNumber === 3) {
      setSortNumber(0);
    } else {
      setSortNumber((prev) => prev + 1);
    }
  };

  const [parent] = useAutoAnimate();
  const [completeTodo] = useCompleteTodoMutation();
  const [deleteAllPending, { isLoading: deletingAll }] = useDeleteAllPendingTodosMutation();

  const [_, drop] = useDrop(() => ({
    accept: "todo",
    drop: (item: itemType) => handleDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleDrop = (item: itemType) => {
    if (item.status) {
      completeTodo(item);
    }
  };

  const handleDeleteAll = () => {
    deleteAllPending(undefined);
  };

  const pendingCount = todos?.filter((todo: todoType) => !todo.status).length || 0;

  const sortLabels = ["Newest", "Oldest", "Priority ↑", "Priority ↓"];

  return (
    <div className="flex flex-col h-full min-h-[500px] w-1/2">
      {/* Section Header */}
      <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 backdrop-blur-md px-5 py-4 rounded-2xl mb-6 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-500/50 leading-none mb-1">Status</span>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Pending</h3>
              <div className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-black rounded-lg shadow-lg shadow-blue-500/20">
                {pendingCount}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSortClicked}
            className="flex items-center gap-2 px-3 py-2 bg-neutral-950/50 border border-white/5 rounded-xl text-[10px] font-bold text-neutral-400 hover:text-blue-400 hover:border-blue-500/30 transition-all uppercase tracking-widest group/sort"
            title="Change sorting"
          >
            <ArrowUpDown className="w-3.5 h-3.5 group-hover/sort:rotate-180 transition-transform duration-500" />
            <span>{sortLabels[sortNumber]}</span>
          </button>

          <button
            disabled={deletingAll || pendingCount === 0}
            onClick={handleDeleteAll}
            className={`
                    p-2.5 rounded-xl transition-all duration-300
                    ${deletingAll || pendingCount === 0
                ? 'text-neutral-700 cursor-not-allowed'
                : 'text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10'}
                `}
            title="Clear all pending"
          >
            {deletingAll ? (
              <Loader2 className="w-5 h-5 animate-spin text-rose-500" />
            ) : (
              <Trash2 className="w-5 h-5 transition-transform" />
            )}
          </button>
        </div>
      </div>

      {/* Drop Zone & Content */}
      <div
        ref={drop}
        className="flex-1 flex flex-col rounded-[2.5rem] transition-colors relative"
      >
        <div ref={parent} className="space-y-3">
          {pendingCount === 0 && (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-neutral-900/20 group">
              <div className="w-16 h-16 bg-neutral-950/50 rounded-3xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                <Sparkles className="w-8 h-8 text-neutral-800 group-hover:text-blue-500/40 transition-colors" />
              </div>
              <h4 className="text-white font-bold tracking-tight mb-2">Workspace Cleared</h4>
              <p className="text-neutral-500 text-sm max-w-[200px] text-center leading-relaxed">
                All daily objectives have been synced. Time to celebrate your victory!
              </p>

              <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Awaiting New Input</span>
              </div>
            </div>
          )}

          {[...todos]?.sort(compareFunction).map((todo: todoType, index) => (
            <TodoCard key={todo._id} time={50 * index} todo={todo} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PendingSection;
