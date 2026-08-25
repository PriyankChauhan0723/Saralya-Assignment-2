import React from 'react';
import { CohortCellSummary, CohortType } from '../../domain/types.ts';
import { COHORT_DEFINITIONS, ROUTING_LANE_CONFIG } from '../../domain/constants.ts';
import { formatIndianCurrency, formatIndianNumber } from '../../domain/indianNumber.ts';
import { RoutingBadge } from './RoutingBadge.tsx';
import { useAppStore } from '../../store/useAppStore.ts';

interface GridCellProps {
  cell: CohortCellSummary;
  shortcutIndex: number;
}

export function GridCell({ cell, shortcutIndex }: GridCellProps) {
  const { selectedCohort, setSelectedCohort } = useAppStore();
  const isSelected = selectedCohort === cell.cohort;
  const meta = COHORT_DEFINITIONS[cell.cohort] || {
    routingLane: 'RULE_BASED',
    recommendedAction: cell.recommendedAction
  };
  const laneConfig = ROUTING_LANE_CONFIG[meta.routingLane];

  return (
    <button
      onClick={() => setSelectedCohort(cell.cohort)}
      className={`relative w-full text-left p-2.5 rounded-xl border-2 transition-all group flex flex-col justify-between h-[104px] shadow-xs cursor-pointer ${
        isSelected
          ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/30 shadow-md scale-[1.01] z-10'
          : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/70'
      }`}
      aria-selected={isSelected}
      aria-label={`${cell.displayName} Cohort: ${cell.count} borrowers, ${formatIndianCurrency(cell.totalOutstanding)}`}
    >
      {/* Top Header: Shortcut Key, Name & Routing Lane Badge */}
      <div className="flex items-start justify-between gap-1 w-full">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`w-4 h-4 rounded text-3xs font-mono font-bold flex items-center justify-center border ${
              isSelected
                ? 'bg-blue-600 text-white border-blue-700'
                : 'bg-slate-100 text-slate-500 border-slate-200 group-hover:bg-slate-200'
            }`}
          >
            {shortcutIndex}
          </span>
          <span className="font-extrabold text-xs text-slate-900 truncate tracking-tight">
            {cell.displayName}
          </span>
        </div>
        <RoutingBadge lane={meta.routingLane} size="sm" />
      </div>

      {/* Center Values: Borrowers Count & Total Outstanding in Indian Format */}
      <div className="flex items-baseline justify-between w-full mt-1">
        <div className="flex items-baseline gap-1">
          <span className="text-base font-black text-slate-900 tabular-nums">
            {formatIndianNumber(cell.count)}
          </span>
          <span className="text-3xs text-slate-500 font-semibold uppercase">accounts</span>
        </div>
        <div className="text-right">
          <span className="text-xs font-extrabold text-slate-800 tabular-nums">
            {formatIndianCurrency(cell.totalOutstanding, { compact: true, decimals: 2 })}
          </span>
        </div>
      </div>

      {/* Bottom Footer: Operational Action Preview */}
      <div className="w-full mt-1 pt-1 border-t border-slate-100/90 flex items-center justify-between text-3xs text-slate-500 truncate">
        <span className="truncate italic font-medium">{cell.recommendedAction}</span>
      </div>
    </button>
  );
}
