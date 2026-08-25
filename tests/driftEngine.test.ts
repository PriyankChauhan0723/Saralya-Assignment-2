import { describe, it, expect } from 'vitest';
import { DataConnector } from '../src/api/connector.ts';

describe('Day-over-Day Drift & Inflow/Outflow Engine (Section 2.5)', () => {
  it('should load overnight drift records with net risk classifications', async () => {
    const drift = await DataConnector.getDailyDrift();

    expect(drift.snapshotDate).toBeDefined();
    expect(drift.totalPortfolioCount).toBe(25000);
    expect(drift.overnightNetDeteriorated).toBeGreaterThan(0);
    expect(drift.cohorts.length).toBe(9);

    const fenceSitter = drift.cohorts.find(c => c.cohort === 'FENCE_SITTER');
    expect(fenceSitter).toBeDefined();
    expect(fenceSitter?.countDelta).toBe(90);
    expect(fenceSitter?.netRiskShift).toBe('DETERIORATED');
  });
});
