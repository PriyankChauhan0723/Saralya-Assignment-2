import React from 'react';
import { Smartphone, Zap, X } from 'lucide-react';
import { formatIndianCurrency, formatIndianNumber } from '../../domain/indianNumber.ts';
import { CohortGridSummary, DayOverDayDriftSummary } from '../../domain/types.ts';

interface ExecutiveMobilePulseProps {
  summary: CohortGridSummary;
  driftData: DayOverDayDriftSummary;
  onClose?: () => void;
}

export function ExecutiveMobilePulse({ summary, driftData, onClose }: ExecutiveMobilePulseProps) {
  return (
    <div className="bg-slate-900 text-white p-4 rounded-3xl border border-slate-800 shadow-2xl space-y-4 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
            Ravi's Mobile Pulse (From Car)
          </h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2-Minute Portfolio Pulse */}
      <div className="space-y-2">
        <div className="p-3 bg-slate-800/90 rounded-2xl border border-slate-700/80">
          <div className="text-3xs font-bold uppercase text-slate-400">Total Book at Risk</div>
          <div className="text-lg font-black text-white tabular-nums mt-0.5">
            {formatIndianCurrency(summary.totalPortfolioOutstanding, { compact: true, decimals: 2 })}
          </div>
          <div className="text-3xs text-slate-400 mt-0.5">
            {formatIndianNumber(summary.totalBorrowers)} overdue accounts
          </div>
        </div>

        {/* Overnight Drift */}
        <div className="grid grid-cols-2 gap-2 text-2xs">
          <div className="p-2.5 bg-rose-950/60 border border-rose-800/60 rounded-xl">
            <div className="text-3xs font-bold uppercase text-rose-300">Deteriorated</div>
            <div className="font-mono font-black text-rose-200 text-sm mt-0.5">
              +{driftData.overnightNetDeteriorated}
            </div>
            <div className="text-3xs text-rose-300">Overnight Drift</div>
          </div>

          <div className="p-2.5 bg-emerald-950/60 border border-emerald-800/60 rounded-xl">
            <div className="text-3xs font-bold uppercase text-emerald-300">Repaired</div>
            <div className="font-mono font-black text-emerald-200 text-sm mt-0.5">
              -{driftData.overnightNetRepaired}
            </div>
            <div className="text-3xs text-emerald-300">Cured Overdue</div>
          </div>
        </div>
      </div>

      {/* Standup Directive */}
      <div className="p-3 bg-blue-950/80 border border-blue-600/50 rounded-2xl space-y-1.5">
        <div className="flex items-center gap-1.5 text-2xs font-extrabold text-blue-300">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Floor Stand-Up Command:</span>
        </div>
        <p className="text-2xs text-blue-100 font-semibold leading-relaxed">
          "Point 45% (900 calls) to <strong>Fence-Sitters</strong> and 25% (500 calls) to <strong>Cashflow Crunch</strong>. Auto-WhatsApp all 4,120 Oops borrowers."
        </p>
      </div>
    </div>
  );
}
