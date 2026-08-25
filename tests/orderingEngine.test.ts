import { describe, it, expect } from 'vitest';
import {
  calculateConversionProbability,
  calculateBoundaryTippingFactor,
  calculateUrgencyDecay,
  calculateRvpScore,
  sortBorrowers
} from '../src/domain/orderingEngine.ts';
import { Borrower } from '../src/domain/types.ts';

describe('Recovery Velocity Priority (RVP) Ordering Engine', () => {
  it('should compute higher conversion probability for higher intent and ability', () => {
    const lowProb = calculateConversionProbability(20, 30);
    const highProb = calculateConversionProbability(80, 85);
    expect(highProb).toBeGreaterThan(lowProb);
  });

  it('should grant boundary tipping bonuses to borrowers near cut-offs', () => {
    const nearCutoff = calculateBoundaryTippingFactor(68); // near 70
    const farFromCutoff = calculateBoundaryTippingFactor(55); // middle
    expect(nearCutoff).toBe(1.4);
    expect(farFromCutoff).toBe(1.0);
  });

  it('should favor lower DPD in urgency decay', () => {
    const earlyDpd = calculateUrgencyDecay(20);
    const lateDpd = calculateUrgencyDecay(110);
    expect(earlyDpd).toBeGreaterThan(lateDpd);
  });

  it('should rank high-leverage accounts ahead of lost causes in default RVP sorting', () => {
    const highLeverageBorrower: Borrower = {
      loanNo: 'LN-1',
      memberName: 'Tipping Point Borrower',
      mobileNumber: '+91 98765 00001',
      isValidMobile: true,
      state: 'Gujarat',
      district: 'Ahmedabad',
      product: 'JLG Microloan',
      odDays: 22,
      odBucket: '1-30 DPD',
      outstandingPrincipal: 65000,
      abilityScore: 65,
      abilityBand: 'MEDIUM',
      intentScore: 68, // Cusp of high intent
      cohort: 'FENCE_SITTER'
    };

    const lostCauseBorrower: Borrower = {
      loanNo: 'LN-2',
      memberName: 'Deep Default Borrower',
      mobileNumber: '+91 98765 00002',
      isValidMobile: false,
      state: 'UP',
      district: 'Varanasi',
      product: 'Individual Business',
      odDays: 140,
      odBucket: '90+ DPD',
      outstandingPrincipal: 120000, // High balance but zero recovery probability
      abilityScore: 20,
      abilityBand: 'LOW',
      intentScore: 15,
      cohort: 'LOST_CAUSE'
    };

    const sorted = sortBorrowers([lostCauseBorrower, highLeverageBorrower], 'rvp', 'DESC');
    expect(sorted[0].loanNo).toBe('LN-1');
  });
});
