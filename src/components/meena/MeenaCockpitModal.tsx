import React, { useState } from 'react';
import { X, Headset, Calculator, FileText } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore.ts';
import { useBorrowerScore } from '../../hooks/useBorrowerScore.ts';
import { HeroSnapshot } from './HeroSnapshot.tsx';
import { AllowedActionCard } from './AllowedActionCard.tsx';
import { FactorImpactWaterfall } from './FactorImpactWaterfall.tsx';
import { WhatIfSimulator } from './WhatIfSimulator.tsx';
import { COHORT_DEFINITIONS } from '../../domain/constants.ts';
import { ErrorBoundary } from '../common/ErrorBoundary.tsx';

export function MeenaCockpitModal() {
  const { selectedBorrower, isCockpitOpen, closeCockpit } = useAppStore();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SIMULATOR'>('OVERVIEW');

  const { data: scoreData, isLoading, isError } = useBorrowerScore(selectedBorrower);

  if (!isCockpitOpen || !selectedBorrower) return null;

  const cohortMeta = COHORT_DEFINITIONS[
    (scoreData?.cohort || selectedBorrower.cohort) as keyof typeof COHORT_DEFINITIONS
  ] || {
    displayName: selectedBorrower.cohort,
    operationalChannel: 'Telecaller',
    policyConstraints: {
      maxGraceDays: 3,
      allowOTS: false,
      allowRestructure: true,
      allowDigitalLink: true
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-slate-100 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-300 relative flex flex-col my-auto">
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Headset className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                  Meena's Telecaller Cockpit
                </h3>
                <span className="text-3xs font-extrabold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                  10-Second Cognitive Budget
                </span>
              </div>
              <p className="text-3xs text-slate-500 font-medium">
                Live Borrower Diagnostic, Factor Explainability & Negotiation Simulator
              </p>
            </div>
          </div>

          {/* Tab Switcher & Close button */}
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setActiveTab('OVERVIEW')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'OVERVIEW'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Diagnostic Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('SIMULATOR')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'SIMULATOR'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>PTP What-If Simulator</span>
              </button>
            </div>

            <button
              onClick={closeCockpit}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              title="Close Cockpit (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="p-4 sm:p-5 space-y-4">
          <ErrorBoundary fallbackTitle="Cockpit Error">
            {/* 1. Hero 3-Second Borrower Snapshot */}
            <HeroSnapshot borrower={selectedBorrower} scoreData={scoreData} />

            {/* 2. Content based on Active Tab */}
            {isLoading ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
                <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto" />
                <p className="text-xs font-semibold text-slate-700">Loading Borrower Scorecard & Factor Diagnostic...</p>
                <p className="text-3xs text-slate-400">Fetching 13 explainability factors from scoring model</p>
              </div>
            ) : activeTab === 'OVERVIEW' ? (
              <div className="space-y-4">
                {/* Allowed Negotiation Actions & Speakable Script */}
                <AllowedActionCard
                  meta={cohortMeta}
                  agentCallScript={scoreData?.agentCallScript}
                  borrowerName={selectedBorrower.memberName}
                  outstandingAmount={selectedBorrower.outstandingPrincipal}
                />

                {/* 13-Factor Impact Waterfall */}
                <FactorImpactWaterfall
                  abilityFactors={scoreData?.factorBreakdown?.ability || []}
                  intentFactors={scoreData?.factorBreakdown?.intent || []}
                />
              </div>
            ) : (
              <div className="space-y-4">
                {scoreData && (
                  <WhatIfSimulator
                    borrower={selectedBorrower}
                    scoreData={scoreData}
                  />
                )}
              </div>
            )}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
