import React from 'react';
import { FleetStats as FleetStatsType } from '../types/vehicle';
import { Card } from './ui/card';
import { Car, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

interface FleetStatsProps {
  stats: FleetStatsType;
}

export const FleetStats = React.memo(function FleetStats({ stats }: FleetStatsProps) {
  const statCards = [
    {
      title: 'Total Vehicles',
      value: stats.totalVehicles,
      icon: Car,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Fleet Value',
      value: `$${stats.totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Net Profit',
      value: `$${stats.netProfit.toLocaleString()}`,
      icon: TrendingUp,
      color: stats.netProfit >= 0 ? 'text-green-400' : 'text-red-400',
      bgColor: stats.netProfit >= 0 ? 'bg-green-500/10' : 'bg-red-500/10',
    },
    {
      title: 'In Maintenance',
      value: stats.maintenanceVehicles,
      icon: AlertTriangle,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                <p className={`text-2xl ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
});
