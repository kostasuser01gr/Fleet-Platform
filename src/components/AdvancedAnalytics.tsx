import { useState } from 'react';
import { AnalyticsReport, PredictiveInsight } from '../types/analytics';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Brain,
  Lightbulb,
  Download,
  Calendar,
  Filter
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { PremiumFeatureGate } from './PremiumFeatureGate';

interface AdvancedAnalyticsProps {
  reports: AnalyticsReport[];
  insights: PredictiveInsight[];
  onGenerateReport?: () => void;
}

export function AdvancedAnalytics({ reports, insights, onGenerateReport }: AdvancedAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('monthly');
  const [selectedReport, setSelectedReport] = useState<AnalyticsReport | null>(null);

  const sampleData = [
    { month: 'Jan', revenue: 12400, costs: 8200, profit: 4200 },
    { month: 'Feb', revenue: 15200, costs: 9100, profit: 6100 },
    { month: 'Mar', revenue: 18900, costs: 10300, profit: 8600 },
    { month: 'Apr', revenue: 21500, costs: 11200, profit: 10300 },
    { month: 'May', revenue: 24800, costs: 12400, profit: 12400 },
    { month: 'Jun', revenue: 28300, costs: 13100, profit: 15200 },
  ];

  return (
    <div className="space-y-6">
      <PremiumFeatureGate featureId="advanced_analytics">
        <div className="space-y-6">
          {/* Predictive Insights */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <h2 className="text-white text-xl">Predictive Insights</h2>
              </div>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                AI Powered
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight) => (
                <Card
                  key={insight.id}
                  className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/30"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold mb-1">{insight.title}</h3>
                        <p className="text-gray-400 text-sm">{insight.description}</p>
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        {Math.round(insight.confidence * 100)}% Confidence
                      </Badge>
                    </div>

                    <div className="space-y-2 mt-4">
                      {insight.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{rec}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-purple-500/30">
                      <p className="text-xs text-gray-400">Timeframe: {insight.timeframe}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Custom Reports */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl">Custom Reports</h2>
              <Button onClick={onGenerateReport} className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>

            <Tabs defaultValue="revenue" className="w-full">
              <TabsList className="bg-gray-800/50 border border-gray-700">
                <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
                <TabsTrigger value="predictions">Predictions</TabsTrigger>
                <TabsTrigger value="custom">Custom Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="revenue" className="space-y-4 mt-4">
                <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white">Revenue Trends</h3>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={sampleData}>
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

              <TabsContent value="predictions" className="space-y-4 mt-4">
                <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
                  <h3 className="text-white mb-4">Demand Forecast</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={sampleData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </TabsContent>

              <TabsContent value="custom" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reports.map((report) => (
                    <Card
                      key={report.id}
                      className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 cursor-pointer hover:border-blue-500 transition-all"
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-semibold">{report.name}</h3>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {report.type}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">
                          {report.metrics.length} metrics • {report.charts.length} charts
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>Updated {new Date(report.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </PremiumFeatureGate>
    </div>
  );
}
