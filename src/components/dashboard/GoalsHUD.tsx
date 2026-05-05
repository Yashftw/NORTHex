import { useState } from "react";
import { useDashboard, GoalCategory } from "@/lib/dashboard-context";
import { Target, Plus, Trash2, ChevronRight, ChevronDown, Check } from "lucide-react";

export const GoalsHUD = () => {
  const { goals, addGoal, setGoalProgress, toggleGoalSubTask, deleteGoal } = useDashboard();
  const [newTitle, setNewTitle] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newCat, setNewCat] = useState<GoalCategory>("personal");
  const [filter, setFilter] = useState<"ALL" | "URGENT" | "DONE">("ALL");
  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({});

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDeadline) return;
    addGoal(newTitle, newDeadline, newCat);
    setNewTitle("");
    setNewDeadline("");
  };

  const toggleExpand = (id: string) => {
    setExpandedGoals(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const today = new Date();
  today.setHours(0,0,0,0);

  const isUrgent = (deadline: string, completed: boolean) => {
    if (completed) return false;
    const d = new Date(deadline);
    d.setHours(0,0,0,0);
    const diff = (d.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return diff <= 3;
  };

  const getDueDateStatus = (deadline: string, completed: boolean) => {
    if (completed) return { text: "muted-foreground", class: "" };
    const d = new Date(deadline);
    d.setHours(0,0,0,0);
    const diff = (d.getTime() - today.getTime()) / (1000 * 3600 * 24);
    if (diff < 0) return { text: "text-[#FF4060]", class: "animate-blink-once" };
    if (diff === 0) return { text: "text-[#FF9500]", class: "" };
    if (diff <= 7) return { text: "text-[#C8C8C8]", class: "" };
    return { text: "text-muted-foreground", class: "" };
  };

  const filteredGoals = goals.filter(g => {
    if (filter === "DONE") return g.completed;
    if (filter === "URGENT") return isUrgent(g.deadline, g.completed);
    return true;
  }).sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  return (
    <div className="glass-card rounded-sm p-6 relative group flex flex-col h-full">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="hud-badge w-10 h-10 border-white/20 text-white rounded-sm">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-display text-white">Objectives</h2>
            <p className="text-xs text-muted-foreground">Active Goals</p>
          </div>
        </div>

        <div className="flex bg-[#111] border border-white/10 rounded-sm p-1 gap-1">
          {(["ALL", "URGENT", "DONE"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-[10px] mono-font rounded-sm transition-all ${filter === f ? 'bg-white/10 text-white border-b border-white' : 'text-muted-foreground hover:text-white'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto no-scrollbar space-y-3 mb-6 max-h-[350px] pr-2">
        {filteredGoals.length === 0 ? (
          <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-sm">
            <span className="text-sm text-muted-foreground">No matching objectives</span>
          </div>
        ) : (
          filteredGoals.map((g) => {
            const dueStatus = getDueDateStatus(g.deadline, g.completed);
            const isExpanded = expandedGoals[g.id];
            const nextSubTask = g.subTasks?.find(st => !st.completed);
            
            return (
              <div key={g.id} className={`p-3 bg-[#111] border border-white/5 rounded-sm relative overflow-hidden group/goal transition-all accent-${g.category} ${g.completed ? 'animate-glow-flash' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 pr-12">
                    <h3 className={`font-bold tracking-wide text-sm ${g.completed ? 'text-white/40 line-through' : 'text-white'}`}>{g.title}</h3>
                    {g.note && <p className="text-xs text-muted-foreground italic mt-0.5">{g.note}</p>}
                    
                    <div className="mt-2 text-xs flex items-center gap-2">
                      <button 
                        className="flex items-center text-muted-foreground hover:text-white transition-colors"
                        onClick={() => toggleExpand(g.id)}
                      >
                        {isExpanded ? <ChevronDown className="w-3 h-3 mr-1" /> : <ChevronRight className="w-3 h-3 mr-1" />}
                        <span className="mono-font text-[10px]">{g.subTasks?.length || 0} steps</span>
                      </button>
                      
                      {!isExpanded && nextSubTask && (
                        <span className="mono-font text-[10px] text-[#FF9500]">◆ NEXT: <span className="text-muted-foreground">{nextSubTask.text}</span></span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-[10px] text-muted-foreground uppercase mb-1">Due {g.deadline.substring(5)}</span>
                    <span className={`text-[10px] mono-font ${dueStatus.text} ${dueStatus.class}`}>
                      {g.completed ? 'COMPLETED' : ''}
                    </span>
                    
                    {g.completed ? (
                      <div className="mt-1 flex items-center gap-1 text-[#39D353] border border-[#39D353]/30 bg-[#39D353]/10 px-2 py-0.5 rounded-sm">
                        <Check className="w-3 h-3" />
                        <span className="text-[9px] font-bold">DONE</span>
                      </div>
                    ) : (
                      <div className="relative w-9 h-9 mt-1">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 50 50">
                          <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="4" />
                          <circle 
                            cx="25" cy="25" r="20" 
                            fill="none" 
                            stroke="#ffffff" 
                            strokeWidth="4" 
                            strokeLinecap="round"
                            strokeDasharray={125.6}
                            strokeDashoffset={125.6 - (g.progress / 100) * 125.6}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="mono-font text-[8px] text-white">{g.progress}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {isExpanded && g.subTasks && g.subTasks.length > 0 && (
                  <div className="mt-3 pl-2 space-y-1.5 border-l border-white/10 ml-1">
                    {g.subTasks.map(st => (
                      <div key={st.id} className="flex items-center gap-2">
                        <button 
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${st.completed ? 'bg-white/20 border-transparent' : 'bg-[#0a0a0a] border-white/50 hover:border-white'}`}
                          onClick={() => toggleGoalSubTask(g.id, st.id)}
                        >
                          {st.completed && <Check className="w-2.5 h-2.5 text-white" />}
                        </button>
                        <span className={`text-[11px] ${st.completed ? 'text-muted-foreground line-through' : 'text-white/80'}`}>{st.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-px mt-4">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const threshold = (i + 1) * 10;
                    const isFilled = g.progress >= threshold;
                    return (
                      <div 
                        key={i}
                        className={`h-2 flex-1 cursor-pointer transition-all ${isFilled ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'bg-white/10 hover:bg-white/20'}`}
                        onClick={() => setGoalProgress(g.id, threshold)}
                      />
                    );
                  })}
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); deleteGoal(g.id); }}
                  className="absolute bottom-2 right-2 p-1 opacity-0 group-hover/goal:opacity-100 text-white/40 hover:text-white hover:bg-white/10 transition-all rounded-sm"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-auto">
        <form onSubmit={handleAdd} className="flex items-center bg-[#111] border border-white/10 rounded-sm overflow-hidden focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/10 transition-all">
          <select 
            value={newCat} 
            onChange={e => setNewCat(e.target.value as GoalCategory)}
            className="w-16 bg-transparent px-2 py-2 outline-none mono-font text-[10px] uppercase text-center"
          >
            <option value="personal" className="text-black">PRS</option>
            <option value="health" className="text-black">HLT</option>
            <option value="finance" className="text-black">FIN</option>
          </select>
          <div className="w-px h-4 bg-white/10" />
          <input
            type="text"
            placeholder="New goal..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <div className="w-px h-4 bg-white/10" />
          <input
            type="date"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            className="w-32 bg-transparent px-2 py-2 text-xs outline-none"
          />
          <button type="submit" className="bg-white/5 hover:bg-white/10 text-white px-3 py-2 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
