# Internal Fleet Management Tool

An internal fleet management tool for company fleet operations. Built with React, TypeScript, and modern web technologies.

## 🆓 **FREE & OPEN ACCESS**

**This tool is completely free and accessible to everyone in the company. No restrictions, no paywalls, no authentication required. All features are unlocked and available immediately.**

## 🚀 Features

### Core Fleet Management
- **Vehicle Management**: Add, edit, and manage your entire fleet
- **Rental Management**: Track rentals, customers, and schedules
- **Maintenance Scheduling**: Plan and track vehicle maintenance
- **Analytics Dashboard**: Real-time insights and performance metrics
- **Activity Feed**: Track all fleet activities in real-time

### 🎮 Gamification Features
- **Vehicle Assembly Game**: Interactive game to assemble vehicle parts and earn XP/coins
- **Quest System**: Daily, weekly, and challenge quests with rewards
- **Achievement System**: Unlock achievements as you progress
- **Leaderboards**: Compete with others on global and category leaderboards
- **Skill Tree**: Unlock and upgrade skills to boost performance
- **XP & Leveling**: Progress through levels by earning XP
- **Rewards System**: Earn coins and unlock premium features

### 📍 GPS Partner Finder
- **Real-time GPS**: Find partners based on your location
- **Advanced Search**: Filter by type, price, rating, distance
- **Partner Details**: View ratings, reviews, contact info, and pricing
- **Map Integration**: Get directions via Google Maps
- **Price Comparison**: Compare prices across multiple partners
- **Distance Calculation**: See how far partners are from you

### 💬 Chat System
- **Team Channels**: Company-wide and team-specific channels
- **Vehicle Channels**: Auto-created channels for each vehicle
- **Direct Messages**: One-on-one and group messaging
- **Real-time Updates**: Instant message delivery
- **User Presence**: See who's online, away, or offline
- **Message Search**: Find messages quickly
- **File Sharing**: Share images and files

### 📝 Notes System
- **Rich Text Notes**: Create detailed notes with formatting
- **Categories**: Organize by vehicle, rental, maintenance, partner, or general
- **Tags**: Tag notes for easy organization
- **Pin Notes**: Pin important notes for quick access
- **Search & Filter**: Find notes quickly
- **Attachments**: Add images and files to notes

### 📊 Advanced Analytics (Premium)
- **Predictive Insights**: AI-powered demand forecasting and price optimization
- **Custom Reports**: Create and schedule custom reports
- **Interactive Charts**: Multiple chart types with real-time data
- **Trend Analysis**: Identify patterns and trends
- **Export Options**: Export reports in multiple formats

### ⚙️ Premium Features
- **Premium Parts**: Access to premium and legendary vehicle parts
- **Advanced Analytics**: Predictive analytics and custom reports
- **Real-time Chat**: Enhanced chat with video/voice calls
- **Advanced Notes**: Rich media notes with collaboration
- **API Access**: Full API access for integrations
- **Automation**: Workflow automation features

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **UI Framework**: Tailwind CSS
- **UI Components**: Radix UI (shadcn/ui)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Build Tool**: Vite
- **State Management**: React Hooks

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎯 Usage

### Fleet Management
1. Navigate to **Fleet Overview** tab
2. Click **Add Vehicle** to add new vehicles
3. Click on any vehicle card to edit details
4. Use filters to find specific vehicles

### Assembly Game
1. Go to **Assembly Game** tab
2. Select a vehicle from the dropdown
3. Choose parts and tools
4. Click **Start Assembly** to begin
5. Earn XP and coins upon completion

### Partner Finder
1. Navigate to **Partner Finder** tab
2. Allow location access for GPS features
3. Use filters to find partners
4. Click on a partner to view details
5. Click **Directions** for navigation

### Chat
1. Go to **Chat** tab
2. Select a channel or create a new one
3. Type messages and press Enter
4. See real-time updates from team members

### Notes
1. Navigate to **Notes** tab
2. Click **New Note** to create a note
3. Add tags and categories
4. Pin important notes
5. Search and filter as needed

### Quests & Achievements
1. Go to **Quests** tab to see active quests
2. Complete objectives to earn rewards
3. Check **Achievements** tab for unlocked achievements
4. View **Leaderboard** to see rankings
5. Unlock **Skills** to boost performance

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── advanced/       # Advanced feature components
├── types/              # TypeScript type definitions
├── services/           # Service layer (API, real-time, premium)
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
├── data/               # Mock data
└── App.tsx             # Main application component
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file:
```
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3001
```

### Premium Features
Premium features are controlled via `PremiumService`. Set tier in code:
```typescript
PremiumService.setTier('premium'); // or 'enterprise'
```

## 🎨 Customization

### Themes
The app uses a dark theme by default. Modify colors in `src/index.css` or component styles.

### Premium Tiers
Edit `src/services/premiumService.ts` to customize tier features and limits.

## 📱 Features Roadmap

### Completed ✅
- Core fleet management
- Vehicle assembly game
- GPS partner finder
- Chat system
- Notes system
- Quest system
- Achievement system
- Leaderboards
- Skill tree
- Premium feature gates
- Real-time service infrastructure
- Advanced analytics (UI)

### In Progress 🚧
- Backend API integration
- WebSocket real-time updates
- Database persistence
- Mobile app

### Planned 📋
- 3D vehicle preview
- Advanced automation
- Third-party integrations
- Mobile apps (iOS/Android)

## 🤝 Contributing

This is an internal tool for company fleet management. For feature requests or bug reports, please contact the development team.

## 📄 License

Proprietary - Internal use only

## 🆘 Support

For support and questions, refer to the internal documentation or contact the development team.

---

**Built with ❤️ for efficient fleet management**