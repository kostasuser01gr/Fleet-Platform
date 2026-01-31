import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Settings,
  Bell,
  User,
  Shield,
  Palette,
  Globe
} from 'lucide-react';
import { PremiumService } from '../services/premiumService';
import { PremiumFeatureGate } from './PremiumFeatureGate';

export function SettingsPanel() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');

  const tier = PremiumService.getCurrentTier();

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-blue-400" />
          <h2 className="text-white text-xl">Settings</h2>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Theme</Label>
                  <p className="text-gray-400 text-sm">Choose your preferred theme</p>
                </div>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Language</Label>
                  <p className="text-gray-400 text-sm">Select your language</p>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Email Notifications</Label>
                  <p className="text-gray-400 text-sm">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Push Notifications</Label>
                  <p className="text-gray-400 text-sm">Receive browser push notifications</p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                />
              </div>

              <PremiumFeatureGate featureId="real_time_chat" showUpgrade={false}>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">SMS Notifications</Label>
                    <p className="text-gray-400 text-sm">Receive SMS notifications (Premium)</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                  />
                </div>
              </PremiumFeatureGate>
            </div>
          </TabsContent>

          <TabsContent value="premium" className="space-y-4 mt-6">
            <Card className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-yellow-500/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white text-lg mb-1">Current Plan: {tier.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {tier.id === 'basic' ? 'Upgrade to unlock premium features' : 'You have access to all premium features'}
                  </p>
                </div>
                {tier.id === 'basic' && (
                  <Button className="bg-yellow-600 hover:bg-yellow-700">
                    Upgrade Now
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-white text-sm font-semibold mb-2">Features:</h4>
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-gray-300">{feature.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div>
                <Label className="text-white">Account Information</Label>
                <p className="text-gray-400 text-sm mt-1">Manage your account settings</p>
              </div>
              <Button variant="outline" className="border-gray-600 text-gray-300">
                Edit Profile
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
