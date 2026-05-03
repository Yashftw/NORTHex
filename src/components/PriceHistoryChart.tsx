import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { generateHistory } from "@/lib/portfolio-data";

const ranges = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y", days: 365 },
];

interface Props {
  totalValue: number;
}

export const PriceHistoryChart = ({ totalValue }: Props) => {
  const [range, setRange] = useState(30);
  const data = useMemo(() => generateHistory(range, totalValue), [range, totalValue]);

  const first = data[0]?.value ?? 0;
  const last = data[data.length - 1]?.value ?? 0;
  const change = ((last - first) / first) * 100;
  const positive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="glass-card rounded-sm p-6 md:p-8 shadow-elegant h-full"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Performance</p>
          <h2 className="display-font text-2xl mt-1">Price History</h2>
          <div className="flex items-baseline gap-3 mt-3">
            <p className="display-font text-3xl mono-font">${last.toLocaleString()}</p>
            <span className={`text-sm mono-font ${positive ? "text-success" : "text-destructive"}`}>
              {positive ? "+" : ""}{change.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex gap-1 bg-secondary/50 p-1 rounded-sm self-start">
          {ranges.map((r) => (
            <button
              key={r.label}
              onClick={() => setRange(r.days)}
              className={`px-3 py-1.5 text-xs mono-font rounded-sm transition-all ${
                range === r.days ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval={Math.floor(data.length / 6)}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              width={50}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "4px",
                fontFamily: "JetBrains Mono",
                fontSize: "12px",
              }}
              formatter={(v: number) => [`$${v.toLocaleString()}`, "Value"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#areaGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
