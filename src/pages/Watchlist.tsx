import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Star, StarOff } from "lucide-react";
import { Link } from "react-router-dom";
import { SiteNav } from "@/components/SiteNav";
import GradualBlur from "@/components/GradualBlur";
import heroBg from "@/assets/hero-bg.jpg";
import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/lib/portfolio-context";

const fmt = (n: number, d = 2) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: d }).format(n);

const Watchlist = () => {
  const { assets, watchlist, toggleWatch } = usePortfolio();

  const watched = assets.filter((a) => watchlist.includes(a.symbol));

  return (
    <div className="min-h-screen bg-background">
      <section className="relative min-h-[50vh] flex flex-col overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1280} />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>
        <SiteNav variant="hero" />

        <div className="relative z-10 flex-1 flex items-center px-6 md:px-12 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6 mono-font">
              ◆ Saved Assets
            </p>
            <h1 className="display-font text-6xl md:text-8xl text-foreground">
              WATCHLIST
            </h1>
            <p className="mt-8 text-lg md:text-xl text-foreground/80 max-w-xl leading-relaxed">
              The assets you're keeping a close eye on. Updates in real time.
            </p>
          </motion.div>
        </div>
        <GradualBlur preset="bottom" strength={2.5} divCount={6} curve="ease-out" />
      </section>

      <main className="relative px-6 md:px-12 py-12 max-w-[1600px] mx-auto z-10">
        {watched.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-sm p-16 text-center"
          >
            <StarOff className="h-12 w-12 mx-auto mb-6 text-muted-foreground" />
            <h2 className="display-font text-2xl mb-3">Nothing here yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Star assets from the markets page to start building your watchlist.
            </p>
            <Button asChild>
              <Link to="/markets">Browse Markets →</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watched.map((a, i) => {
              const positive = a.change24h >= 0;
              return (
                <motion.div
                  key={a.symbol}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="glass-card rounded-sm p-6 shadow-elegant hover:shadow-glow transition-all group relative overflow-hidden"
                >
                  <div
                    className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20 blur-2xl"
                    style={{ backgroundColor: a.color }}
                  />
                  <div className="flex items-start justify-between relative">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-sm flex items-center justify-center font-bold text-xs"
                        style={{ backgroundColor: a.color, color: "hsl(var(--background))" }}
                      >
                        {a.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <p className="font-semibold">{a.name}</p>
                        <p className="text-xs text-muted-foreground mono-font">{a.symbol}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleWatch(a.symbol)}
                      className="text-primary hover:text-primary-glow transition-colors"
                      aria-label="Remove from watchlist"
                    >
                      <Star className="h-4 w-4 fill-primary" />
                    </button>
                  </div>

                  <div className="mt-6 relative">
                    <p className="display-font text-3xl mono-font">{fmt(a.price, a.price < 10 ? 4 : 2)}</p>
                    <div
                      className={`inline-flex items-center gap-1 mt-2 text-sm mono-font ${
                        positive ? "text-success" : "text-destructive"
                      }`}
                    >
                      {positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      {positive ? "+" : ""}
                      {a.change24h.toFixed(2)}% · 24h
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Watchlist;
