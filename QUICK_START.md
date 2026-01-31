# Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 🎮 Using the Features

### Vehicle Assembly Game
1. Click **Assembly Game** tab
2. Select a vehicle from dropdown
3. Browse and select parts (engine, body, interior, etc.)
4. Select required tools
5. Click **Start Assembly**
6. Watch progress and earn XP/coins!

### GPS Partner Finder
1. Click **Partner Finder** tab
2. Allow location access when prompted
3. Use search and filters to find partners
4. Click on a partner card to see details
5. Click **Directions** for Google Maps navigation

### Chat System
1. Click **Chat** tab
2. Select a channel (General, Operations, etc.)
3. Type messages and press Enter
4. See real-time updates from team

### Notes System
1. Click **Notes** tab
2. Click **New Note** button
3. Fill in title, content, category, tags
4. Pin important notes
5. Use search to find notes quickly

### Quests & Achievements
1. Click **Quests** tab to see active quests
2. Complete objectives to progress
3. Check **Achievements** tab for unlocked achievements
4. View **Leaderboard** for rankings
5. Unlock **Skills** to boost performance

### Advanced Analytics (Premium)
1. Click **Analytics** tab
2. Switch to **Advanced Analytics** sub-tab
3. View predictive insights
4. Create custom reports
5. Export data

## ⚙️ Settings

Click the **Settings** icon in the header to:
- Change theme
- Configure notifications
- View premium features
- Manage account

## 🔔 Notifications

Click the **Bell** icon in the header to:
- View all notifications
- Mark as read
- Delete notifications

## 💎 Premium Features

To enable premium features, update the tier in code:
```typescript
// In src/services/premiumService.ts or App.tsx
PremiumService.setTier('premium'); // or 'enterprise'
```

## 🎯 Tips

- **Assembly Game**: Higher quality parts = more XP and coins
- **Partner Finder**: Use GPS for accurate distance calculations
- **Chat**: Create vehicle-specific channels for better organization
- **Notes**: Use tags for easy filtering
- **Quests**: Complete daily quests for consistent rewards
- **Skills**: Unlock skills to boost XP and reduce costs

## 🐛 Troubleshooting

### GPS not working?
- Ensure browser location permissions are granted
- Check HTTPS (required for geolocation)

### Real-time features not updating?
- WebSocket service is mock - needs backend integration
- Check browser console for connection status

### Premium features locked?
- Default tier is 'basic'
- Update tier in PremiumService to unlock features

## 📚 Documentation

See `README.md` for full documentation and `IMPLEMENTATION_SUMMARY.md` for feature details.
