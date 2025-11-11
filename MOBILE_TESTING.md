# Mobile Testing Guide for StartFarme

This guide explains how to test the StartFarme application on mobile devices and mobile browsers.

## Method 1: Browser DevTools (Easiest - Recommended for Development)

### Chrome/Edge DevTools:
1. Open the app in Chrome/Edge: `http://localhost:5174`
2. Press `F12` or `Right-click → Inspect`
3. Click the **Device Toolbar** icon (or press `Ctrl+Shift+M` / `Cmd+Shift+M` on Mac)
4. Select a device preset:
   - iPhone 12/13/14 (375x812)
   - iPhone 14 Pro Max (430x932)
   - Samsung Galaxy S20 (360x800)
   - iPad (768x1024)
   - Or set custom dimensions

### Firefox DevTools:
1. Open the app in Firefox: `http://localhost:5174`
2. Press `F12` or `Right-click → Inspect Element`
3. Click the **Responsive Design Mode** icon (or press `Ctrl+Shift+M` / `Cmd+Shift+M`)
4. Select a device from the dropdown

### Safari (macOS):
1. Enable Developer menu: `Safari → Preferences → Advanced → Show Develop menu`
2. Open the app: `http://localhost:5174`
3. Go to `Develop → Enter Responsive Design Mode`
4. Select device from the dropdown

## Method 2: Test on Actual Mobile Device (Most Realistic)

### Step 1: Find Your Computer's IP Address

**On macOS:**
```bash
ipconfig getifaddr en0
# or
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**On Windows:**
```bash
ipconfig
# Look for IPv4 Address under your network adapter
```

**On Linux:**
```bash
hostname -I
# or
ip addr show
```

### Step 2: Ensure Vite is Configured for Network Access

The `vite.config.ts` should have `host: true` (already configured):

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: true, // This allows network access
  },
})
```

### Step 3: Start the Dev Server

```bash
npm run dev
```

You should see output like:
```
VITE v5.4.21  ready in 135 ms

➜  Local:   http://localhost:5174/
➜  Network: http://192.168.1.97:5174/  ← Use this on your phone
```

### Step 4: Connect Your Phone

1. **Ensure your phone is on the same Wi-Fi network** as your computer
2. Open a browser on your phone (Chrome, Safari, Firefox)
3. Navigate to: `http://YOUR_IP_ADDRESS:5174`
   - Example: `http://192.168.1.97:5174`

### Step 5: Test the Application

- Test touch interactions
- Test swipe gestures
- Test bottom navigation
- Test language toggle (Arabic RTL)
- Test form inputs
- Test scrolling performance

## Method 3: Using ngrok (For Testing from Anywhere)

If you want to test from a device not on the same network:

### Install ngrok:
```bash
# macOS
brew install ngrok

# Or download from https://ngrok.com/download
```

### Start ngrok:
```bash
ngrok http 5174
```

This will give you a public URL like: `https://abc123.ngrok.io`

### Access from Mobile:
1. Open the ngrok URL on your phone's browser
2. Test the application

**Note:** ngrok free tier has limitations. For production, use a proper deployment.

## Method 4: Deploy to a Testing Server

### Vercel (Recommended):
```bash
npm install -g vercel
vercel
```

### Netlify:
```bash
npm install -g netlify-cli
netlify deploy
```

### GitHub Pages:
Build and deploy to GitHub Pages for public testing.

## Testing Checklist

### Mobile-Specific Features to Test:
- [ ] Bottom navigation works on mobile
- [ ] Sidebar opens/closes correctly on mobile
- [ ] Language toggle works (Arabic RTL layout)
- [ ] Forms are touch-friendly (large tap targets)
- [ ] Images load correctly
- [ ] Charts (Recharts) render on mobile
- [ ] Scrolling is smooth
- [ ] No horizontal scrolling
- [ ] Text is readable without zooming
- [ ] Buttons are easy to tap (min 44x44px)
- [ ] Login flow works on mobile
- [ ] Irrigation calculator is usable on mobile
- [ ] Market prices display correctly
- [ ] Community forum is readable

### Browser Testing:
- [ ] Chrome (Android)
- [ ] Safari (iOS)
- [ ] Firefox (Android)
- [ ] Samsung Internet (Android)

### Device Testing:
- [ ] iPhone (various sizes)
- [ ] Android phones (various sizes)
- [ ] Tablets (iPad, Android tablets)

## Troubleshooting

### Cannot Access from Mobile Device:

1. **Check Firewall:**
   - macOS: System Settings → Network → Firewall (allow Node.js)
   - Windows: Windows Defender Firewall (allow Node.js)

2. **Check Network:**
   - Ensure phone and computer are on the same Wi-Fi
   - Some public Wi-Fi blocks device-to-device communication

3. **Check IP Address:**
   - IP address may change when reconnecting to Wi-Fi
   - Use `ipconfig getifaddr en0` to get current IP

4. **Check Port:**
   - Ensure port 5174 is not blocked
   - Try a different port if needed

### Performance Issues:

1. **Enable Production Build:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Check Network Tab:**
   - Use browser DevTools to check load times
   - Optimize large images
   - Check bundle size

## Quick Test Commands

```bash
# Start dev server with network access
npm run dev

# Build for production (faster, optimized)
npm run build
npm run preview

# Check if port is accessible
curl http://localhost:5174

# Find your IP address
ipconfig getifaddr en0  # macOS
ipconfig                 # Windows
hostname -I              # Linux
```

## PWA Testing (When Implemented)

Once PWA features are added:
1. Test "Add to Home Screen" on iOS/Android
2. Test offline functionality
3. Test service worker updates
4. Test app manifest

## Additional Resources

- [Chrome DevTools Mobile Emulation](https://developer.chrome.com/docs/devtools/device-mode/)
- [Firefox Responsive Design Mode](https://developer.mozilla.org/en-US/docs/Tools/Responsive_Design_Mode)
- [Vite Server Options](https://vitejs.dev/config/server-options.html)
- [Testing on Real Devices](https://web.dev/test-mobile-websites/)

