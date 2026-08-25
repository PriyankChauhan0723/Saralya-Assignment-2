import React from 'react';
import { DayOverDayDriftSummary, CohortDriftRecord } from '../../domain/types.ts';
import { formatIndianNumber } from '../../domain/indianNumber.ts';
import { TrendingDown, TrendingUp, AlertTriangle, Activity } from 'lucide-react';

interface DayOverDayDriftProps {
  driftData: DayOverDayDriftSummary;
}

export function DayOverDayDrift({ driftData }: DayOverDayDriftProps) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Day-over-Day Portfolio Drift & Cohort Migration Matrix
          </h3>
        </div>
        <span className="text-3xs font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
          Comparing Today 09:00 vs Yesterday Close
        </span>
      </div>

      {/* Top 3 Drift Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200/80">
          <div className="flex items-center justify-between text-3xs font-bold uppercase text-rose-700">
            <span>Net Risk Deteriorated</span>
            <TrendingDown className="w-3.5 h-3.5" />
          </div>
          <div className="text-base font-black text-rose-950 tabular-nums mt-0.5">
            +{formatIndianNumber(driftData.overnightNetDeteriorated)} accounts
          </div>
          <div className="text-3xs text-rose-700 mt-0.5">Migrated to lower intent/ability</div>
        </div>

        <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/80">
          <div className="flex items-center justify-between text-3xs font-bold uppercase text-emerald-700">
            <span>Net Cured / Repaired</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div className="text-base font-black text-emerald-950 tabular-nums mt-0.5">
            -{formatIndianNumber(driftData.overnightNetRepaired)} accounts
          </div>
          <div className="text-3xs text-emerald-700 mt-0.5">Recovered or closed arrears</div>
        </div>

        <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80">
          <div className="flex items-center justify-between text-3xs font-bold uppercase text-amber-700">
            <span>Top Attention Cohort</span>
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="text-base font-black text-amber-950 truncate mt-0.5">
            {driftData.topAttentionCohort.replace('_', ' ')}
          </div>
          <div className="text-3xs text-amber-700 mt-0.5">+90 new high-leverage entrants</div>
        </div>
      </div>

      {/* Migration Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-2xs">
          <thead className="bg-slate-50 text-slate-700 font-extrabold uppercase text-3xs border-b border-slate-200">
            <tr>
              <th className="p-2.5">Cohort</th>
              <th className="p-2.5 text-right">Yesterday</th>
              <th className="p-2.5 text-right">Today</th>
              <th className="p-2.5 text-right">Net Change</th>
              <th className="p-2.5 text-right">Inflow (New)</th>
              <th className="p-2.5 text-right">Outflow (Cured)</th>
              <th className="p-2.5 text-center">Overnight Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {driftData.cohorts.map((row: CohortDriftRecord) => (
              <tr key={row.cohort} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-2.5 font-bold text-slate-900">{row.displayName}</td>
                <td className="p-2.5 text-right font-mono tabular-nums text-slate-600">
                  {formatIndianNumber(row.countYesterday)}
                </td>
                <td className="p-2.5 text-right font-mono font-bold tabular-nums text-slate-900">
                  {formatIndianNumber(row.countToday)}
                </td>
                <td className={`p-2.5 text-right font-mono font-black tabular-nums ${
                  row.countDelta > 0 ? 'text-rose-600' : row.countDelta < 0 ? 'text-emerald-600' : 'text-slate-500'
                }`}>
                  {row.countDelta > 0 ? `+${row.countDelta}` : row.countDelta}
                </td>
                <td className="p-2.5 text-right font-mono text-rose-700 tabular-nums">
                  +{row.inflowCount}
                </td>
                <td className="p-2.5 text-right font-mono text-emerald-700 tabular-nums">
                  -{row.outflowCount}
                </td>
                <td className="p-2.5 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-3xs font-extrabold border ${
                    row.netRiskShift === 'DETERIORATED'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : row.netRiskShift === 'IMPROVED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {row.netRiskShift}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
