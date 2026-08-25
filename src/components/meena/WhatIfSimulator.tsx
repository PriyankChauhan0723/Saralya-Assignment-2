import React, { useState, useEffect } from 'react';
import { Borrower, BorrowerScore, ScoreSimulationResult, CohortType } from '../../domain/types.ts';
import { DataConnector } from '../../api/connector.ts';
import { TrajectoryVector } from './TrajectoryVector.tsx';
import { Calculator, RotateCcw, Check } from 'lucide-react';
import { formatIndianCurrency } from '../../domain/indianNumber.ts';

interface WhatIfSimulatorProps {
  borrower: Borrower;
  scoreData: BorrowerScore;
}

export function WhatIfSimulator({ borrower, scoreData }: WhatIfSimulatorProps) {
  const maxPayment = Math.max(1000, Number(borrower.outstandingPrincipal || 50000));
  const initialPayment = Math.min(5000, Math.max(500, Math.round((borrower.outstandingPrincipal || 10000) * 0.15)));

  const [paymentAmount, setPaymentAmount] = useState<number>(initialPayment);
  const [ptpDays, setPtpDays] = useState<number>(3);
  const [contactabilityConfirmed, setContactabilityConfirmed] = useState<boolean>(borrower.isValidMobile ?? true);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<ScoreSimulationResult | null>(null);

  // Trigger simulation whenever inputs change
  useEffect(() => {
    let isMounted = true;

    async function runSimulation() {
      setIsSimulating(true);
      try {
        const overrides = {
          last_coll_amount: paymentAmount,
          payment: paymentAmount,
          od_days: Math.max(0, Number(borrower.odDays || 0) - (paymentAmount > 0 ? 10 : 0)),
          ptp_days: ptpDays,
          is_valid_mobile: contactabilityConfirmed
        };

        const result = await DataConnector.simulateScore(
          borrower.loanNo,
          overrides,
          scoreData
        );

        if (isMounted) {
          setSimResult(result.data);
        }
      } catch (err) {
        console.error('Simulation calculation failed:', err);
      } finally {
        if (isMounted) setIsSimulating(false);
      }
    }

    const timer = setTimeout(runSimulation, 150); // Fast 150ms debounce
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [paymentAmount, ptpDays, contactabilityConfirmed, borrower, scoreData]);

  const handleReset = () => {
    setPaymentAmount(0);
    setPtpDays(0);
    setContactabilityConfirmed(borrower.isValidMobile);
  };

  const currentCohort = (scoreData?.cohort || borrower.cohort) as CohortType;
  const simulatedCohort = (simResult?.simulated?.cohort || currentCohort) as CohortType;

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Real-Time PTP Negotiation Simulator (What-If Calculator)
          </h3>
        </div>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-2xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Sliders</span>
        </button>
      </div>

      {/* Simulator Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Control 1: Immediate Token Payment Amount (₹) */}
        <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-2xs">
            <span className="font-bold text-slate-700">Immediate Token Payment</span>
            <span className="font-mono font-black text-xs text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
              {formatIndianCurrency(paymentAmount, { compact: false })}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={maxPayment}
            step="500"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-3xs text-slate-400 font-semibold">
            <span>₹0</span>
            <span>{formatIndianCurrency(Math.round(maxPayment * 0.25))}</span>
            <span>{formatIndianCurrency(Math.round(maxPayment * 0.5))}</span>
            <span>{formatIndianCurrency(maxPayment)}</span>
          </div>
        </div>

        {/* Control 2: Promise to Pay (PTP) Commitment Horizon */}
        <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-2xs">
            <span className="font-bold text-slate-700">PTP Commitment Date</span>
            <span className="font-mono font-black text-xs text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded">
              {ptpDays === 0 ? 'Today' : `Within ${ptpDays} Days`}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="14"
            step="1"
            value={ptpDays}
            onChange={(e) => setPtpDays(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-3xs text-slate-400 font-semibold">
            <span>Today (0d)</span>
            <span>3 Days</span>
            <span>7 Days</span>
            <span>14 Days</span>
          </div>
        </div>

        {/* Control 3: Verified Contactability */}
        <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="font-bold text-xs text-slate-800">Confirmed Phone Contact</div>
            <p className="text-3xs text-slate-500 mt-0.5">
              Borrower answered primary SIM and verified household presence.
            </p>
          </div>
          <button
            onClick={() => setContactabilityConfirmed(!contactabilityConfirmed)}
            className={`w-full py-1.5 px-3 rounded-lg text-2xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
              contactabilityConfirmed
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            <Check className={`w-3.5 h-3.5 ${contactabilityConfirmed ? 'opacity-100' : 'opacity-40'}`} />
            <span>{contactabilityConfirmed ? 'Contact Verified (+Intent)' : 'Mark Contact Unverified'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Trajectory Output Component */}
      <TrajectoryVector
        baselineCohort={currentCohort}
        simulatedCohort={simulatedCohort}
        deltaAbility={simResult?.deltas?.deltaAbility ?? 0}
        deltaIntent={simResult?.deltas?.deltaIntent ?? 0}
        simulationSummary={simResult?.simulationSummary}
      />
    </div>
  );
}
