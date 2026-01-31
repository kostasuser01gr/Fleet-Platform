import { ReactNode } from 'react';
import { PremiumService } from '../services/premiumService';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Lock, 
  Crown,
  Sparkles
} from 'lucide-react';

interface PremiumFeatureGateProps {
  featureId: string;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgrade?: boolean;
}

export function PremiumFeatureGate({ 
  featureId, 
  children, 
  fallback,
  showUpgrade = false // Disabled - all features free
}: PremiumFeatureGateProps) {
  // All features are free and accessible - no gates
  return <>{children}</>;
}
