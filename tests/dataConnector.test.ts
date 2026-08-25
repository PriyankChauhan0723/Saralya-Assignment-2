import { describe, it, expect } from 'vitest';
import { DataConnector } from '../src/api/connector.ts';

describe('Data Connector Resilience & Fixture Failover Suite', () => {
  it('should retrieve 3x3 grid summary in fixture mode', async () => {
    DataConnector.setForceFixtureMode(true);
    const res = await DataConnector.getCohortSummary();

    expect(res.isFixture).toBe(true);
    expect(res.data.totalBorrowers).toBe(25000);
    expect(res.data.grid.HIGH_ABILITY.HIGH_INTENT.cohort).toBe('OOPS');
  });

  it('should retrieve paginated borrowers for any selected cohort', async () => {
    const res = await DataConnector.getCohortBorrowers('FENCE_SITTER', { page: 1, limit: 10 });

    expect(res.data.items.length).toBeGreaterThan(0);
    expect(res.data.pagination.page).toBe(1);
    expect(res.data.pagination.limit).toBe(10);
  });
});
