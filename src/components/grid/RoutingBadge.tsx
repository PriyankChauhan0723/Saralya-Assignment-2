import React from 'react';
import { RoutingLane } from '../../domain/types.ts';
import { ROUTING_LANE_CONFIG } from '../../domain/constants.ts';

interface RoutingBadgeProps {
  lane: RoutingLane;
  size?: 'sm' | 'md';
}

export function RoutingBadge({ lane, size = 'sm' }: RoutingBadgeProps) {
  const config = ROUTING_LANE_CONFIG[lane];

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-md border tracking-tight shadow-2xs ${
        config.badgeClass
      } ${size === 'sm' ? 'text-2xs px-1.5 py-0.5' : 'text-xs px-2 py-1'}`}
      title={config.description}
    >
      <span className={`font-black ${config.iconColor}`}>{config.symbol}</span>
      <span>{config.shortName}</span>
    </span>
  );
}
