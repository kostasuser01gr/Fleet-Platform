import { useState } from 'react';
import { Vehicle, VehicleFeature } from '../types/vehicle';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Wrench, 
  Palette, 
  Zap, 
  Shield, 
  DollarSign, 
  Gauge,
  Calendar,
  Star,
  Save,
  X
} from 'lucide-react';
import { PartsRadarPanel } from './partsRadar/PartsRadarPanel';

interface VehicleEditorProps {
  vehicle: Vehicle | null | undefined;
  open: boolean;
  onClose: () => void;
  onSave: (vehicle: Vehicle) => void;
}

export function VehicleEditor({ vehicle, open, onClose, onSave }: VehicleEditorProps) {
  const [editedVehicle, setEditedVehicle] = useState<Vehicle | null>(vehicle);

  if (!editedVehicle) return null;

  const handleFeatureToggle = (featureIndex: number) => {
    const updatedFeatures = [...editedVehicle.features];
    updatedFeatures[featureIndex].installed = !updatedFeatures[featureIndex].installed;
    setEditedVehicle({ ...editedVehicle, features: updatedFeatures });
  };

  const handleSave = () => {
    onSave(editedVehicle);
    onClose();
  };

  const categoryIcons = {
    exterior: Palette,
    interior: Wrench,
    performance: Zap,
    safety: Shield,
  };

  const getFeaturesByCategory = (category: string) => {
    return editedVehicle.features.filter(f => f.category === category);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-950 to-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">
                {editedVehicle.year} {editedVehicle.make} {editedVehicle.model}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Edit vehicle details, features, and track performance
              </DialogDescription>
            </div>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              #{editedVehicle.licensePlate}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vehicle Preview */}
          <div className="relative h-64 rounded-lg overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
            <ImageWithFallback
              src={editedVehicle.image}
              alt={`${editedVehicle.make} ${editedVehicle.model}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
              <div className="flex-1 bg-black/80 backdrop-blur-sm rounded-lg p-3">
                <p className="text-xs text-gray-400">Daily Rate</p>
                <p className="text-green-400">${editedVehicle.rentalPricePerDay}/day</p>
              </div>
              <div className="flex-1 bg-black/80 backdrop-blur-sm rounded-lg p-3">
                <p className="text-xs text-gray-400">Total Revenue</p>
                <p className="text-blue-400">${editedVehicle.stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="flex-1 bg-black/80 backdrop-blur-sm rounded-lg p-3">
                <p className="text-xs text-gray-400">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400">{editedVehicle.stats.averageRating}</span>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
              <TabsTrigger value="features">Features & Upgrades</TabsTrigger>
              <TabsTrigger value="details">Vehicle Details</TabsTrigger>
              <TabsTrigger value="costs">Costs & Analytics</TabsTrigger>
              <TabsTrigger value="parts-radar">Parts Radar</TabsTrigger>
            </TabsList>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['exterior', 'interior', 'performance', 'safety'].map((category) => {
                  const Icon = categoryIcons[category as keyof typeof categoryIcons];
                  const features = getFeaturesByCategory(category);
                  
                  return (
                    <div key={category} className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="w-5 h-5 text-blue-400" />
                        <h3 className="capitalize text-gray-200">{category}</h3>
                      </div>
                      <div className="space-y-3">
                        {features.map((feature, index) => {
                          const globalIndex = editedVehicle.features.findIndex(f => f.name === feature.name);
                          return (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                              <div className="flex-1">
                                <p className="text-sm text-gray-200">{feature.name}</p>
                                <p className="text-xs text-gray-400">${feature.cost}</p>
                              </div>
                              <Switch
                                checked={feature.installed}
                                onCheckedChange={() => handleFeatureToggle(globalIndex)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              {/* Color Picker Section */}
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                <h3 className="text-gray-200 mb-3">Vehicle Color</h3>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {['#FF0000', '#0000FF', '#000000', '#FFFFFF', '#FFD700', '#00FF00', '#FF69B4', '#8B4513'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setEditedVehicle({ ...editedVehicle, color })}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          editedVehicle.color === color ? 'border-blue-500 scale-110' : 'border-gray-600'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-gray-300">Custom:</Label>
                    <input
                      type="color"
                      value={editedVehicle.color}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle, color: e.target.value })}
                      className="w-12 h-10 rounded-lg cursor-pointer bg-gray-800 border border-gray-700"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Make</Label>
                  <Input
                    value={editedVehicle.make}
                    onChange={(e) => setEditedVehicle({ ...editedVehicle, make: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Model</Label>
                  <Input
                    value={editedVehicle.model}
                    onChange={(e) => setEditedVehicle({ ...editedVehicle, model: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Year</Label>
                  <Input
                    type="number"
                    value={editedVehicle.year}
                    onChange={(e) => setEditedVehicle({ ...editedVehicle, year: parseInt(e.target.value) })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Status</Label>
                  <Select 
                    value={editedVehicle.status}
                    onValueChange={(value: Vehicle['status']) => setEditedVehicle({ ...editedVehicle, status: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">License Plate</Label>
                  <Input
                    value={editedVehicle.licensePlate}
                    onChange={(e) => setEditedVehicle({ ...editedVehicle, licensePlate: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">VIN</Label>
                  <Input
                    value={editedVehicle.vin}
                    onChange={(e) => setEditedVehicle({ ...editedVehicle, vin: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Mileage</Label>
                  <Input
                    type="number"
                    value={editedVehicle.mileage}
                    onChange={(e) => setEditedVehicle({ ...editedVehicle, mileage: parseInt(e.target.value) })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Daily Rental Rate</Label>
                  <Input
                    type="number"
                    value={editedVehicle.rentalPricePerDay}
                    onChange={(e) => setEditedVehicle({ ...editedVehicle, rentalPricePerDay: parseInt(e.target.value) })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Costs Tab */}
            <TabsContent value="costs" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                  <h3 className="mb-4 text-gray-200">Operating Costs</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Maintenance</span>
                      <span className="text-red-400">${editedVehicle.costs.maintenance.toLocaleString()}</span>
                    </div>
                    <Separator className="bg-gray-700" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Fuel</span>
                      <span className="text-red-400">${editedVehicle.costs.fuel.toLocaleString()}</span>
                    </div>
                    <Separator className="bg-gray-700" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Insurance</span>
                      <span className="text-red-400">${editedVehicle.costs.insurance.toLocaleString()}</span>
                    </div>
                    <Separator className="bg-gray-700" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Repairs</span>
                      <span className="text-red-400">${editedVehicle.costs.repairs.toLocaleString()}</span>
                    </div>
                    <Separator className="bg-gray-700" />
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-gray-200">Total Costs</span>
                      <span className="text-red-400">${editedVehicle.costs.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                  <h3 className="mb-4 text-gray-200">Performance Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Rentals</span>
                      <span className="text-blue-400">{editedVehicle.stats.totalRentals}</span>
                    </div>
                    <Separator className="bg-gray-700" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Days Rented</span>
                      <span className="text-blue-400">{editedVehicle.stats.daysRented}</span>
                    </div>
                    <Separator className="bg-gray-700" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Revenue</span>
                      <span className="text-green-400">${editedVehicle.stats.totalRevenue.toLocaleString()}</span>
                    </div>
                    <Separator className="bg-gray-700" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Average Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400">{editedVehicle.stats.averageRating}</span>
                      </div>
                    </div>
                    <Separator className="bg-gray-700" />
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-gray-200">Net Profit</span>
                      <span className={editedVehicle.stats.totalRevenue - editedVehicle.costs.total >= 0 ? 'text-green-400' : 'text-red-400'}>
                        ${(editedVehicle.stats.totalRevenue - editedVehicle.costs.total).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Parts Radar Tab */}
            <TabsContent value="parts-radar" className="space-y-4">
              <div className="h-[600px] rounded-lg overflow-hidden border border-gray-700">
                <PartsRadarPanel vehicle={editedVehicle || undefined} mode="single" />
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
            <Button variant="outline" onClick={onClose} className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
