import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  AreaChart, 
  Area, 
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
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, DollarSign, Activity, Users } from 'lucide-react';

const revenueData = [
  { month: 'Jan', revenue: 12400, costs: 8200, profit: 4200 },
  { month: 'Feb', revenue: 15200, costs: 9100, profit: 6100 },
  { month: 'Mar', revenue: 18900, costs: 10300, profit: 8600 },
  { month: 'Apr', revenue: 21500, costs: 11200, profit: 10300 },
  { month: 'May', revenue: 24800, costs: 12400, profit: 12400 },
  { month: 'Jun', revenue: 28300, costs: 13100, profit: 15200 },
  { month: 'Jul', revenue: 32100, costs: 14200, profit: 17900 },
  { month: 'Aug', revenue: 29400, costs: 13800, profit: 15600 },
  { month: 'Sep', revenue: 26700, costs: 12900, profit: 13800 },
  { month: 'Oct', revenue: 31200, costs: 14500, profit: 16700 },
  { month: 'Nov', revenue: 35400, costs: 15200, profit: 20200 },
];

const vehiclePerformance = [
  { name: 'Ford F-150', rentals: 45, revenue: 12600 },
  { name: 'Shelby GT350R', rentals: 32, revenue: 28000 },
  { name: 'Mercedes S-Class', rentals: 28, revenue: 35100 },
  { name: 'Toyota Camry', rentals: 68, revenue: 15340 },
];

const statusDistribution = [
  { name: 'Available', value: 45, color: '#10b981' },
  { name: 'Rented', value: 35, color: '#3b82f6' },
  { name: 'Maintenance', value: 20, color: '#f59e0b' },
];

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100 mb-1">Monthly Revenue</p>
              <p className="text-2xl text-white">$35,400</p>
              <p className="text-xs text-blue-200 mt-1">+13.5% from last month</p>
            </div>
            <div className="p-3 rounded-xl bg-white/20">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-600 to-green-700 border-green-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100 mb-1">Active Rentals</p>
              <p className="text-2xl text-white">12</p>
              <p className="text-xs text-green-200 mt-1">8 upcoming bookings</p>
            </div>
            <div className="p-3 rounded-xl bg-white/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-purple-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-100 mb-1">Total Customers</p>
              <p className="text-2xl text-white">347</p>
              <p className="text-xs text-purple-200 mt-1">+24 this month</p>
            </div>
            <div className="p-3 rounded-xl bg-white/20">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600 to-orange-700 border-orange-500 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-100 mb-1">Growth Rate</p>
              <p className="text-2xl text-white">+18.3%</p>
              <p className="text-xs text-orange-200 mt-1">YoY comparison</p>
            </div>
            <div className="p-3 rounded-xl bg-white/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="bg-gray-800/50 border border-gray-700">
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="performance">Vehicle Performance</TabsTrigger>
          <TabsTrigger value="distribution">Fleet Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4 mt-4">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
            <h3 className="text-white mb-4">Revenue & Profit Trends</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4 mt-4">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
            <h3 className="text-white mb-4">Top Performing Vehicles</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={vehiclePerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" angle={-15} textAnchor="end" height={80} />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="rentals" fill="#8b5cf6" name="Total Rentals" />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
              <h3 className="text-white mb-4">Fleet Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
              <h3 className="text-white mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300">Average Daily Rate</span>
                  <span className="text-green-400">$246</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300">Fleet Utilization</span>
                  <span className="text-blue-400">73%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300">Customer Satisfaction</span>
                  <span className="text-yellow-400">4.8/5.0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300">Return Rate</span>
                  <span className="text-purple-400">89%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300">Avg. Rental Duration</span>
                  <span className="text-orange-400">5.2 days</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
