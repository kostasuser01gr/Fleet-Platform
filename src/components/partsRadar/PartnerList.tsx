// Partner List Component with Ranking

import { useMemo } from 'react';
import type { CustomPartner, PartnerScore, ScoringWeights } from '../../types/partsRadar';
import { PartsService } from '../../services/partsService';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MapPin, Phone, Globe, Star, TrendingUp, Clock } from 'lucide-react';

interface PartnerListProps {
  partners: CustomPartner[];
  selectedPartner: CustomPartner | null;
  onPartnerSelect: (partner: CustomPartner) => void;
  scoringWeights?: ScoringWeights;
}

export function PartnerList({ partners, selectedPartner, onPartnerSelect, scoringWeights }: PartnerListProps) {
  // Calculate scores for ranking
  const rankedPartners = useMemo(() => {
    const scores: Array<{ partner: CustomPartner; score: PartnerScore }> = partners.map((partner: CustomPartner) => ({
      partner,
      score: PartsService.calculatePartnerScore(partner, undefined, undefined, scoringWeights),
    }));

    return scores.sort((a: { partner: CustomPartner; score: PartnerScore }, b: { partner: CustomPartner; score: PartnerScore }): number => b.score.score - a.score.score);
  }, [partners, scoringWeights]);

  if (rankedPartners.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400 text-sm">
        No partners found
      </div>
    );
  }

  return (
    <div className="p-2 space-y-2">
      {rankedPartners.map(({ partner, score }, index) => {
        const isSelected = selectedPartner?.partnerId === partner.partnerId;
        
        return (
          <Card
            key={partner.partnerId}
            className={`p-3 cursor-pointer transition-all ${
              isSelected
                ? 'bg-blue-600/20 border-blue-500'
                : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
            }`}
            onClick={() => onPartnerSelect(partner)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-1">{partner.name}</h4>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {partner.address}
                </p>
              </div>
              {index === 0 && score.score > 80 && (
                <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Best</Badge>
              )}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Badge variant={partner.tier === 'premium' ? 'default' : 'secondary'} className="text-xs">
                {partner.tier}
              </Badge>
              {partner.isOnline && (
                <Badge className="bg-green-500/20 text-green-400 text-xs">Online</Badge>
              )}
              {partner.source === 'google_places' && !partner.isVerified && (
                <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Unverified</Badge>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Score: {score.score}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                SLA: {partner.slaMinutesTypical}m
              </div>
            </div>

            {score.explanation && (
              <p className="text-xs text-gray-500 mb-2">{score.explanation}</p>
            )}

            <div className="flex items-center gap-2 mt-2">
              {partner.phone && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`tel:${partner.phone}`);
                  }}
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Call
                </Button>
              )}
              {partner.website && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(partner.website, '_blank');
                  }}
                >
                  <Globe className="w-3 h-3 mr-1" />
                  Website
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
