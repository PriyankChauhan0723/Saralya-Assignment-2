import React, { useState, useEffect } from 'react';
import { BarChart3, Activity, Target, Smartphone } from 'lucide-react';
import { useCohortSummary } from '../../hooks/useCohortSummary.ts';
import { DataConnector } from '../../api/connector.ts';
import { DayOverDayDriftSummary } from '../../domain/types.ts';
import { DayOverDayDrift } from './DayOverDayDrift.tsx';
import { CapacityAllocator } from './CapacityAllocator.tsx';
import { ExecutiveMobilePulse } from './ExecutiveMobilePulse.tsx';
import { ErrorBoundary } from '../common/ErrorBoundary.tsx';

export function FloorDirectorDeck() {
  const { data: summaryData } = useCohortSummary();
  const [activeTab, setActiveTab] = useState<'CAPACITY' | 'DRIFT' | 'MOBILE'>('CAPACITY');
  const [driftData, setDriftData] = useState<DayOverDayDriftSummary | null>(null);

  useEffect(() => {
    DataConnector.getDailyDrift().then(setDriftData);
  }, []);

  if (!summaryData) return null;

  return (
    <ErrorBoundary fallbackTitle="Floor Director Error">
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-xl space-y-4">
        {/* Banner Header: 4-Minute Morning Command */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-500/40 text-blue-400 font-black flex items-center justify-center text-sm shadow-inner">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                  Ravi's 4-Minute Morning Floor Director
                </h2>
                <span className="text-3xs font-extrabold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/30">
                  9:15 AM Stand-Up Engine
                </span>
              </div>
              <p className="text-3xs text-slate-400 font-medium">
                Answered in &lt;4 minutes: "What changed since yesterday, and where do I point the 2,000-call floor today?"
              </p>
            </div>
          </div>

          {/* Sub-navigation tabs */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveTab('CAPACITY')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                activeTab === 'CAPACITY'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>2,000 Capacity Allocator</span>
            </button>

            <button
              onClick={() => setActiveTab('DRIFT')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                activeTab === 'DRIFT'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Overnight Drift Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('MOBILE')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                activeTab === 'MOBILE'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Pulse View</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="pt-1">
          {activeTab === 'CAPACITY' && (
            <CapacityAllocator summary={summaryData} />
          )}

          {activeTab === 'DRIFT' && driftData && (
            <DayOverDayDrift driftData={driftData} />
          )}

          {activeTab === 'MOBILE' && driftData && (
            <ExecutiveMobilePulse summary={summaryData} driftData={driftData} />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
