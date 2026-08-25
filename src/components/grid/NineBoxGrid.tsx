import React from 'react';
import { useCohortSummary } from '../../hooks/useCohortSummary.ts';
import { GridCell } from './GridCell.tsx';
import { GridColumnHeaders, GridRowHeader } from './GridAxisHeader.tsx';
import { GridSkeleton } from '../common/LoadingSkeleton.tsx';
import { ErrorBoundary } from '../common/ErrorBoundary.tsx';

export function NineBoxGrid() {
  const { data, isLoading, isError, error, refetch } = useCohortSummary();

  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="h-4 bg-slate-200 rounded w-48 mb-3 animate-pulse" />
        <GridSkeleton />
      </div>
    );
  }

  if (isError || !data?.grid) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-red-200 shadow-xs text-center">
        <p className="text-sm font-semibold text-red-700">Failed to load 3x3 Cohort Grid</p>
        <p className="text-xs text-red-500 mt-1">{(error as Error)?.message || 'Unknown network error'}</p>
        <button
          onClick={() => refetch()}
          className="mt-3 px-3 py-1.5 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100"
        >
          Retry Grid Load
        </button>
      </div>
    );
  }

  const { HIGH_ABILITY, MED_ABILITY, LOW_ABILITY } = data.grid;

  return (
    <ErrorBoundary fallbackTitle="3x3 Grid Error">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-xs">
        {/* Column Labels (Intent) */}
        <GridColumnHeaders />

        {/* 3 Rows with Row Headers (Ability) */}
        <div className="space-y-2">
          {/* Row 1: High Ability (>=70) */}
          <div className="flex gap-2 items-stretch">
            <GridRowHeader band="HIGH" />
            <div className="grid grid-cols-3 gap-2.5 flex-1">
              <GridCell cell={HIGH_ABILITY.LOW_INTENT} shortcutIndex={1} />
              <GridCell cell={HIGH_ABILITY.MED_INTENT} shortcutIndex={2} />
              <GridCell cell={HIGH_ABILITY.HIGH_INTENT} shortcutIndex={3} />
            </div>
          </div>

          {/* Row 2: Medium Ability (40-69) */}
          <div className="flex gap-2 items-stretch">
            <GridRowHeader band="MED" />
            <div className="grid grid-cols-3 gap-2.5 flex-1">
              <GridCell cell={MED_ABILITY.LOW_INTENT} shortcutIndex={4} />
              <GridCell cell={MED_ABILITY.MED_INTENT} shortcutIndex={5} />
              <GridCell cell={MED_ABILITY.HIGH_INTENT} shortcutIndex={6} />
            </div>
          </div>

          {/* Row 3: Low Ability (<40) */}
          <div className="flex gap-2 items-stretch">
            <GridRowHeader band="LOW" />
            <div className="grid grid-cols-3 gap-2.5 flex-1">
              <GridCell cell={LOW_ABILITY.LOW_INTENT} shortcutIndex={7} />
              <GridCell cell={LOW_ABILITY.MED_INTENT} shortcutIndex={8} />
              <GridCell cell={LOW_ABILITY.HIGH_INTENT} shortcutIndex={9} />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
