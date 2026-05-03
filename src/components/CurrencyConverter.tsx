import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CurrencyConverter = () => {
  const [usdAmount, setUsdAmount] = useState<string>("1");
  const [inrAmount, setInrAmount] = useState<string>("");
  const [exchangeRate, setExchangeRate] = useState<number>(83.12);
  const [previousRate, setPreviousRate] = useState<number>(83.12);
  const [rateHistory, setRateHistory] = useState<number[]>([83.12]);

  // Fetch live exchange rate with realistic fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setExchangeRate((prev) => {
        setPreviousRate(prev);
        const fluctuation = (Math.random() - 0.5) * 0.15;
        const newRate = prev + fluctuation;
        setRateHistory((history) => [...history.slice(-29), newRate]);
        return newRate;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const usd = parseFloat(usdAmount) || 0;
    setInrAmount((usd * exchangeRate).toFixed(2));
  }, [usdAmount, exchangeRate]);

  const handleInrChange = (value: string) => {
    setInrAmount(value);
    const inr = parseFloat(value) || 0;
    setUsdAmount((inr / exchangeRate).toFixed(2));
  };

  const handleSwap = () => {
    setUsdAmount(inrAmount);
    setInrAmount(usdAmount);
  };

  const rateChange = exchangeRate - previousRate;
  const rateChangePercent = ((rateChange / previousRate) * 100);
  const isPositive = rateChange >= 0;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          INR Currency Converter
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>Live USD to INR conversion</span>
          <span className={`flex items-center gap-1 text-xs ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isPositive ? '+' : ''}{rateChangePercent.toFixed(3)}%
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted/50 p-3 space-y-1">
          <p className="text-xs text-muted-foreground">Current Exchange Rate</p>
          <p className="text-2xl font-bold mono-font">₹{exchangeRate.toFixed(4)}</p>
          <p className="text-xs text-muted-foreground">per 1 USD</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="usd">USD Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
            <Input
              id="usd"
              type="number"
              step="any"
              value={usdAmount}
              onChange={(e) => setUsdAmount(e.target.value)}
              className="pl-7 text-lg"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleSwap}
            className="rounded-full"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="inr">INR Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
            <Input
              id="inr"
              type="number"
              step="any"
              value={inrAmount}
              onChange={(e) => handleInrChange(e.target.value)}
              className="pl-7 text-lg"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-border/50">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-muted-foreground">24h High</p>
              <p className="font-semibold mono-font">₹{Math.max(...rateHistory).toFixed(4)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">24h Low</p>
              <p className="font-semibold mono-font">₹{Math.min(...rateHistory).toFixed(4)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
