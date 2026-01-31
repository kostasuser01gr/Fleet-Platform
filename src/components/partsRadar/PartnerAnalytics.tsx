// Partner Analytics Dashboard

import { useMemo } from 'react';
import type { CustomPartner, PartsRequest, Quote } from '../../types/partsRadar';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  CheckCircle,
  Star,
  Activity
} from 'lucide-react';

interface PartnerAnalyticsProps {
  partner: CustomPartner;
  requests?: PartsRequest[];
  quotes?: Quote[];
}

export function PartnerAnalytics({ partner, requests = [], quotes = [] }: PartnerAnalyticsProps) {
  const stats = useMemo(() => {
    const partnerRequests = requests.filter((r) => r.selectedPartnerId === partner.partnerId);
    const partnerQuotes = quotes.filter((q) => q.partnerId === partner.partnerId);
    const acceptedQuotes = partnerQuotes.filter((q) => q.status === 'accepted');
    
    const totalRevenue = acceptedQuotes.reduce((sum, q) => sum + q.totals.grandTotal, 0);
    const avgETAMinutes = partnerQuotes
      .filter((q) => q.etaMinutes)
      .reduce((sum, q, _, arr) => sum + (q.etaMinutes || 0) / arr.length, 0);
    
    const acceptanceRate = partnerQuotes.length > 0
      ? (acceptedQuotes.length / partnerQuotes.length) * 100
      : 0;

    return {
      totalRequests: partnerRequests.length,
      totalQuotes: partnerQuotes.length,
      acceptedQuotes: acceptedQuotes.length,
      acceptanceRate: Math.round(acceptanceRate),
      totalRevenue,
      avgETAMinutes: Math.round(avgETAMinutes),
    };
  }, [partner, requests, quotes]);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white mb-1">Partner Analytics</h3>
        <p className="text-xs text-gray-400">{partner.name}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 bg-gray-800/50 border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Total Requests</span>
          </div>
          <p className="text-lg font-semibold text-white">{stats.totalRequests}</p>
        </Card>

        <Card className="p-3 bg-gray-800/50 border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">Acceptance Rate</span>
          </div>
          <p className="text-lg font-semibold text-white">{stats.acceptanceRate}%</p>
        </Card>

        <Card className="p-3 bg-gray-800/50 border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">Total Revenue</span>
          </div>
          <p className="text-lg font-semibold text-white">${stats.totalRevenue.toFixed(2)}</p>
        </Card>

        <Card className="p-3 bg-gray-800/50 border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">Avg ETA</span>
          </div>
          <p className="text-lg font-semibold text-white">
            {stats.avgETAMinutes > 0 ? `${stats.avgETAMinutes}m` : 'N/A'}
          </p>
        </Card>
      </div>

      {/* Partner KPIs */}
      <Card className="p-3 bg-gray-800/50 border-gray-700">
        <h4 className="text-xs font-semibold text-white mb-2">Key Performance Indicators</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Reliability Index</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${partner.reliabilityIndex}%` }}
                />
              </div>
              <span className="text-xs text-white">{partner.reliabilityIndex}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Price Index</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${100 - partner.priceIndex}%` }}
                />
              </div>
              <span className="text-xs text-white">{partner.priceIndex}/100</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Typical SLA</span>
            <Badge className="bg-purple-500/20 text-purple-400 text-xs">
              {partner.slaMinutesTypical}m
            </Badge>
          </div>
        </div>
      </Card>

      {/* Status */}
      <div className="flex items-center gap-2">
        <Badge className={partner.isOnline ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
          {partner.isOnline ? 'Online' : 'Offline'}
        </Badge>
        <Badge variant={partner.tier === 'premium' ? 'default' : 'secondary'}>
          {partner.tier}
        </Badge>
        {partner.isVerified && (
          <Badge className="bg-blue-500/20 text-blue-400">Verified</Badge>
        )}
      </div>
    </div>
  );
}
