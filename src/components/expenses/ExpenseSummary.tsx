import { motion } from "framer-motion";
import { Wallet, Calendar, TrendingDown } from "lucide-react";
import { useExpenses } from "@/lib/expenses-context";
import { useCurrency } from "@/lib/currency-context";

export const ExpenseSummary = () => {
  const { monthTotal, todayTotal, byCategory, expenses } = useExpenses();
  const { formatAmount } = useCurrency();

  const totalBudget = byCategory.reduce((s, c) => s + c.budget, 0);
  const budgetPct = totalBudget > 0 ? (monthTotal / totalBudget) * 100 : 0;
  const remaining = Math.max(totalBudget - monthTotal, 0);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthExpenses = expenses.filter((e) => e.date.startsWith(currentMonth));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card rounded-sm p-8 md:p-10 shadow-elegant relative overflow-hidden"
    >
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-primary opacity-10 blur-3xl rounded-full" />

      <div className="flex items-center gap-3 mb-8 relative">
        <div className="h-10 w-10 rounded-sm bg-gradient-primary flex items-center justify-center">
          <Wallet className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">This Month</p>
          <p className="text-xs text-muted-foreground/70 mono-font">{monthExpenses.length} transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">Spent</p>
          <p className="display-font text-5xl md:text-6xl text-foreground mono-font">
            {formatAmount(monthTotal, 0)}
          </p>
          <div className="mt-4 space-y-2">
            <div className="w-full h-px bg-border overflow-hidden">
              <div
                className="h-full bg-gradient-primary transition-all duration-700"
                style={{ width: `${Math.min(budgetPct, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mono-font">
              {budgetPct.toFixed(1)}% of {formatAmount(totalBudget, 0)} budget
            </p>
          </div>
        </div>

        <div className="md:border-l md:border-border md:pl-8">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">Remaining</p>
          <div className="flex items-baseline gap-3">
            <p className="text-3xl md:text-4xl font-bold mono-font text-success">
              {formatAmount(remaining, 0)}
            </p>
          </div>
          <div className="inline-flex items-center gap-1 mt-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Through month end
          </div>
        </div>

        <div className="md:border-l md:border-border md:pl-8">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">Today</p>
          <div className="flex items-baseline gap-3">
            <p className="text-3xl md:text-4xl font-bold mono-font text-destructive">
              {formatAmount(todayTotal, 0)}
            </p>
          </div>
          <div className="inline-flex items-center gap-1 mt-2 text-sm text-muted-foreground">
            <TrendingDown className="h-4 w-4" />
            Tracked today
          </div>
        </div>
      </div>
    </motion.div>
  );
};
