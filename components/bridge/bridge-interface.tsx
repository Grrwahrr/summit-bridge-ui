import React from 'react';

export interface BridgeInterfaceProps {
  className?: string;
}

/**
 * Main bridge interface component that orchestrates the bridge UI
 * This is a placeholder component that will be implemented in later tasks
 */
export function BridgeInterface({ className }: BridgeInterfaceProps) {
  return (
    <div className={className}>
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Cross-Chain Bridge Aggregator</h2>
        <p className="text-muted-foreground">
          Bridge interface components will be implemented in upcoming tasks
        </p>
      </div>
    </div>
  );
}