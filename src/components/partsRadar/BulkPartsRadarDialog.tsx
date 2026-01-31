// Bulk Parts Radar Dialog - Accessible from Fleet View

import { useState } from 'react';
import type { Vehicle } from '../../types/vehicle';
import { PartsRadarPanel } from './PartsRadarPanel';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { ShoppingCart } from 'lucide-react';

interface BulkPartsRadarDialogProps {
  open: boolean;
  onClose: () => void;
  selectedVehicles: Vehicle[];
}

export function BulkPartsRadarDialog({ open, onClose, selectedVehicles }: BulkPartsRadarDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-gradient-to-br from-gray-950 to-gray-900 border-gray-700 text-white overflow-hidden">
        <DialogHeader className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-400" />
                Parts Radar - Bulk Mode
              </DialogTitle>
              <p className="text-sm text-gray-400 mt-1">
                {selectedVehicles.length} vehicle{selectedVehicles.length !== 1 ? 's' : ''} selected
              </p>
            </div>
            <Badge className="bg-blue-500/20 text-blue-400">
              Bulk Request
            </Badge>
          </div>
        </DialogHeader>
        <div className="h-[calc(95vh-80px)]">
          <PartsRadarPanel vehicles={selectedVehicles} mode="bulk" onClose={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
