import React, { useState } from 'react';
import { HelpCircle, X, Sparkles, TrendingUp } from 'lucide-react';

export function OrderingExplainer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 text-2xs font-semibold text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 px-2 py-1 rounded-md border border-blue-200/80 transition-colors"
        title="Why this calling order? View the Recovery Velocity Priority strategy."
      >
        <Sparkles className="w-3 h-3 text-blue-600" />
        <span>Calling Order: RVP Algorithm</span>
        <HelpCircle className="w-3 h-3 text-blue-500" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Recovery Velocity Priority (RVP) Strategy
                </h3>
                <p className="text-2xs text-slate-500 font-medium">
                  The Algorithmic Calling Order Strategy for Floor Capacity Deployment
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                <p className="font-bold text-2xs uppercase tracking-wide text-amber-800 mb-0.5">
                  The Operational Dilemma
                </p>
                <p className="text-2xs">
                  Sorting purely by <strong>Outstanding Amount</strong> sends telecallers chasing high-balance "lost causes" who never convert. Sorting purely by <strong>Intent</strong> wastes calls on borrowers who would have paid anyway via WhatsApp links.
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-800 text-xs mb-1">Mathematical Formulation:</p>
                <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-2xs shadow-inner">
                  RVP = Outstanding × P(Conversion) × BoundaryTipping × Contactability × UrgencyDecay(DPD)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-2xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-0.5">1. Boundary Tipping Factor</span>
                  Prioritizes borrowers near band cut-offs (35–44 and 65–74) where a single phone call tips them into a paying cohort.
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-0.5">2. Early DPD Urgency</span>
                  Favors 1–30 and 31–60 DPD accounts to prevent roll-rates escalating past the 90+ DPD write-off horizon.
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
