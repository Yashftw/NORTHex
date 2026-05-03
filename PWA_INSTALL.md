# NORTH - Progressive Web App Installation Guide

## What is a PWA?

NORTH is now a **Progressive Web App (PWA)** - a modern web application that can be installed on your device and used like a native app, with offline support and a standalone window.

## Installation Instructions

### Desktop (Chrome, Edge, Brave)

1. **Visit the deployed website** (e.g., https://your-domain.com)
2. Look for the **install icon** in the address bar (usually a ⊕ or 🖥️ icon)
3. Click the icon and select **"Install NORTH"**
4. The app will open in its own window
5. Find the app in your:
   - **Windows**: Start Menu or Desktop
   - **Mac**: Applications folder or Launchpad
   - **Linux**: Application menu

**Alternative Method:**
- Click the three-dot menu (⋮) in your browser
- Select **"Install NORTH"** or **"Install app"**

### Mobile (Android)

1. **Open the website** in Chrome or Samsung Internet
2. Tap the **three-dot menu** (⋮) in the top-right
3. Select **"Add to Home screen"** or **"Install app"**
4. Confirm the installation
5. The NORTH icon will appear on your home screen
6. Tap to open as a standalone app

### Mobile (iOS/iPhone/iPad)

1. **Open the website** in Safari
2. Tap the **Share button** (□↑) at the bottom
3. Scroll down and tap **"Add to Home Screen"**
4. Edit the name if desired
5. Tap **"Add"**
6. The NORTH icon will appear on your home screen

## Features After Installation

✅ **Standalone Window** - Opens in its own window without browser UI
✅ **Offline Support** - Access your data even without internet
✅ **Fast Loading** - Cached resources load instantly
✅ **Desktop Icon** - Quick access from your home screen or desktop
✅ **Native Feel** - Looks and feels like a native app
✅ **Auto Updates** - Automatically updates when you're online

## PWA Features

### Offline Functionality
- View your expenses and portfolio data offline
- Add new expenses (syncs when back online)
- Browse all pages without internet

### Data Persistence
- All data stored locally in your browser
- No data sent to external servers
- Complete privacy and security

### Performance
- Instant loading after first visit
- Smooth animations and transitions
- Optimized for mobile and desktop

## Uninstallation

### Desktop
- **Windows**: Right-click the app icon → Uninstall
- **Mac**: Drag from Applications to Trash
- **Chrome**: Settings → Apps → NORTH → Uninstall

### Mobile
- **Android**: Long-press icon → Uninstall or App info → Uninstall
- **iOS**: Long-press icon → Remove App

## Browser Support

✅ **Chrome** (Desktop & Android)
✅ **Edge** (Desktop & Android)
✅ **Safari** (iOS & macOS)
✅ **Samsung Internet** (Android)
✅ **Brave** (Desktop & Android)
✅ **Firefox** (Limited PWA support)

## Technical Details

- **Manifest**: `/manifest.json`
- **Service Worker**: `/sw.js`
- **Cache Strategy**: Cache-first with network fallback
- **Offline Pages**: All main pages available offline
- **Theme Color**: Orange (#ff7f3f)
- **Background**: Dark (#0a0a0a)

## Troubleshooting

**Install button not showing?**
- Ensure you're using HTTPS (required for PWA)
- Try refreshing the page
- Check if already installed
- Clear browser cache and try again

**App not working offline?**
- Visit the app online first to cache resources
- Check browser settings allow offline storage
- Ensure service worker is registered (check DevTools)

**Updates not appearing?**
- Close and reopen the app
- Clear app cache in browser settings
- Uninstall and reinstall the app

## Development

The PWA is automatically configured when you deploy the app. No additional setup needed!

**Files:**
- `public/manifest.json` - PWA configuration
- `public/sw.js` - Service worker for offline support
- `index.html` - PWA meta tags and service worker registration

---

**Enjoy NORTH as a native-like app on all your devices!** 🌟
