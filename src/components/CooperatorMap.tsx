import React, { useState, useMemo, useEffect } from 'react';
import { ServiceCooperator, ServiceType } from '../types/inventory';
import { mockCooperators } from '../data/mockCooperators';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  MapPin,
  Star,
  DollarSign,
  Clock,
  Phone,
  Mail,
  Lock,
  Unlock,
  Filter,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Award,
  Zap
} from 'lucide-react';

interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  cooperator: ServiceCooperator;
}

export const CooperatorMap: React.FC = () => {
  const [cooperators, setCooperators] = useState<ServiceCooperator[]>(mockCooperators);
  const [selectedCooperator, setSelectedCooperator] = useState<ServiceCooperator | null>(null);
  const [filterService, setFilterService] = useState<string>('all');
  const [filterUnlocked, setFilterUnlocked] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [sortBy, setSortBy] = useState<'price' | 'quality' | 'distance'>('price');
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 }); // Center of USA
  const [playerLevel] = useState(12); // Mock player level
  const [playerReputation] = useState(650); // Mock player reputation

  const filteredCooperators = useMemo(() => {
    let filtered = [...cooperators];

    // Filter by service
    if (filterService !== 'all') {
      filtered = filtered.filter(c => 
        c.services.includes(filterService as ServiceType)
      );
    }

    // Filter by unlock status
    if (filterUnlocked === 'unlocked') {
      filtered = filtered.filter(c => c.unlocked);
    } else if (filterUnlocked === 'locked') {
      filtered = filtered.filter(c => !c.unlocked);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.priceMultiplier - b.priceMultiplier;
        case 'quality':
          return b.quality - a.quality;
        case 'distance':
          // Simple distance calculation from map center
          const distA = Math.sqrt(
            Math.pow(a.location.lat - mapCenter.lat, 2) + 
            Math.pow(a.location.lng - mapCenter.lng, 2)
          );
          const distB = Math.sqrt(
            Math.pow(b.location.lat - mapCenter.lat, 2) + 
            Math.pow(b.location.lng - mapCenter.lng, 2)
          );
          return distA - distB;
        default:
          return 0;
      }
    });

    return filtered;
  }, [cooperators, filterService, filterUnlocked, sortBy, mapCenter]);

  const unlockCooperator = (cooperatorId: string) => {
    setCooperators(prev => prev.map(c => 
      c.id === cooperatorId ? { ...c, unlocked: true } : c
    ));
  };

  const canUnlock = (cooperator: ServiceCooperator): boolean => {
    if (cooperator.unlocked) return false;
    if (!cooperator.unlockRequirements) return true;

    const meetsLevel = !cooperator.unlockRequirements.level || 
      playerLevel >= cooperator.unlockRequirements.level;
    const meetsReputation = !cooperator.unlockRequirements.reputation || 
      playerReputation >= cooperator.unlockRequirements.reputation;

    return meetsLevel && meetsReputation;
  };

  const getPriceCategory = (multiplier: number): { text: string; color: string } => {
    if (multiplier < 0.8) return { text: 'Very Cheap', color: 'text-green-500' };
    if (multiplier < 1.0) return { text: 'Cheap', color: 'text-green-400' };
    if (multiplier < 1.3) return { text: 'Average', color: 'text-yellow-500' };
    if (multiplier < 1.8) return { text: 'Expensive', color: 'text-orange-500' };
    return { text: 'Premium', color: 'text-red-500' };
  };

  const getQualityStars = (quality: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < quality ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
        }`}
      />
    ));
  };

  const serviceIcons: Record<string, string> = {
    tire_replacement: '🛞',
    engine_repair: '⚙️',
    transmission_service: '🔧',
    suspension_upgrade: '🔩',
    body_work: '🔨',
    electronics_install: '💻',
    brake_service: '🛑',
    exhaust_upgrade: '💨',
    paint_job: '🎨',
    interior_detailing: '✨',
    oil_change: '🛢️',
    inspection: '🔍',
    tuning: '⚡',
    custom_fabrication: '🏭'
  };

  return (
    <div className="cooperator-map p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MapPin className="h-8 w-8" />
            Service Cooperator Network
          </h1>
          <p className="text-muted-foreground mt-1">
            Find the best service centers for your fleet
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-4 py-2">
            Level: {playerLevel}
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            Reputation: {playerReputation}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Sorting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Service Type</label>
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Services</option>
                <option value="tire_replacement">Tire Replacement</option>
                <option value="engine_repair">Engine Repair</option>
                <option value="transmission_service">Transmission</option>
                <option value="brake_service">Brake Service</option>
                <option value="oil_change">Oil Change</option>
                <option value="tuning">Tuning</option>
                <option value="paint_job">Paint Job</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Availability</label>
              <select
                value={filterUnlocked}
                onChange={(e) => setFilterUnlocked(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Cooperators</option>
                <option value="unlocked">Unlocked Only</option>
                <option value="locked">Locked Only</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="price">Price (Low to High)</option>
                <option value="quality">Quality (High to Low)</option>
                <option value="distance">Distance (Nearest)</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="w-full">
                <div className="text-sm font-medium mb-2">Results</div>
                <div className="text-2xl font-bold text-primary">
                  {filteredCooperators.length}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cooperators List */}
        <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto pr-2">
          {filteredCooperators.map(cooperator => {
            const priceInfo = getPriceCategory(cooperator.priceMultiplier);
            const isLocked = !cooperator.unlocked;
            const canUnlockNow = canUnlock(cooperator);

            return (
              <Card
                key={cooperator.id}
                className={`cursor-pointer transition-all ${
                  selectedCooperator?.id === cooperator.id
                    ? 'border-primary shadow-lg'
                    : 'hover:border-primary/50'
                } ${isLocked ? 'opacity-75' : ''}`}
                onClick={() => setSelectedCooperator(cooperator)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {isLocked ? (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Unlock className="h-5 w-5 text-green-500" />
                        )}
                        {cooperator.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {cooperator.location.city}, {cooperator.location.country}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex">
                        {getQualityStars(cooperator.quality)}
                      </div>
                      <Badge className={priceInfo.color} variant="outline">
                        {priceInfo.text}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Services */}
                    <div>
                      <div className="text-sm font-medium mb-2">Services Offered</div>
                      <div className="flex flex-wrap gap-1">
                        {cooperator.services.slice(0, 6).map((service: ServiceType) => (
                          <Badge key={service} variant="secondary" className="text-xs">
                            {serviceIcons[service]} {service.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                        {cooperator.services.length > 6 && (
                          <Badge variant="secondary" className="text-xs">
                            +{cooperator.services.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Specialties */}
                    <div>
                      <div className="text-sm font-medium mb-2">Specialties</div>
                      <div className="flex flex-wrap gap-1">
                        {cooperator.specialties.map((specialty: string) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Reliability</div>
                        <div className="font-bold">{cooperator.reliability}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Work Speed</div>
                        <div className="font-bold">
                          {cooperator.workSpeed < 1 ? (
                            <TrendingDown className="h-4 w-4 inline text-orange-500" />
                          ) : cooperator.workSpeed > 1 ? (
                            <TrendingUp className="h-4 w-4 inline text-green-500" />
                          ) : null}
                          {cooperator.workSpeed}x
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Reputation</div>
                        <div className="font-bold">{cooperator.reputation}</div>
                      </div>
                    </div>

                    {/* Discounts */}
                    {cooperator.discounts.length > 0 && (
                      <div className="bg-green-50 dark:bg-green-950 p-2 rounded-md">
                        <div className="text-xs font-medium text-green-700 dark:text-green-300 flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          Active Discount: {cooperator.discounts[0].value}% off - {cooperator.discounts[0].condition}
                        </div>
                      </div>
                    )}

                    {/* Unlock Info */}
                    {isLocked && (
                      <div className="bg-muted p-3 rounded-md">
                        <div className="text-sm font-medium mb-1">Unlock Requirements</div>
                        <div className="text-xs space-y-1">
                          {cooperator.unlockCost && (
                            <div>Cost: ${cooperator.unlockCost.toLocaleString()}</div>
                          )}
                          {cooperator.unlockRequirements?.level && (
                            <div className={playerLevel >= cooperator.unlockRequirements.level ? 'text-green-500' : 'text-red-500'}>
                              Level: {cooperator.unlockRequirements.level}
                              {playerLevel >= cooperator.unlockRequirements.level && ' ✓'}
                            </div>
                          )}
                          {cooperator.unlockRequirements?.reputation && (
                            <div className={playerReputation >= cooperator.unlockRequirements.reputation ? 'text-green-500' : 'text-red-500'}>
                              Reputation: {cooperator.unlockRequirements.reputation}
                              {playerReputation >= cooperator.unlockRequirements.reputation && ' ✓'}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredCooperators.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No cooperators found matching your filters</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Cooperator Details */}
        <div className="lg:col-span-1">
          {selectedCooperator ? (
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedCooperator.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {selectedCooperator.location.address}
                    </CardDescription>
                  </div>
                  {selectedCooperator.unlocked ? (
                    <Badge className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Unlocked
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Lock className="h-3 w-3 mr-1" />
                      Locked
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location */}
                <div>
                  <div className="text-sm font-medium mb-2">Location</div>
                  <div className="text-sm space-y-1">
                    <div>{selectedCooperator.location.address}</div>
                    <div>{selectedCooperator.location.city}, {selectedCooperator.location.country}</div>
                  </div>
                </div>

                {/* Contact */}
                {selectedCooperator.contactInfo && (
                  <div className="border-t pt-4">
                    <div className="text-sm font-medium mb-2">Contact</div>
                    <div className="space-y-2">
                      {selectedCooperator.contactInfo.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4" />
                          {selectedCooperator.contactInfo.phone}
                        </div>
                      )}
                      {selectedCooperator.contactInfo.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4" />
                          {selectedCooperator.contactInfo.email}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Hours */}
                <div className="border-t pt-4">
                  <div className="text-sm font-medium mb-2">Hours</div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    {selectedCooperator.availableHours.open} - {selectedCooperator.availableHours.close}
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t pt-4">
                  <div className="text-sm font-medium mb-2">Pricing</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Price Multiplier</span>
                      <span className={`font-bold ${getPriceCategory(selectedCooperator.priceMultiplier).color}`}>
                        {selectedCooperator.priceMultiplier}x
                              </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getPriceCategory(selectedCooperator.priceMultiplier).text} compared to market average
                    </div>
                  </div>
                </div>

                {/* All Services */}
                <div className="border-t pt-4">
                  <div className="text-sm font-medium mb-2">All Services</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedCooperator.services.map((service: ServiceType) => (
                      <Badge key={service} variant="secondary" className="text-xs">
                        {service.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  {selectedCooperator.unlocked ? (
                    <Button className="w-full" size="lg">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Request Service
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      size="lg"
                      variant={canUnlock(selectedCooperator) ? 'default' : 'secondary'}
                      disabled={!canUnlock(selectedCooperator)}
                      onClick={() => unlockCooperator(selectedCooperator.id)}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Unlock for ${selectedCooperator.unlockCost?.toLocaleString() || 0}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="sticky top-6">
              <CardContent className="py-12 text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a cooperator to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
