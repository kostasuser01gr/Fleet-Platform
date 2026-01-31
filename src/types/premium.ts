export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  category: 'analytics' | 'automation' | 'integration' | 'game' | 'communication' | 'data';
  tier: 'premium' | 'enterprise';
  enabled: boolean;
}

export interface PremiumTier {
  id: 'basic' | 'premium' | 'enterprise';
  name: string;
  features: string[];
  price?: number;
  limits: {
    vehicles?: number;
    users?: number;
    storage?: number;
    apiCalls?: number;
  };
}

export interface UserSubscription {
  userId: string;
  tier: PremiumTier['id'];
  startDate: Date;
  endDate?: Date;
  features: PremiumFeature[];
  isActive: boolean;
}
