// Add Custom Partner Modal (Admin)

import { useState } from 'react';
import { PartsService } from '../../services/partsService';
import { MapsService } from '../../services/mapsService';
import { AuditService } from '../../services/auditService';
import { useAuth } from '../../contexts/AuthContext';
import type { CustomPartner } from '../../types/partsRadar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { MapPin, Save } from 'lucide-react';
import { toast } from 'sonner';

interface AddPartnerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddPartnerModal({ open, onClose, onSuccess }: AddPartnerModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<CustomPartner>>({
    source: 'custom',
    name: '',
    address: '',
    geo: { lat: 0, lng: 0 },
    types: [],
    tier: 'standard',
    priceIndex: 50,
    reliabilityIndex: 50,
    slaMinutesTypical: 60,
    delivery: { pickup: true, delivery: false, deliveryFeeBase: 0 },
    paymentTerms: { invoice: true, cash: true, card: true },
    coverageBranches: [],
    isActive: true,
    isVerified: false,
    isOnline: false,
  });

  const [isGeocoding, setIsGeocoding] = useState(false);

  const handleGeocode = async () => {
    if (!formData.address) {
      toast.error('Please enter an address');
      return;
    }

    setIsGeocoding(true);
    try {
      const location = await MapsService.geocodeAddress(formData.address);
      if (location) {
        setFormData({ ...formData, geo: location });
        toast.success('Address geocoded');
      } else {
        toast.error('Could not geocode address');
      }
    } catch (error) {
      toast.error('Geocoding failed');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !formData.name || !formData.address) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      const partner = await PartsService.createPartner({
        ...formData,
        createdBy: user.id,
        updatedBy: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Omit<CustomPartner, 'partnerId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>);

      if (partner) {
        await AuditService.logPartnerCreate(partner.partnerId, partner.name);
        toast.success('Partner created');
        onSuccess();
      }
    } catch (error) {
      toast.error('Failed to create partner');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-950 to-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Add Custom Partner</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new custom partner by entering details or dropping a pin on the map
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div>
            <Label>Address *</Label>
            <div className="flex gap-2">
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white flex-1"
              />
              <Button
                variant="outline"
                onClick={handleGeocode}
                disabled={isGeocoding}
                className="bg-gray-800 border-gray-700 text-white"
              >
                <MapPin className="w-4 h-4 mr-2" />
                {isGeocoding ? 'Geocoding...' : 'Geocode'}
              </Button>
            </div>
            {formData.geo && formData.geo.lat !== 0 && (
              <p className="text-xs text-gray-400 mt-1">
                Location: {formData.geo.lat.toFixed(4)}, {formData.geo.lng.toFixed(4)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tier</Label>
              <Select
                value={formData.tier}
                onValueChange={(value) => setFormData({ ...formData, tier: value as CustomPartner['tier'] })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>SLA (minutes)</Label>
              <Input
                type="number"
                value={formData.slaMinutesTypical}
                onChange={(e) => setFormData({ ...formData, slaMinutesTypical: parseInt(e.target.value) || 60 })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Price Index (0-100)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.priceIndex}
                onChange={(e) => setFormData({ ...formData, priceIndex: parseInt(e.target.value) || 50 })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <Label>Reliability Index (0-100)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.reliabilityIndex}
                onChange={(e) => setFormData({ ...formData, reliabilityIndex: parseInt(e.target.value) || 50 })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          <div>
            <Label>Contact</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <Input
                placeholder="Phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Input
                placeholder="Email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label>Active</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isVerified}
                onCheckedChange={(checked) => setFormData({ ...formData, isVerified: checked })}
              />
              <Label>Verified</Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} className="bg-gray-800 border-gray-700 text-white">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Create Partner
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
