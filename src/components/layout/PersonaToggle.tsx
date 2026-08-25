import React from 'react';
import { Headset, BarChart3 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore.ts';
import { PersonaType } from '../../domain/types.ts';

export function PersonaToggle() {
  const { persona, setPersona } = useAppStore();

  return (
    <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg border border-slate-300/70 text-xs font-semibold shadow-inner">
      <button
        onClick={() => setPersona('RAVI')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
          persona === 'RAVI'
            ? 'bg-white text-blue-700 shadow-xs font-bold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Ravi - Collections Manager (Macro Book Triage & Floor Direction)"
      >
        <BarChart3 className="w-3.5 h-3.5" />
        <span>Ravi (Floor Lead)</span>
      </button>

      <button
        onClick={() => setPersona('MEENA')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
          persona === 'MEENA'
            ? 'bg-white text-indigo-700 shadow-xs font-bold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Meena - Telecaller (10-Second Borrower Cockpit & Negotiation Simulator)"
      >
        <Headset className="w-3.5 h-3.5" />
        <span>Meena (Telecaller)</span>
      </button>
    </div>
  );
}
