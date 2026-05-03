import { motion } from "framer-motion";
import GradualBlur from "@/components/GradualBlur";
import heroBg from "@/assets/hero-bg.jpg";
import { AllocationChart } from "@/components/AllocationChart";
import { AssetTable } from "@/components/AssetTable";
import { PortfolioSummary } from "@/components/PortfolioSummary";
import { PriceHistoryChart } from "@/components/PriceHistoryChart";
import { SiteNav } from "@/components/SiteNav";
import { AddAssetDialog } from "@/components/AddAssetDialog";
import { CurrencyConverter } from "@/components/CurrencyConverter";
import { usePortfolio } from "@/lib/portfolio-context";

const Portfolio = () => {
  const { assets, totalValue, totalPnL, pnlPercent, dayChange, dayChangePercent } = usePortfolio();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex flex-col overflow-hidden">
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
              ◆ Live Portfolio Dashboard
            </p>
            <h1 className="display-font text-6xl md:text-8xl lg:text-[9rem] text-foreground">
              TRACK<br />YOUR EDGE
            </h1>
            <p className="mt-8 text-lg md:text-xl text-foreground/80 max-w-xl leading-relaxed">
              Real-time prices, allocation insights, and historical performance — engineered for the disciplined investor.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 px-6 md:px-12 pb-8 flex items-center justify-between text-xs mono-font text-foreground/60">
          <span>EST. 2026</span>
          <div className="flex-1 mx-8 h-px bg-foreground/20 max-w-md" />
          <span>SCROLL ↓</span>
        </div>

        <GradualBlur preset="bottom" strength={2.5} divCount={6} curve="ease-out" />
      </section>

      <main className="relative px-6 md:px-12 py-16 md:py-24 max-w-[1600px] mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <PortfolioSummary
            totalValue={totalValue}
            totalPnL={totalPnL}
            pnlPercent={pnlPercent}
            dayChange={dayChange}
            dayChangePercent={dayChangePercent}
          />
          <AddAssetDialog />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PriceHistoryChart totalValue={totalValue} />
          </div>
          <div className="space-y-8">
            <AllocationChart assets={assets} totalValue={totalValue} />
            <CurrencyConverter />
          </div>
        </div>

        <AssetTable assets={assets} totalValue={totalValue} />
      </main>

      <footer className="border-t border-border px-6 md:px-12 py-10 mt-16">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs mono-font text-muted-foreground">
          <span>© 2026 NORTH — All positions are simulated.</span>
          <span>BUILT FOR THOSE WHO CHART THEIR OWN COURSE</span>
        </div>
      </footer>

      {/* Page-level scroll blur effect */}
      <GradualBlur preset="page-footer" strength={2} divCount={6} animated="scroll" />
    </div>
  );
};

export default Portfolio;
