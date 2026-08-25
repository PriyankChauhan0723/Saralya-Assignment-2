import { describe, it, expect } from 'vitest';
import { DataConnector } from '../src/api/connector.ts';
import { BorrowerScore, CohortType, ScoreBand } from '../src/domain/types.ts';

describe('Meena What-If Simulation Engine & Factor Ranking', () => {
  const mockScore: BorrowerScore = {
    loanNo: 'LN-2024-TEST',
    memberName: 'Pooja Test Patel',
    abilityScore: 55,
    abilityBand: ScoreBand.MEDIUM,
    intentScore: 50,
    intentBand: ScoreBand.MEDIUM,
    cohort: CohortType.FENCE_SITTER,
    modelVersion: 'v1.2.0-logistic',
    computedAt: new Date().toISOString(),
    agentCallScript: 'Test Script',
    factorBreakdown: {
      ability: [
        {
          factor: 'foir',
          factorDisplayName: 'FOIR',
          rawValue: 0.40,
          normalizedScore: 65,
          weight: 0.35,
          contribution: 22.75,
          isMissing: false,
          agentExplanation: 'Manageable FOIR'
        }
      ],
      intent: [
        {
          factor: 'emi_bounce',
          factorDisplayName: 'Bounce History',
          rawValue: 1,
          normalizedScore: 52,
          weight: 0.30,
          contribution: 15.6,
          isMissing: false,
          agentExplanation: '1 bounce'
        }
      ]
    }
  };

  it('should calculate positive deltas when token payment is offered', async () => {
    const result = await DataConnector.simulateScore(
      'LN-2024-TEST',
      { payment: 10000 },
      mockScore
    );

    expect(result.data.simulated.abilityScore).toBeGreaterThanOrEqual(mockScore.abilityScore);
    expect(result.data.simulated.intentScore).toBeGreaterThan(mockScore.intentScore);
    expect(result.data.deltas.deltaIntent).toBeGreaterThan(0);
  });

  it('should detect when borrower crosses band boundary into higher cohort', async () => {
    // Large payment that pushes score >= 70
    const result = await DataConnector.simulateScore(
      'LN-2024-TEST',
      { payment: 25000 },
      mockScore
    );

    expect(result.data.simulated.intentScore).toBeGreaterThanOrEqual(70);
    expect(result.data.simulated.cohort).toBe(CohortType.CASHFLOW_CRUNCH);
    expect(result.data.deltas.cohortChanged).toBe(true);
  });
});
