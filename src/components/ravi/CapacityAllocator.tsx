import React, { useState, useMemo } from 'react';
import { CohortGridSummary } from '../../domain/types.ts';
import { optimizeFloorCapacity } from '../../domain/capacityOptimizer.ts';
import { formatIndianCurrency, formatIndianNumber } from '../../domain/indianNumber.ts';
import { Target, Zap, CheckCircle2, Sliders } from 'lucide-react';
import { FloorQueueExport } from './FloorQueueExport.tsx';

interface CapacityAllocatorProps {
  summary: CohortGridSummary;
}

export function CapacityAllocator({ summary }: CapacityAllocatorProps) {
  const [totalCapacity, setTotalCapacity] = useState<number>(2000);

  const plan = useMemo(() => {
    return optimizeFloorCapacity(summary, { totalCapacity });
  }, [summary, totalCapacity]);

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
      {/* Header with Capacity Slider */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Floor Capacity Allocation Optimizer (2,000-Call Daily Budget)
            </h3>
          </div>
          <p className="text-3xs text-slate-500 font-medium mt-0.5">
            Algorithmic linear optimization maximizing Expected Recoverable Amount (ERA)
          </p>
        </div>

        {/* Capacity Slider */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <Sliders className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-2xs font-bold text-slate-700">Floor Capacity:</span>
          <span className="font-mono font-black text-xs text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
            {formatIndianNumber(totalCapacity)} Calls
          </span>
          <input
            type="range"
            min="500"
            max="5000"
            step="100"
            value={totalCapacity}
            onChange={(e) => setTotalCapacity(Number(e.target.value))}
            className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 ml-1"
          />
        </div>
      </div>

      {/* High-Level Outcome Banner: Expected Recoverable Yield */}
      <div className="p-3.5 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl text-white flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="text-3xs font-bold uppercase tracking-wider text-blue-300">
            Total Expected Recoverable Yield (ERA) Today
          </div>
          <div className="text-xl font-black text-white tabular-nums tracking-tight mt-0.5">
            {formatIndianCurrency(plan.totalExpectedRecoveryYield, { compact: false })}
            <span className="text-xs font-semibold text-blue-200 ml-2">
              ({formatIndianCurrency(plan.totalExpectedRecoveryYield, { compact: true, decimals: 2 })})
            </span>
          </div>
          <div className="text-3xs text-blue-200 mt-0.5">
            Based on {formatIndianNumber(plan.totalAllocated)} scheduled calls across top conversion cohorts
          </div>
        </div>

        <FloorQueueExport plan={plan} />
      </div>

      {/* Cell Allocation Breakdown Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-2xs">
          <thead className="bg-slate-50 text-slate-700 font-extrabold uppercase text-3xs border-b border-slate-200">
            <tr>
              <th className="p-2.5">Target Cohort</th>
              <th className="p-2.5 text-right">Eligible Pool</th>
              <th className="p-2.5 text-right">Allocated Calls</th>
              <th className="p-2.5 text-right">Floor Share</th>
              <th className="p-2.5 text-right">Expected Conv. Rate</th>
              <th className="p-2.5 text-right">Expected Cash Recovery</th>
              <th className="p-2.5">Floor Action Directive</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {Object.values(plan.cellAllocations).map((cell) => (
              <tr key={cell.cohort} className={cell.allocatedCalls > 0 ? 'bg-blue-50/20' : 'text-slate-400 bg-slate-50/40'}>
                <td className="p-2.5 font-bold text-slate-900">{cell.displayName}</td>
                <td className="p-2.5 text-right font-mono tabular-nums text-slate-600">
                  {formatIndianNumber(cell.totalBorrowers)}
                </td>
                <td className="p-2.5 text-right font-mono font-extrabold text-blue-700 tabular-nums">
                  {cell.allocatedCalls > 0 ? formatIndianNumber(cell.allocatedCalls) : '0 (Automated)'}
                </td>
                <td className="p-2.5 text-right font-mono font-bold tabular-nums">
                  {cell.allocationPercentage}%
                </td>
                <td className="p-2.5 text-right font-mono tabular-nums">
                  {(cell.expectedRecoveryRate * 100).toFixed(0)}%
                </td>
                <td className="p-2.5 text-right font-mono font-bold text-emerald-700 tabular-nums">
                  {cell.expectedRecoveryYield > 0 ? formatIndianCurrency(cell.expectedRecoveryYield) : '—'}
                </td>
                <td className="p-2.5 text-3xs italic text-slate-600 truncate max-w-[220px]">
                  {cell.recommendedAction}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stand-Up Floor Directives */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
        <div className="flex items-center gap-1.5 text-2xs font-extrabold text-slate-800">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Ravi's 9:15 AM Stand-Up Briefing Directives:</span>
        </div>
        <ul className="space-y-1 text-2xs text-slate-700">
          {plan.floorDirectives.map((directive, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{directive}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
