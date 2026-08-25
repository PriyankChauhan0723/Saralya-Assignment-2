import {
  getCohortSummaryApi,
  getCohortBorrowersApi,
  getBorrowerScoreApi,
  simulateScoreApi,
  BorrowerQueryParams
} from './endpoints.ts';
import summaryFixture from './fixtures/summary.json';
import borrowersFixture from './fixtures/borrowers_sample.json';
import scoresFixture from './fixtures/scores_sample.json';
import driftFixture from './fixtures/daily_drift.json';
import {
  CohortGridSummary,
  PaginatedBorrowersResult,
  BorrowerScore,
  ScoreSimulationResult,
  DayOverDayDriftSummary,
  Borrower,
  CohortType,
  ScoreBand
} from '../domain/types.ts';

// Intelligent in-memory synthetic generator for fixture mode when filtering 8,000+ borrowers
function getFilteredFixtureBorrowers(
  cohortKey: string,
  params: BorrowerQueryParams
): PaginatedBorrowersResult {
  const normKey = cohortKey.toUpperCase().replace(/[\s\-]+/g, '_');
  
  // Base samples from fixture
  let list: Borrower[] = (borrowersFixture as Borrower[]).filter(
    b => b.cohort.toUpperCase().replace(/[\s\-]+/g, '_') === normKey
  );

  // If few records in fixture for this specific cell, generate synthetic realistic rows
  if (list.length < 50) {
    const states = ['Gujarat', 'Maharashtra', 'Madhya Pradesh', 'Rajasthan', 'Uttar Pradesh', 'Tamil Nadu'];
    const districts: Record<string, string[]> = {
      Gujarat: ['Ahmedabad', 'Surat', 'Rajkot', 'Vadodara'],
      Maharashtra: ['Pune', 'Nashik', 'Nagpur', 'Aurangabad'],
      'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior'],
      Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
      'Uttar Pradesh': ['Varanasi', 'Gorakhpur', 'Lucknow', 'Kanpur'],
      'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem']
    };
    const products = ['JLG Microloan', 'Individual Business', 'Agri Dairy Loan', '2-Wheeler Loan'];
    const odBuckets = ['1-30 DPD', '31-60 DPD', '61-90 DPD', '90+ DPD'];
    const names = [
      'Anand Verma', 'Pooja Devi', 'Ramesh Chandra', 'Geeta Sharma', 'Vikram Rathod',
      'Laxmi Bai', 'Dinesh Rawat', 'Sarojini Naidu', 'Harish Bhai', 'Meenakshi Iyer',
      'Santosh Gaikwad', 'Nilesh Shinde', 'Bhavna Ben', 'Kishore Kumar', 'Rani Devi'
    ];

    const syntheticRows: Borrower[] = [];
    const count = 120; // Enough for rich virtualized testing
    for (let i = 1; i <= count; i++) {
      const state = states[i % states.length];
      const distList = districts[state];
      const district = distList[i % distList.length];
      const product = products[i % products.length];
      const odBucket = odBuckets[i % odBuckets.length];
      const odDays = odBucket === '1-30 DPD' ? 10 + (i % 20) :
                     odBucket === '31-60 DPD' ? 35 + (i % 25) :
                     odBucket === '61-90 DPD' ? 65 + (i % 25) : 95 + (i % 50);
      const outstanding = 15000 + ((i * 3791) % 185000);
      const abilityScore = normKey.includes('HIGH_ABILITY') || normKey === 'WILFUL_DEFAULTER' || normKey === 'PROCRASTINATOR' || normKey === 'OOPS' ? 72 + (i % 25) :
                           normKey.includes('MED_ABILITY') || normKey === 'EVASION_RISK' || normKey === 'FENCE_SITTER' || normKey === 'CASHFLOW_CRUNCH' ? 42 + (i % 26) : 15 + (i % 24);
      const intentScore = normKey === 'OOPS' || normKey === 'CASHFLOW_CRUNCH' || normKey === 'DISTRESSED' ? 72 + (i % 25) :
                          normKey === 'PROCRASTINATOR' || normKey === 'FENCE_SITTER' || normKey === 'STRUGGLER' ? 42 + (i % 26) : 12 + (i % 26);

      syntheticRows.push({
        loanNo: `LN-2024-${normKey.slice(0, 3)}-${1000 + i}`,
        memberName: `${names[i % names.length]} (${normKey.slice(0, 4)}-${i})`,
        mobileNumber: `+91 98${(10000000 + i * 837).toString().slice(0, 8)}`,
        isValidMobile: i % 7 !== 0,
        state,
        district,
        product,
        odDays,
        odBucket,
        outstandingPrincipal: outstanding,
        abilityScore,
        abilityBand: abilityScore >= 70 ? 'HIGH' : abilityScore >= 40 ? 'MEDIUM' : 'LOW',
        intentScore,
        intentBand: intentScore >= 70 ? 'HIGH' : intentScore >= 40 ? 'MEDIUM' : 'LOW',
        cohort: normKey
      });
    }
    list = [...list, ...syntheticRows];
  }

  // Filter client-side
  if (params.state) {
    list = list.filter(b => b.state.toLowerCase() === params.state!.toLowerCase());
  }
  if (params.product) {
    list = list.filter(b => b.product.toLowerCase() === params.product!.toLowerCase());
  }
  if (params.od_bucket) {
    list = list.filter(b => b.odBucket.toLowerCase() === params.od_bucket!.toLowerCase());
  }
  if (params.minOutstanding !== undefined) {
    list = list.filter(b => b.outstandingPrincipal >= params.minOutstanding!);
  }
  if (params.maxOutstanding !== undefined) {
    list = list.filter(b => b.outstandingPrincipal <= params.maxOutstanding!);
  }

  const page = params.page || 1;
  const limit = params.limit || 50;
  const totalRecords = list.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));
  const startIndex = (page - 1) * limit;
  const items = list.slice(startIndex, startIndex + limit);

  return {
    cohort: cohortKey,
    pagination: {
      page,
      limit,
      totalRecords,
      totalPages
    },
    items
  };
}

