import React from 'react';
import { Phone, PhoneOff, MapPin, CreditCard } from 'lucide-react';
import { Borrower, BorrowerScore } from '../../domain/types.ts';
import { COHORT_DEFINITIONS } from '../../domain/constants.ts';
import { formatExactRupees } from '../../domain/indianNumber.ts';
import { RoutingBadge } from '../grid/RoutingBadge.tsx';

interface HeroSnapshotProps {
  borrower: Borrower;
  scoreData?: BorrowerScore | null;
}

export function HeroSnapshot({ borrower, scoreData }: HeroSnapshotProps) {
  const meta = COHORT_DEFINITIONS[borrower.cohort as keyof typeof COHORT_DEFINITIONS] || {
    displayName: borrower.cohort,
    routingLane: 'RULE_BASED'
  };

  const abilityScore = scoreData?.abilityScore ?? borrower.abilityScore;
  const intentScore = scoreData?.intentScore ?? borrower.intentScore;

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-md border border-slate-800">
      {/* Top row: Name, Account ID, Mobile Dial Link, Cohort Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400 font-extrabold flex items-center justify-center text-sm shadow-inner">
            {borrower.memberName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white tracking-tight">
                {borrower.memberName}
              </h2>
              <span className="font-mono text-2xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                {borrower.loanNo}
              </span>
            </div>
            <div className="flex items-center gap-3 text-2xs text-slate-400 mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                {borrower.district}, {borrower.state}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-slate-500" />
                {borrower.product}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Cohort Badge & Phone dialer */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            {borrower.isValidMobile ? (
              <a
                href={`tel:${borrower.mobileNumber}`}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                title="Click to dial borrower on softphone"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{borrower.mobileNumber}</span>
              </a>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400" title="Invalid mobile number on file">
                <PhoneOff className="w-3.5 h-3.5" />
                <span>{borrower.mobileNumber} (Invalid)</span>
              </span>
            )}
          </div>

          <div className="bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700">
            <RoutingBadge lane={meta.routingLane} size="md" />
          </div>
        </div>
      </div>

      {/* Bottom KPI Grid: 10-Second Cognitive Digest */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3">
        {/* Outstanding Balance */}
        <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/60">
          <div className="text-3xs font-bold uppercase tracking-wider text-slate-400">
            Outstanding Principal
          </div>
          <div className="text-sm font-black text-white tabular-nums mt-0.5">
            {formatExactRupees(borrower.outstandingPrincipal)}
          </div>
          <div className="text-3xs text-slate-400 mt-0.5">Total overdue arrears</div>
        </div>

        {/* Days Past Due */}
        <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/60">
          <div className="text-3xs font-bold uppercase tracking-wider text-slate-400">
            Delinquency Stage
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span
              className={`text-sm font-black tabular-nums ${
                borrower.odDays <= 30
                  ? 'text-amber-400'
                  : borrower.odDays <= 60
                  ? 'text-orange-400'
                  : 'text-rose-400'
              }`}
            >
              {borrower.odDays} DPD
            </span>
            <span className="text-3xs text-slate-400 font-semibold">({borrower.odBucket})</span>
          </div>
          <div className="text-3xs text-slate-400 mt-0.5">Early warning window</div>
        </div>

        {/* Ability Score Gauge */}
        <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/60">
          <div className="flex items-center justify-between text-3xs font-bold uppercase tracking-wider text-slate-400">
            <span>Ability (Capacity)</span>
            <span
              className={`font-black ${
                abilityScore >= 70
                  ? 'text-emerald-400'
                  : abilityScore >= 40
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {abilityScore >= 70 ? 'HIGH' : abilityScore >= 40 ? 'MED' : 'LOW'}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-sm font-black text-white tabular-nums">{abilityScore}</span>
            <span className="text-3xs text-slate-500">/ 100</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-700 rounded-full mt-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                abilityScore >= 70
                  ? 'bg-emerald-500'
                  : abilityScore >= 40
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${abilityScore}%` }}
            />
          </div>
        </div>

        {/* Intent Score Gauge */}
        <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/60">
          <div className="flex items-center justify-between text-3xs font-bold uppercase tracking-wider text-slate-400">
            <span>Intent (Willingness)</span>
            <span
              className={`font-black ${
                intentScore >= 70
                  ? 'text-emerald-400'
                  : intentScore >= 40
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {intentScore >= 70 ? 'HIGH' : intentScore >= 40 ? 'MED' : 'LOW'}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-sm font-black text-white tabular-nums">{intentScore}</span>
            <span className="text-3xs text-slate-500">/ 100</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-700 rounded-full mt-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                intentScore >= 70
                  ? 'bg-emerald-500'
                  : intentScore >= 40
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${intentScore}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
