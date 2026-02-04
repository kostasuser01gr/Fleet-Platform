# 🚀 Quick Start Guide - Advanced Features

## Welcome to the Fleet Management Game Platform v2.0!

This guide will help you get started with all the new advanced features.

---

## 🎯 New Features Overview

### 1. **Mission System** - Earn rewards by completing tasks
### 2. **Dynamic Market** - Buy low, sell high with real-time trends
### 3. **Advanced Analytics** - Track performance with Redux state management
### 4. **Enhanced Garage** - Install parts with smart recommendations

---

## 📖 Getting Started

### Step 1: Launch the Platform
```bash
npm install
npm run dev
```

### Step 2: Navigate the Interface

**New Tabs Added:**
- 🚀 **Missions** - View and complete missions for rewards
- 📈 **Market** - Monitor market trends and investment opportunities

**Existing Tabs:**
- 🚗 **Fleet Overview** - Manage your vehicles
- 🏪 **Vehicle Garage** - Install/upgrade parts
- 🗺️ **Service Network** - Find service providers

---

## 🎮 Using the Mission System

### Finding Missions

1. Click the **"Missions"** tab
2. Browse available missions (displayed as cards)
3. Check difficulty levels (1-5 stars)
4. Preview rewards (currency, XP, reputation, tokens)

### Starting a Mission

1. Click **"Start Mission"** button
2. Mission moves to "Active Missions" section
3. Progress bar shows completion status
4. Objectives are tracked automatically

### Completing Missions

1. Complete objectives (installing parts, deliveries, etc.)
2. Progress updates in real-time
3. When 100% complete, **"Claim Rewards"** button appears
4. Click to receive your rewards

### Mission Types

- 📦 **Delivery** - Transport goods across the city
- 🏁 **Race** - Compete in high-speed challenges
- 🔧 **Maintenance** - Perform vehicle upgrades
- 🗺️ **Exploration** - Discover new locations
- ⚔️ **Challenge** - Complete difficult tasks
- 💎 **Collection** - Collect specific items

---

## 📊 Using the Market System

### Viewing Market Trends

1. Click the **"Market"** tab
2. See 3 summary cards:
   - **Trending Up** - Prices rising
   - **Declining** - Prices falling
   - **Hot Deals** - Low prices + low demand

### Understanding Categories

Each part category shows:
- **Volume** - Trading activity
- **Trend Multiplier** - Current price adjustment (0.5x - 2.0x)
- **Prediction** - Rising / Falling / Stable
- **Investment Opportunity** - Yellow badge for good deals

### Making Smart Purchases

1. Look for **"Investment Opportunity"** badges
2. Buy when trend is low (< 0.8x)
3. Check prediction is "rising"
4. Sell when trend is high (> 1.2x)

### Market Updates

- Updates automatically every 5 minutes
- Prices fluctuate ±10% per hour
- Seasonal events temporarily multiply prices

---

## 🏪 Enhanced Garage System

### Installing Parts

1. Go to **"Vehicle Garage"** tab
2. Select a vehicle from dropdown
3. Browse available parts
4. Filter by:
   - Part Type (engine, tires, etc.)
   - Rarity (common, rare, legendary)
   - Price range

5. Click **"Install Part"** button
6. Part automatically swaps if type already installed
7. Vehicle stats update instantly

### Part Rarity System

- **Common** (gray) - Basic parts, low boost
- **Uncommon** (green) - Moderate upgrade
- **Rare** (blue) - Significant improvement
- **Epic** (purple) - Major performance boost
- **Legendary** (gold) - Ultimate upgrades with glowing effect

### Dynamic Pricing

Part prices change based on:
- **Market Trend** - Current supply/demand
- **Condition** - 100% condition = full price
- **Rarity** - Higher rarity = higher price
- **Season** - Events increase/decrease prices
- **Reputation** - Up to 15% discount

---

## 🎯 Player Progression

### Leveling Up

- Earn XP from missions
- Level up every 1000 XP
- Required XP increases with level
- Higher levels unlock more content

### Currency Management

- **Money** - Buy parts, unlock cooperators
- **Reputation** - Unlock premium cooperators
- **Tokens** - Premium currency from missions
- **Experience** - Level progression

### Achievements

- Track mission completions
- Unlock special badges
- Progress through 6 tiers

---

## 💡 Pro Tips

