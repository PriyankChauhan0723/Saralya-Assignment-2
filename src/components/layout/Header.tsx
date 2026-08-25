import React from 'react';
import { RefreshCw } from 'lucide-react';
import { PersonaToggle } from './PersonaToggle.tsx';
import { DataSourceBadge } from './DataSourceBadge.tsx';
import { KeyboardLegend } from './KeyboardLegend.tsx';
import { useCohortSummary } from '../../hooks/useCohortSummary.ts';

export function Header() {
  const { refetch, isFetching } = useCohortSummary();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 py-2.5 shadow-xs flex items-center justify-between">
      {/* Brand & Mission Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-sm font-black text-sm">
            SC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                SaralCollect
              </span>
              <span className="text-2xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                Command Centre
              </span>
            </div>
            <p className="text-2xs text-slate-500 font-medium">
              Portfolio Collections Scoring & Frontline Floor Cockpit
            </p>
          </div>
        </div>
      </div>

      {/* Center Controls: Persona Switcher */}
      <div className="flex items-center gap-3">
        <PersonaToggle />
      </div>

      {/* Right Controls: Data Mode, Refresh, Keyboard Guide */}
      <div className="flex items-center gap-2.5">
        <DataSourceBadge />

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh Portfolio Scores & Summary"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-blue-600' : ''}`} />
        </button>

        <KeyboardLegend />
      </div>
    </header>
  );
}
