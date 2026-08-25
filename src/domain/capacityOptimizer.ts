import { CohortType, RoutingLane, CapacityAllocationPlan, CohortGridSummary } from './types.ts';
import { COHORT_DEFINITIONS } from './constants.ts';

/**
 * Capacity Optimizer Algorithm for Collections Floor Management
 * 
 * Objective: Maximize Expected Recoverable Amount (ERA) subject to Daily Capacity Constraint (C = 2,000 calls)
 * ERA = sum(AllocatedCalls_j * AverageBalance_j * ExpectedConversionRate_j)
 * 
 * Operational Heuristics:
 * 1. Rule-based cohorts (Oops, Procrastinator) have high digital touch; Procrastinator receives ~20% of calls.
 * 2. High-leverage ML cohorts (Fence-Sitter, Cashflow Crunch) receive peak telecalling leverage (~70% combined).
 * 3. High-friction/Legal cohorts (Wilful Defaulter, Lost Cause) are routed to Field/Settlement Desks with minimal telecaller allocation.
 */

export interface OptimizeCapacityOptions {
  totalCapacity?: number;
  customWeights?: Partial<Record<CohortType, number>>;
}

const HISTORICAL_CONVERSION_RATES: Record<CohortType, number> = {
  [CohortType.OOPS]: 0.90,              // High willingness; mainly digital reminder
  [CohortType.PROCRASTINATOR]: 0.72,    // High ability + phone nudge = high conversion
  [CohortType.WILFUL_DEFAULTER]: 0.15,  // Low willingness; requires legal/field enforcement
  [CohortType.CASHFLOW_CRUNCH]: 0.68,   // High willingness; converts well with grace period
  [CohortType.FENCE_SITTER]: 0.58,      // Medium willingness; primary telecaller target
  [CohortType.EVASION_RISK]: 0.25,      // Moderate ability but evasive; field visit favored
  [CohortType.DISTRESSED]: 0.40,        // Needs tenure restructuring
  [CohortType.STRUGGLER]: 0.32,         // Needs token installment plan
  [CohortType.LOST_CAUSE]: 0.08         // Settlement desk / write-off candidate
};

const DEFAULT_ALLOCATION_WEIGHTS: Record<CohortType, number> = {
  [CohortType.FENCE_SITTER]: 0.45,      // 45% (900 calls) - Highest ROI on agent minute
  [CohortType.CASHFLOW_CRUNCH]: 0.25,   // 25% (500 calls) - High conversion with split EMI
  [CohortType.PROCRASTINATOR]: 0.20,    // 20% (400 calls) - Quick deadline calls
  [CohortType.STRUGGLER]: 0.05,         // 5% (100 calls) - Token plan negotiation
  [CohortType.DISTRESSED]: 0.03,        // 3% (60 calls) - Restructure qualification
  [CohortType.EVASION_RISK]: 0.02,      // 2% (40 calls) - Telephonic pre-escalation
  [CohortType.OOPS]: 0.00,              // 0% - 100% Automated WhatsApp/SMS
  [CohortType.WILFUL_DEFAULTER]: 0.00,  // 0% - Handed to Legal Desk
  [CohortType.LOST_CAUSE]: 0.00         // 0% - Handed to OTS Desk
};