### Maximize Earnings

1. **Check market before buying** - Wait for low trends
2. **Complete daily missions** - Easy rewards
3. **Install rare parts** - Higher stat boosts
4. **Monitor investment opportunities** - Buy undervalued parts
5. **Use cooperator discounts** - Unlock better providers

### Efficient Part Management

1. **Install matching types** - Swap happens automatically
2. **Check condition** - Maintain parts at 80%+
3. **Upgrade progressively** - Don't skip rarities
4. **Save for legendary** - Best long-term investment

### Mission Strategy

1. **Start easy missions first** - Build XP and currency
2. **Check time limits** - Prioritize expiring missions
3. **Complete optional objectives** - Bonus rewards
4. **Save tokens for premium content**

---

## 🔧 Technical Features

### Redux State Management

All data now flows through centralized Redux store:
- Inventory, Vehicles, Player stats
- Missions, Economy, Cooperators
- Real-time updates across all components

### React Query Caching

Optimized data fetching:
- 5-minute cache duration
- Automatic refetch on mutations
- Loading states handled
- Offline support

### Validation Layer

Prevents errors before they happen:
- Part compatibility checks
- Installation requirement validation
- Service request verification
- Budget validation

---

## 📱 UI Navigation

### Main Tabs

```
Fleet Overview → Vehicle Garage → Service Network → Missions → Market
     ↓              ↓                 ↓              ↓         ↓
  Vehicles      Parts Install    Find Services   Quests    Trends
```

### Quick Actions

- **Add Vehicle** - Plus button (top right)
- **Notifications** - Bell icon (alerts)
- **Settings** - Gear icon (preferences)
- **Theme Toggle** - Light/dark mode

---

## 🎨 Visual Indicators

### Color Coding

- **Green** - Available / Positive / Rising
- **Blue** - Active / Info / Normal
- **Yellow** - Warning / Investment Opportunity
- **Orange** - Maintenance / Caution
- **Red** - Unavailable / Negative / Falling
- **Purple** - Premium / Epic rarity
- **Gold** - Legendary rarity

### Icons

- 🚗 Fleet
- 🏪 Garage
- 🗺️ Map
- 🚀 Missions
- 📈 Market
- 📊 Analytics
- 🔧 Assembly
- 💬 Chat
- 🏆 Achievements

---

## ❓ Common Questions

### Q: How often do missions refresh?
**A:** Daily missions generate every 24 hours. Daily challenges expire at midnight.

### Q: Can I lose money on market trades?
**A:** Yes, if you buy high and market trend falls, you may sell at a loss.

### Q: What happens if I fail a mission?
**A:** You can abandon and retry. No penalty except lost time.

### Q: How do I unlock cooperators?
**A:** Meet level/reputation requirements and pay unlock cost.

### Q: Do parts degrade over time?
**A:** Yes, condition decreases with use. Repair at cooperators.

### Q: Can I have multiple active missions?
**A:** Yes, no limit on active missions.

### Q: How accurate are market predictions?
**A:** Predictions are based on current trends but can change hourly.

### Q: What's the fastest way to level up?
**A:** Complete high-difficulty missions and daily challenges.

---

## 🚨 Troubleshooting

### Market not updating?
- Check internet connection
- Refresh page
- Market updates every 5 minutes

### Mission not tracking progress?
- Ensure mission is started (click "Start Mission")
- Check objective requirements
- Progress updates may take few seconds

### Parts not installing?
- Check vehicle compatibility
- Verify part type matches
- Ensure sufficient budget

### Rewards not received?
- Click "Claim Rewards" button
- Check player stats for updates
- Rewards added automatically on claim

---

## 📚 Next Steps

1. **Complete your first mission** - Start with Level 1 difficulty
2. **Monitor the market** - Learn trend patterns
3. **Upgrade a vehicle** - Install your first legendary part
4. **Unlock a cooperator** - Build reputation
5. **Reach Level 5** - Unlock advanced missions

---

## 🎉 Have Fun!

The Fleet Management Game Platform is now a full-featured game with progression, economy, and challenges. Experiment with different strategies and build the ultimate fleet!

**Questions?** Check the comprehensive documentation in `ADVANCED_FEATURES_COMPLETE.md`

---

**Version:** 2.0.0  
**Last Updated:** February 2026  
**Status:** ✅ Ready to Play
