// Impact Review - Shows total cost, vehicles affected, readiness impact for bulk requests

import { useMemo } from 'react';
import type { Vehicle } from '../../types/vehicle';
import type { PartsRequest, PartLine } from '../../types/partsRadar';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { DollarSign, Car, AlertTriangle, CheckCircle, Clock, Package } from 'lucide-react';

interface ImpactReviewProps {
  requests: PartsRequest[];
  vehicles: Vehicle[];
  estimatedQuotes?: Array<{ requestId: string; estimatedCost: number }>;
}

export function ImpactReview({ requests, vehicles, estimatedQuotes }: ImpactReviewProps) {
  const impact = useMemo(() => {
    const totalVehicles = new Set(requests.flatMap((r) => r.vehicleIds)).size;
    const totalParts = requests.reduce((sum, r) => sum + r.partLines.length, 0);
    const estimatedTotalCost = estimatedQuotes?.reduce((sum, q) => sum + q.estimatedCost, 0) || 0;
    
    // Calculate readiness impact (vehicles that will be unavailable)
    const affectedVehicles = vehicles.filter((v) =>
      requests.some((r) => r.vehicleIds.includes(v.id))
    );
    
    const criticalParts = requests.some((r) =>
      r.partLines.some((p) => p.urgency === 'critical' || p.urgency === 'high')
    );

    const avgLeadTime = requests.reduce((sum, r) => {
      const leadTimes = r.partLines
        .map((p) => {
          // Estimate lead time based on urgency
          const urgencyHours: Record<string, number> = {
            critical: 2,
            high: 24,
            medium: 72,
            low: 168,
          };
          return urgencyHours[p.urgency] || 72;
        });
      return sum + (leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length);
    }, 0) / requests.length;

    return {
      totalVehicles,
      totalParts,
      estimatedTotalCost,
      affectedVehicles,
      criticalParts,
      avgLeadTimeHours: Math.round(avgLeadTime),
      requestsCount: requests.length,
    };
  }, [requests, vehicles, estimatedQuotes]);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white mb-1">Impact Review</h3>
        <p className="text-xs text-gray-400">Summary of bulk request impact</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 bg-gray-800/50 border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <Car className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Vehicles Affected</span>
          </div>
          <p className="text-lg font-semibold text-white">{impact.totalVehicles}</p>
        </Card>

        <Card className="p-3 bg-gray-800/50 border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">Estimated Cost</span>
          </div>
          <p className="text-lg font-semibold text-white">
            ${impact.estimatedTotalCost.toLocaleString()}
          </p>
        </Card>

        <Card className="p-3 bg-gray-800/50 border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Total Parts</span>
          </div>
          <p className="text-lg font-semibold text-white">{impact.totalParts}</p>
        </Card>

        <Card className="p-3 bg-gray-800/50 border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">Avg Lead Time</span>
          </div>
          <p className="text-lg font-semibold text-white">{impact.avgLeadTimeHours}h</p>
        </Card>
      </div>

      {/* Alerts */}
      {impact.criticalParts && (
        <Alert className="bg-orange-500/10 border-orange-500/50">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
          <AlertDescription className="text-orange-400 text-sm">
            Critical or high urgency parts detected. These may require expedited processing.
          </AlertDescription>
        </Alert>
      )}

      {impact.totalVehicles > 10 && (
        <Alert className="bg-blue-500/10 border-blue-500/50">
          <AlertDescription className="text-blue-400 text-sm">
            Large bulk request: {impact.totalVehicles} vehicles affected. Consider splitting into smaller batches.
          </AlertDescription>
        </Alert>
      )}

      {/* Vehicle Status Breakdown */}
      <Card className="p-3 bg-gray-800/50 border-gray-700">
        <h4 className="text-xs font-semibold text-white mb-2">Vehicle Status Breakdown</h4>
        <div className="space-y-1">
          {['available', 'rented', 'maintenance'].map((status) => {
            const count = impact.affectedVehicles.filter((v) => v.status === status).length;
            if (count === 0) return null;
            return (
              <div key={status} className="flex items-center justify-between text-xs">
                <span className="text-gray-400 capitalize">{status}</span>
                <Badge variant="outline" className="text-xs">
                  {count}
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Request Summary */}
      <Card className="p-3 bg-gray-800/50 border-gray-700">
        <h4 className="text-xs font-semibold text-white mb-2">Request Summary</h4>
        <p className="text-xs text-gray-400">
          {impact.requestsCount} request{impact.requestsCount !== 1 ? 's' : ''} will be created
        </p>
      </Card>
    </div>
  );
}
