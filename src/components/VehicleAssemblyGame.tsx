import { useState } from 'react';
import { Vehicle } from '../types/vehicle';
import { VehiclePart, Tool, AssemblySession } from '../types/assembly';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { 
  Wrench, 
  Zap, 
  Award, 
  Star, 
  DollarSign,
  TrendingUp,
  CheckCircle,
  X,
  Play,
  Pause,
  Trophy,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface VehicleAssemblyGameProps {
  vehicle: Vehicle | null | undefined;
  parts: VehiclePart[];
  tools: Tool[];
  onComplete?: (session: AssemblySession) => void;
}

export function VehicleAssemblyGame({ vehicle, parts, tools, onComplete }: VehicleAssemblyGameProps) {
  const [selectedParts, setSelectedParts] = useState<VehiclePart[]>([]);
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [progress, setProgress] = useState(0);
  const [isAssembling, setIsAssembling] = useState(false);
  const [session, setSession] = useState<AssemblySession | null>(null);

  if (!vehicle) {
    return (
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-8 text-center">
        <Wrench className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-white text-xl mb-2">No Vehicle Selected</h3>
        <p className="text-gray-400">Select a vehicle to start assembling parts</p>
      </Card>
    );
  }

  const compatibleParts = parts.filter(p => 
    p.compatibility.includes(vehicle.type) || p.compatibility.length === 0
  );

  const handlePartToggle = (part: VehiclePart) => {
    if (selectedParts.find(p => p.id === part.id)) {
      setSelectedParts(selectedParts.filter(p => p.id !== part.id));
    } else {
      setSelectedParts([...selectedParts, part]);
    }
  };

  const handleToolToggle = (tool: Tool) => {
    if (!tool.available && !tool.isPremium) {
      toast.error('Tool not available', {
        description: `${tool.name} is not available. Premium tools require premium access.`,
      });
      return;
    }
    
    if (selectedTools.find(t => t.id === tool.id)) {
      setSelectedTools(selectedTools.filter(t => t.id !== tool.id));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const calculateQuality = (): AssemblySession['quality'] => {
    if (selectedParts.length === 0) return 'basic';
    const avgQuality = selectedParts.reduce((sum, p) => {
      const qualityMap = { basic: 1, standard: 2, premium: 3, luxury: 4, legendary: 5 };
      return sum + qualityMap[p.quality];
    }, 0) / selectedParts.length;
    
    if (avgQuality >= 4.5) return 'legendary';
    if (avgQuality >= 3.5) return 'luxury';
    if (avgQuality >= 2.5) return 'premium';
    if (avgQuality >= 1.5) return 'standard';
    return 'basic';
  };

  const calculateRewards = () => {
    const quality = calculateQuality();
    const partCount = selectedParts.length;
    const qualityMultiplier = { basic: 1, standard: 1.5, premium: 2, luxury: 3, legendary: 5 };
    const xp = Math.floor(partCount * 50 * qualityMultiplier[quality]);
    const coins = Math.floor(selectedParts.reduce((sum, p) => sum + p.price * 0.1, 0) * qualityMultiplier[quality]);
    return { xp, coins };
  };

  const startAssembly = () => {
    if (selectedParts.length === 0) {
      toast.error('No parts selected', {
        description: 'Please select at least one part to assemble.',
      });
      return;
    }

    const requiredTools = tools.filter(t => t.required);
    const hasRequiredTools = requiredTools.every(t => 
      selectedTools.find(st => st.id === t.id) || t.available
    );

    if (!hasRequiredTools) {
      toast.error('Missing required tools', {
        description: 'Please select all required tools to start assembly.',
      });
      return;
    }

    setIsAssembling(true);
    setProgress(0);

    const newSession: AssemblySession = {
      id: Date.now().toString(),
      vehicleId: vehicle.id,
      parts: selectedParts,
      tools: selectedTools,
      progress: 0,
      status: 'in-progress',
      startedAt: new Date(),
      xpEarned: 0,
      coinsEarned: 0,
      quality: calculateQuality(),
    };

    setSession(newSession);

    // Simulate assembly progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          const rewards = calculateRewards();
          const completedSession: AssemblySession = {
            ...newSession,
            progress: 100,
            status: 'completed',
            completedAt: new Date(),
            xpEarned: rewards.xp,
            coinsEarned: rewards.coins,
          };
          setSession(completedSession);
          setIsAssembling(false);
          onComplete?.(completedSession);
          toast.success('Assembly Complete!', {
            description: `Earned ${rewards.xp} XP and ${rewards.coins} coins!`,
          });
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const qualityColors = {
    basic: 'text-gray-400',
    standard: 'text-green-400',
    premium: 'text-blue-400',
    luxury: 'text-purple-400',
    legendary: 'text-yellow-400',
  };

  const qualityBgColors = {
    basic: 'bg-gray-500/20',
    standard: 'bg-green-500/20',
    premium: 'bg-blue-500/20',
    luxury: 'bg-purple-500/20',
    legendary: 'bg-yellow-500/20',
  };

  const totalCost = selectedParts.reduce((sum, p) => sum + p.price, 0);
  const rewards = calculateRewards();

  return (
    <div className="space-y-6">
      {/* Vehicle Info */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-xl mb-1">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
            <p className="text-gray-400 text-sm">#{vehicle.licensePlate}</p>
          </div>
          <Badge className={`${qualityBgColors[calculateQuality()]} ${qualityColors[calculateQuality()]} border-0`}>
            {calculateQuality().toUpperCase()} Build
          </Badge>
        </div>
      </Card>

      {/* Assembly Progress */}
      {isAssembling && (
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-blue-500 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Wrench className="w-6 h-6 text-white animate-spin" />
              <div>
                <h3 className="text-white text-lg">Assembling...</h3>
                <p className="text-blue-100 text-sm">{progress}% Complete</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsAssembling(false)}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          </div>
          <Progress value={progress} className="h-3 bg-blue-900/50" />
        </Card>
      )}

      {/* Completion Screen */}
      {session?.status === 'completed' && (
        <Card className="bg-gradient-to-br from-yellow-600 to-orange-600 border-yellow-500 p-6">
          <div className="text-center">
            <Trophy className="w-16 h-16 text-white mx-auto mb-4 animate-bounce" />
            <h3 className="text-white text-2xl mb-2">Assembly Complete!</h3>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <Sparkles className="w-5 h-5 text-yellow-200" />
                  <span className="text-white text-xl font-bold">{session.xpEarned}</span>
                </div>
                <p className="text-yellow-100 text-sm">XP Earned</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <DollarSign className="w-5 h-5 text-yellow-200" />
                  <span className="text-white text-xl font-bold">{session.coinsEarned}</span>
                </div>
                <p className="text-yellow-100 text-sm">Coins Earned</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Tabs defaultValue="parts" className="w-full">
        <TabsList className="bg-gray-800/50 border border-gray-700">
          <TabsTrigger value="parts">Parts ({selectedParts.length})</TabsTrigger>
          <TabsTrigger value="tools">Tools ({selectedTools.length})</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        {/* Parts Tab */}
        <TabsContent value="parts" className="space-y-4 mt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {compatibleParts.map((part) => {
                const isSelected = selectedParts.find(p => p.id === part.id);
                return (
                  <Card
                    key={part.id}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      isSelected 
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-blue-500' 
                        : 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700'
                    }`}
                    onClick={() => handlePartToggle(part)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-white'}`}>
                            {part.name}
                          </h4>
                          <p className={`text-xs mt-1 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                            {part.description}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-white flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <Badge className={`${qualityBgColors[part.quality]} ${qualityColors[part.quality]} border-0`}>
                          {part.quality}
                        </Badge>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <DollarSign className="w-4 h-4" />
                          <span className={isSelected ? 'text-white' : 'text-gray-300'}>{part.price}</span>
                        </div>
                      </div>
                      {part.stats && (
                        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/20">
                          {Object.entries(part.stats).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-blue-300" />
                              <span className="text-xs text-white capitalize">{key}: {value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Tools Tab */}
        <TabsContent value="tools" className="space-y-4 mt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {tools.map((tool) => {
                const isSelected = selectedTools.find(t => t.id === tool.id);
                const isRequired = tool.required;
                return (
                  <Card
                    key={tool.id}
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-gradient-to-br from-green-600 to-emerald-600 border-green-500' 
                        : !tool.available
                        ? 'bg-gray-800/50 border-gray-800 opacity-50'
                        : 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700'
                    }`}
                    onClick={() => handleToolToggle(tool)}
                  >
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? 'bg-white/20' : 'bg-gray-700/50'
                        }`}>
                          <Wrench className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <h4 className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                            {tool.name}
                          </h4>
                          <p className="text-xs text-gray-400 capitalize">{tool.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isRequired && (
                          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                            Required
                          </Badge>
                        )}
                        {!tool.available && (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                            {tool.isPremium ? 'Premium' : 'Unavailable'}
                          </Badge>
                        )}
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4 mt-4">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
            <h3 className="text-white text-lg mb-4">Assembly Summary</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-2">Selected Parts ({selectedParts.length})</p>
                <div className="space-y-2">
                  {selectedParts.map(part => (
                    <div key={part.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                      <span className="text-white text-sm">{part.name}</span>
                      <span className="text-green-400 text-sm">${part.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Total Cost</span>
                  <span className="text-white text-lg font-bold">${totalCost}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Build Quality</span>
                  <Badge className={`${qualityBgColors[calculateQuality()]} ${qualityColors[calculateQuality()]} border-0`}>
                    {calculateQuality().toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">XP Reward</span>
                  <span className="text-blue-400 font-bold">{rewards.xp} XP</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Coins Reward</span>
                  <span className="text-yellow-400 font-bold">{rewards.coins} Coins</span>
                </div>
              </div>

              <Button
                onClick={startAssembly}
                disabled={isAssembling || selectedParts.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Play className="w-4 h-4 mr-2" />
                {isAssembling ? 'Assembling...' : 'Start Assembly'}
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
