import React from 'react';
import { Phone, PhoneOff, ChevronRight } from 'lucide-react';
import { Borrower } from '../../domain/types.ts';
import { formatIndianCurrency } from '../../domain/indianNumber.ts';
import { useAppStore } from '../../store/useAppStore.ts';

interface BorrowerRowProps {
  borrower: Borrower;
  rankIndex: number;
  isFocused?: boolean;
}

export function BorrowerRow({ borrower, rankIndex, isFocused = false }: BorrowerRowProps) {
  const openCockpit = useAppStore((state) => state.openCockpit);

  return (
    <div
      onClick={() => openCockpit(borrower)}
      className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer select-none text-xs ${
        isFocused
          ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-500/20 shadow-sm'
          : 'bg-white border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/40 shadow-2xs'
      }`}
      role="row"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openCockpit(borrower);
        }
      }}
    >
      {/* Col 1: Calling Rank & Identity */}
      <div className="flex items-center gap-2.5 min-w-[200px] max-w-[240px]">
        <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-700 font-mono font-black text-2xs flex items-center justify-center border border-slate-200 transition-colors">
          #{rankIndex}
        </div>
        <div className="min-w-0">
          <div className="font-bold text-slate-900 truncate tracking-tight group-hover:text-blue-600">
            {borrower.memberName}
          </div>
          <div className="text-3xs font-mono text-slate-500 flex items-center gap-1.5 mt-0.5">
            <span>{borrower.loanNo}</span>
            {borrower.isValidMobile ? (
              <span className="text-emerald-600 flex items-center gap-0.5" title="Valid mobile number">
                <Phone className="w-2.5 h-2.5" />
              </span>
            ) : (
              <span className="text-amber-600 flex items-center gap-0.5" title="Unreachable / invalid mobile">
                <PhoneOff className="w-2.5 h-2.5" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Col 2: Region & Product */}
      <div className="hidden sm:block min-w-[140px]">
        <div className="text-2xs font-semibold text-slate-800 truncate">
          {borrower.district}, {borrower.state}
        </div>
        <div className="text-3xs text-slate-500 truncate mt-0.5">
          {borrower.product}
        </div>
      </div>

      {/* Col 3: DPD & Delinquency Bucket */}
      <div className="min-w-[90px] text-center">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-3xs font-extrabold border ${
            borrower.odDays <= 30
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : borrower.odDays <= 60
              ? 'bg-orange-50 text-orange-800 border-orange-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {borrower.odDays} DPD
        </span>
      </div>

      {/* Col 4: Outstanding Principal */}
      <div className="min-w-[100px] text-right">
        <div className="font-black text-slate-900 tabular-nums">
          {formatIndianCurrency(borrower.outstandingPrincipal, { compact: false })}
        </div>
        <div className="text-3xs text-slate-400 font-medium">Principal Balance</div>
      </div>

      {/* Col 5: Scores (Ability & Intent) */}
      <div className="hidden md:flex items-center gap-2 min-w-[130px] justify-end">
        <div className="text-right">
          <div className="text-3xs font-bold text-slate-500 uppercase">Ability</div>
          <div className="font-mono font-extrabold text-xs text-slate-800 tabular-nums">
            {borrower.abilityScore}/100
          </div>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div className="text-left">
          <div className="text-3xs font-bold text-slate-500 uppercase">Intent</div>
          <div className="font-mono font-extrabold text-xs text-slate-800 tabular-nums">
            {borrower.intentScore}/100
          </div>
        </div>
      </div>

      {/* Col 6: Action Chevron */}
      <div className="pl-2">
        <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-blue-600 group-hover:text-white text-slate-400 flex items-center justify-center border border-slate-200/80 group-hover:border-blue-700 transition-all shadow-2xs">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
