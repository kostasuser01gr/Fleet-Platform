import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Car, 
  DollarSign, 
  Users, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { Vehicle } from '../types/vehicle';
import { Rental } from '../types/rental';
import { analyticsEngine, AnalyticsMetrics, PredictionResult } from '../services/analyticsEngine';
import { LoadingSpinner } from './ui/loading-spinner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface EnhancedDashboardProps {
  vehicles: Vehicle[];
  rentals: Rental[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function EnhancedDashboard({ vehicles, rentals }: EnhancedDashboardProps) {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    setLoading(true);
    analyticsEngine.setData(vehicles, rentals);
    
    setTimeout(() => {
      const calculatedMetrics = analyticsEngine.calculateMetrics();
      const generatedPredictions = analyticsEngine.predictTrends();
      const generatedInsights = analyticsEngine.generateInsights();
      
      setMetrics(calculatedMetrics);
      setPredictions(generatedPredictions);
      setInsights(generatedInsights);
      setLoading(false);
    }, 500);
  }, [vehicles, rentals]);

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const timeSeriesData = analyticsEngine.generateTimeSeriesData(
    timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
  );

  const vehicleTypeData = Object.entries(metrics.revenueByVehicleType).map(([type, revenue]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: revenue,
  }));

  const statusData = [
    { name: 'Available', value: vehicles.filter(v => v.status === 'available').length },
    { name: 'Rented', value: vehicles.filter(v => v.status === 'rented').length },
    { name: 'Maintenance', value: vehicles.filter(v => v.status === 'maintenance').length },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header with time range selector */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Real-time analytics and insights for your fleet</p>
        </div>
        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
          <TabsList>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
            <TabsTrigger value="90d">90 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.profitMargin.toFixed(1)}% profit margin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Utilization</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.fleetUtilization.toFixed(1)}%</div>
            <Progress value={metrics.fleetUtilization} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rentals</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRentals}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.averageRentalDuration.toFixed(1)} days avg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Retention</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.customerRetention.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Returning customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              AI-Powered Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                  <div className="flex-1 text-sm">{insight}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fleet Status</CardTitle>
            <CardDescription>Current vehicle distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Vehicle Type</CardTitle>
            <CardDescription>Performance by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vehicleTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {vehicleTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peak Rental Hours</CardTitle>
            <CardDescription>Busiest times of day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.peakHours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" label={{ value: 'Hour', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Rentals', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Predictions */}
      {predictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Trend Predictions</CardTitle>
            <CardDescription>AI-powered forecasts for the next period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictions.map((prediction, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{prediction.metric}</h4>
                    <p className="text-sm text-muted-foreground">
                      Current: {prediction.current.toFixed(2)} → Predicted: {prediction.predicted.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={prediction.trend === 'up' ? 'default' : prediction.trend === 'down' ? 'destructive' : 'secondary'}>
                      {prediction.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                      {prediction.trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                      {prediction.trend}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{prediction.confidence.toFixed(0)}% confidence</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Vehicles</CardTitle>
          <CardDescription>Most rented vehicles in your fleet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.popularVehicles.map((vehicle: { vehicleId: string; name: string; rentals: number }, index: number) => (
              <div key={vehicle.vehicleId} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{vehicle.name}</p>
                    <p className="text-sm text-muted-foreground">{vehicle.rentals} rentals</p>
                  </div>
                </div>
                <Progress value={(vehicle.rentals / metrics.totalRentals) * 100} className="w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
