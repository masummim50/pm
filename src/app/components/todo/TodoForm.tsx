import { useEffect, useRef, useState } from "react";
import { useCreateTodoMutation } from "../../redux/features/todo/todo.api";
import { getCurrentTimeString } from "../../lib/dateFunctions";
import {
  Plus,
  Dices,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Zap
} from "lucide-react";

const TodoForm = () => {
  const priorities = [
    {
      value: 1,
      label: "Low",
      color: "bg-blue-500",
      textColor: "text-blue-400",
      borderColor: "border-blue-500/20",
      icon: ShieldCheck
    },
    {
      value: 2,
      label: "Medium",
      color: "bg-amber-500",
      textColor: "text-amber-400",
      borderColor: "border-amber-500/20",
      icon: Zap
    },
    {
      value: 3,
      label: "High",
      color: "bg-rose-500",
      textColor: "text-rose-400",
      borderColor: "border-rose-500/20",
      icon: AlertCircle
    },
  ];

  const [addTodo, { isLoading: addingTodo }] = useCreateTodoMutation();

  const inputRef = useRef<HTMLInputElement>(null);
  const [priority, setPriority] = useState(2);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleAddTodo = () => {
    if (inputRef.current && inputRef.current.value) {
      const todo = { title: inputRef.current?.value, priority };
      addTodo(todo);
      inputRef.current.value = "";
      setButtonDisabled(true);
    }
  };

  const addRandomTodo = () => {
    const value = `Task synced at ${getCurrentTimeString()}`;
    const randomPriority = Math.floor(Math.random() * 3) + 1;
    setPriority(randomPriority);
    if (inputRef.current) {
      inputRef.current.value = value;
      setButtonDisabled(false);
    }
  };

  return (
    <div className="bg-neutral-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem] shadow-2xl mb-8 relative overflow-hidden group">
      {/* Subtle Glow Decor */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] transition-colors duration-700 opacity-20 -z-10
        ${priority === 1 ? 'bg-blue-500' : priority === 2 ? 'bg-amber-500' : 'bg-rose-500'}
      `} />

      <div className="flex flex-col lg:flex-row items-end gap-6">
        {/* Main Input Field */}
        <div className="flex-1 w-full space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">
            New Objective
          </label>
          <div className="relative group">
            <input
              ref={inputRef}
              type="text"
              placeholder="What needs to be done?"
              onChange={(e) => setButtonDisabled(e.target.value === "")}
              onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
              className="w-full bg-neutral-950/50 border border-white/5 rounded-2xl px-5 py-3.5 text-white placeholder-neutral-600 outline-none focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all"
            />
          </div>
        </div>

        {/* Priority Selection */}
        <div className="w-full lg:w-auto space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">
            Priority Level
          </label>
          <div className="flex items-center gap-2 p-1.5 bg-neutral-950/50 border border-white/5 rounded-2xl">
            {priorities.map((p) => {
              const Icon = p.icon;
              const active = priority === p.value;
              return (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className={`
                            flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all
                            ${active
                      ? `${p.color} text-white shadow-lg shadow-${p.color.split('-')[1]}-500/20`
                      : `hover:bg-white/5 text-neutral-500`}
                        `}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : p.textColor}`} />
                  <span>{p.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button
            disabled={buttonDisabled || addingTodo}
            onClick={handleAddTodo}
            className={`
              flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all
              ${buttonDisabled || addingTodo
                ? 'bg-neutral-800 text-neutral-600 grayscale cursor-not-allowed'
                : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]'
              }
            `}
          >
            {addingTodo ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>Add Task</span>
          </button>

          <button
            onClick={addRandomTodo}
            className="p-3.5 bg-neutral-800/50 border border-white/5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-2xl transition-all hover:scale-105"
            title="Generate Random Task"
          >
            <Dices className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoForm;
