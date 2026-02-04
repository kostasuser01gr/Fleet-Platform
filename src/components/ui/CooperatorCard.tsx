import React from 'react';
import { ServiceCooperator } from '../../types/inventory';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  MapPin,
  Star,
  Clock,
  DollarSign,
  Lock,
  Unlock,
  Phone,
  Mail,
  Award,
  Zap
} from 'lucide-react';

interface CooperatorCardProps {
  cooperator: ServiceCooperator;
  onSelect?: () => void;
  onUnlock?: () => void;
  canUnlock?: boolean;
  selected?: boolean;
}

export const CooperatorCard: React.FC<CooperatorCardProps> = ({
  cooperator,
  onSelect,
  onUnlock,
  canUnlock = false,
  selected = false
}) => {
  const getPriceCategory = (multiplier: number): { text: string; color: string } => {
    if (multiplier < 0.8) return { text: 'Very Cheap', color: 'text-green-500' };
    if (multiplier < 1.0) return { text: 'Cheap', color: 'text-green-400' };
    if (multiplier < 1.3) return { text: 'Average', color: 'text-yellow-500' };
    if (multiplier < 1.8) return { text: 'Expensive', color: 'text-orange-500' };
    return { text: 'Premium', color: 'text-red-500' };
  };

  const getQualityStars = (quality: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < quality ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
        }`}
      />
    ));
  };

  const priceInfo = getPriceCategory(cooperator.priceMultiplier);
  const isLocked = !cooperator.unlocked;

  return (
    <Card
      className={`transition-all cursor-pointer ${
        selected ? 'border-primary shadow-lg' : 'hover:border-primary/50'
      } ${isLocked ? 'opacity-75' : ''}`}
      onClick={onSelect}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {isLocked ? (
                <Lock className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Unlock className="h-5 w-5 text-green-500" />
              )}
              {cooperator.name}
            </CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3 inline mr-1" />
              {cooperator.location.city}, {cooperator.location.country}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex">
              {getQualityStars(cooperator.quality)}
            </div>
            <Badge className={priceInfo.color} variant="outline">
              {priceInfo.text}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Services */}
        <div>
          <div className="text-sm font-medium mb-2">Services</div>
          <div className="flex flex-wrap gap-1">
            {cooperator.services.slice(0, 4).map(service => (
              <Badge key={service} variant="secondary" className="text-xs">
                {service.replace(/_/g, ' ')}
              </Badge>
            ))}
            {cooperator.services.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{cooperator.services.length - 4}
              </Badge>
            )}
          </div>
        </div>

        {/* Specialties */}
        {cooperator.specialties.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">Specialties</div>
            <div className="flex flex-wrap gap-1">
              {cooperator.specialties.slice(0, 3).map(specialty => (
                <Badge key={specialty} variant="outline" className="text-xs">
                  <Award className="h-3 w-3 mr-1" />
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t text-center">
          <div>
            <div className="text-xs text-muted-foreground">Reliability</div>
            <div className="font-bold">{cooperator.reliability}%</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Speed</div>
            <div className="font-bold">{cooperator.workSpeed}x</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Rating</div>
            <div className="font-bold">{cooperator.reputation}</div>
          </div>
        </div>

        {/* Hours */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {cooperator.availableHours.open} - {cooperator.availableHours.close}
          </span>
        </div>

        {/* Discounts */}
        {cooperator.discounts.length > 0 && (
          <div className="bg-green-50 dark:bg-green-950 p-2 rounded-md">
            <div className="text-xs font-medium text-green-700 dark:text-green-300 flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {cooperator.discounts[0].value}% off - {cooperator.discounts[0].condition}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {isLocked ? (
            <Button
              className="w-full"
              variant={canUnlock ? 'default' : 'secondary'}
              disabled={!canUnlock}
              onClick={(e) => {
                e.stopPropagation();
                onUnlock?.();
              }}
            >
              <Lock className="h-4 w-4 mr-2" />
              Unlock ${cooperator.unlockCost?.toLocaleString() || 0}
            </Button>
          ) : (
            <Button className="w-full" onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}>
              <DollarSign className="h-4 w-4 mr-2" />
              Request Service
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
