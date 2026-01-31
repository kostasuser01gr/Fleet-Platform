import { useState, useEffect } from 'react';
import { Partner, PartnerSearch } from '../types/partner';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  DollarSign,
  Clock,
  Navigation,
  Search,
  Filter,
  X,
  TrendingUp,
  TrendingDown,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface GPSPartnerFinderProps {
  partners: Partner[];
  userLocation?: { lat: number; lng: number };
  onPartnerSelect?: (partner: Partner) => void;
}

export function GPSPartnerFinder({ partners, userLocation, onPartnerSelect }: GPSPartnerFinderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [distanceFilter, setDistanceFilter] = useState<number>(50);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to San Francisco
          setMapCenter({ lat: 37.7749, lng: -122.4194 });
        }
      );
    } else if (userLocation) {
      setMapCenter(userLocation);
    } else {
      setMapCenter({ lat: 37.7749, lng: -122.4194 });
    }
  }, [userLocation]);

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filter and sort partners
  const filteredPartners = partners
    .map(partner => {
      const distance = mapCenter 
        ? calculateDistance(mapCenter.lat, mapCenter.lng, partner.location.lat, partner.location.lng)
        : undefined;
      return { ...partner, distance };
    })
    .filter(partner => {
      const matchesSearch = !searchQuery || 
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = typeFilter === 'all' || partner.type === typeFilter;
      const matchesPrice = priceFilter === 'all' || partner.priceRating === priceFilter;
      const matchesRating = partner.rating >= ratingFilter;
      const matchesDistance = !partner.distance || partner.distance <= distanceFilter;

      return matchesSearch && matchesType && matchesPrice && matchesRating && matchesDistance;
    })
    .sort((a, b) => {
      if (a.distance && b.distance) {
        return a.distance - b.distance;
      }
      return b.rating - a.rating;
    });

  const handlePartnerClick = (partner: Partner) => {
    setSelectedPartner(partner);
    onPartnerSelect?.(partner);
  };

  const getGoogleMapsUrl = (partner: Partner) => {
    return `https://www.google.com/maps/search/?api=1&query=${partner.location.lat},${partner.location.lng}`;
  };

  const getDirectionsUrl = (partner: Partner) => {
    if (!mapCenter) return getGoogleMapsUrl(partner);
    return `https://www.google.com/maps/dir/${mapCenter.lat},${mapCenter.lng}/${partner.location.lat},${partner.location.lng}`;
  };

  const priceColors = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-orange-400',
  };

  const priceBgColors = {
    low: 'bg-green-500/20',
    medium: 'bg-yellow-500/20',
    high: 'bg-orange-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search partners, specialties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="supplier">Supplier</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="parts">Parts</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ratingFilter.toString()} onValueChange={(v) => setRatingFilter(parseFloat(v))}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Min Rating" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="0">Any Rating</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="4.5">4.5+ Stars</SelectItem>
              </SelectContent>
            </Select>

            <Select value={distanceFilter.toString()} onValueChange={(v) => setDistanceFilter(parseInt(v))}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Max Distance" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="5">5 km</SelectItem>
                <SelectItem value="10">10 km</SelectItem>
                <SelectItem value="25">25 km</SelectItem>
                <SelectItem value="50">50 km</SelectItem>
                <SelectItem value="100">100 km</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Partners List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg">
              Found {filteredPartners.length} Partner{filteredPartners.length !== 1 ? 's' : ''}
            </h3>
            {mapCenter && (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                <Navigation className="w-3 h-3 mr-1" />
                GPS Active
              </Badge>
            )}
          </div>

          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-3">
              {filteredPartners.map((partner) => (
                <Card
                  key={partner.id}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    selectedPartner?.id === partner.id
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-blue-500'
                      : 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700'
                  }`}
                  onClick={() => handlePartnerClick(partner)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-semibold ${selectedPartner?.id === partner.id ? 'text-white' : 'text-white'}`}>
                            {partner.name}
                          </h4>
                          {partner.isPremium && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              Premium
                            </Badge>
                          )}
                          {partner.isOpen && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Open
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 capitalize">{partner.type}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-white font-semibold">{partner.rating}</span>
                        </div>
                        <p className="text-xs text-gray-400">{partner.reviewCount} reviews</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span>{partner.location.address}, {partner.location.city}</span>
                        {partner.distance && (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 ml-auto">
                            {partner.distance.toFixed(1)} km
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <Badge className={`${priceBgColors[partner.priceRating]} ${priceColors[partner.priceRating]} border-0`}>
                          <DollarSign className="w-3 h-3 mr-1" />
                          {partner.priceRating}
                        </Badge>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">{partner.hours.open} - {partner.hours.close}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {partner.specialties.slice(0, 3).map((specialty, idx) => (
                          <Badge key={idx} className="bg-gray-800 text-gray-300 border-gray-700 text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Partner Details */}
        <div className="lg:col-span-1">
          {selectedPartner ? (
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6 sticky top-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white text-xl">{selectedPartner.name}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedPartner(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-semibold">{selectedPartner.rating}</span>
                    <span className="text-gray-400 text-sm">({selectedPartner.reviewCount} reviews)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Location</p>
                    <p className="text-white text-sm">
                      {selectedPartner.location.address}<br />
                      {selectedPartner.location.city}, {selectedPartner.location.state} {selectedPartner.location.zipCode}
                    </p>
                    {selectedPartner.distance && (
                      <p className="text-blue-400 text-sm mt-1">
                        {selectedPartner.distance.toFixed(1)} km away
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-1">Contact</p>
                    <div className="space-y-1">
                      <a href={`tel:${selectedPartner.contact.phone}`} className="flex items-center gap-2 text-white text-sm hover:text-blue-400">
                        <Phone className="w-4 h-4" />
                        {selectedPartner.contact.phone}
                      </a>
                      <a href={`mailto:${selectedPartner.contact.email}`} className="flex items-center gap-2 text-white text-sm hover:text-blue-400">
                        <Mail className="w-4 h-4" />
                        {selectedPartner.contact.email}
                      </a>
                      {selectedPartner.contact.website && (
                        <a href={`https://${selectedPartner.contact.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white text-sm hover:text-blue-400">
                          <Globe className="w-4 h-4" />
                          {selectedPartner.contact.website}
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-1">Hours</p>
                    <p className="text-white text-sm">
                      {selectedPartner.hours.open} - {selectedPartner.hours.close}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {selectedPartner.hours.days.join(', ')}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPartner.specialties.map((specialty, idx) => (
                        <Badge key={idx} className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedPartner.priceRange && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Price Range</p>
                      <p className="text-white text-sm">
                        ${selectedPartner.priceRange.min} - ${selectedPartner.priceRange.max} {selectedPartner.priceRange.currency}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t border-gray-700">
                    <Button
                      onClick={() => window.open(getDirectionsUrl(selectedPartner), '_blank')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Directions
                    </Button>
                    <Button
                      onClick={() => window.open(getGoogleMapsUrl(selectedPartner), '_blank')}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Select a partner to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
