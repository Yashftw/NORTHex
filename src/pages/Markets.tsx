import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Search, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { Input } from "@/components/ui/input";
import { usePortfolio } from "@/lib/portfolio-context";

// Extended market list (includes user assets + extras)
const extraMarket = [
  { symbol: "ADA", name: "Cardano", price: 0.58, change24h: 1.23, color: "hsl(210 70% 55%)" },
  { symbol: "DOT", name: "Polkadot", price: 7.42, change24h: -2.04, color: "hsl(330 70% 55%)" },
  { symbol: "ARB", name: "Arbitrum", price: 1.12, change24h: 4.51, color: "hsl(200 80% 55%)" },
  { symbol: "OP", name: "Optimism", price: 2.34, change24h: -1.87, color: "hsl(0 80% 60%)" },
  { symbol: "DOGE", name: "Dogecoin", price: 0.16, change24h: 0.92, color: "hsl(45 90% 60%)" },
  { symbol: "ATOM", name: "Cosmos", price: 9.81, change24h: 3.45, color: "hsl(260 60% 60%)" },
];

const fmt = (n: number, d = 2) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: d }).format(n);

const Markets = () => {
  const { assets, watchlist, toggleWatch } = usePortfolio();
  const [query, setQuery] = useState("");

  const merged = useMemo(() => {
    const map = new Map<string, { symbol: string; name: string; price: number; change24h: number; color: string }>();
    [...assets, ...extraMarket].forEach((a) => map.set(a.symbol, a));
    return Array.from(map.values());
  }, [assets]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return merged.filter((m) => m.name.toLowerCase().includes(q) || m.symbol.toLowerCase().includes(q));
  }, [merged, query]);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <main className="px-6 md:px-12 py-12 max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-primary mono-font mb-4">◆ Live Markets</p>
          <h1 className="display-font text-5xl md:text-7xl">MARKETS</h1>
          <p className="mt-4 text-muted-foreground max-w-xl">
            Browse, search and watch the assets that matter to your strategy.
          </p>
        </motion.div>

        <div className="glass-card rounded-sm shadow-elegant overflow-hidden">
          <div className="p-6 md:p-8 border-b border-border flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 bg-secondary/50 border-border"
              />
            </div>
            <span className="mono-font text-xs text-muted-foreground">
              {filtered.length} ASSETS · LIVE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  <th className="text-left px-6 md:px-8 py-4 font-normal w-12"></th>
                  <th className="text-left px-2 py-4 font-normal">Asset</th>
                  <th className="text-right px-4 py-4 font-normal">Price</th>
                  <th className="text-right px-4 py-4 font-normal">24h</th>
                  <th className="text-right px-6 md:px-8 py-4 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => {
                  const positive = m.change24h >= 0;
                  const watched = watchlist.includes(m.symbol);
                  const owned = assets.some((a) => a.symbol === m.symbol);
                  return (
                    <motion.tr
                      key={m.symbol}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                      className="border-t border-border/50 hover:bg-secondary/40 transition-colors"
                    >
                      <td className="px-6 md:px-8 py-5">
                        <button
                          onClick={() => toggleWatch(m.symbol)}
                          className="text-muted-foreground hover:text-primary transition-colors"
                          aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
                        >
                          <Star className={`h-4 w-4 ${watched ? "fill-primary text-primary" : ""}`} />
                        </button>
                      </td>
                      <td className="px-2 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-9 w-9 rounded-sm flex items-center justify-center font-bold text-xs"
                            style={{ backgroundColor: m.color, color: "hsl(var(--background))" }}
                          >
                            {m.symbol.slice(0, 3)}
                          </div>
                          <div>
                            <p className="font-semibold">{m.name}</p>
                            <p className="text-xs text-muted-foreground mono-font">{m.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-right px-4 py-5 mono-font">{fmt(m.price, m.price < 10 ? 4 : 2)}</td>
                      <td className="text-right px-4 py-5">
                        <span
                          className={`inline-flex items-center gap-0.5 text-sm mono-font ${
                            positive ? "text-success" : "text-destructive"
                          }`}
                        >
                          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {positive ? "+" : ""}
                          {m.change24h.toFixed(2)}%
                        </span>
                      </td>
                      <td className="text-right px-6 md:px-8 py-5">
                        {owned && (
                          <span className="text-[10px] uppercase tracking-[0.2em] mono-font text-primary border border-primary/40 px-2 py-1 rounded-sm">
                            HELD
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Markets;
