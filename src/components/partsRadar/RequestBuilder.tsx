// Request Builder Component

import { useState } from 'react';
import type { PartsRequest, PartLine, RequestConstraints, RequestMode } from '../../types/partsRadar';
import type { Vehicle } from '../../types/vehicle';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Plus, X, ShoppingCart, Split, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { SplitByCompatibilityWizard, type VehicleGroup } from './SplitByCompatibilityWizard';
import { ImpactReview } from './ImpactReview';
import { Dialog, DialogContent } from '../ui/dialog';

interface RequestBuilderProps {
  vehicle?: Vehicle;
  vehicles?: Vehicle[];
  mode: RequestMode;
  onCreateRequest: (request: Omit<PartsRequest, 'requestId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => void;
}

const PART_TEMPLATES = [
  { key: 'tires', description: 'Tires (Set of 4)', urgency: 'medium' as const },
  { key: 'battery', description: 'Car Battery', urgency: 'high' as const },
  { key: 'brakes', description: 'Brake Pads & Rotors', urgency: 'high' as const },
  { key: 'wipers', description: 'Windshield Wipers', urgency: 'low' as const },
  { key: 'oil_filter', description: 'Oil Filter', urgency: 'medium' as const },
  { key: 'air_filter', description: 'Air Filter', urgency: 'low' as const },
  { key: 'mirror', description: 'Side Mirror', urgency: 'medium' as const },
  { key: 'bumper', description: 'Front/Rear Bumper', urgency: 'medium' as const },
];

export function RequestBuilder({ vehicle, vehicles, mode, onCreateRequest }: RequestBuilderProps) {
  const [partLines, setPartLines] = useState<PartLine[]>([]);
  const [constraints, setConstraints] = useState<RequestConstraints>({
    radiusKm: 50,
    mustBeInStock: false,
    deliveryRequired: false,
  });
  const [showSplitWizard, setShowSplitWizard] = useState(false);
  const [showImpactReview, setShowImpactReview] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<PartsRequest[]>([]);

  const addPartLine = (template?: typeof PART_TEMPLATES[0]) => {
    const newLine: PartLine = {
      partKey: template?.key || '',
      description: template?.description || '',
      qty: 1,
      urgency: template?.urgency || 'medium',
    };
    setPartLines([...partLines, newLine]);
  };

  const removePartLine = (index: number) => {
    setPartLines(partLines.filter((_, i) => i !== index));
  };

  const updatePartLine = (index: number, updates: Partial<PartLine>) => {
    setPartLines(partLines.map((line, i) => (i === index ? { ...line, ...updates } : line)));
  };

  const handleCreate = () => {
    if (partLines.length === 0) {
      toast.error('Please add at least one part');
      return;
    }

    const targetVehicles = mode === 'single' && vehicle ? [vehicle.id] : vehicles?.map((v) => v.id) || [];
    
    if (targetVehicles.length === 0) {
      toast.error('No vehicles selected');
      return;
    }

    // For bulk mode with multiple vehicles, show split wizard
    if (mode === 'bulk' && targetVehicles.length > 1) {
      setShowSplitWizard(true);
      return;
    }

    onCreateRequest({
      mode,
      vehicleIds: targetVehicles,
      partLines,
      constraints,
      status: 'draft',
    });

    // Reset form
    setPartLines([]);
    setConstraints({
      radiusKm: 50,
      mustBeInStock: false,
      deliveryRequired: false,
    });

    toast.success('Request created');
  };

  const handleGroupsCreated = (groups: VehicleGroup[]): void => {
    const targetVehicles = vehicles || [];
    const requests: PartsRequest[] = groups.map((group: VehicleGroup): PartsRequest => ({
      requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      createdBy: 'current_user', // Get from auth context
      mode: 'bulk',
      vehicleIds: group.vehicles.map((v: Vehicle) => v.id),
      partLines,
      constraints,
      status: 'draft',
      updatedAt: new Date(),
      updatedBy: 'current_user',
    }));

    setPendingRequests(requests);
    setShowSplitWizard(false);
    setShowImpactReview(true);
  };

  const handleImpactReviewConfirm = () => {
    pendingRequests.forEach((req) => {
      onCreateRequest({
        mode: req.mode,
        vehicleIds: req.vehicleIds,
        partLines: req.partLines,
        constraints: req.constraints,
        status: 'draft',
      });
    });

    setPendingRequests([]);
    setShowImpactReview(false);
    setPartLines([]);
    setConstraints({
      radiusKm: 50,
      mustBeInStock: false,
      deliveryRequired: false,
    });

    toast.success(`${pendingRequests.length} request${pendingRequests.length !== 1 ? 's' : ''} created`);
  };

  const targetVehicles = mode === 'single' && vehicle ? [vehicle] : vehicles || [];

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white mb-2">Create Parts Request</h3>
        <p className="text-xs text-gray-400">
          {mode === 'single' && vehicle
            ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
            : `${targetVehicles.length} vehicle${targetVehicles.length !== 1 ? 's' : ''} selected`}
        </p>
      </div>

      {/* Part Lines */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs text-gray-400">Parts Needed</Label>
          <div className="flex gap-1">
            {PART_TEMPLATES.slice(0, 4).map((template) => (
              <Button
                key={template.key}
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                onClick={() => addPartLine(template)}
              >
                <Plus className="w-3 h-3 mr-1" />
                {template.key}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {partLines.map((line, index) => (
            <Card key={index} className="p-3 bg-gray-800/50 border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Part key"
                    value={line.partKey}
                    onChange={(e) => updatePartLine(index, { partKey: e.target.value })}
                    className="bg-gray-900 border-gray-700 text-white text-xs h-8"
                  />
                  <Textarea
                    placeholder="Description"
                    value={line.description}
                    onChange={(e) => updatePartLine(index, { description: e.target.value })}
                    className="bg-gray-900 border-gray-700 text-white text-xs min-h-[60px]"
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={line.qty}
                      onChange={(e) => updatePartLine(index, { qty: parseInt(e.target.value) || 1 })}
                      className="bg-gray-900 border-gray-700 text-white text-xs h-8 w-20"
                    />
                    <Select
                      value={line.urgency}
                      onValueChange={(value) => updatePartLine(index, { urgency: value as PartLine['urgency'] })}
                    >
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white text-xs h-8 flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 text-gray-400 hover:text-white"
                  onClick={() => removePartLine(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}

          {partLines.length === 0 && (
            <Button
              variant="outline"
              className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              onClick={() => addPartLine()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Part
            </Button>
          )}
        </div>
      </div>

      {/* Constraints */}
      <Card className="p-3 bg-gray-800/50 border-gray-700">
        <Label className="text-xs text-gray-400 mb-2 block">Constraints</Label>
        <div className="space-y-2">
          <div>
            <Label className="text-xs text-gray-400">Radius: {constraints.radiusKm} km</Label>
            <input
              type="range"
              min="5"
              max="200"
              step="5"
              value={constraints.radiusKm}
              onChange={(e) => setConstraints({ ...constraints, radiusKm: parseInt(e.target.value) })}
              className="w-full mt-1"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-gray-400">Must be in stock</Label>
            <input
              type="checkbox"
              checked={constraints.mustBeInStock}
              onChange={(e) => setConstraints({ ...constraints, mustBeInStock: e.target.checked })}
              className="rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-gray-400">Delivery required</Label>
            <input
              type="checkbox"
              checked={constraints.deliveryRequired}
              onChange={(e) => setConstraints({ ...constraints, deliveryRequired: e.target.checked })}
              className="rounded"
            />
          </div>
        </div>
      </Card>

      <div className="flex gap-2">
        {mode === 'bulk' && (vehicles?.length || 0) > 1 && (
          <Button
            variant="outline"
            className="flex-1 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            onClick={() => setShowSplitWizard(true)}
            disabled={partLines.length === 0}
          >
            <Split className="w-4 h-4 mr-2" />
            Split by Compatibility
          </Button>
        )}
        <Button
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleCreate}
          disabled={partLines.length === 0}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Create Request
        </Button>
      </div>

      {/* Split Wizard Dialog */}
      <Dialog open={showSplitWizard} onOpenChange={setShowSplitWizard}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-950 to-gray-900 border-gray-700 text-white">
          <SplitByCompatibilityWizard
            vehicles={vehicles || []}
            partLines={partLines}
            onGroupsCreated={handleGroupsCreated}
            onCancel={() => setShowSplitWizard(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Impact Review Dialog */}
      <Dialog open={showImpactReview} onOpenChange={setShowImpactReview}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-950 to-gray-900 border-gray-700 text-white">
          <ImpactReview
            requests={pendingRequests}
            vehicles={vehicles || []}
          />
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-800">
            <Button
              variant="outline"
              onClick={() => {
                setShowImpactReview(false);
                setPendingRequests([]);
              }}
              className="bg-gray-800 border-gray-700 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleImpactReviewConfirm}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Create {pendingRequests.length} Request{pendingRequests.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
