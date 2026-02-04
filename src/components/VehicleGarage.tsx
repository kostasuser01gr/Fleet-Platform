import React, { useState, useMemo } from 'react';
import { VehiclePart } from '../types/inventory';
import { Vehicle } from '../types/vehicle';
import { mockParts } from '../data/mockInventory';
import { mockVehicles } from '../data/mockVehicles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Wrench, 
  Settings, 
  TrendingUp, 
  Package, 
  Star, 
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

export const VehicleGarage: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(mockVehicles[0] || null);
  const [inventory, setInventory] = useState<VehiclePart[]>(mockParts);
  const [selectedPart, setSelectedPart] = useState<VehiclePart | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRarity, setFilterRarity] = useState<string>('all');

  const installedParts = useMemo(() => {
    return inventory.filter(p => p.installed && p.vehicleId === selectedVehicle?.id);
  }, [inventory, selectedVehicle]);

  const availableParts = useMemo(() => {
    let parts = inventory.filter(p => !p.installed);
    
    if (filterType !== 'all') {
      parts = parts.filter(p => p.type === filterType);
    }
    
    if (filterRarity !== 'all') {
      parts = parts.filter(p => p.rarity === filterRarity);
    }
    
    return parts;
  }, [inventory, filterType, filterRarity]);

  const vehicleStats = useMemo(() => {
    if (!selectedVehicle) return null;

    const stats = {
      speed: 0,
      acceleration: 0,
      handling: 0,
      durability: 0,
      efficiency: 0
    };

    installedParts.forEach(part => {
      if (part.stats.speed) stats.speed += part.stats.speed;
      if (part.stats.acceleration) stats.acceleration += part.stats.acceleration;
      if (part.stats.handling) stats.handling += part.stats.handling;
      if (part.stats.durability) stats.durability += part.stats.durability;
      if (part.stats.efficiency) stats.efficiency += part.stats.efficiency;
    });

    return stats;
  }, [selectedVehicle, installedParts]);

  const installPart = (part: VehiclePart) => {
    if (!selectedVehicle) return;

    // Check if there's already a part of this type installed
    const existingPart = installedParts.find(p => p.type === part.type);
    
    setInventory(prev => prev.map(p => {
      if (p.id === part.id) {
        return { ...p, installed: true, vehicleId: selectedVehicle.id };
      }
      if (existingPart && p.id === existingPart.id) {
        // Uninstall the existing part
        return { ...p, installed: false, vehicleId: undefined };
      }
      return p;
    }));

    setSelectedPart(null);
  };

  const uninstallPart = (part: VehiclePart) => {
    setInventory(prev => prev.map(p => 
      p.id === part.id ? { ...p, installed: false, vehicleId: undefined } : p
    ));
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'uncommon': return 'bg-green-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getConditionColor = (condition: number) => {
    if (condition >= 80) return 'text-green-500';
    if (condition >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="vehicle-garage p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wrench className="h-8 w-8" />
            Vehicle Garage
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and upgrade your fleet's performance
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-4 py-2">
            <Package className="h-4 w-4 mr-2" />
            Parts: {availableParts.length}
          </Badge>
        </div>
      </div>

      {/* Vehicle Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Vehicle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockVehicles.slice(0, 6).map((vehicle: Vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedVehicle?.id === vehicle.id 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{vehicle.make} {vehicle.model}</h3>
                    <p className="text-sm text-muted-foreground">{vehicle.year}</p>
                  </div>
                  {selectedVehicle?.id === vehicle.id && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Status</span>
                    <span className="capitalize text-primary">
                      {vehicle.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedVehicle && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vehicle Bay - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Performance</CardTitle>
                <CardDescription>
                  {selectedVehicle.make} {selectedVehicle.model} - Current stats with installed parts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {vehicleStats && Object.entries(vehicleStats).map(([stat, value]) => (
                    <div key={stat} className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {value > 0 ? '+' : ''}{value}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {stat}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Installed Parts */}
            <Card>
              <CardHeader>
                <CardTitle>Installed Parts</CardTitle>
                <CardDescription>
                  Parts currently installed on this vehicle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {installedParts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No parts installed on this vehicle</p>
                    </div>
                  ) : (
                    installedParts.map(part => (
                      <div
                        key={part.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Badge className={getRarityColor(part.rarity)}>
                            {part.rarity}
                          </Badge>
                          <div>
                            <div className="font-medium">{part.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {part.manufacturer} • Condition: {part.condition}%
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPart(part)}
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => uninstallPart(part)}
                          >
                            Uninstall
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Parts Inventory */}
            <Card>
              <CardHeader>
                <CardTitle>Parts Inventory</CardTitle>
                <CardDescription>
                  Available parts for installation
                </CardDescription>
                <div className="flex gap-2 mt-4">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-1 border rounded-md bg-background"
                  >
                    <option value="all">All Types</option>
                    <option value="engine">Engine</option>
                    <option value="tires">Tires</option>
                    <option value="transmission">Transmission</option>
                    <option value="suspension">Suspension</option>
                    <option value="brakes">Brakes</option>
                    <option value="electronics">Electronics</option>
                    <option value="paint">Paint</option>
                  </select>
                  <select
                    value={filterRarity}
                    onChange={(e) => setFilterRarity(e.target.value)}
                    className="px-3 py-1 border rounded-md bg-background"
                  >
                    <option value="all">All Rarities</option>
                    <option value="common">Common</option>
                    <option value="uncommon">Uncommon</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
                  {availableParts.map(part => (
                    <div
                      key={part.id}
                      className="p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedPart(part)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="font-medium">{part.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {part.manufacturer}
                          </div>
                        </div>
                        <Badge className={getRarityColor(part.rarity)} variant="secondary">
                          {part.rarity}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground capitalize">
                          {part.type.replace('_', ' ')}
                        </span>
                        <span className="font-bold text-primary">
                          ${part.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="flex gap-1 flex-wrap">
                          {part.stats.speed && (
                            <Badge variant="outline" className="text-xs">
                              Speed +{part.stats.speed}
                            </Badge>
                          )}
                          {part.stats.acceleration && (
                            <Badge variant="outline" className="text-xs">
                              Accel +{part.stats.acceleration}
                            </Badge>
                          )}
                          {part.stats.handling && (
                            <Badge variant="outline" className="text-xs">
                              Handling +{part.stats.handling}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Part Details - Right Column */}
          <div className="lg:col-span-1">
            {selectedPart ? (
              <Card className="sticky top-6">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{selectedPart.name}</CardTitle>
                    <Badge className={getRarityColor(selectedPart.rarity)}>
                      {selectedPart.rarity}
                    </Badge>
                  </div>
                  <CardDescription>{selectedPart.manufacturer}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Description</div>
                    <p className="text-sm">{selectedPart.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y">
                    <div>
                      <div className="text-xs text-muted-foreground">Type</div>
                      <div className="font-medium capitalize">
                        {selectedPart.type.replace('_', ' ')}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Condition</div>
                      <div className={`font-medium ${getConditionColor(selectedPart.condition)}`}>
                        {selectedPart.condition}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Performance</div>
                      <div className="font-medium">+{selectedPart.performance}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Durability</div>
                      <div className="font-medium">{selectedPart.durability}</div>
                    </div>
                  </div>

                  {Object.keys(selectedPart.stats).length > 0 && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Stats Bonuses</div>
                      <div className="space-y-2">
                        {Object.entries(selectedPart.stats).map(([stat, value]) => (
                          value !== undefined && value !== 0 && value !== null && (
                            <div key={stat} className="flex justify-between items-center">
                              <span className="text-sm capitalize">{stat}</span>
                              <span className={`font-medium ${(value as number) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {(value as number) > 0 ? '+' : ''}{value}
                              </span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedPart.requirements && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Requirements</div>
                      <div className="space-y-1 text-sm">
                        {selectedPart.requirements.level && (
                          <div>Level: {selectedPart.requirements.level}</div>
                        )}
                        {selectedPart.requirements.reputation && (
                          <div>Reputation: {selectedPart.requirements.reputation}</div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <div className="text-2xl font-bold text-primary mb-4">
                      ${selectedPart.price.toLocaleString()}
                    </div>
                    
                    {!selectedPart.installed ? (
                      <Button
                        className="w-full"
                        onClick={() => installPart(selectedPart)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Install Part
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => uninstallPart(selectedPart)}
                      >
                        Uninstall Part
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-6">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a part to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
