import React, { useState, useEffect } from 'react';
import { Vehicle, FleetStats as FleetStatsType } from './types/vehicle';
import { Rental, MaintenanceSchedule } from './types/rental';
import { AssemblySession } from './types/assembly';
import { Note } from './types/note';
import { ChatMessage } from './types/chat';
import { Quest, Skill } from './types/gamification';
import { mockVehicles } from './data/mockVehicles';
import { mockRentals, mockMaintenanceSchedule, mockActivities } from './data/mockRentals';
import { mockParts, mockTools } from './data/mockAssembly';
import { mockPartners } from './data/mockPartners';
import { mockChannels, mockMessages, mockUsers } from './data/mockChat';
import { mockNotes } from './data/mockNotes';
import { mockQuests, mockAchievements, mockLeaderboard, mockSkills } from './data/mockGamification';
import { mockReports, mockInsights } from './data/mockAnalytics';
import { VehicleCard } from './components/VehicleCard';
import { VehicleEditor } from './components/VehicleEditor';
import { AddVehicleDialog } from './components/AddVehicleDialog';
import { FleetStats } from './components/FleetStats';
import { BulkPartsRadarDialog } from './components/partsRadar/BulkPartsRadarDialog';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AdvancedAnalytics } from './components/AdvancedAnalytics';
import { GameProgress } from './components/GameProgress';
import { RentalManagement } from './components/RentalManagement';
import { ActivityFeed } from './components/ActivityFeed';
import { VehicleAssemblyGame } from './components/VehicleAssemblyGame';
import { GPSPartnerFinder } from './components/GPSPartnerFinder';
import { ChatSystem } from './components/ChatSystem';
import { NotesSystem } from './components/NotesSystem';
import { QuestSystem } from './components/QuestSystem';
import { AchievementGallery } from './components/AchievementGallery';
import { Leaderboard } from './components/Leaderboard';
import { SkillTree } from './components/SkillTree';
import { NotificationCenter, Notification } from './components/NotificationCenter';
import { SettingsPanel } from './components/SettingsPanel';
import { VehicleGarage } from './components/VehicleGarage';
import { CooperatorMap } from './components/CooperatorMap';
import { MissionDashboard } from './components/MissionDashboard';
import { MarketTrends } from './components/MarketTrends';
import { AchievementTracker } from './components/AchievementTracker';
import { TutorialOverlay, useTutorial } from './components/TutorialOverlay';
import { NotificationSystem, ToastNotification } from './components/NotificationSystem';
import { RealtimeService } from './services/realtimeService';
import { GamificationService } from './utils/gamification';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { 
  Plus, 
  Search, 
  Trophy, 
  Zap,
  Car,
  BarChart3,
  Calendar,
  Sparkles,
  Wrench,
  MapPin,
  MessageSquare,
  StickyNote,
  Target,
  Award,
  Users,
  Brain,
  Bell,
  Settings as SettingsIcon,
  X,
  ShoppingCart,
  Warehouse,
  Map,
  TrendingUp,
  Rocket
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { ThemeToggle } from './components/ui/theme-toggle';
import { ConnectionStatus, ErrorBoundary } from './components/ConnectionStatus';
import { websocketService } from './services/websocketService';
import { useDebounce } from './utils/performance';
import { EnhancedDashboard } from './components/EnhancedDashboard';

interface UserLocation {
  lat: number;
  lng: number;
}

const STATUS_FILTER_VALUES = ['all', 'available', 'rented', 'maintenance'] as const;
type StatusFilter = (typeof STATUS_FILTER_VALUES)[number];

const TYPE_FILTER_VALUES = ['all', 'sedan', 'suv', 'truck', 'sports', 'luxury'] as const;
type TypeFilter = (typeof TYPE_FILTER_VALUES)[number];

const TAB_VALUES = ['fleet', 'garage', 'cooperators', 'missions', 'market', 'analytics', 'rentals', 'assembly', 'partners', 'chat', 'notes', 'quests', 'achievements', 'leaderboard', 'skills', 'progress'] as const;
type TabValue = (typeof TAB_VALUES)[number];

export default function App() {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [rentals, setRentals] = useState(mockRentals);
  const [maintenanceSchedule, setMaintenanceSchedule] = useState(mockMaintenanceSchedule);
  const [activities] = useState(mockActivities);
  const [notes, setNotes] = useState(mockNotes);
  const [channels] = useState(mockChannels);
  const [messages, setMessages] = useState(mockMessages);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>();
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkPartsRadarOpen, setIsBulkPartsRadarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [currentTab, setCurrentTab] = useState<TabValue>('fleet');
  const [assemblyVehicle, setAssemblyVehicle] = useState<Vehicle | undefined>();
  const [quests, setQuests] = useState(mockQuests);
  const [skills, setSkills] = useState(mockSkills);
  const [skillPoints, setSkillPoints] = useState(5);
  const [userLocation, setUserLocation] = useState<UserLocation | undefined>();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'n1',
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You unlocked the "First Steps" achievement',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: 'n2',
      type: 'info',
      title: 'New Quest Available',
      message: 'Daily Assembly Challenge is now available',
      timestamp: new Date(Date.now() - 7200000),
      read: false,
    },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toastNotifications, setToastNotifications] = useState<ToastNotification[]>([]);
  
  // Tutorial hook
  const { hasCompletedTutorial, tutorialSteps, completeTutorial, skipTutorial } = useTutorial();

  // Use debounced search for performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  // Initialize real-time services
  useEffect(() => {
    RealtimeService.connect();
    websocketService.connect();
    
    // Subscribe to real-time updates
    websocketService.subscribeToVehicleUpdates((vehicle) => {
      setVehicles(prev => prev.map(v => v.id === vehicle.id ? vehicle : v));
      toast.info('Vehicle Updated', {
        description: `${vehicle.make} ${vehicle.model} has been updated`,
      });
    });

    websocketService.subscribeToNotifications((notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    return () => {
      RealtimeService.disconnect();
      websocketService.disconnect();
    };
  }, []);

  // Initialize gamification
  useEffect(() => {
    GamificationService.initialize({
      xp: gameProgress.xp,
      coins: 1000,
      level: gameProgress.level,
      achievements: mockAchievements,
      quests: mockQuests,
      skills: mockSkills,
    });
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default to San Francisco if location denied
          setUserLocation({ lat: 37.7749, lng: -122.4194 });
        }
      );
    }
  }, []);

  // Calculate fleet stats
  const calculateFleetStats = () => {
    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter(v => v.status === 'available').length;
    const rentedVehicles = vehicles.filter(v => v.status === 'rented').length;
    const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;
    const totalValue = vehicles.reduce((sum, v) => sum + v.purchasePrice, 0);
    const totalRevenue = vehicles.reduce((sum, v) => sum + v.stats.totalRevenue, 0);
    const totalCosts = vehicles.reduce((sum, v) => sum + v.costs.total, 0);
    const netProfit = totalRevenue - totalCosts;

    return {
      totalVehicles,
      availableVehicles,
      rentedVehicles,
      maintenanceVehicles,
      totalValue,
      totalRevenue,
      totalCosts,
      netProfit,
    };
  };

  const [fleetStats, setFleetStats] = useState(calculateFleetStats());

  useEffect(() => {
    setFleetStats(calculateFleetStats());
  }, [vehicles]);

  // Filter vehicles with debounced search
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.make.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditorOpen(true);
  };

  const handleSaveVehicle = (updatedVehicle: Vehicle) => {
    setVehicles(vehicles.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
    toast.success('Vehicle updated successfully!', {
      description: `${updatedVehicle.make} ${updatedVehicle.model} has been updated.`,
    });
  };

  const handleAddVehicle = (newVehicle: Vehicle) => {
    setVehicles([...vehicles, newVehicle]);
    toast.success('Vehicle added successfully!', {
      description: `${newVehicle.make} ${newVehicle.model} has been added to your fleet.`,
    });
  };

  const handleAddRental = (newRental: Rental) => {
    setRentals([...rentals, newRental]);
  };

  const handleAddMaintenance = (newMaintenance: MaintenanceSchedule) => {
    setMaintenanceSchedule([...maintenanceSchedule, newMaintenance]);
  };

  // Assembly Game Handlers
  const handleAssemblyComplete = (session: AssemblySession) => {
    toast.success('Assembly Complete!', {
      description: `Earned ${session.xpEarned} XP and ${session.coinsEarned} coins!`,
    });
    // Update vehicle with assembled parts if needed
  };

  // Notes Handlers
  interface NoteInput extends Pick<Note, 'title' | 'content' | 'category' | 'relatedId' | 'tags' | 'author' | 'authorName' | 'isPinned' | 'isPremium' | 'attachments' | 'color'> {}
  
  const handleAddNote = (note: NoteInput) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([...notes, newNote]);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(n => n.id !== noteId));
  };

  // Chat Handlers
  const handleSendMessage = (channelId: string, content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'u1', // Current user
      userName: 'John Doe',
      content,
      timestamp: new Date(),
      type: 'text',
      read: false,
    };

    setMessages({
      ...messages,
      [channelId]: [...(messages[channelId] || []), newMessage],
    });

    // Emit real-time event
    RealtimeService.emit('chat_message', newMessage);
  };

  // Quest Handlers
  const handleQuestComplete = (quest: Quest) => {
    const result = GamificationService.addXP(quest.rewards.xp, 'quest');
    GamificationService.addCoins(quest.rewards.coins, 'quest');
    
    setQuests(quests.map(q => q.id === quest.id ? { ...q, completed: true } : q));
    
    if (result.levelUp) {
      toast.success('Level Up!', {
        description: `You reached level ${result.newLevel}!`,
      });
    }
  };

  // Skill Handlers
  const handleSkillUnlock = (skillId: string) => {
    if (skillPoints > 0) {
      setSkills(skills.map(s => 
        s.id === skillId ? { ...s, unlocked: true } : s
      ));
      setSkillPoints(skillPoints - 1);
    }
  };

  const handleSkillUpgrade = (skillId: string) => {
    if (skillPoints > 0) {
      setSkills(skills.map(s => 
        s.id === skillId && s.unlocked ? { ...s, level: Math.min(s.level + 1, s.maxLevel) } : s
      ));
      setSkillPoints(skillPoints - 1);
    }
  };

  // Game progress data
  interface GameProgress {
    level: number;
    xp: number;
    xpToNextLevel: number;
    totalEarnings: number;
  }
  
  const gameProgress = {
    level: 8,
    xp: 3420,
    xpToNextLevel: 5000,
    totalEarnings: fleetStats.totalRevenue,
  } satisfies GameProgress;

  // Achievement system
  interface IconProps {
    className?: string;
  }
  
  interface AchievementBadge {
    title: string;
    achieved: boolean;
    icon: React.ComponentType<IconProps>;
    color: string;
  }
  
  const achievements = [
    { 
      title: '10+ Vehicles', 
      achieved: vehicles.length >= 10,
      icon: Car,
      color: 'text-blue-400'
    },
    { 
      title: 'Profit Maker', 
      achieved: fleetStats.netProfit > 50000,
      icon: Trophy,
      color: 'text-yellow-400'
    },
    { 
      title: 'Fleet Master', 
      achieved: vehicles.length >= 20,
      icon: Zap,
      color: 'text-purple-400'
    },
  ] satisfies AchievementBadge[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <Toaster theme="dark" />
      
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-white text-xl">Internal Fleet Management Tool</h1>
                  <p className="text-gray-400 text-sm">Company Fleet Management System</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Achievements */}
              <div className="hidden md:flex items-center gap-2">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <Badge 
                      key={index}
                      className={`${achievement.achieved ? 'bg-gray-800 border-gray-700' : 'bg-gray-900/50 border-gray-800 opacity-50'}`}
                    >
                      <Icon className={`w-4 h-4 mr-1 ${achievement.color}`} />
                      {achievement.title}
                    </Badge>
                  );
                })}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-gray-400 hover:text-white"
              >
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
                className="text-gray-400 hover:text-white"
              >
                <SettingsIcon className="w-5 h-5" />
              </Button>

              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Navigation Tabs */}
        <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as TabValue)} className="w-full">
          <TabsList className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-1 flex-wrap">
            <TabsTrigger value="fleet" className="data-[state=active]:bg-blue-600">
              <Car className="w-4 h-4 mr-2" />
              Fleet Overview
            </TabsTrigger>
            <TabsTrigger value="garage" className="data-[state=active]:bg-teal-600">
              <Warehouse className="w-4 h-4 mr-2" />
              Vehicle Garage
            </TabsTrigger>
            <TabsTrigger value="cooperators" className="data-[state=active]:bg-rose-600">
              <Map className="w-4 h-4 mr-2" />
              Service Network
            </TabsTrigger>
            <TabsTrigger value="missions" className="data-[state=active]:bg-indigo-600">
              <Rocket className="w-4 h-4 mr-2" />
              Missions
            </TabsTrigger>
            <TabsTrigger value="market" className="data-[state=active]:bg-yellow-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Market
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="rentals" className="data-[state=active]:bg-green-600">
              <Calendar className="w-4 h-4 mr-2" />
              Rentals & Maintenance
            </TabsTrigger>
            <TabsTrigger value="assembly" className="data-[state=active]:bg-orange-600">
              <Wrench className="w-4 h-4 mr-2" />
              Assembly Game
            </TabsTrigger>
            <TabsTrigger value="partners" className="data-[state=active]:bg-red-600">
              <MapPin className="w-4 h-4 mr-2" />
              Partner Finder
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-indigo-600">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="notes" className="data-[state=active]:bg-pink-600">
              <StickyNote className="w-4 h-4 mr-2" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="quests" className="data-[state=active]:bg-cyan-600">
              <Target className="w-4 h-4 mr-2" />
              Quests
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-amber-600">
              <Award className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="tracker" className="data-[state=active]:bg-fuchsia-600">
              <Trophy className="w-4 h-4 mr-2" />
              Achievement Tracker
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-emerald-600">
              <Users className="w-4 h-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-violet-600">
              <Zap className="w-4 h-4 mr-2" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-yellow-600">
              <Sparkles className="w-4 h-4 mr-2" />
              Progress & Rewards
            </TabsTrigger>
          </TabsList>

          {/* Fleet Overview Tab */}
          <TabsContent value="fleet" className="space-y-8 mt-8">
            {/* Stats Dashboard */}
            <FleetStats stats={fleetStats} />

            {/* Filters and Search */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search vehicles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as TypeFilter)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Vehicle Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-xl">
                  Fleet Overview <span className="text-gray-400">({filteredVehicles.length})</span>
                  {selectedVehicles.length > 0 && (
                    <Badge className="ml-2 bg-blue-500/20 text-blue-400">
                      {selectedVehicles.length} selected
                    </Badge>
                  )}
                </h2>
                <div className="flex items-center gap-2">
                  {selectedVehicles.length > 0 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVehicles([])}
                        className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                      >
                        Clear Selection
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setIsBulkPartsRadarOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Parts Radar ({selectedVehicles.length})
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newSelection = selectedVehicles.length === filteredVehicles.length 
                        ? [] 
                        : [...filteredVehicles];
                      setSelectedVehicles(newSelection);
                    }}
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  >
                    {selectedVehicles.length === filteredVehicles.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
              </div>

              {filteredVehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredVehicles.map(vehicle => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      onClick={() => handleVehicleClick(vehicle)}
                      isSelected={selectedVehicles.some(v => v.id === vehicle.id)}
                      onSelect={(v, selected) => {
                        if (selected) {
                          setSelectedVehicles([...selectedVehicles, v]);
                        } else {
                          setSelectedVehicles(selectedVehicles.filter(sv => sv.id !== v.id));
                        }
                      }}
                      showCheckbox={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-900/30 rounded-xl border border-gray-800">
                  <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-gray-400 text-lg mb-2">No vehicles found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filters or add a new vehicle</p>
                  <Button 
                    onClick={() => setIsAddDialogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Vehicle
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8 mt-8">
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="bg-gray-800/50 border border-gray-700 mb-6">
                <TabsTrigger value="dashboard">Enhanced Dashboard</TabsTrigger>
                <TabsTrigger value="basic">Basic Analytics</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard">
                <EnhancedDashboard vehicles={vehicles} rentals={rentals} />
              </TabsContent>
              <TabsContent value="basic">
                <AnalyticsDashboard />
              </TabsContent>
              <TabsContent value="advanced">
                <AdvancedAnalytics
                  reports={mockReports}
                  insights={mockInsights}
                  onGenerateReport={() => {
                    toast.success('Report generated', {
                      description: 'Your custom report has been generated successfully.',
                    });
                  }}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Rentals & Maintenance Tab */}
          <TabsContent value="rentals" className="space-y-8 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RentalManagement 
                  rentals={rentals}
                  maintenanceSchedule={maintenanceSchedule}
                  vehicles={vehicles}
                  onAddRental={handleAddRental}
                  onAddMaintenance={handleAddMaintenance}
                />
              </div>
              <div>
                <ActivityFeed activities={activities} />
              </div>
            </div>
          </TabsContent>

          {/* Assembly Game Tab */}
          <TabsContent value="assembly" className="space-y-8 mt-8">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white text-xl mb-2">Vehicle Assembly Game</h2>
                  <p className="text-gray-400">Select a vehicle and assemble parts to earn XP and coins!</p>
                </div>
                <Select
                  value={assemblyVehicle?.id || ''}
                  onValueChange={(value) => {
                    const vehicle = vehicles.find(v => v.id === value);
                    setAssemblyVehicle(vehicle || undefined);
                  }}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-64">
                    <SelectValue placeholder="Select a vehicle to assemble" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {vehicles.map(vehicle => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.year} {vehicle.make} {vehicle.model} - #{vehicle.licensePlate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <VehicleAssemblyGame
              vehicle={assemblyVehicle}
              parts={mockParts}
              tools={mockTools}
              onComplete={handleAssemblyComplete}
            />
          </TabsContent>

          {/* GPS Partner Finder Tab */}
          <TabsContent value="partners" className="space-y-8 mt-8">
            <GPSPartnerFinder
              partners={mockPartners}
              userLocation={userLocation}
              onPartnerSelect={(partner) => {
                toast.success('Partner selected', {
                  description: `Selected ${partner.name}`,
                });
              }}
            />
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-8 mt-8">
            <ChatSystem
              channels={channels}
              messages={messages}
              users={mockUsers}
              currentUserId="u1"
              onSendMessage={handleSendMessage}
            />
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-8 mt-8">
            <NotesSystem
              notes={notes}
              onAddNote={handleAddNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
              currentUserId="u1"
              currentUserName="John Doe"
            />
          </TabsContent>

          {/* Vehicle Garage Tab */}
          <TabsContent value="garage" className="space-y-8 mt-8">
            <VehicleGarage />
          </TabsContent>

          {/* Service Cooperators Tab */}
          <TabsContent value="cooperators" className="space-y-8 mt-8">
            <CooperatorMap />
          </TabsContent>

          {/* Missions Tab */}
          <TabsContent value="missions" className="space-y-8 mt-8">
            <MissionDashboard />
          </TabsContent>

          {/* Market Tab */}
          <TabsContent value="market" className="space-y-8 mt-8">
            <MarketTrends />
          </TabsContent>

          {/* Quests Tab */}
          <TabsContent value="quests" className="space-y-8 mt-8">
            <QuestSystem
              quests={quests}
              onQuestComplete={handleQuestComplete}
            />
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-8 mt-8">
            <AchievementGallery achievements={mockAchievements} />
          </TabsContent>

          {/* Achievement Tracker Tab */}
          <TabsContent value="tracker" className="space-y-8 mt-8">
            <AchievementTracker />
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-8 mt-8">
            <Leaderboard
              leaderboard={mockLeaderboard}
              currentUserId="u1"
            />
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-8 mt-8">
            <SkillTree
              skills={skills}
              availablePoints={skillPoints}
              onSkillUnlock={handleSkillUnlock}
              onSkillUpgrade={handleSkillUpgrade}
            />
          </TabsContent>

          {/* Progress & Rewards Tab */}
          <TabsContent value="progress" className="space-y-8 mt-8">
            <GameProgress 
              level={gameProgress.level}
              xp={gameProgress.xp}
              xpToNextLevel={gameProgress.xpToNextLevel}
              totalEarnings={gameProgress.totalEarnings}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Vehicle Editor Modal */}
      <VehicleEditor
        vehicle={selectedVehicle}
        open={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedVehicle(undefined);
        }}
        onSave={handleSaveVehicle}
      />

      {/* Add Vehicle Dialog */}
      <AddVehicleDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddVehicle}
      />

      {/* Bulk Parts Radar Dialog */}
      <BulkPartsRadarDialog
        open={isBulkPartsRadarOpen}
        onClose={() => {
          setIsBulkPartsRadarOpen(false);
          setSelectedVehicles([]);
        }}
        selectedVehicles={selectedVehicles}
      />

      {/* Notification Center */}
      {showNotifications && (
        <div className="fixed top-16 right-4 z-50 w-96 max-h-[600px]">
          <NotificationCenter
            notifications={notifications}
            onMarkRead={(id) => {
              setNotifications(notifications.map(n => 
                n.id === id ? { ...n, read: true } : n
              ));
            }}
            onMarkAllRead={() => {
              setNotifications(notifications.map(n => ({ ...n, read: true })));
            }}
            onDelete={(id) => {
              setNotifications(notifications.filter(n => n.id !== id));
            }}
          />
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
              <h2 className="text-white text-xl">Settings</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-6">
              <SettingsPanel />
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Overlay */}
      {!hasCompletedTutorial && (
        <TutorialOverlay
          steps={tutorialSteps}
          onComplete={completeTutorial}
          onSkip={skipTutorial}
        />
      )}

      {/* Toast Notifications */}
      <NotificationSystem
        notifications={toastNotifications}
        onDismiss={(id) => {
          setToastNotifications(toastNotifications.filter(n => n.id !== id));
        }}
      />
    </div>
  );
}
