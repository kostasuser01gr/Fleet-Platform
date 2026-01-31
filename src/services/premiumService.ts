import { PremiumFeature, PremiumTier, UserSubscription } from '../types/premium';

export const premiumTiers: PremiumTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    features: [
      'core_fleet_management',
      'basic_analytics',
      'standard_support',
    ],
    limits: {
      vehicles: 10,
      users: 3,
      storage: 1000,
      apiCalls: 1000,
    },
  },
  {
    id: 'premium',
    name: 'Premium',
    features: [
      'unlimited_vehicles',
      'advanced_analytics',
      'priority_support',
      'premium_parts',
      'advanced_assembly',
      'gps_partner_finder',
      'real_time_chat',
      'advanced_notes',
      'automation',
      'api_access',
    ],
    limits: {
      vehicles: -1,
      users: 50,
      storage: 10000,
      apiCalls: 100000,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    features: [
      'all_premium_features',
      'white_label',
      'custom_integrations',
      'dedicated_support',
      'custom_features',
      'sla_guarantee',
      'on_premise_option',
    ],
    limits: {
      vehicles: -1,
      users: -1,
      storage: -1,
      apiCalls: -1,
    },
  },
];

export const premiumFeatures: PremiumFeature[] = [
  {
    id: 'advanced_analytics',
    name: 'Advanced Analytics',
    description: 'Predictive analytics, custom reports, and data export',
    category: 'analytics',
    tier: 'premium',
    enabled: false,
  },
  {
    id: 'automation',
    name: 'Workflow Automation',
    description: 'Automate repetitive tasks and workflows',
    category: 'automation',
    tier: 'premium',
    enabled: false,
  },
  {
    id: 'api_access',
    name: 'API Access',
    description: 'Full API access for integrations',
    category: 'integration',
    tier: 'premium',
    enabled: false,
  },
  {
    id: 'premium_parts',
    name: 'Premium Parts',
    description: 'Access to premium and legendary vehicle parts',
    category: 'game',
    tier: 'premium',
    enabled: false,
  },
  {
    id: 'real_time_chat',
    name: 'Real-time Chat',
    description: 'Advanced chat features with video/voice calls',
    category: 'communication',
    tier: 'premium',
    enabled: false,
  },
  {
    id: 'advanced_notes',
    name: 'Advanced Notes',
    description: 'Rich media notes with collaboration',
    category: 'data',
    tier: 'premium',
    enabled: false,
  },
];

export class PremiumService {
  // Default to enterprise tier - all features free and accessible
  private static currentTier: PremiumTier['id'] = 'enterprise';
  private static subscription: UserSubscription | null = null;

  static getCurrentTier(): PremiumTier {
    return premiumTiers.find(t => t.id === this.currentTier) || premiumTiers[2]; // Default to enterprise
  }

  static setTier(tier: PremiumTier['id']) {
    this.currentTier = tier;
  }

  static hasFeature(featureId: string): boolean {
    // All features are available - free for all users
    return true;
  }

  static isFeatureEnabled(featureId: string): boolean {
    // All features are enabled - no restrictions
    return true;
  }

  static checkLimit(limitType: keyof PremiumTier['limits']): boolean {
    // No limits - unlimited access for all
    return true;
  }

  static getLimit(limitType: keyof PremiumTier['limits']): number {
    // Unlimited for all users
    return -1;
  }

  static upgradeTier(newTier: PremiumTier['id']) {
    this.setTier(newTier);
  }
}
