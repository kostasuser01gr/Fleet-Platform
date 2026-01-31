// Split by Compatibility Wizard - Groups vehicles by compatibility rules

import { useState, useMemo } from 'react';
import type { Vehicle } from '../../types/vehicle';
import type { PartLine } from '../../types/partsRadar';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Car, Package, ArrowRight } from 'lucide-react';

export interface VehicleGroup {
  id: string;
  name: string;
  vehicles: Vehicle[];
  compatibility: {
    type?: string;
    yearRange?: { min: number; max: number };
    make?: string;
  };
}

interface SplitByCompatibilityWizardProps {
  vehicles: Vehicle[];
  partLines: PartLine[];
  onGroupsCreated: (groups: VehicleGroup[]) => void;
  onCancel: () => void;
}

export function SplitByCompatibilityWizard({
  vehicles,
  partLines,
  onGroupsCreated,
  onCancel,
}: SplitByCompatibilityWizardProps) {
  const [selectedRules, setSelectedRules] = useState<string[]>(['type', 'year']);

  // Group vehicles by selected rules
  const groups = useMemo(() => {
    const grouped: Record<string, VehicleGroup> = {};

    vehicles.forEach((vehicle) => {
      let groupKey = '';

      if (selectedRules.includes('type')) {
        groupKey += vehicle.type;
      }
      if (selectedRules.includes('make')) {
        groupKey += `_${vehicle.make}`;
      }
      if (selectedRules.includes('year')) {
        const yearRange = `${Math.floor(vehicle.year / 5) * 5}-${Math.floor(vehicle.year / 5) * 5 + 4}`;
        groupKey += `_${yearRange}`;
      }

      if (!groupKey) groupKey = 'other';

      if (!grouped[groupKey]) {
        grouped[groupKey] = {
          id: groupKey,
          name: groupKey.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
          vehicles: [],
          compatibility: {
            type: selectedRules.includes('type') ? vehicle.type : undefined,
            make: selectedRules.includes('make') ? vehicle.make : undefined,
            yearRange: selectedRules.includes('year')
              ? {
                  min: Math.floor(vehicle.year / 5) * 5,
                  max: Math.floor(vehicle.year / 5) * 5 + 4,
                }
              : undefined,
          },
        };
      }

      grouped[groupKey].vehicles.push(vehicle);
    });

    return Object.values(grouped);
  }, [vehicles, selectedRules]);

  const handleRuleToggle = (rule: string): void => {
    setSelectedRules((prev: string[]): string[] =>
      prev.includes(rule) ? prev.filter((r: string): boolean => r !== rule) : [...prev, rule]
    );
  };

  const handleCreate = (): void => {
    onGroupsCreated(groups);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Split by Compatibility</h3>
        <p className="text-sm text-gray-400">
          Group vehicles to ensure parts compatibility. This will create separate requests for each group.
        </p>
      </div>

      {/* Rule Selection */}
      <Card className="p-4 bg-gray-800/50 border-gray-700">
        <h4 className="text-sm font-semibold text-white mb-3">Grouping Rules</h4>
        <div className="space-y-2">
          {[
            { id: 'type', label: 'Vehicle Type', desc: 'Group by sedan, SUV, truck, etc.' },
            { id: 'make', label: 'Make', desc: 'Group by manufacturer' },
            { id: 'year', label: 'Year Range', desc: 'Group by 5-year ranges' },
          ].map((rule) => (
            <div key={rule.id} className="flex items-start gap-3 p-2 rounded hover:bg-gray-800/50">
              <Checkbox
                checked={selectedRules.includes(rule.id)}
                onCheckedChange={() => handleRuleToggle(rule.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-white cursor-pointer">
                  {rule.label}
                </label>
                <p className="text-xs text-gray-400">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Preview Groups */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-3">
          Preview: {groups.length} group{groups.length !== 1 ? 's' : ''} will be created
        </h4>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {groups.map((group) => (
            <Card key={group.id} className="p-3 bg-gray-800/50 border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-blue-400" />
                    <h5 className="text-sm font-semibold text-white">{group.name}</h5>
                    <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                      {group.vehicles.length} vehicle{group.vehicles.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {group.vehicles.slice(0, 5).map((v) => (
                      <Badge key={v.id} variant="outline" className="text-xs">
                        {v.make} {v.model}
                      </Badge>
                    ))}
                    {group.vehicles.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{group.vehicles.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t border-gray-800">
        <Button variant="outline" onClick={onCancel} className="bg-gray-800 border-gray-700 text-white">
          Cancel
        </Button>
        <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white">
          <ArrowRight className="w-4 h-4 mr-2" />
          Create {groups.length} Request{groups.length !== 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  );
}