export class DataConnector {
  private static forceFixtureMode = false;

  public static setForceFixtureMode(enabled: boolean) {
    this.forceFixtureMode = enabled;
  }

  public static isForceFixtureMode(): boolean {
    return this.forceFixtureMode;
  }

  /**
   * Fetch 3x3 Grid Summary (Live API with Fixture Failover)
   */
  public static async getCohortSummary(): Promise<{ data: CohortGridSummary; isFixture: boolean }> {
    if (!this.forceFixtureMode) {
      try {
        const liveData = await getCohortSummaryApi();
        return { data: liveData, isFixture: false };
      } catch (err) {
        console.warn('Assignment 1 live backend unreachable, using fixture summary.', err);
      }
    }
    return { data: summaryFixture as unknown as CohortGridSummary, isFixture: true };
  }

  /**
   * Fetch Cohort Borrowers (Live API with Fixture Failover)
   */
  public static async getCohortBorrowers(
    cohortKey: string,
    params: BorrowerQueryParams = {}
  ): Promise<{ data: PaginatedBorrowersResult; isFixture: boolean }> {
    if (!this.forceFixtureMode) {
      try {
        const liveData = await getCohortBorrowersApi(cohortKey, params);
        return { data: liveData, isFixture: false };
      } catch (err) {
        console.warn(`Assignment 1 live backend failed for cohort ${cohortKey}, using fixture borrowers.`, err);
      }
    }
    return { data: getFilteredFixtureBorrowers(cohortKey, params), isFixture: true };
  }