export function optimizeFloorCapacity(
  summary: CohortGridSummary,
  options: OptimizeCapacityOptions = {}
): CapacityAllocationPlan {
  const totalCapacity = options.totalCapacity ?? 2000;
  const weights = { ...DEFAULT_ALLOCATION_WEIGHTS, ...options.customWeights };

  // Normalize weights
  const totalWeight = Object.values(weights).reduce((acc, w) => acc + w, 0) || 1;
  const normalizedWeights: Record<CohortType, number> = {} as any;
  for (const c of Object.keys(weights) as CohortType[]) {
    normalizedWeights[c] = (weights[c] || 0) / totalWeight;
  }

  // Flatten grid summaries defensively
  const cellMap: Record<CohortType, { count: number; totalOutstanding: number }> = {
    [CohortType.WILFUL_DEFAULTER]: summary?.grid?.HIGH_ABILITY?.LOW_INTENT || { count: 0, totalOutstanding: 0 },
    [CohortType.PROCRASTINATOR]: summary?.grid?.HIGH_ABILITY?.MED_INTENT || { count: 0, totalOutstanding: 0 },
    [CohortType.OOPS]: summary?.grid?.HIGH_ABILITY?.HIGH_INTENT || { count: 0, totalOutstanding: 0 },
    [CohortType.EVASION_RISK]: summary?.grid?.MED_ABILITY?.LOW_INTENT || { count: 0, totalOutstanding: 0 },
    [CohortType.FENCE_SITTER]: summary?.grid?.MED_ABILITY?.MED_INTENT || { count: 0, totalOutstanding: 0 },
    [CohortType.CASHFLOW_CRUNCH]: summary?.grid?.MED_ABILITY?.HIGH_INTENT || { count: 0, totalOutstanding: 0 },
    [CohortType.LOST_CAUSE]: summary?.grid?.LOW_ABILITY?.LOW_INTENT || { count: 0, totalOutstanding: 0 },
    [CohortType.STRUGGLER]: summary?.grid?.LOW_ABILITY?.MED_INTENT || { count: 0, totalOutstanding: 0 },
    [CohortType.DISTRESSED]: summary?.grid?.LOW_ABILITY?.HIGH_INTENT || { count: 0, totalOutstanding: 0 }
  };

  const cellAllocations: Record<CohortType, any> = {} as any;
  let totalAllocated = 0;
  let totalExpectedRecoveryYield = 0;

  for (const cohort of Object.values(CohortType)) {
    const meta = COHORT_DEFINITIONS[cohort];
    const data = cellMap[cohort] || { count: 0, totalOutstanding: 0 };
    const count = Number(data.count || 0);
    const totalOutstanding = Number(data.totalOutstanding || 0);
    const avgBalance = count > 0 ? totalOutstanding / count : 25000;
    const weight = normalizedWeights[cohort] || 0;

    // Allocated calls cannot exceed total eligible borrowers
    const theoreticalCalls = Math.round(totalCapacity * weight);
    const allocatedCalls = Math.min(count, theoreticalCalls);
    const allocationPercentage = totalCapacity > 0 ? Number(((allocatedCalls / totalCapacity) * 100).toFixed(1)) : 0;

    const conversionRate = HISTORICAL_CONVERSION_RATES[cohort] || 0.3;
    const expectedRecoveryYield = Math.round(allocatedCalls * avgBalance * conversionRate);

    totalAllocated += allocatedCalls;
    totalExpectedRecoveryYield += expectedRecoveryYield;

    cellAllocations[cohort] = {
      cohort,
      displayName: meta?.displayName || cohort,
      routingLane: meta?.routingLane || RoutingLane.RULE_BASED,
      totalBorrowers: count,
      allocatedCalls,
      allocationPercentage,
      expectedRecoveryRate: conversionRate,
      expectedRecoveryYield,
      recommendedAction: meta?.recommendedAction || 'Follow standard SOP'
    };
  }

  const fenceCalls = cellAllocations[CohortType.FENCE_SITTER]?.allocatedCalls ?? 0;
  const cashflowCalls = cellAllocations[CohortType.CASHFLOW_CRUNCH]?.allocatedCalls ?? 0;
  const procrCalls = cellAllocations[CohortType.PROCRASTINATOR]?.allocatedCalls ?? 0;
  const oopsCount = cellMap[CohortType.OOPS]?.count ?? 0;
  const wilfulCount = cellMap[CohortType.WILFUL_DEFAULTER]?.count ?? 0;

  const floorDirectives = [
    `Point 45% of Floor Capacity (${fenceCalls} calls) to Fence-Sitters for immediate UPI conversion.`,
    `Deploy 25% of Capacity (${cashflowCalls} calls) to Cashflow Crunch borrowers with 3-7 day split EMI offers.`,
    `Assign 20% of Capacity (${procrCalls} calls) to Procrastinators with firm 48-hour payment deadlines.`,
    `Route all ${oopsCount} "Oops" accounts to automated WhatsApp payment links (Zero agent minutes burned).`,
    `Escalate ${wilfulCount} "Wilful Defaulters" directly to Legal / Field Verification.`
  ];

  return {
    totalCapacity,
    totalAllocated,
    totalExpectedRecoveryYield,
    cellAllocations,
    floorDirectives
  };
}
