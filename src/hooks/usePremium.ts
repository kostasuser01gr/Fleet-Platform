import { PremiumService } from '../services/premiumService';

export function usePremium() {
  const tier = PremiumService.getCurrentTier();
  
  const hasFeature = (featureId: string) => {
    return PremiumService.isFeatureEnabled(featureId);
  };

  const checkLimit = (limitType: 'vehicles' | 'users' | 'storage' | 'apiCalls') => {
    return PremiumService.checkLimit(limitType);
  };

  const getLimit = (limitType: 'vehicles' | 'users' | 'storage' | 'apiCalls') => {
    return PremiumService.getLimit(limitType);
  };

  return {
    tier,
    hasFeature,
    checkLimit,
    getLimit,
    isPremium: tier.id !== 'basic',
    isEnterprise: tier.id === 'enterprise',
  };
}
