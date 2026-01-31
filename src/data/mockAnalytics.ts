import { AnalyticsReport, PredictiveInsight } from '../types/analytics';

export const mockReports: AnalyticsReport[] = [
  {
    id: 'r1',
    name: 'Monthly Revenue Report',
    type: 'standard',
    metrics: [
      {
        id: 'm1',
        name: 'Total Revenue',
        value: 35400,
        change: 13.5,
        changeType: 'increase',
        unit: 'USD',
        trend: 'up',
        period: 'monthly',
      },
      {
        id: 'm2',
        name: 'Total Costs',
        value: 15200,
        change: 8.2,
        changeType: 'increase',
        unit: 'USD',
        trend: 'up',
        period: 'monthly',
      },
    ],
    charts: [],
    filters: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockInsights: PredictiveInsight[] = [
  {
    id: 'i1',
    type: 'demand_forecast',
    title: 'High Demand Expected',
    description: 'Based on historical data, demand for luxury vehicles is expected to increase by 25% next month',
    confidence: 0.87,
    prediction: {
      increase: 25,
      category: 'luxury',
      timeframe: 'next_month',
    },
    recommendations: [
      'Increase luxury vehicle inventory',
      'Adjust pricing strategy for peak demand',
      'Prepare additional maintenance resources',
    ],
    timeframe: 'Next 30 days',
    createdAt: new Date(),
  },
  {
    id: 'i2',
    type: 'price_optimization',
    title: 'Price Optimization Opportunity',
    description: 'Current pricing for sports cars is 15% below market average',
    confidence: 0.92,
    prediction: {
      currentPrice: 120,
      recommendedPrice: 138,
      potentialIncrease: 15,
    },
    recommendations: [
      'Adjust sports car pricing strategy by 15%',
      'Monitor competitor pricing',
      'Test new pricing with A/B testing',
    ],
    timeframe: 'Immediate',
    createdAt: new Date(),
  },
  {
    id: 'i3',
    type: 'maintenance_prediction',
    title: 'Maintenance Alert',
    description: '3 vehicles are approaching scheduled maintenance within 7 days',
    confidence: 0.95,
    prediction: {
      vehicles: ['1', '2', '3'],
      maintenanceType: 'scheduled',
      daysUntil: 7,
    },
    recommendations: [
      'Schedule maintenance appointments',
      'Check parts availability',
      'Notify rental customers if needed',
    ],
    timeframe: 'Next 7 days',
    createdAt: new Date(),
  },
];
