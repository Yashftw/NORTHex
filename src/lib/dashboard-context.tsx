import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface SleepRecordV2 {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO string
  hours: number;
}

export type WorkoutCategory = "Cardio" | "Strength" | "Flexibility" | "Recovery";

export interface WorkoutRecordV2 {
  id: string;
  date: string;
  timestamp: string;
  durationMinutes: number;
  type: WorkoutCategory;
}

export type GoalCategory = "health" | "finance" | "personal";

export interface GoalV2 {
  id: string;
  title: string;
  deadline: string;
  category: GoalCategory;
  progress: number; // 0 to 100
  completed: boolean;
  createdAt: string;
}

export type PriorityLevel = "P1" | "P2" | "P3";

export interface TodoV2 {
  id: string;
  text: string;
  priority: PriorityLevel;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

interface DashboardContextValue {
  sleepData: SleepRecordV2[];
  workoutData: WorkoutRecordV2[];
  goals: GoalV2[];
  todos: TodoV2[];
  addSleep: (date: string, hours: number) => void;
  addWorkout: (date: string, durationMinutes: number, type: WorkoutCategory) => void;
  addGoal: (title: string, deadline: string, category: GoalCategory) => void;
  incrementGoal: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;
  addTodo: (text: string, priority: PriorityLevel) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  streak: number;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [sleepData, setSleepData] = useState<SleepRecordV2[]>(() => {
    try {
      const saved = localStorage.getItem("north_sleep_v2");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [workoutData, setWorkoutData] = useState<WorkoutRecordV2[]>(() => {
    try {
      const saved = localStorage.getItem("north_workout_v2");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [goals, setGoals] = useState<GoalV2[]>(() => {
    try {
      const saved = localStorage.getItem("north_goals_v2");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [todos, setTodos] = useState<TodoV2[]>(() => {
    try {
      const saved = localStorage.getItem("north_todos_v2");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("north_sleep_v2", JSON.stringify(sleepData));
  }, [sleepData]);

  useEffect(() => {
    localStorage.setItem("north_workout_v2", JSON.stringify(workoutData));
  }, [workoutData]);

  useEffect(() => {
    localStorage.setItem("north_goals_v2", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("north_todos_v2", JSON.stringify(todos));
  }, [todos]);

  const addSleep = (date: string, hours: number) => {
    setSleepData((prev) => {
      const existingIdx = prev.findIndex((s) => s.date === date);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = { ...next[existingIdx], hours, timestamp: new Date().toISOString() };
        return next;
      }
      return [...prev, { id: crypto.randomUUID(), date, timestamp: new Date().toISOString(), hours }];
    });
  };

  const addWorkout = (date: string, durationMinutes: number, type: WorkoutCategory) => {
    setWorkoutData((prev) => [
      ...prev,
      { id: crypto.randomUUID(), date, timestamp: new Date().toISOString(), durationMinutes, type },
    ]);
  };

  const addGoal = (title: string, deadline: string, category: GoalCategory) => {
    setGoals((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title,
        deadline,
        category,
        progress: 0,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const incrementGoal = (id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const newProgress = Math.min(Math.max(g.progress + amount, 0), 100);
        return { ...g, progress: newProgress, completed: newProgress === 100 };
      })
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const addTodo = (text: string, priority: PriorityLevel) => {
    setTodos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text,
        priority,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const isCompleted = !t.completed;
        return {
          ...t,
          completed: isCompleted,
          completedAt: isCompleted ? new Date().toISOString() : undefined,
        };
      })
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // Calculate workout streak
  const streak = (() => {
    if (workoutData.length === 0) return 0;
    const uniqueDates = [...new Set(workoutData.map(w => w.date))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const d = new Date(uniqueDates[i]);
      d.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      
      if (i === 0 && diffDays > 1) {
        return 0; // Streak broken
      }
      
      if (diffDays === currentStreak || diffDays === currentStreak + 1) {
         if (diffDays === currentStreak && i === 0 && diffDays === 0) {
            // Did it today, counts as 1 (or currentStreak + 1 if we had a history, but this logic is simplified)
            // Actually, if we did it today, and diff is 0, currentStreak becomes 1.
         }
         currentStreak = diffDays === 0 ? 1 : diffDays + 1;
      } else if (i > 0 && diffDays > currentStreak) {
          break; // Gap found
      }
    }
    
    // Simplification for robust visual streak
    let robustStreak = 0;
    const sortedDates = [...new Set(workoutData.map(w => w.date))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    if (sortedDates.length === 0) return 0;
    
    const todayStr = new Date().toISOString().split("T")[0];
    let checkDate = new Date();
    
    if (sortedDates[0] !== todayStr) {
      // Check if they worked out yesterday
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayStr = checkDate.toISOString().split("T")[0];
      if (sortedDates[0] !== yesterdayStr) return 0; // Streak is 0
    }
    
    for (const dStr of sortedDates) {
      const expectedStr = checkDate.toISOString().split("T")[0];
      if (dStr === expectedStr) {
        robustStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return robustStreak;
  })();

  return (
    <DashboardContext.Provider
      value={{
        sleepData,
        workoutData,
        goals,
        todos,
        addSleep,
        addWorkout,
        addGoal,
        incrementGoal,
        deleteGoal,
        addTodo,
        toggleTodo,
        deleteTodo,
        streak,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
};
