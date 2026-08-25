import React from 'react';

export function GridColumnHeaders() {
  return (
    <div className="grid grid-cols-3 gap-2.5 mb-1.5 ml-14">
      <div className="text-center">
        <div className="text-2xs font-extrabold uppercase tracking-wider text-rose-700 bg-rose-50/70 border border-rose-200/80 rounded-t py-1">
          Intent: Low (&lt;40)
        </div>
      </div>
      <div className="text-center">
        <div className="text-2xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50/70 border border-amber-200/80 rounded-t py-1">
          Intent: Med (40–69)
        </div>
      </div>
      <div className="text-center">
        <div className="text-2xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50/70 border border-emerald-200/80 rounded-t py-1">
          Intent: High (&ge;70)
        </div>
      </div>
    </div>
  );
}

interface RowHeaderProps {
  band: 'HIGH' | 'MED' | 'LOW';
}

export function GridRowHeader({ band }: RowHeaderProps) {
  const configs = {
    HIGH: {
      label: 'Ability',
      sub: 'High (≥70)',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    MED: {
      label: 'Ability',
      sub: 'Med (40-69)',
      bg: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    LOW: {
      label: 'Ability',
      sub: 'Low (<40)',
      bg: 'bg-rose-50 text-rose-800 border-rose-200'
    }
  };

  const c = configs[band];

  return (
    <div
      className={`w-12 flex flex-col items-center justify-center text-center p-1 rounded-l-lg border ${c.bg} shadow-2xs`}
    >
      <span className="text-2xs font-black uppercase tracking-tighter">{c.label}</span>
      <span className="text-3xs font-semibold tabular-nums leading-tight">{c.sub}</span>
    </div>
  );
}
