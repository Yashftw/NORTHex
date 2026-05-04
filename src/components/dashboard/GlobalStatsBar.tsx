import { useDashboard } from "@/lib/dashboard-context";
import { Flame, Moon, Dumbbell, CheckSquare, Target } from "lucide-react";

export const GlobalStatsBar = () => {
  const { streak, sleepData, workoutData, todos, goals } = useDashboard();

  const avgSleep = (() => {
    if (sleepData.length === 0) return "--";
    const last7 = sleepData.slice(-7);
    const sum = last7.reduce((acc, curr) => acc + curr.hours, 0);
    return (sum / last7.length).toFixed(1) + "h";
  })();

  const workoutsThisWeek = (() => {
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return workoutData.filter(w => new Date(w.date) >= oneWeekAgo).length;
  })();

  const tasksDoneToday = (() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const todayTodos = todos.filter(t => t.createdAt.startsWith(todayStr) || (t.completedAt && t.completedAt.startsWith(todayStr)));
    const done = todayTodos.filter(t => t.completed).length;
    return `${done}/${todayTodos.length}`;
  })();

  const activeGoals = goals.filter(g => !g.completed).length;

  return (
    <div className="w-full border-y border-primary/20 bg-primary/5 py-2 overflow-x-auto no-scrollbar">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center gap-6 md:gap-12 min-w-max text-xs uppercase tracking-widest mono-font text-foreground/80">
        
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-accent" />
          <span>Streak: <span className="text-accent font-bold">{streak} days</span></span>
        </div>

        <div className="w-px h-4 bg-primary/20" />

        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-primary" />
          <span>Avg Sleep: <span className="text-primary font-bold">{avgSleep}</span></span>
        </div>

        <div className="w-px h-4 bg-primary/20" />

        <div className="flex items-center gap-2">
          <Dumbbell className="w-4 h-4 text-success" />
          <span>Weekly Workouts: <span className="text-success font-bold">{workoutsThisWeek}</span></span>
        </div>

        <div className="w-px h-4 bg-primary/20" />

        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-foreground" />
          <span>Tasks Today: <span className="text-foreground font-bold">{tasksDoneToday}</span></span>
        </div>

        <div className="w-px h-4 bg-primary/20" />

        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary-glow" />
          <span>Active Goals: <span className="text-primary-glow font-bold">{activeGoals}</span></span>
        </div>

      </div>
    </div>
  );
};
