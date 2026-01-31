import { Vehicle } from '../types/vehicle';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Gauge, DollarSign, Calendar, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick: () => void;
  isSelected?: boolean;
  onSelect?: (vehicle: Vehicle, selected: boolean) => void;
  showCheckbox?: boolean;
}

export function VehicleCard({ vehicle, onClick, isSelected, onSelect, showCheckbox }: VehicleCardProps) {
  const statusColors = {
    available: 'bg-green-500',
    rented: 'bg-blue-500',
    maintenance: 'bg-orange-500',
  };

  const statusLabels = {
    available: 'Available',
    rented: 'Rented',
    maintenance: 'Maintenance',
  };

  const profitMargin = vehicle.stats.totalRevenue - vehicle.costs.total;
  const isProfit = profitMargin > 0;

  return (
    <Card 
      className={`overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-xl bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
        <ImageWithFallback
          src={vehicle.image}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge className={`${statusColors[vehicle.status]} text-white border-0`}>
            {statusLabels[vehicle.status]}
          </Badge>
        </div>
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {showCheckbox && (
            <Checkbox
              checked={isSelected || false}
              onCheckedChange={(checked) => onSelect?.(vehicle, checked as boolean)}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/90 border-gray-300"
            />
          )}
          <Badge className="bg-black/60 text-white border-0">
            #{vehicle.licensePlate}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-white">{vehicle.year} {vehicle.make}</h3>
          <p className="text-gray-400">{vehicle.model}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-gray-300">
            <Gauge className="w-4 h-4 text-blue-400" />
            <span className="text-sm">{vehicle.mileage.toLocaleString()} mi</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-sm">${vehicle.rentalPricePerDay}/day</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span className="text-sm">{vehicle.stats.totalRentals} rentals</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm">{vehicle.stats.averageRating}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Profit Margin</span>
            <span className={`${isProfit ? 'text-green-400' : 'text-red-400'}`}>
              {isProfit ? '+' : ''}{profitMargin.toLocaleString()} $
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
