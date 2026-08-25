import React, { useRef } from 'react';
import { Header } from './components/layout/Header.tsx';
import { NineBoxGrid } from './components/grid/NineBoxGrid.tsx';
import { VirtualBorrowerTable } from './components/list/VirtualBorrowerTable.tsx';
import { MeenaCockpitModal } from './components/meena/MeenaCockpitModal.tsx';
import { FloorDirectorDeck } from './components/ravi/FloorDirectorDeck.tsx';
import { StatMetric } from './components/common/StatMetric.tsx';
import { useCohortSummary } from './hooks/useCohortSummary.ts';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation.ts';
import { useAppStore } from './store/useAppStore.ts';
import { formatIndianCurrency, formatIndianNumber } from './domain/indianNumber.ts';
import { Users, IndianRupee, ShieldAlert, Target } from 'lucide-react';
import { COHORT_DEFINITIONS } from './domain/constants.ts';

export function App() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { data: summaryData } = useCohortSummary();
  const { selectedCohort, persona } = useAppStore();

  useKeyboardNavigation(() => {
    searchInputRef.current?.focus();
  });

  const activeCohortMeta = COHORT_DEFINITIONS[selectedCohort];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Navigation & Status Bar */}
      <Header />

      {/* Main Operations Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 space-y-3">
        {/* Operations Pulse / KPI Highlights */}
        <section aria-label="Portfolio Metrics" className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <StatMetric
            label="Total Delinquent Book"
            value={formatIndianNumber(summaryData?.totalBorrowers || 25000)}
            subValue="accounts"
            icon={<Users className="w-4 h-4" />}
          />
          <StatMetric
            label="Total Portfolio at Risk"
            value={formatIndianCurrency(summaryData?.totalPortfolioOutstanding || 633520000, {
              compact: true,
              decimals: 2
            })}
            subValue="Principal"
            icon={<IndianRupee className="w-4 h-4" />}
          />
          <StatMetric
            label="High-Leverage Segment"
            value={formatIndianNumber(
              (summaryData?.grid?.MED_ABILITY?.MED_INTENT?.count || 5480) +
              (summaryData?.grid?.MED_ABILITY?.HIGH_INTENT?.count || 3890)
            )}
            subValue="Fence & Cashflow"
            trend="up"
            trendLabel="Primary Calling Focus"
            highlight={true}
            icon={<Target className="w-4 h-4 text-blue-600" />}
          />
          <StatMetric
            label="Selected Grid Cell"
            value={activeCohortMeta?.displayName || 'Fence-Sitter'}
            subValue={activeCohortMeta?.routingLane.replace('_', ' ')}
            icon={<ShieldAlert className="w-4 h-4 text-amber-500" />}
          />
        </section>

        {/* Section 2.5: Ravi's 4-Minute Morning Floor Director (Rendered for Floor Lead persona) */}
        {persona === 'RAVI' && (
          <section aria-label="Floor Strategy & Capacity Allocator">
            <FloorDirectorDeck />
          </section>
        )}

        {/* Section 2.1: The 3x3 Nine-Box Grid */}
        <section aria-label="3x3 Ability x Intent Matrix">
          <NineBoxGrid />
        </section>

        {/* Section 2.2: High-Performance Virtualized Drill-Down Table */}
        <section aria-label="Borrower Calling Queue">
          <VirtualBorrowerTable />
        </section>
      </main>

      {/* Section 2.3 & 2.4: Meena's 10-Second Telecaller Cockpit Modal */}
      <MeenaCockpitModal />

      {/* Operational Footer */}
      <footer className="py-2 px-4 border-t border-slate-200 bg-white text-2xs text-slate-500 flex flex-wrap items-center justify-between">
        <span>SaralCollect Command Centre &copy; 2026 Saralya NBFC Operations</span>
        <div className="flex items-center gap-3">
          <span>Active Persona: <strong className="text-slate-800 font-bold">{persona}</strong></span>
          <span>•</span>
          <span>Resolution: <strong className="text-slate-800 font-bold">1366x768 Optimized</strong></span>
        </div>
      </footer>
    </div>
  );
}
export default App;
