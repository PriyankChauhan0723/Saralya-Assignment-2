import { Borrower } from './types.ts';

/**
 * Recovery Velocity Priority (RVP) Ranking Algorithm
 * 
 * Defended Strategy for Default Calling Order:
 * In collections operations, sorting purely by Outstanding Balance wastes capacity on
 * uncollectable high-balance lost causes. Sorting purely by Intent contacts borrowers
 * who were already going to pay through digital reminders.
 * 
 * Recovery Velocity Priority (RVP) maximizes expected cash recovery per telecaller minute:
 * 
 * RVP = OutstandingPrincipal * ConversionProbability(Intent, Ability) * BoundaryTippingFactor * Contactability * UrgencyFactor
 */

export function calculateConversionProbability(intentScore: number, abilityScore: number): number {
  // Sigmoid response centered around intent/ability baseline
  const iNorm = Math.max(0, Math.min(100, intentScore)) / 100;
  const aNorm = Math.max(0, Math.min(100, abilityScore)) / 100;
  
  // Weighted blend (Intent is 60% of willingness, Ability is 40% of feasibility)
  const score = (iNorm * 0.6) + (aNorm * 0.4);
  return 1 / (1 + Math.exp(-6 * (score - 0.5)));
}

export function calculateBoundaryTippingFactor(intentScore: number): number {
  // Borrowers on the cusp of band boundaries (35-44 and 65-74) have the highest responsiveness
  // to an agent phone call that tips them into a paying cohort.
  const distTo40 = Math.abs(intentScore - 40);
  const distTo70 = Math.abs(intentScore - 70);
  const minDistance = Math.min(distTo40, distTo70);

  if (minDistance <= 5) return 1.4;  // Peak sensitivity
  if (minDistance <= 10) return 1.2; // Moderate sensitivity
  return 1.0;
}

export function calculateUrgencyDecay(odDays: number): number {
  // Early stage delinquency (1-30 DPD) has higher cure elasticity before write-off roll rates escalate
  if (odDays <= 30) return 1.3;
  if (odDays <= 60) return 1.1;
  if (odDays <= 90) return 0.9;
  return 0.7; // 90+ DPD has lower telecalling conversion velocity
}

export function calculateRvpScore(borrower: Borrower): number {
  const balance = Math.max(1000, Number(borrower.outstandingPrincipal || 0));
  const intentScore = Number(borrower.intentScore || 0);
  const abilityScore = Number(borrower.abilityScore || 0);
  const odDays = Number(borrower.odDays || 0);

  const convProb = calculateConversionProbability(intentScore, abilityScore);
  const tippingFactor = calculateBoundaryTippingFactor(intentScore);
  const contactability = Boolean(borrower.isValidMobile) ? 1.0 : 0.4;
  const urgency = calculateUrgencyDecay(odDays);

  const rawRvp = balance * convProb * tippingFactor * contactability * urgency;
  return Math.round(rawRvp);
}

/**
 * Sorts an array of borrowers according to the designated sort option.
 * If sortBy is 'rvp', computes and orders by Recovery Velocity Priority.
 */
export function sortBorrowers(
  borrowers: Borrower[],
  sortBy: 'rvp' | 'od_days' | 'outstanding_principal' | 'ability_score' | 'intent_score' = 'rvp',
  sortOrder: 'ASC' | 'DESC' = 'DESC'
): Borrower[] {
  // Attach RVP scores if not present
  const enriched = borrowers.map(b => ({
    ...b,
    rvpScore: b.rvpScore ?? calculateRvpScore(b)
  }));

  return [...enriched].sort((a, b) => {
    let comp = 0;
    if (sortBy === 'rvp') {
      comp = Number(a.rvpScore || 0) - Number(b.rvpScore || 0);
    } else if (sortBy === 'od_days') {
      comp = Number(a.odDays || 0) - Number(b.odDays || 0);
    } else if (sortBy === 'outstanding_principal') {
      comp = Number(a.outstandingPrincipal || 0) - Number(b.outstandingPrincipal || 0);
    } else if (sortBy === 'ability_score') {
      comp = Number(a.abilityScore || 0) - Number(b.abilityScore || 0);
    } else if (sortBy === 'intent_score') {
      comp = Number(a.intentScore || 0) - Number(b.intentScore || 0);
    }

    return sortOrder === 'DESC' ? -comp : comp;
  });
}
