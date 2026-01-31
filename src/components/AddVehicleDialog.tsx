import { useState } from 'react';
import { Vehicle } from '../types/vehicle';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, X } from 'lucide-react';

interface AddVehicleDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (vehicle: Vehicle) => void;
}

export function AddVehicleDialog({ open, onClose, onAdd }: AddVehicleDialogProps) {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'sedan' as Vehicle['type'],
    licensePlate: '',
    vin: '',
    mileage: 0,
    purchasePrice: 0,
    rentalPricePerDay: 0,
    imageUrl: '',
  });

  const handleSubmit = () => {
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      make: formData.make,
      model: formData.model,
      year: formData.year,
      type: formData.type,
      color: '#FFFFFF',
      status: 'available',
      image: formData.imageUrl || 'https://images.unsplash.com/photo-1658662160331-62f7e52e63de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWRhbiUyMGNhcnxlbnwxfHx8fDE3NjIyMDY5Njd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      vin: formData.vin,
      licensePlate: formData.licensePlate,
      mileage: formData.mileage,
      purchasePrice: formData.purchasePrice,
      rentalPricePerDay: formData.rentalPricePerDay,
      features: [
        { name: 'Backup Camera', category: 'safety', installed: true, cost: 400 },
        { name: 'Bluetooth', category: 'interior', installed: true, cost: 200 },
      ],
      costs: {
        maintenance: 0,
        fuel: 0,
        insurance: 0,
        repairs: 0,
        total: 0,
      },
      stats: {
        totalRentals: 0,
        totalRevenue: 0,
        daysRented: 0,
        averageRating: 0,
      },
    };

    onAdd(newVehicle);
    onClose();
    setFormData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      type: 'sedan',
      licensePlate: '',
      vin: '',
      mileage: 0,
      purchasePrice: 0,
      rentalPricePerDay: 0,
      imageUrl: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-gray-950 to-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Vehicle</DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill in the details to add a new vehicle to your fleet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Make</Label>
              <Input
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                placeholder="e.g., Toyota, Ford"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Model</Label>
              <Input
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g., Camry, F-150"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Year</Label>
              <Input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Type</Label>
              <Select 
                value={formData.type}
                onValueChange={(value: Vehicle['type']) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">License Plate</Label>
              <Input
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                placeholder="e.g., ABC-1234"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">VIN</Label>
              <Input
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                placeholder="17-digit VIN"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Mileage</Label>
              <Input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Purchase Price ($)</Label>
              <Input
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: parseInt(e.target.value) })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Daily Rental Rate ($)</Label>
              <Input
                type="number"
                value={formData.rentalPricePerDay}
                onChange={(e) => setFormData({ ...formData, rentalPricePerDay: parseInt(e.target.value) })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Image URL (optional)</Label>
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
            <Button variant="outline" onClick={onClose} className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
