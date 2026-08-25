import React, { useState } from 'react';
import { FactorContribution } from '../../domain/types.ts';
import { TrendingUp, TrendingDown, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FactorImpactWaterfallProps {
  abilityFactors: FactorContribution[];
  intentFactors: FactorContribution[];
}

export function FactorImpactWaterfall({
  abilityFactors = [],
  intentFactors = []
}: FactorImpactWaterfallProps) {
  const [showAllFactors, setShowAllFactors] = useState(false);

  // Merge all 13 factors
  const allFactors = [...abilityFactors, ...intentFactors];

  // Separate missing vs observed
  const missingFactors = allFactors.filter((f) => f.isMissing || f.normalizedScore === null);
  const observedFactors = allFactors.filter((f) => !f.isMissing && f.normalizedScore !== null);

  // Compute impact magnitude: (Score - 50) * weight
  const factorsWithImpact = observedFactors.map((f) => {
    const score = f.normalizedScore ?? 50;
    const weight = Number(f.weight || 0.2);
    const impact = (score - 50) * weight;
    return {
      ...f,
      impact,
      isPositive: impact >= 0
    };
  });

  // Top positive drivers
  const positiveDrivers = [...factorsWithImpact]
    .filter((f) => f.isPositive)
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 3);

  // Top negative inhibitors
  const negativeInhibitors = [...factorsWithImpact]
    .filter((f) => !f.isPositive)
    .sort((a, b) => a.impact - b.impact)
    .slice(0, 3);

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Cohort Drivers & Inhibitors (10-Second Factor Impact)
          </h3>
        </div>
        <span className="text-3xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border">
          Ranked by |Impact|
        </span>
      </div>

      {/* Grid: Positive Drivers vs Negative Inhibitors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Positive Drivers Column */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-2xs font-extrabold text-emerald-800">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Top Score Drivers (Why they can repay)</span>
          </div>

          {positiveDrivers.length === 0 ? (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-3xs text-slate-500 italic">
              No significant positive factors identified for this profile.
            </div>
          ) : (
            positiveDrivers.map((driver) => (
              <div
                key={driver.factor}
                className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 shadow-2xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-950 truncate max-w-[200px]">
                    {driver.factorDisplayName}
                  </span>
                  <span className="font-mono text-2xs font-black text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                    Score: {driver.normalizedScore}/100
                  </span>
                </div>
                <p className="text-2xs text-emerald-900 font-medium leading-tight">
                  "{driver.agentExplanation}"
                </p>
                <div className="flex items-center justify-between text-3xs text-emerald-700 pt-0.5">
                  <span>Weight: {(driver.weight * 100).toFixed(0)}%</span>
                  <span className="font-semibold tabular-nums">+{driver.impact.toFixed(1)} impact pts</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Negative Inhibitors Column */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-2xs font-extrabold text-rose-800">
            <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
            <span>Top Score Inhibitors (What is holding them back)</span>
          </div>

          {negativeInhibitors.length === 0 ? (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-3xs text-slate-500 italic">
              No negative inhibitors dragging down this account.
            </div>
          ) : (
            negativeInhibitors.map((inhibitor) => (
              <div
                key={inhibitor.factor}
                className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/80 shadow-2xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-rose-950 truncate max-w-[200px]">
                    {inhibitor.factorDisplayName}
                  </span>
                  <span className="font-mono text-2xs font-black text-rose-700 bg-rose-100/80 px-1.5 py-0.5 rounded">
                    Score: {inhibitor.normalizedScore}/100
                  </span>
                </div>
                <p className="text-2xs text-rose-900 font-medium leading-tight">
                  "{inhibitor.agentExplanation}"
                </p>
                <div className="flex items-center justify-between text-3xs text-rose-700 pt-0.5">
                  <span>Weight: {(inhibitor.weight * 100).toFixed(0)}%</span>
                  <span className="font-semibold tabular-nums">{inhibitor.impact.toFixed(1)} impact pts</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Honest Handling of Missing / Unobserved Data */}
      {missingFactors.length > 0 && (
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-2xs font-bold text-slate-600 mb-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Unobserved / Missing Bureau Records ({missingFactors.length} Factors)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {missingFactors.map((f) => (
              <div
                key={f.factor}
                className="p-2 rounded-lg bg-slate-50 border border-dashed border-slate-300 text-2xs space-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 truncate">{f.factorDisplayName}</span>
                  <span className="text-3xs font-mono font-bold bg-slate-200 text-slate-600 px-1 rounded">
                    Unobserved
                  </span>
                </div>
                <p className="text-3xs text-slate-500">
                  {f.agentExplanation || 'No history recorded. Standard median baseline applied without penalty.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collapsible View for All 13 Factors (Operations Transparency) */}
      <div className="pt-1 flex justify-center">
        <button
          onClick={() => setShowAllFactors(!showAllFactors)}
          className="inline-flex items-center gap-1 text-2xs font-bold text-blue-600 hover:text-blue-800"
        >
          <span>{showAllFactors ? 'Hide Full 13-Factor Breakdown Table' : 'Inspect Full 13-Factor Breakdown Table'}</span>
          {showAllFactors ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {showAllFactors && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 text-2xs pt-2">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-3xs border-b border-slate-200">
              <tr>
                <th className="p-2">Factor</th>
                <th className="p-2">Raw Value</th>
                <th className="p-2">Score (0-100)</th>
                <th className="p-2">Weight</th>
                <th className="p-2">Agent Call Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {allFactors.map((factor) => (
                <tr key={factor.factor} className={factor.isMissing ? 'bg-slate-50/70 text-slate-500' : ''}>
                  <td className="p-2 font-bold">{factor.factorDisplayName}</td>
                  <td className="p-2 font-mono">{factor.rawValue !== null ? String(factor.rawValue) : 'N/A'}</td>
                  <td className="p-2 font-mono font-bold">
                    {factor.isMissing ? '— (Median)' : factor.normalizedScore}
                  </td>
                  <td className="p-2 font-mono">{(factor.weight * 100).toFixed(0)}%</td>
                  <td className="p-2 italic">{factor.agentExplanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
