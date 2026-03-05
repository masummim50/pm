import { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import {
  useCompleteTodoMutation,
  useDeleteTodoMutation,
} from "../../redux/features/todo/todo.api";
import { todoType } from "./todo.interface";
import { isDesktop } from "./TodoContainer";
import {
  Trash2,
  CheckCircle2,
  RotateCcw,
  Clock,
  Calendar
} from "lucide-react";

export default function TodoCard({
  todo,
  time,
}: {
  todo: todoType;
  time: number;
}) {
  const ismobile = isDesktop();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(false);
    }, time);
    return () => clearTimeout(timer);
  }, [time]);

  const [deleteTodo, { isSuccess: deleteSuccess, error }] = useDeleteTodoMutation();
  const [completeTodo] = useCompleteTodoMutation();

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "todo",
      item: () => todo,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [todo]
  );

  const [deletingTodo, setDeletingTodo] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (!deleteSuccess || error) {
      setDeletingTodo(false);
    }
  }, [deleteSuccess, error]);

  useEffect(() => {
    if (deletingTodo) {
      const timer = setTimeout(() => {
        setHide(true);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [deletingTodo]);

  const handleDelete = () => {
    deleteTodo(todo);
  };

  const handleComplete = () => {
    completeTodo(todo);
  };

  // Priority color mapping
  const priorityColors = [
    "border-neutral-800",             // 0: None
    "border-blue-500/30",             // 1: Low
    "border-amber-500/30",            // 2: Medium
    "border-rose-500/30"              // 3: High
  ];

  const priorityGlows = [
    "",                               // 0
    "shadow-[0_0_15px_rgba(59,130,246,0.1)]", // 1
    "shadow-[0_0_15px_rgba(245,158,11,0.1)]", // 2
    "shadow-[0_0_15px_rgba(244,63,94,0.1)]"   // 3
  ];

  if (hide) return null;

  return (
    <div
      ref={drag}
      className={`
        group relative mb-3 transition-all duration-500 ease-out
        ${hidden ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}
        ${deletingTodo ? "scale-0 opacity-0" : "scale-100"}
        ${isDragging ? "opacity-20" : "opacity-100"}
      `}
    >
      <div
        className={`
          relative overflow-hidden rounded-2xl border bg-neutral-900/60 backdrop-blur-md p-4
          transition-colors duration-300 hover:bg-neutral-800/80
          ${priorityColors[todo.priority] || priorityColors[0]}
          ${priorityGlows[todo.priority] || ""}
        `}
      >
        {/* Priority Left Indicator Bar */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1.5 
            ${todo.priority === 1 ? 'bg-blue-500' :
              todo.priority === 2 ? 'bg-amber-500' :
                todo.priority === 3 ? 'bg-rose-500' : 'bg-neutral-800'}
          `}
        />

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-bold tracking-tight mb-1 truncate
              ${todo.status ? 'text-neutral-500 line-through decoration-neutral-600' : 'text-white'}
            `}>
              {todo?.title}
            </h4>

            <div className="flex items-center gap-2">
              {todo.status ? (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500/80 uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Completed</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  <Clock className="w-3 h-3" />
                  <span>Pending</span>
                </div>
              )}

              <span className="w-1 h-1 bg-neutral-700 rounded-full" />

              <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-medium italic">
                <Calendar className="w-3 h-3 opacity-50" />
                <span>
                  {todo.status
                    ? new Date(todo.updatedAt).toLocaleDateString()
                    : new Date(todo.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 gap-1">
            {!ismobile && (
              <button
                onClick={handleComplete}
                className={`p-2 rounded-xl transition-all duration-200
                  ${todo.status
                    ? 'text-neutral-500 hover:text-amber-500 hover:bg-amber-500/10'
                    : 'text-neutral-500 hover:text-emerald-500 hover:bg-emerald-500/10'}
                `}
                title={todo.status ? "Undo Completion" : "Complete Task"}
              >
                {todo.status ? <RotateCcw className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              </button>
            )}

            <button
              onClick={handleDelete}
              className="p-2 text-neutral-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all duration-200"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
