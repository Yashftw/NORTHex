import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/lib/user-context";
import { CurrencyProvider } from "@/lib/currency-context";
import { PortfolioProvider } from "@/lib/portfolio-context";
import { ExpensesProvider } from "@/lib/expenses-context";
import Expenses from "./pages/Expenses.tsx";
import Portfolio from "./pages/Portfolio.tsx";
import Markets from "./pages/Markets.tsx";
import NotFound from "./pages/NotFound.tsx";
import Settings from "./pages/Settings.tsx";
import Watchlist from "./pages/Watchlist.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <CurrencyProvider>
          <PortfolioProvider>
            <ExpensesProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Expenses />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/markets" element={<Markets />} />
                  <Route path="/watchlist" element={<Watchlist />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </ExpensesProvider>
          </PortfolioProvider>
        </CurrencyProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
