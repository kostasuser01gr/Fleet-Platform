// Import Partner from Google Places Modal (Admin)

import { useState } from 'react';
import { PartsService } from '../../services/partsService';
import { MapsService } from '../../services/mapsService';
import { AuditService } from '../../services/auditService';
import { useAuth } from '../../contexts/AuthContext';
import type { PlaceDetails } from '../../types/maps';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Search, MapPin, Star, Download } from 'lucide-react';
import { toast } from 'sonner';

interface ImportPartnerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ImportPartnerModal({ open, onClose, onSuccess }: ImportPartnerModalProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PlaceDetails[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsSearching(true);
    try {
      const response = await MapsService.textSearch(searchQuery);
      setSearchResults(response.places);
      if (response.places.length === 0) {
        toast.info('No results found');
      }
    } catch (error) {
      toast.error('Search failed');
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleImport = async (place: PlaceDetails) => {
    if (!user) return;

    try {
      const partner = await PartsService.createPartner({
        source: 'google_places',
        placeId: place.placeId,
        name: place.name,
        geo: place.location,
        address: place.formattedAddress,
        phone: place.phoneNumber,
        website: place.websiteUri,
        types: place.types || [],
        tier: 'standard',
        priceIndex: 50,
        reliabilityIndex: place.rating ? Math.round(place.rating * 20) : 50, // Convert 5-star to 0-100
        slaMinutesTypical: 60,
        delivery: { pickup: true, delivery: false, deliveryFeeBase: 0 },
        paymentTerms: { invoice: true, cash: true, card: true },
        coverageBranches: [],
        isActive: true,
        isVerified: false, // Requires admin verification
        isOnline: false,
        createdBy: user.id,
        updatedBy: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Omit<import('../../types/partsRadar').CustomPartner, 'partnerId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>);

      if (partner) {
        await AuditService.logPartnerCreate(partner.partnerId, partner.name);
        toast.success('Partner imported (requires verification)');
        onSuccess();
      }
    } catch (error) {
      toast.error('Failed to import partner');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-950 to-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Import Partner from Google Places</DialogTitle>
          <DialogDescription className="text-gray-400">
            Search for partners and import them as custom partners (requires verification)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Search</Label>
            <div className="flex gap-2 mt-1">
              <Input
                placeholder="Search for car repair, parts store, dealer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-gray-800 border-gray-700 text-white flex-1"
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {searchResults.map((place) => (
                <Card
                  key={place.placeId}
                  className="p-3 bg-gray-800/50 border-gray-700 cursor-pointer hover:bg-gray-800"
                  onClick={() => setSelectedPlace(place)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-white mb-1">{place.name}</h4>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3" />
                        {place.formattedAddress}
                      </p>
                      {place.rating && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          {place.rating} ({place.userRatingCount || 0} reviews)
                        </div>
                      )}
                      {place.primaryType && (
                        <Badge className="mt-2 bg-blue-500/20 text-blue-400 text-xs">
                          {place.primaryType}
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImport(place);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Import
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {selectedPlace && (
            <Card className="p-4 bg-blue-600/10 border-blue-500/50">
              <h4 className="font-semibold mb-2">Selected Place</h4>
              <p className="text-sm text-gray-300">{selectedPlace.name}</p>
              <p className="text-xs text-gray-400 mt-1">{selectedPlace.formattedAddress}</p>
            </Card>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} className="bg-gray-800 border-gray-700 text-white">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
