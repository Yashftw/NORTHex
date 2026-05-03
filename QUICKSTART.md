# Quick Start Guide

## Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

## First Steps

### 1. Expense Tracking (Homepage)

When you first open the app at `/`, you'll see:

**Pre-loaded Sample Data:**
- 7 sample expenses from the past week
- Default budgets for all 8 categories
- Monthly summary showing your spending

**Add Your First Expense:**
1. Find the "New Expense" form
2. Enter amount (e.g., 25.50)
3. Select category (e.g., Food)
4. Add note (e.g., "Lunch at cafe")
5. Date defaults to today
6. Click the + button

**Set Your Budgets:**
1. Scroll to "Monthly Budgets" panel on the right
2. Click any budget number to edit
3. Enter your desired monthly limit
4. Changes save automatically

### 2. Portfolio (Side Objective)

**Quick View from Homepage:**
- Scroll to bottom of expenses page
- See "Investment Portfolio" card
- Shows Net Worth and 24h change
- Click "View →" to see full portfolio

**Full Portfolio Page:**
1. Click "Portfolio" in top navigation
2. See pre-loaded sample assets (BTC, ETH, SOL, etc.)
3. Click "Add Asset" to add your own
4. Enter symbol, name, amount, price
5. Optionally add purchase price for P&L tracking

### 3. Navigation

**Top Menu:**
- **Expenses** (/) - Your homepage, expense tracker
- **Portfolio** (/portfolio) - Investment portfolio
- **Markets** (/markets) - Market overview
- **Watchlist** (/watchlist) - Tracked assets
- **Settings** (/settings) - App settings

## Key Features to Try

### Expense Analytics
- **Monthly Summary**: See total spent, remaining budget, today's spending
- **Weekly Chart**: View spending trends over last 7 days
- **Category Chart**: Donut chart showing distribution
- **Transaction List**: Scroll through all expenses, delete any

### Budget Management
- **Visual Progress**: Each category shows spending vs. budget
- **Over-Budget Alerts**: Red bars when you exceed limits
- **Inline Editing**: Click budget numbers to adjust
- **Real-time Updates**: All totals recalculate instantly

### Portfolio Features
- **Add Assets**: Support for USD or INR pricing
- **P&L Tracking**: See profit/loss per asset
- **Live Prices**: Simulated price updates every 3 seconds
- **INR Converter**: Standalone currency converter widget
- **Allocation Chart**: Visual portfolio distribution

## Data Persistence

All your data is saved automatically to browser localStorage:

- **Expenses**: Saved to `north_expenses_v1`
- **Budgets**: Saved to `north_budgets_v1`
- **Portfolio**: Saved to `north_assets`
- **Watchlist**: Saved to `north_watchlist`

**Note**: Data persists across browser sessions but is local to your device.

## Tips & Tricks

### Expense Tracking
- Use the date picker to add past expenses
- Add notes to remember context later
- Delete expenses by hovering over rows
- Watch the budget progress bars turn red when over limit

### Portfolio Management
- Add purchase prices to track real P&L
- Use notes field for personal reminders
- Switch between USD/INR when adding assets
- Check the side objective card on expenses page for quick portfolio view

### Visual Design
- Scroll to bottom - blur effect vanishes automatically
- Custom scrollbar matches the dark theme
- Smooth animations throughout
- Glass card effects for depth

## Keyboard Shortcuts

- **Tab**: Navigate through form fields
- **Enter**: Submit forms
- **Escape**: Close dialogs

## Mobile Usage

The app is fully responsive:
- Forms stack vertically on mobile
- Charts adapt to screen size
- Touch-friendly controls
- Swipe to scroll tables

## Troubleshooting

**Expenses not saving?**
- Check browser localStorage is enabled
- Try clearing cache and refreshing

**Portfolio not updating?**
- Prices update every 3 seconds (simulated)
- Refresh page to reset

**Charts not showing?**
- Add some expenses first
- Ensure amounts are greater than 0

**Budget bars not appearing?**
- Set budget values greater than 0
- Add expenses in that category

## Next Steps

1. **Clear Sample Data**: Delete pre-loaded expenses and assets
2. **Set Real Budgets**: Adjust category budgets to match your goals
3. **Add Real Expenses**: Start tracking your actual spending
4. **Add Portfolio**: Enter your real investment holdings
5. **Daily Habit**: Add expenses daily for best results

## Philosophy

Remember the core principle:

**"SPEND CONSCIOUSLY · INVEST PATIENTLY"**

- Track expenses daily (primary focus)
- Check portfolio occasionally (side objective)
- Stay within budgets
- Build long-term wealth

## Support

For issues or questions:
- Check README.md for detailed documentation
- Review CHANGES.md for technical details
- Inspect browser console for errors

---

**Ready to take control of your finances? Start tracking!**
