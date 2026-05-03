import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Currency = "INR" | "USD";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchangeRate: number;
  formatAmount: (amount: number, decimals?: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem("north_currency");
      return (saved as Currency) || "INR";
    } catch {
      return "INR";
    }
  });

  const [exchangeRate, setExchangeRate] = useState<number>(83.12);

  // Save currency preference
  useEffect(() => {
    localStorage.setItem("north_currency", currency);
  }, [currency]);

  // Simulate live exchange rate updates
  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * 0.1;
      setExchangeRate((prev) => prev + fluctuation);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  };

  const formatAmount = (amount: number, decimals: number = 2): string => {
    if (currency === "INR") {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: decimals,
      }).format(amount);
    } else {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: decimals,
      }).format(amount);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRate, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
};
