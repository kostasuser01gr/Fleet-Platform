// Quote Comparison Component

import { useMemo } from 'react';
import type { PartsRequest, Quote } from '../../types/partsRadar';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CheckCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface QuoteComparisonProps {
  request: PartsRequest;
  quotes: Quote[];
  onAcceptQuote: (quoteId: string) => void;
  canApprove: boolean;
}

export function QuoteComparison({ request, quotes, onAcceptQuote, canApprove }: QuoteComparisonProps) {
  const sortedQuotes = useMemo(() => {
    return [...quotes].sort((a, b) => {
      // Sort by total cost, then by ETA
      if (a.totals.grandTotal !== b.totals.grandTotal) {
        return a.totals.grandTotal - b.totals.grandTotal;
      }
      return (a.etaMinutes || 999) - (b.etaMinutes || 999);
    });
  }, [quotes]);

  const bestQuote = sortedQuotes[0];

  if (quotes.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400 text-sm">
        No quotes received yet
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white mb-1">Quote Comparison</h3>
        <p className="text-xs text-gray-400">{quotes.length} quote{quotes.length !== 1 ? 's' : ''} received</p>
      </div>

      {bestQuote && (
        <Card className="p-3 bg-blue-600/20 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-white">Best Option</span>
            </div>
            <Badge className="bg-blue-500/20 text-blue-400">Recommended</Badge>
          </div>
          <p className="text-xs text-gray-300">
            Lowest cost: ${bestQuote.totals.grandTotal.toFixed(2)}
            {bestQuote.etaMinutes && ` • ETA: ${bestQuote.etaMinutes}m`}
          </p>
        </Card>
      )}

      <div className="space-y-2">
        {sortedQuotes.map((quote) => {
          const isBest = quote.quoteId === bestQuote?.quoteId;
          const isAccepted = quote.status === 'accepted';

          return (
            <Card
              key={quote.quoteId}
              className={`p-3 ${
                isBest ? 'bg-blue-600/10 border-blue-500/50' : 'bg-gray-800/50 border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-white">Quote #{quote.quoteId.slice(0, 8)}</h4>
                    {isBest && <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Best</Badge>}
                    {isAccepted && (
                      <Badge className="bg-green-500/20 text-green-400 text-xs">Accepted</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      ${quote.totals.grandTotal.toFixed(2)}
                    </div>
                    {quote.etaMinutes && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {quote.etaMinutes}m
                      </div>
                    )}
                  </div>
                </div>
                {canApprove && !isAccepted && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white h-7 px-3 text-xs"
                    onClick={() => onAcceptQuote(quote.quoteId)}
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Accept
                  </Button>
                )}
              </div>

              <div className="mt-2 text-xs text-gray-400">
                <p>Parts: ${quote.totals.partsTotal.toFixed(2)}</p>
                {quote.totals.deliveryFee > 0 && (
                  <p>Delivery: ${quote.totals.deliveryFee.toFixed(2)}</p>
                )}
                {quote.totals.tax && <p>Tax: ${quote.totals.tax.toFixed(2)}</p>}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
