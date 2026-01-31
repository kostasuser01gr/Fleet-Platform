// Parts Radar Main Panel Component
// Game-like overlay panel with live map + partner cards + filters + actions

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PartsService } from '../../services/partsService';
import { MapsService } from '../../services/mapsService';
import { RealtimeService } from '../../services/realtimeService';
import type { CustomPartner, PartsRequest, PartnerFilters, ScoringWeights, RequestMode, Quote } from '../../types/partsRadar';
import type { Vehicle } from '../../types/vehicle';
import { PartnerMap } from './PartnerMap';
import { PartnerFilters as PartnerFiltersComponent } from './PartnerFilters';
import { PartnerList } from './PartnerList';
import { RequestBuilder } from './RequestBuilder';
import { QuoteComparison } from './QuoteComparison';
import { AddPartnerModal } from './AddPartnerModal';
import { ImportPartnerModal } from './ImportPartnerModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  MapPin, 
  Filter, 
  Plus, 
  Download, 
  RefreshCw,
  Settings,
  ShoppingCart,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

interface PartsRadarPanelProps {
  vehicle?: Vehicle; // Single mode
  vehicles?: Vehicle[]; // Bulk mode
  mode?: 'single' | 'bulk';
  onClose?: () => void;
}

export function PartsRadarPanel({ vehicle, vehicles, mode = vehicle ? 'single' : 'bulk', onClose }: PartsRadarPanelProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager' || isAdmin;

  // State
  const [partners, setPartners] = useState<CustomPartner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<CustomPartner[]>([]);
  const [filters, setFilters] = useState<PartnerFilters>({
    radiusKm: 50,
    availability: 'all',
  });
  const [selectedPartner, setSelectedPartner] = useState<CustomPartner | null>(null);
  const [activeRequest, setActiveRequest] = useState<PartsRequest | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [scoringWeights, setScoringWeights] = useState<ScoringWeights>({
    cost: 0.4,
    speed: 0.3,
    reliability: 0.3,
  });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [showImportPartner, setShowImportPartner] = useState(false);
  const [activeTab, setActiveTab] = useState<'map' | 'list' | 'request' | 'quotes'>('map');

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition): void => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error: GeolocationPositionError): void => {
          console.warn('Geolocation error:', error);
          // Default to a central location if geolocation fails
          setUserLocation({ lat: 40.7128, lng: -74.0060 }); // NYC default
        }
      );
    } else {
      setUserLocation({ lat: 40.7128, lng: -74.0060 });
    }
  }, []);

  // Load partners
  useEffect(() => {
    loadPartners();
  }, [filters]);

  // Real-time updates for partners
  useEffect(() => {
    const unsubscribe = RealtimeService.subscribe('partner_update', (data: { partnerId: string; updates: Partial<CustomPartner> }): void => {
      setPartners((prev: CustomPartner[]): CustomPartner[] =>
        prev.map((p: CustomPartner): CustomPartner => (p.partnerId === data.partnerId ? { ...p, ...data.updates } : p))
      );
    });

    return (): void => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const loadPartners = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const data = await PartsService.getPartners(filters);
      setPartners(data);
      setFilteredPartners(data);
    } catch (error: unknown) {
      toast.error('Failed to load partners');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: PartnerFilters): void => {
    setFilters(newFilters);
  };

  const handlePartnerSelect = (partner: CustomPartner): void => {
    setSelectedPartner(partner);
  };

  const handleRequestCreate = async (requestData: Omit<PartsRequest, 'requestId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>): Promise<void> => {
    if (!user) return;

    try {
      const request = await PartsService.createRequest({
        ...requestData,
        mode: mode,
        vehicleIds: vehicle ? [vehicle.id] : vehicles?.map((v) => v.id) || [],
      });

      if (request) {
        setActiveRequest(request);
        setActiveTab('quotes');
        toast.success('Parts request created');
      }
    } catch (error: unknown) {
      toast.error('Failed to create request');
      console.error(error);
    }
  };

  const handleQuoteAccept = async (quoteId: string): Promise<void> => {
    if (!activeRequest || !isManager) return;

    try {
      const success = await PartsService.acceptQuote(quoteId, activeRequest.requestId);
      if (success) {
        toast.success('Quote accepted');
        setActiveRequest((prev) => prev ? { ...prev, status: 'approved' } : null);
      }
    } catch (error: unknown) {
      toast.error('Failed to accept quote');
      console.error(error);
    }
  };

  const targetVehicles = mode === 'single' && vehicle ? [vehicle] : vehicles || [];
  const vehicleCount = targetVehicles.length;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              Parts Radar
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {mode === 'single' && vehicle
                ? `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.vin})`
                : `${vehicleCount} vehicle${vehicleCount !== 1 ? 's' : ''} selected`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImportPartner(true)}
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddPartner(true)}
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Partner
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={loadPartners}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                Close
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Filters & List */}
        <div className="w-80 border-r border-gray-800 flex flex-col">
          <Tabs value={activeTab} onValueChange={(v: string): void => setActiveTab(v as 'map' | 'list' | 'request' | 'quotes')} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-2 bg-gray-900/50 p-1">
              <TabsTrigger value="map" className="text-xs">Map</TabsTrigger>
              <TabsTrigger value="list" className="text-xs">List</TabsTrigger>
            </TabsList>

            <TabsContent value="map" className="flex-1 flex flex-col m-0 p-0">
              <div className="p-4 border-b border-gray-800">
                <PartnerFiltersComponent
                  filters={filters}
                  onFiltersChange={handleFilterChange}
                />
              </div>
              <ScrollArea className="flex-1">
                <PartnerList
                  partners={filteredPartners}
                  selectedPartner={selectedPartner}
                  onPartnerSelect={handlePartnerSelect}
                  scoringWeights={scoringWeights}
                />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="list" className="flex-1 m-0 p-0">
              <ScrollArea className="h-full">
                <PartnerList
                  partners={filteredPartners}
                  selectedPartner={selectedPartner}
                  onPartnerSelect={handlePartnerSelect}
                  scoringWeights={scoringWeights}
                />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Center - Map */}
        <div className="flex-1 relative">
          {userLocation && (
            <PartnerMap
              center={userLocation}
              partners={filteredPartners}
              selectedPartner={selectedPartner}
              onPartnerSelect={handlePartnerSelect}
              filters={filters}
            />
          )}
        </div>

        {/* Right Sidebar - Request Builder / Quotes */}
        <div className="w-96 border-l border-gray-800 flex flex-col">
          <Tabs value={activeTab === 'request' ? 'request' : activeTab === 'quotes' ? 'quotes' : 'details'} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-3 bg-gray-900/50 p-1">
              <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
              <TabsTrigger value="request" className="text-xs">
                <ShoppingCart className="w-3 h-3 mr-1" />
                Request
              </TabsTrigger>
              <TabsTrigger value="quotes" className="text-xs">
                <FileText className="w-3 h-3 mr-1" />
                Quotes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="flex-1 m-0 p-4">
              {selectedPartner ? (
                <div className="space-y-4">
                  <h3 className="font-semibold">{selectedPartner.name}</h3>
                  <p className="text-sm text-gray-400">{selectedPartner.address}</p>
                  <Badge variant={selectedPartner.tier === 'premium' ? 'default' : 'secondary'}>
                    {selectedPartner.tier}
                  </Badge>
                  {selectedPartner.isOnline && (
                    <Badge className="bg-green-500/20 text-green-400">Online</Badge>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Select a partner to view details</p>
              )}
            </TabsContent>

            <TabsContent value="request" className="flex-1 m-0 p-0">
              <ScrollArea className="h-full">
                <RequestBuilder
                  vehicle={vehicle}
                  vehicles={vehicles}
                  mode={mode}
                  onCreateRequest={handleRequestCreate}
                />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="quotes" className="flex-1 m-0 p-0">
              {activeRequest ? (
                <QuoteComparison
                  request={activeRequest}
                  quotes={quotes}
                  onAcceptQuote={handleQuoteAccept}
                  canApprove={isManager}
                />
              ) : (
                <div className="p-4 text-gray-400 text-sm">
                  Create a request to view quotes
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modals */}
      {isAdmin && (
        <>
          <AddPartnerModal
            open={showAddPartner}
            onClose={() => setShowAddPartner(false)}
            onSuccess={() => {
              setShowAddPartner(false);
              loadPartners();
            }}
          />
          <ImportPartnerModal
            open={showImportPartner}
            onClose={() => setShowImportPartner(false)}
            onSuccess={() => {
              setShowImportPartner(false);
              loadPartners();
            }}
          />
        </>
      )}
    </div>
  );
}
