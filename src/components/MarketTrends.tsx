import React, { useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Minus, DollarSign, Activity } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateMarketTrends, setInvestmentOpportunities } from '../store/slices/economySlice';
import EconomyService from '../services/economyService';
import { MarketTrend } from '../types/advancedInventory';

export const MarketTrends: React.FC = () => {
  const dispatch = useAppDispatch();
  const marketTrends = useAppSelector((state) => state.economy.marketTrends);
  const investmentOpportunities = useAppSelector((state) => state.economy.investmentOpportunities);

  useEffect(() => {
    // Initialize market data
    const trends = EconomyService.getAllMarketTrends();
    const trendsMap: Record<string, MarketTrend> = {};
    trends.forEach((trend) => {
      trendsMap[trend.partType] = trend;
    });
    dispatch(updateMarketTrends(trendsMap));

    const opportunities = EconomyService.getInvestmentOpportunities();
    dispatch(setInvestmentOpportunities(opportunities));

    // Update every 5 minutes
    const interval = setInterval(() => {
      const updatedTrends = EconomyService.getAllMarketTrends();
      const updatedTrendsMap: Record<string, MarketTrend> = {};
      updatedTrends.forEach((trend) => {
        updatedTrendsMap[trend.partType] = trend;
      });
      dispatch(updateMarketTrends(updatedTrendsMap));

      const newOpportunities = EconomyService.getInvestmentOpportunities();
      dispatch(setInvestmentOpportunities(newOpportunities));
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const getTrendIcon = (prediction: MarketTrend['prediction']) => {
    switch (prediction) {
      case 'rising':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'falling':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: number): string => {
    if (trend > 1.1) return 'text-green-600';
    if (trend < 0.9) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatPartType = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const marketSummary = EconomyService.getMarketSummary();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Market Trends</h2>
          <p className="text-muted-foreground">Real-time market analysis and investment opportunities</p>
        </div>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-xs text-muted-foreground">Market Activity</div>
              <div className="text-sm font-semibold">Active</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Market Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold">Trending Up</h3>
          </div>
          <div className="space-y-1">
            {marketSummary.trending.length > 0 ? (
              marketSummary.trending.map((type) => (
                <Badge key={type} variant="outline" className="mr-2">
                  {formatPartType(type)}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No trending items</p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold">Declining</h3>
          </div>
          <div className="space-y-1">
            {marketSummary.declining.length > 0 ? (
              marketSummary.declining.map((type) => (
                <Badge key={type} variant="outline" className="mr-2">
                  {formatPartType(type)}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No declining items</p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold">Hot Deals</h3>
          </div>
          <div className="space-y-1">
            {marketSummary.hotDeals.length > 0 ? (
              marketSummary.hotDeals.map((type) => (
                <Badge key={type} variant="outline" className="mr-2 bg-yellow-50">
                  {formatPartType(type)}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No hot deals</p>
            )}
          </div>
        </Card>
      </div>

      {/* Detailed Market Data */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Part Categories</h3>
        <div className="space-y-4">
          {Object.entries(marketTrends).map(([partType, trend]) => (
            <div
              key={partType}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-2xl">
                    {partType === 'engine' && '⚙️'}
                    {partType === 'tires' && '🛞'}
                    {partType === 'transmission' && '🔧'}
                    {partType === 'suspension' && '🔩'}
                    {partType === 'brakes' && '🛑'}
                    {partType === 'electronics' && '💡'}
                    {partType === 'paint' && '🎨'}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold">{formatPartType(partType)}</h4>
                  <p className="text-sm text-muted-foreground">Volume: {trend.volume}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {getTrendIcon(trend.prediction)}
                    <span className={`font-semibold ${getTrendColor(trend.trend)}`}>
                      {((trend.trend - 1) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Multiplier: {trend.trend.toFixed(2)}x
                  </p>
                </div>

                <Badge
                  variant={
                    trend.prediction === 'rising'
                      ? 'default'
                      : trend.prediction === 'falling'
                      ? 'destructive'
                      : 'outline'
                  }
                >
                  {trend.prediction}
                </Badge>

                {investmentOpportunities.includes(partType) && (
                  <Badge className="bg-yellow-500">Investment Opportunity</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Investment Opportunities */}
      {investmentOpportunities.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-yellow-600" />
            Investment Opportunities
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            These parts are currently undervalued and predicted to rise. Consider buying now!
          </p>
          <div className="flex flex-wrap gap-2">
            {investmentOpportunities.map((type) => (
              <Badge key={type} className="bg-yellow-500 text-white">
                {formatPartType(type)}
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MarketTrends;
