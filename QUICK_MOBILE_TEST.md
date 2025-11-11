# Quick Mobile Testing Guide

## Your Setup:
- **Local URL:** http://localhost:5174
- **Network URL:** http://192.168.1.97:5174
- **Server Status:** ✅ Running

## Quick Test (Browser DevTools):

1. Open Chrome/Edge: `http://localhost:5174`
2. Press `F12` (or `Cmd+Option+I` on Mac)
3. Click device icon (or press `Cmd+Shift+M`)
4. Select "iPhone 12 Pro" or "Samsung Galaxy S20"
5. Test the app!

## Test on Real Phone:

1. **Connect phone to same Wi-Fi** as your computer
2. **Open browser on phone**
3. **Go to:** `http://192.168.1.97:5174`
4. **Test the app!**

## If It Doesn't Work:

### Check Firewall (macOS):
```bash
# Allow Node.js through firewall
# System Settings → Network → Firewall → Options
# Add Node.js to allowed apps
```

### Check if server is accessible:
```bash
# From your phone's browser, try:
http://192.168.1.97:5174
```

### Restart server if needed:
```bash
cd ~/Documents/startfarme
npm run dev
```

## What to Test:

✅ Bottom navigation (mobile)
✅ Sidebar menu (mobile)
✅ Arabic RTL layout
✅ Touch interactions
✅ Forms and inputs
✅ Scrolling
✅ Language toggle
✅ All pages (Weather, Crops, Irrigation, Market, Community, Profile)

## Troubleshooting:

**Can't access from phone?**
- Make sure phone and computer are on same Wi-Fi
- Check firewall settings
- Try restarting the dev server
- Verify IP address: `ipconfig getifaddr en0`

**IP address changed?**
- Run: `ipconfig getifaddr en0` to get new IP
- Update the URL on your phone

## Alternative: Use ngrok (works from anywhere)

```bash
# Install ngrok
brew install ngrok

# Start tunnel
ngrok http 5174

# Use the ngrok URL on your phone
```

