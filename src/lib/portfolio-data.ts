export type Asset = {
  symbol: string;
  name: string;
  amount: number;
  price: number;
  change24h: number;
  color: string;
  purchasePrice?: number;
  notes?: string;
};

export const initialAssets: Asset[] = [];

export const generateHistory = (days = 30, base = 100000) => {
  const data = [];
  let value = base * 0.78;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    value = value * (1 + (Math.random() - 0.45) * 0.04);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Math.round(value),
    });
  }
  return data;
};
