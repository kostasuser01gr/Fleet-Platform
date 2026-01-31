// Partner Filters Component

import { useState } from 'react';
import type { PartnerFilters, PartnerTier } from '../../types/partsRadar';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Filter } from 'lucide-react';

interface PartnerFiltersProps {
  filters: PartnerFilters;
  onFiltersChange: (filters: PartnerFilters) => void;
}

export function PartnerFilters({ filters, onFiltersChange }: PartnerFiltersProps) {
  const [localFilters, setLocalFilters] = useState<PartnerFilters>(filters);

  const handleChange = (key: keyof PartnerFilters, value: unknown): void => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <Card className="p-4 bg-gray-800/50 border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-200">Filters</h3>
      </div>

      <div className="space-y-4">
        {/* Radius */}
        <div>
          <Label className="text-xs text-gray-400">Radius: {localFilters.radiusKm} km</Label>
          <Slider
            value={[localFilters.radiusKm]}
            onValueChange={([value]: number[]): void => handleChange('radiusKm', value)}
            min={5}
            max={200}
            step={5}
            className="mt-2"
          />
        </div>

        {/* Tier */}
        <div>
          <Label className="text-xs text-gray-400">Tier</Label>
          <Select
            value={localFilters.tier || 'all'}
            onValueChange={(value: string): void => handleChange('tier', value === 'all' ? undefined : value as PartnerTier)}
          >
            <SelectTrigger className="bg-gray-900 border-gray-700 text-white text-xs h-8 mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Availability */}
        <div>
          <Label className="text-xs text-gray-400">Availability</Label>
          <Select
            value={localFilters.availability || 'all'}
            onValueChange={(value: string): void => handleChange('availability', value === 'all' ? undefined : value as 'online' | 'all')}
          >
            <SelectTrigger className="bg-gray-900 border-gray-700 text-white text-xs h-8 mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="online">Online Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Delivery Required */}
        <div className="flex items-center justify-between">
          <Label className="text-xs text-gray-400">Delivery Required</Label>
          <Switch
            checked={localFilters.deliveryRequired || false}
            onCheckedChange={(checked: boolean): void => handleChange('deliveryRequired', checked || undefined)}
          />
        </div>

        {/* Min Reliability */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="text-xs text-gray-400">Min Reliability</Label>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-2 text-xs text-gray-400 hover:text-white"
              onClick={(): void => handleChange('minReliability', localFilters.minReliability === undefined ? 50 : undefined)}
            >
              {localFilters.minReliability !== undefined ? 'Clear' : 'Set'}
            </Button>
          </div>
          {localFilters.minReliability !== undefined && (
            <>
              <Label className="text-xs text-gray-400">{localFilters.minReliability}%</Label>
              <Slider
                value={[localFilters.minReliability]}
                onValueChange={([value]: number[]): void => handleChange('minReliability', value)}
                min={0}
                max={100}
                step={5}
                className="mt-2"
              />
            </>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <Label className="text-xs text-gray-400">Payment Method</Label>
          <Select
            value={localFilters.paymentMethod || 'all'}
            onValueChange={(value: string): void => handleChange('paymentMethod', value === 'all' ? undefined : value as 'invoice' | 'cash' | 'card')}
          >
            <SelectTrigger className="bg-gray-900 border-gray-700 text-white text-xs h-8 mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="invoice">Invoice</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Max SLA */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="text-xs text-gray-400">Max SLA (minutes)</Label>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-2 text-xs text-gray-400 hover:text-white"
              onClick={(): void => handleChange('maxSlaMinutes', localFilters.maxSlaMinutes === undefined ? 120 : undefined)}
            >
              {localFilters.maxSlaMinutes !== undefined ? 'Clear' : 'Set'}
            </Button>
          </div>
          {localFilters.maxSlaMinutes !== undefined && (
            <>
              <Label className="text-xs text-gray-400">{localFilters.maxSlaMinutes}m</Label>
              <Slider
                value={[localFilters.maxSlaMinutes]}
                onValueChange={([value]: number[]): void => handleChange('maxSlaMinutes', value)}
                min={15}
                max={240}
                step={15}
                className="mt-2"
              />
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
