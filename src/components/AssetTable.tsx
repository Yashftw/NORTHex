import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Trash2 } from "lucide-react";
import type { Asset } from "@/lib/portfolio-data";
import { usePortfolio } from "@/lib/portfolio-context";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Props {
  assets: Asset[];
  totalValue: number;
}

const fmt = (n: number, d = 2) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: d }).format(n);

export const AssetTable = ({ assets, totalValue }: Props) => {
  const { removeAsset } = usePortfolio();

  const handleDelete = (symbol: string, name: string) => {
    removeAsset(symbol);
    toast.success(`Removed ${name} from your portfolio`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="glass-card rounded-sm shadow-elegant overflow-hidden"
    >
      <div className="px-6 md:px-8 py-6 border-b border-border flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Holdings</p>
          <h2 className="display-font text-2xl mt-1">Your Assets</h2>
        </div>
        <span className="mono-font text-xs text-muted-foreground">{assets.length} POSITIONS</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
              <th className="text-left px-6 md:px-8 py-4 font-normal">Asset</th>
              <th className="text-right px-4 py-4 font-normal">Holdings</th>
              <th className="text-right px-4 py-4 font-normal">Price</th>
              <th className="text-right px-4 py-4 font-normal">Purchase</th>
              <th className="text-right px-4 py-4 font-normal">P&L</th>
              <th className="text-right px-4 py-4 font-normal">24h</th>
              <th className="text-right px-4 py-4 font-normal">Value</th>
              <th className="text-right px-4 py-4 font-normal">Allocation</th>
              <th className="text-right px-6 md:px-8 py-4 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a, i) => {
              const value = a.amount * a.price;
              const allocation = (value / totalValue) * 100;
              const positive = a.change24h >= 0;
              const purchasePrice = a.purchasePrice ?? a.price;
              const costBasis = a.amount * purchasePrice;
              const pnl = value - costBasis;
              const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
              const pnlPositive = pnl >= 0;
              return (
                <motion.tr
                  key={a.symbol}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                  className="border-t border-border/50 hover:bg-secondary/40 transition-colors group"
                >
                  <td className="px-6 md:px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 rounded-sm flex items-center justify-center font-bold text-xs"
                        style={{ backgroundColor: a.color, color: "hsl(var(--background))" }}
                      >
                        {a.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <p className="font-semibold">{a.name}</p>
                        <p className="text-xs text-muted-foreground mono-font">{a.symbol}</p>
                        {a.notes && (
                          <p className="text-xs text-muted-foreground italic mt-0.5">{a.notes}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="text-right px-4 py-5 mono-font text-sm">{a.amount.toLocaleString()}</td>
                  <td className="text-right px-4 py-5 mono-font text-sm">{fmt(a.price, a.price < 10 ? 4 : 2)}</td>
                  <td className="text-right px-4 py-5 mono-font text-sm text-muted-foreground">
                    {fmt(purchasePrice, purchasePrice < 10 ? 4 : 2)}
                  </td>
                  <td className="text-right px-4 py-5">
                    <div className="flex flex-col items-end">
                      <span className={`mono-font text-sm font-semibold ${pnlPositive ? "text-success" : "text-destructive"}`}>
                        {pnlPositive ? "+" : ""}{fmt(pnl)}
                      </span>
                      <span className={`mono-font text-xs ${pnlPositive ? "text-success" : "text-destructive"}`}>
                        {pnlPositive ? "+" : ""}{pnlPercent.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="text-right px-4 py-5">
                    <span className={`inline-flex items-center gap-0.5 text-sm mono-font ${positive ? "text-success" : "text-destructive"}`}>
                      {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {positive ? "+" : ""}{a.change24h.toFixed(2)}%
                    </span>
                  </td>
                  <td className="text-right px-4 py-5 mono-font font-semibold">{fmt(value)}</td>
                  <td className="text-right px-4 py-5">
                    <div className="flex items-center justify-end gap-3">
                      <div className="w-20 h-1 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${allocation}%`, backgroundColor: a.color }}
                        />
                      </div>
                      <span className="mono-font text-xs text-muted-foreground w-10 text-right">{allocation.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="text-right px-6 md:px-8 py-5">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove {a.name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove {a.name} ({a.symbol}) from your portfolio. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(a.symbol, a.name)}>
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