  /**
   * Fetch Detailed Borrower Score & Explainability
   */
  public static async getBorrowerScore(
    loanId: string,
    fallbackBorrower?: Borrower
  ): Promise<{ data: BorrowerScore; isFixture: boolean }> {
    if (!this.forceFixtureMode) {
      try {
        const liveData = await getBorrowerScoreApi(loanId);
        return { data: liveData, isFixture: false };
      } catch (err) {
        console.warn(`Live score fetch failed for ${loanId}, using fixture fallback.`, err);
      }
    }

    const cached = (scoresFixture as Record<string, BorrowerScore>)[loanId];
    if (cached) {
      return { data: cached, isFixture: true };
    }

    // Synthesize structured factor breakdown from borrower data
    const ability = fallbackBorrower?.abilityScore ?? 60;
    const intent = fallbackBorrower?.intentScore ?? 55;
    const synthesized: BorrowerScore = {
      loanNo: loanId,
      memberName: fallbackBorrower?.memberName || 'Borrower Account',
      abilityScore: ability,
      abilityBand: ability >= 70 ? ScoreBand.HIGH : ability >= 40 ? ScoreBand.MEDIUM : ScoreBand.LOW,
      intentScore: intent,
      intentBand: intent >= 70 ? ScoreBand.HIGH : intent >= 40 ? ScoreBand.MEDIUM : ScoreBand.LOW,
      cohort: (fallbackBorrower?.cohort as CohortType) || CohortType.FENCE_SITTER,
      modelVersion: 'v1.2.0-logistic',
      computedAt: new Date().toISOString(),
      agentCallScript: `Borrower has ${fallbackBorrower?.odDays || 30} days overdue with ₹${fallbackBorrower?.outstandingPrincipal || 45000} balance. Offer standard settlement or split payment.`,
      factorBreakdown: {
        ability: [
          {
            factor: 'foir',
            factorDisplayName: 'Fixed Obligation to Income Ratio (FOIR)',
            rawValue: 0.45,
            normalizedScore: ability,
            weight: 0.35,
            contribution: Number(((ability * 0.35)).toFixed(2)),
            isMissing: false,
            agentExplanation: 'Household debt obligations are within manageable thresholds.'
          },
          {
            factor: 'repayment_velocity',
            factorDisplayName: 'Principal Repayment Velocity',
            rawValue: 0.60,
            normalizedScore: Math.min(100, ability + 5),
            weight: 0.25,
            contribution: Number((((ability + 5) * 0.25)).toFixed(2)),
            isMissing: false,
            agentExplanation: 'Borrower cleared 60% of past EMIs on time.'
          },
          {
            factor: 'days_overdue',
            factorDisplayName: 'Days Past Due (DPD)',
            rawValue: fallbackBorrower?.odDays || 25,
            normalizedScore: Math.max(10, 100 - (fallbackBorrower?.odDays || 25) * 1.5),
            weight: 0.25,
            contribution: Number((((100 - (fallbackBorrower?.odDays || 25) * 1.5) * 0.25)).toFixed(2)),
            isMissing: false,
            agentExplanation: `${fallbackBorrower?.odDays || 25} days past due.`
          }
        ],
        intent: [
          {
            factor: 'emi_bounce_rate',
            factorDisplayName: 'Historical EMI Bounce Frequency',
            rawValue: 1,
            normalizedScore: intent,
            weight: 0.30,
            contribution: Number(((intent * 0.30)).toFixed(2)),
            isMissing: false,
            agentExplanation: 'Demonstrates consistent willingness with isolated bounce incident.'
          },
          {
            factor: 'ptp_compliance',
            factorDisplayName: 'Promise to Pay (PTP) Track Record',
            rawValue: 0.70,
            normalizedScore: Math.min(100, intent + 8),
            weight: 0.25,
            contribution: Number((((intent + 8) * 0.25)).toFixed(2)),
            isMissing: false,
            agentExplanation: 'Fulfilled past payment commitments.'
          },
          {
            factor: 'bureau_inquiry_velocity',
            factorDisplayName: 'Recent Bureau Inquiries',
            rawValue: null,
            normalizedScore: null,
            weight: 0.10,
            contribution: null,
            isMissing: true,
            agentExplanation: 'No bureau inquiry records in last 90 days (neutral median imputed).'
          }
        ]
      }
    };

    return { data: synthesized, isFixture: true };
  }

