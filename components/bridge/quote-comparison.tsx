import React from 'react';
import { Quote } from '@/lib/bridge/types';

export interface QuoteComparisonProps {
  quotes: Quote[];
  onSelectQuote: (quote: Quote) => void;
  selectedQuote?: Quote;
}

/**
 * Component for displaying and comparing bridge quotes from different providers
 * This is a placeholder component that will be implemented in later tasks
 */
export function QuoteComparison(props: QuoteComparisonProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">Bridge Quotes</div>
      <div className="p-4 border rounded-lg">
        <p className="text-muted-foreground text-sm">
          Quote comparison component will be implemented in upcoming tasks
        </p>
      </div>
    </div>
  );
}