import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { usePortfolio } from "@/lib/portfolio-context";
import { toast } from "sonner";

export const AddAssetDialog = () => {
  const { addAsset } = usePortfolio();
  const [open, setOpen] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number>(83.12);
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    amount: "",
    price: "",
    purchasePrice: "",
    notes: "",
  });

  // Fetch live exchange rate
  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * 0.1;
      setExchangeRate((prev) => prev + fluctuation);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.symbol || !formData.name || !formData.amount || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(formData.amount);
    let price = parseFloat(formData.price);
    let purchasePrice = formData.purchasePrice ? parseFloat(formData.purchasePrice) : price;

    if (isNaN(amount) || isNaN(price) || amount <= 0 || price <= 0) {
      toast.error("Please enter valid positive numbers");
      return;
    }

    // Convert INR to USD if needed
    if (currency === "INR") {
      price = price / exchangeRate;
      purchasePrice = purchasePrice / exchangeRate;
    }

    addAsset({
      symbol: formData.symbol.toUpperCase(),
      name: formData.name,
      amount,
      price,
      change24h: 0,
      color: `hsl(${Math.random() * 360} 70% 60%)`,
      purchasePrice,
      notes: formData.notes,
    });

    toast.success(`Added ${formData.symbol.toUpperCase()} to your portfolio`);
    setFormData({ symbol: "", name: "", amount: "", price: "", purchasePrice: "", notes: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Asset</DialogTitle>
            <DialogDescription>
              Enter the details of your asset holdings and money you have invested.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="symbol">Symbol *</Label>
                <Input
                  id="symbol"
                  placeholder="BTC"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Asset Name *</Label>
                <Input
                  id="name"
                  placeholder="Bitcoin"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount Held *</Label>
              <Input
                id="amount"
                type="number"
                step="any"
                placeholder="0.5"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <Tabs value={currency} onValueChange={(v) => setCurrency(v as "USD" | "INR")} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="USD">USD</TabsTrigger>
                <TabsTrigger value="INR">INR</TabsTrigger>
              </TabsList>
              <TabsContent value="USD" className="space-y-4 mt-4">
                <div className="grid gap-2">
                  <Label htmlFor="price-usd">Current Price (USD) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="price-usd"
                      type="number"
                      step="any"
                      placeholder="67420"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="pl-7"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="purchase-price-usd">Purchase Price (USD)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="purchase-price-usd"
                      type="number"
                      step="any"
                      placeholder="65000"
                      value={formData.purchasePrice}
                      onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                      className="pl-7"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="INR" className="space-y-4 mt-4">
                <div className="grid gap-2">
                  <Label htmlFor="price-inr">Current Price (INR) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input
                      id="price-inr"
                      type="number"
                      step="any"
                      placeholder="5600000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="pl-7"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ≈ ${formData.price ? (parseFloat(formData.price) / exchangeRate).toFixed(2) : "0.00"} USD
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="purchase-price-inr">Purchase Price (INR)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input
                      id="purchase-price-inr"
                      type="number"
                      step="any"
                      placeholder="5400000"
                      value={formData.purchasePrice}
                      onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                      className="pl-7"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Add any notes about this holding..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Asset</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