  /**
   * Real-time Simulation Engine
   */
  public static async simulateScore(
    loanId: string,
    overrides: Record<string, any>,
    currentScore: BorrowerScore
  ): Promise<{ data: ScoreSimulationResult; isFixture: boolean }> {
    if (!this.forceFixtureMode) {
      try {
        const liveData = await simulateScoreApi(loanId, overrides);
        return { data: liveData, isFixture: false };
      } catch (err) {
        console.warn('Live simulation API call failed, using client-side mathematical simulation.', err);
      }
    }

    // Client-side simulation fallback
    const payment = Number(overrides.last_coll_amount || overrides.payment || 0);
    const abilityDelta = payment > 0 ? Math.min(25, Math.round(payment / 500)) : 0;
    const intentDelta = payment > 0 ? Math.min(30, Math.round(payment / 400) + 10) : 0;

    const newAbility = Math.min(100, currentScore.abilityScore + abilityDelta);
    const newIntent = Math.min(100, currentScore.intentScore + intentDelta);

    const getBand = (s: number): ScoreBand => s >= 70 ? ScoreBand.HIGH : s >= 40 ? ScoreBand.MEDIUM : ScoreBand.LOW;
    const newAbilityBand = getBand(newAbility);
    const newIntentBand = getBand(newIntent);

    // Compute cohort
    let newCohort = currentScore.cohort;
    if (newAbilityBand === ScoreBand.HIGH && newIntentBand === ScoreBand.HIGH) newCohort = CohortType.OOPS;
    else if (newAbilityBand === ScoreBand.HIGH && newIntentBand === ScoreBand.MEDIUM) newCohort = CohortType.PROCRASTINATOR;
    else if (newAbilityBand === ScoreBand.HIGH && newIntentBand === ScoreBand.LOW) newCohort = CohortType.WILFUL_DEFAULTER;
    else if (newAbilityBand === ScoreBand.MEDIUM && newIntentBand === ScoreBand.HIGH) newCohort = CohortType.CASHFLOW_CRUNCH;
    else if (newAbilityBand === ScoreBand.MEDIUM && newIntentBand === ScoreBand.MEDIUM) newCohort = CohortType.FENCE_SITTER;
    else if (newAbilityBand === ScoreBand.MEDIUM && newIntentBand === ScoreBand.LOW) newCohort = CohortType.EVASION_RISK;
    else if (newAbilityBand === ScoreBand.LOW && newIntentBand === ScoreBand.HIGH) newCohort = CohortType.DISTRESSED;
    else if (newAbilityBand === ScoreBand.LOW && newIntentBand === ScoreBand.MEDIUM) newCohort = CohortType.STRUGGLER;
    else if (newAbilityBand === ScoreBand.LOW && newIntentBand === ScoreBand.LOW) newCohort = CohortType.LOST_CAUSE;

    const cohortChanged = newCohort !== currentScore.cohort;

    return {
      data: {
        loanNo: loanId,
        baseline: {
          abilityScore: currentScore.abilityScore,
          abilityBand: currentScore.abilityBand,
          intentScore: currentScore.intentScore,
          intentBand: currentScore.intentBand,
          cohort: currentScore.cohort
        },
        simulated: {
          abilityScore: newAbility,
          abilityBand: newAbilityBand,
          intentScore: newIntent,
          intentBand: newIntentBand,
          cohort: newCohort
        },
        deltas: {
          deltaAbility: abilityDelta,
          deltaIntent: intentDelta,
          cohortChanged
        },
        simulationSummary: cohortChanged
          ? `Borrower moves from ${currentScore.cohort} to ${newCohort} with +${intentDelta} Intent and +${abilityDelta} Ability!`
          : `Score improved by +${intentDelta} Intent, maintaining ${currentScore.cohort}.`,
        simulatedScore: {
          ...currentScore,
          abilityScore: newAbility,
          abilityBand: newAbilityBand,
          intentScore: newIntent,
          intentBand: newIntentBand,
          cohort: newCohort
        }
      },
      isFixture: true
    };
  }

  /**
   * Day-over-Day Drift for Section 2.5
   */
  public static async getDailyDrift(): Promise<DayOverDayDriftSummary> {
    return driftFixture as unknown as DayOverDayDriftSummary;
  }
}
