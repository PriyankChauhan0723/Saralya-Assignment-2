import React from 'react';
import { CohortType } from '../../domain/types.ts';
import { COHORT_DEFINITIONS } from '../../domain/constants.ts';
import { Sparkles } from 'lucide-react';

interface TrajectoryVectorProps {
  baselineCohort: CohortType;
  simulatedCohort: CohortType;
  deltaAbility: number;
  deltaIntent: number;
  simulationSummary?: string;
}

export function TrajectoryVector({
  baselineCohort,
  simulatedCohort,
  deltaAbility,
  deltaIntent,
  simulationSummary
}: TrajectoryVectorProps) {
  const isMigrated = baselineCohort !== simulatedCohort;
  const baseMeta = COHORT_DEFINITIONS[baselineCohort];
  const simMeta = COHORT_DEFINITIONS[simulatedCohort];

  // 3x3 layout order
  const gridRows: CohortType[][] = [
    [CohortType.WILFUL_DEFAULTER, CohortType.PROCRASTINATOR, CohortType.OOPS],
    [CohortType.EVASION_RISK, CohortType.FENCE_SITTER, CohortType.CASHFLOW_CRUNCH],
    [CohortType.LOST_CAUSE, CohortType.STRUGGLER, CohortType.DISTRESSED]
  ];

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
            Cohort Trajectory & Band Crossing Vector
          </h4>
        </div>
        <div className="flex items-center gap-2 text-2xs font-bold">
          <span className={deltaAbility >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
            Ability: {deltaAbility >= 0 ? `+${deltaAbility}` : deltaAbility}
          </span>
          <span>•</span>
          <span className={deltaIntent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
            Intent: {deltaIntent >= 0 ? `+${deltaIntent}` : deltaIntent}
          </span>
        </div>
      </div>

      {/* Mini 3x3 Visual Matrix */}
      <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-950/80 rounded-xl border border-slate-800">
        {gridRows.flat().map((cType) => {
          const isBase = cType === baselineCohort;
          const isSim = cType === simulatedCohort;
          const meta = COHORT_DEFINITIONS[cType];

          return (
            <div
              key={cType}
              className={`p-1.5 rounded-lg text-center text-3xs font-bold transition-all relative ${
                isSim && isMigrated
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-md font-black animate-pulse'
                  : isBase
                  ? 'bg-blue-600 text-white ring-1 ring-blue-400'
                  : 'bg-slate-800/60 text-slate-500 border border-slate-700/50'
              }`}
            >
              <div className="truncate">{meta?.displayName || cType}</div>
              {isBase && !isMigrated && (
                <span className="text-4xs uppercase tracking-tighter bg-blue-800 text-blue-200 px-1 rounded block mt-0.5">
                  Current
                </span>
              )}
              {isBase && isMigrated && (
                <span className="text-4xs uppercase tracking-tighter bg-slate-700 text-slate-300 px-1 rounded block mt-0.5 line-through">
                  Origin
                </span>
              )}
              {isSim && isMigrated && (
                <span className="text-4xs uppercase tracking-tighter bg-emerald-800 text-emerald-100 px-1 rounded block mt-0.5 font-black">
                  New Target ✦
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Migration Outcome Alert */}
      {isMigrated ? (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-300">
            <span>🎉 Cohort Boundary Crossed!</span>
            <span className="text-3xs bg-emerald-800 px-1.5 py-0.5 rounded text-white">
              {baseMeta?.displayName} ➔ {simMeta?.displayName}
            </span>
          </div>
          <p className="text-2xs text-emerald-100">
            {simulationSummary || `Borrower crossed the band boundary into ${simMeta?.displayName}. Operational policy unlocked: ${simMeta?.recommendedAction}!`}
          </p>
        </div>
      ) : (
        <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 text-2xs text-slate-300">
          <span>Borrower remains in <strong>{baseMeta?.displayName}</strong>. Higher payment commitment needed to cross into a higher-intent cohort.</span>
        </div>
      )}
    </div>
  );
}
