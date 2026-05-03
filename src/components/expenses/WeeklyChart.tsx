import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useExpenses } from "@/lib/expenses-context";
import { useCurrency } from "@/lib/currency-context";

export const WeeklyChart = () => {
  const { last7Days } = useExpenses();
  const { formatAmount, currency } = useCurrency();

  const maxValue = Math.max(...last7Days.map((d) => d.total), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass-card rounded-sm shadow-elegant overflow-hidden"
    >
      <div className="px-6 md:px-8 py-6 border-b border-border flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Last 7 days</p>
          <h2 className="display-font text-2xl mt-1">Daily Spending</h2>
        </div>
        <span className="mono-font text-xs text-muted-foreground">PEAK {formatAmount(maxValue, 0)}</span>
      </div>

      <div className="p-6 md:p-8">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={last7Days}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickFormatter={(v) => `${currency === "INR" ? "₹" : "$"}${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.125rem",
                fontFamily: "JetBrains Mono, monospace",
              }}
              formatter={(value: number) => [formatAmount(value, 0), "Spent"]}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#colorTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
