import { describe, it, expect } from 'vitest';
import { optimizeFloorCapacity } from '../src/domain/capacityOptimizer.ts';
import { CohortType, CohortGridSummary } from '../src/domain/types.ts';
import summaryFixture from '../src/api/fixtures/summary.json';

describe('Ravi 2,000-Call Capacity Optimizer Suite (Section 2.5)', () => {
  const mockSummary = summaryFixture as unknown as CohortGridSummary;

  it('should allocate calls without exceeding total daily floor capacity', () => {
    const plan = optimizeFloorCapacity(mockSummary, { totalCapacity: 2000 });

    expect(plan.totalAllocated).toBeLessThanOrEqual(2000);
    expect(plan.totalCapacity).toBe(2000);
    expect(plan.totalExpectedRecoveryYield).toBeGreaterThan(10000000); // Greater than ₹1 Cr
  });

  it('should allocate peak leverage to Fence-Sitter and Cashflow Crunch cohorts', () => {
    const plan = optimizeFloorCapacity(mockSummary, { totalCapacity: 2000 });

    const fenceSitterCalls = plan.cellAllocations[CohortType.FENCE_SITTER].allocatedCalls;
    const cashflowCalls = plan.cellAllocations[CohortType.CASHFLOW_CRUNCH].allocatedCalls;

    expect(fenceSitterCalls).toBeGreaterThanOrEqual(800); // ~45%
    expect(cashflowCalls).toBeGreaterThanOrEqual(400);   // ~25%
  });

  it('should zero out telecalling capacity for automated Oops and legal Wilful Defaulter', () => {
    const plan = optimizeFloorCapacity(mockSummary, { totalCapacity: 2000 });

    expect(plan.cellAllocations[CohortType.OOPS].allocatedCalls).toBe(0);
    expect(plan.cellAllocations[CohortType.WILFUL_DEFAULTER].allocatedCalls).toBe(0);
  });
});
