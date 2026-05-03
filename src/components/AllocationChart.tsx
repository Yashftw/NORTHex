import { motion } from "framer-motion";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Asset } from "@/lib/portfolio-data";

interface Props {
  assets: Asset[];
  totalValue: number;
}

export const AllocationChart = ({ assets, totalValue }: Props) => {
  const data = assets.map((a) => ({
    name: a.symbol,
    value: a.amount * a.price,
    color: a.color,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass-card rounded-sm p-6 md:p-8 shadow-elegant h-full"
    >
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Distribution</p>
        <h2 className="display-font text-2xl mt-1">Allocation</h2>
      </div>

      <div className="relative h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              stroke="hsl(var(--background))"
              strokeWidth={2}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "4px",
                fontFamily: "JetBrains Mono",
                fontSize: "12px",
              }}
              formatter={(v: number) => `$${v.toLocaleString()}`}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Total</p>
          <p className="display-font text-2xl mono-font mt-1">
            ${(totalValue / 1000).toFixed(1)}k
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        {data.map((d) => {
          const pct = (d.value / totalValue) * 100;
          return (
            <div key={d.name} className="flex items-center gap-2 text-sm">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="mono-font text-xs">{d.name}</span>
              <span className="mono-font text-xs text-muted-foreground ml-auto">{pct.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
