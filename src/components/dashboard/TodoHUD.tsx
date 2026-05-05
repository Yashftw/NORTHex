import { useState, useEffect } from "react";
import { useDashboard, PriorityLevel, TodoCategory } from "@/lib/dashboard-context";
import { ListChecks, Trash2, Check } from "lucide-react";

const PRIORITY_COLORS: Record<PriorityLevel, string> = {
  P1: "#FF4060",
  P2: "#FF9500",
  P3: "#9B9B9B",
};

const CAT_COLORS: Record<TodoCategory, string> = {
  Work: "#FF4060",
  Study: "#FF9500",
  Personal: "#9B9B9B",
  Health: "#39D353",
};

export const TodoHUD = () => {
  const { todos, addTodo, toggleTodo, deleteTodo } = useDashboard();
  const [newTodo, setNewTodo] = useState("");
  const [priority, setPriority] = useState<PriorityLevel>("P3");
  const [category, setCategory] = useState<TodoCategory>("Personal");
  const [time, setTime] = useState("");
  const [allClear, setAllClear] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];
  
  const todayTodos = todos.filter(t => t.createdAt.startsWith(todayStr) || (t.completedAt && t.completedAt.startsWith(todayStr)));
  const completedToday = todayTodos.filter(t => t.completed).length;
  const totalToday = todayTodos.length;
  
  const completionPct = totalToday === 0 ? 0 : Math.round((completedToday / totalToday) * 100);

  useEffect(() => {
    if (totalToday > 0 && completedToday === totalToday) {
      setAllClear(true);
      const timer = setTimeout(() => setAllClear(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [completedToday, totalToday]);
  
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPct / 100) * circumference;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    addTodo(newTodo, priority, category, time);
    setNewTodo("");
    setTime("");
  };

  const getRelativeTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return "older";
  };

  const sortedTodos = [...todayTodos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.priority !== b.priority) return a.priority.localeCompare(b.priority);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className={`glass-card rounded-sm p-6 relative group flex flex-col h-full ${allClear ? 'animate-glow-flash' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="hud-badge w-10 h-10 border-white/20 text-white rounded-sm">
            <ListChecks className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-display text-white">Tasks</h2>
            <p className="text-xs text-muted-foreground">Operational Queue</p>
          </div>
        </div>

        <div className="relative w-10 h-10">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r={radius} fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="3" />
            <circle 
              cx="25" cy="25" r={radius} 
              fill="none" 
              stroke="#ffffff" 
              strokeWidth="3" 
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="mono-font text-[9px] text-white font-medium">{completionPct}%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto no-scrollbar space-y-2 mb-2 max-h-[300px] pr-2">
        {sortedTodos.length === 0 ? (
          <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-sm">
            <span className="text-sm text-muted-foreground">Task queue empty</span>
          </div>
        ) : (
          sortedTodos.map((t) => {
            const glowClass = t.completed ? 'glow-completed' : `glow-${t.priority.toLowerCase()}`;
            return (
              <div 
                key={t.id} 
                className={`flex items-center bg-[#111] border border-white/5 rounded-sm group/todo transition-all hover:border-white/20 hover-scanline ${glowClass} py-2 px-3`}
              >
                <button 
                  className={`w-4 h-4 rounded-full border border-white/50 flex items-center justify-center mr-3 shrink-0 transition-colors ${t.completed ? 'bg-white/20 border-transparent' : 'bg-[#0a0a0a] hover:border-white'}`}
                  onClick={() => toggleTodo(t.id)}
                >
                  {t.completed && <Check className="w-2.5 h-2.5 text-white" />}
                </button>
                
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex items-center gap-2">
                    {t.category && (
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CAT_COLORS[t.category] }} />
                    )}
                    <span className={`text-sm font-medium truncate ${t.completed ? 'opacity-40 animate-strikethrough' : 'text-foreground'}`}>
                      {t.text}
                    </span>
                    {!t.completed && (
                      <span className="text-[9px] mono-font uppercase tracking-wider px-1 rounded-sm bg-white/5 border border-white/10" style={{ color: PRIORITY_COLORS[t.priority] }}>
                        [{t.priority}]
                      </span>
                    )}
                    {!t.completed && t.estimatedTime && (
                      <span className="text-[10px] mono-font text-muted-foreground">
                        {t.estimatedTime}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-0.5 italic flex justify-between">
                    <span>Logged: {getRelativeTime(t.createdAt)}</span>
                  </span>
                </div>
                
                <button 
                  onClick={() => deleteTodo(t.id)}
                  className="ml-3 p-1.5 opacity-0 group-hover/todo:opacity-100 text-white/40 hover:bg-white/10 hover:text-white transition-all shrink-0 rounded-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="w-full h-px bg-white/10 mb-4 relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 bottom-0 bg-white transition-all duration-500 ease-out"
          style={{ width: `${completionPct}%` }}
        />
        {allClear && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <span className="mono-font text-[8px] font-bold text-black tracking-widest">ALL CLEAR</span>
          </div>
        )}
      </div>

      <div className="mt-auto">
        <form onSubmit={handleAdd} className="flex items-center bg-[#111] border border-white/10 rounded-sm overflow-hidden focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/10 transition-all">
          <input
            type="text"
            placeholder="Add new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <div className="w-px h-4 bg-white/10" />
          <input
            type="text"
            placeholder="~30m"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-14 bg-transparent px-2 py-2 text-xs mono-font outline-none placeholder:text-muted-foreground text-center"
          />
          <div className="w-px h-4 bg-white/10" />
          <select 
            value={priority} 
            onChange={e => setPriority(e.target.value as PriorityLevel)}
            className="w-14 bg-transparent px-2 py-2 text-[10px] mono-font outline-none text-center"
            style={{ color: PRIORITY_COLORS[priority] }}
          >
            <option value="P1" className="text-black">P1</option>
            <option value="P2" className="text-black">P2</option>
            <option value="P3" className="text-black">P3</option>
          </select>
          <div className="w-px h-4 bg-white/10" />
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value as TodoCategory)}
            className="w-16 bg-transparent px-2 py-2 text-[10px] mono-font outline-none text-center"
          >
            <option value="Work" className="text-black">WRK</option>
            <option value="Study" className="text-black">STD</option>
            <option value="Personal" className="text-black">PRS</option>
            <option value="Health" className="text-black">HLT</option>
          </select>
          <button type="submit" className="bg-white/5 hover:bg-white/10 text-white px-3 py-2 text-[10px] mono-font font-medium uppercase tracking-wider transition-colors">
            Add
          </button>
        </form>
      </div>
    </div>
  );
};
