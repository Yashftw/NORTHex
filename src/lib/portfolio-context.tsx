import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { initialAssets, type Asset } from "./portfolio-data";

interface PortfolioContextValue {
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  addAsset: (asset: Asset) => void;
  removeAsset: (symbol: string) => void;
  updateAsset: (symbol: string, updates: Partial<Asset>) => void;
  watchlist: string[];
  toggleWatch: (symbol: string) => void;
  totalValue: number;
  totalPnL: number;
  pnlPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [assets, setAssets] = useState<Asset[]>(() => {
    try {
      const saved = localStorage.getItem("north_assets");
      return saved ? JSON.parse(saved) : initialAssets;
    } catch {
      return initialAssets;
    }
  });
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("north_watchlist") || "[]");
    } catch {
      return [];
    }
  });

  // Save assets to localStorage
  useEffect(() => {
    localStorage.setItem("north_assets", JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem("north_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // Live tick
  useEffect(() => {
    const id = setInterval(() => {
      setAssets((prev) =>
        prev.map((a) => {
          const drift = (Math.random() - 0.5) * 0.008;
          return {
            ...a,
            price: a.price * (1 + drift),
            change24h: a.change24h + drift * 100,
          };
        })
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const addAsset = (asset: Asset) => {
    setAssets((prev) => {
      const exists = prev.find((a) => a.symbol === asset.symbol);
      if (exists) {
        return prev.map((a) =>
          a.symbol === asset.symbol
            ? { ...a, amount: a.amount + asset.amount }
            : a
        );
      }
      return [...prev, asset];
    });
  };

  const removeAsset = (symbol: string) => {
    setAssets((prev) => prev.filter((a) => a.symbol !== symbol));
  };

  const updateAsset = (symbol: string, updates: Partial<Asset>) => {
    setAssets((prev) =>
      prev.map((a) => (a.symbol === symbol ? { ...a, ...updates } : a))
    );
  };

  const toggleWatch = (symbol: string) =>
    setWatchlist((w) => (w.includes(symbol) ? w.filter((s) => s !== symbol) : [...w, symbol]));

  const stats = useMemo(() => {
    const total = assets.reduce((s, a) => s + a.amount * a.price, 0);
    // Calculate actual cost based on purchase prices
    const cost = assets.reduce((s, a) => {
      const purchasePrice = a.purchasePrice ?? a.price;
      return s + a.amount * purchasePrice;
    }, 0);
    const pnl = total - cost;
    const day = assets.reduce((s, a) => s + a.amount * a.price * (a.change24h / 100), 0);
    return {
      totalValue: total,
      totalPnL: pnl,
      pnlPercent: cost > 0 ? (pnl / cost) * 100 : 0,
      dayChange: day,
      dayChangePercent: total > 0 ? (day / total) * 100 : 0,
    };
  }, [assets]);

  return (
    <PortfolioContext.Provider value={{ assets, setAssets, addAsset, removeAsset, updateAsset, watchlist, toggleWatch, ...stats }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
};
