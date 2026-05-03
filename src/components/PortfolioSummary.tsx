import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  totalValue: number;
  totalPnL: number;
  pnlPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

const fmtINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

export const PortfolioSummary = ({ totalValue, totalPnL, pnlPercent, dayChange, dayChangePercent }: Props) => {
  const pnlPositive = totalPnL >= 0;
  const dayPositive = dayChange >= 0;
  const [exchangeRate, setExchangeRate] = useState<number>(83.12);

  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * 0.1;
      setExchangeRate((prev) => prev + fluctuation);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total Portfolio</p>
          <p className="text-xs text-muted-foreground/70 mono-font">Updated just now</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">Net Worth</p>
          <p className="display-font text-5xl md:text-6xl text-foreground mono-font">
            {fmt(totalValue)}
          </p>
          <p className="text-sm text-muted-foreground mono-font mt-2">
            {fmtINR(totalValue * exchangeRate)}
          </p>
        </div>

        <div className="md:border-l md:border-border md:pl-8">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">Total P&L</p>
          <div className="flex items-baseline gap-3">
            <p className={`text-3xl md:text-4xl font-bold mono-font ${pnlPositive ? "text-success" : "text-destructive"}`}>
              {pnlPositive ? "+" : ""}{fmt(totalPnL)}
            </p>
          </div>
          <div className={`inline-flex items-center gap-1 mt-2 text-sm mono-font ${pnlPositive ? "text-success" : "text-destructive"}`}>
            {pnlPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            {pnlPositive ? "+" : ""}{pnlPercent.toFixed(2)}%
          </div>
        </div>

        <div className="md:border-l md:border-border md:pl-8">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">24h Change</p>
          <div className="flex items-baseline gap-3">
            <p className={`text-3xl md:text-4xl font-bold mono-font ${dayPositive ? "text-success" : "text-destructive"}`}>
              {dayPositive ? "+" : ""}{fmt(dayChange)}
            </p>
          </div>
          <div className={`inline-flex items-center gap-1 mt-2 text-sm mono-font ${dayPositive ? "text-success" : "text-destructive"}`}>
            {dayPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            {dayPositive ? "+" : ""}{dayChangePercent.toFixed(2)}%
          </div>
        </div>
      </div>
    </motion.div>
  );
};
