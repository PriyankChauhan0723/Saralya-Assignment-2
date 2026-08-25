export enum ScoreBand {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export enum CohortType {
  // ABILITY HIGH (>=70)
  WILFUL_DEFAULTER = 'WILFUL_DEFAULTER',   // Intent Low (<40)
  PROCRASTINATOR = 'PROCRASTINATOR',       // Intent Med (40-69)
  OOPS = 'OOPS',                           // Intent High (>=70)

  // ABILITY MED (40-69)
  EVASION_RISK = 'EVASION_RISK',           // Intent Low (<40)
  FENCE_SITTER = 'FENCE_SITTER',           // Intent Med (40-69)
  CASHFLOW_CRUNCH = 'CASHFLOW_CRUNCH',     // Intent High (>=70)

  // ABILITY LOW (<40)
  LOST_CAUSE = 'LOST_CAUSE',               // Intent Low (<40)
  STRUGGLER = 'STRUGGLER',                 // Intent Med (40-69)
  DISTRESSED = 'DISTRESSED'                // Intent High (>=70)
}

export enum RoutingLane {
  RULE_BASED = 'RULE_BASED',       // Oops, Procrastinator
  ML = 'ML',                       // Fence-Sitter, Cashflow Crunch
  ML_LLM_REVIEW = 'ML_LLM_REVIEW'  // Other 5 cohorts
}

export interface CohortMetadata {
  cohort: CohortType;
  displayName: string;
  abilityBand: ScoreBand;
  intentBand: ScoreBand;
  routingLane: RoutingLane;
  recommendedAction: string;
  operationalChannel: string;
  description: string;
  policyConstraints: {
    maxGraceDays: number;
    allowOTS: boolean;
    allowRestructure: boolean;
    allowDigitalLink: boolean;
  };
}

export interface CohortCellSummary {
  cohort: CohortType;
  displayName: string;
  count: number;
  totalOutstanding: number;
  recommendedAction: string;
  operationalChannel: string;
}

export interface CohortGridSummary {
  grid: {
    HIGH_ABILITY: {
      LOW_INTENT: CohortCellSummary;
      MED_INTENT: CohortCellSummary;
      HIGH_INTENT: CohortCellSummary;
    };
    MED_ABILITY: {
      LOW_INTENT: CohortCellSummary;
      MED_INTENT: CohortCellSummary;
      HIGH_INTENT: CohortCellSummary;
    };
    LOW_ABILITY: {
      LOW_INTENT: CohortCellSummary;
      MED_INTENT: CohortCellSummary;
      HIGH_INTENT: CohortCellSummary;
    };
  };
  totalBorrowers: number;
  totalPortfolioOutstanding: number;
}

export interface Borrower {
  loanNo: string;
  memberName: string;
  mobileNumber: string;
  isValidMobile: boolean;
  state: string;
  district: string;
  product: string;
  odDays: number;
  odBucket: string;
  outstandingPrincipal: number;
  abilityScore: number;
  abilityBand: ScoreBand | string;
  intentScore: number;
  intentBand: ScoreBand | string;
  cohort: CohortType | string;
  rvpScore?: number; // Calculated Recovery Velocity Priority
}

export interface PaginatedBorrowersResult {
  cohort: string;
  pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
  items: Borrower[];
}

export interface FactorContribution {
  factor: string;
  factorDisplayName: string;
  rawValue: number | string | null;
  normalizedScore: number | null; // 0-100 or null if missing
  weight: number;                 // Rescaled weight in the scorecard
  contribution: number | null;    // normalizedScore * weight
  isMissing: boolean;
  agentExplanation: string;       // Human-readable sentence for live call center agent
}

export interface BorrowerScore {
  loanNo: string;
  memberName: string;
  abilityScore: number;
  abilityBand: ScoreBand;
  intentScore: number;
  intentBand: ScoreBand;
  cohort: CohortType;
  modelVersion: string;
  factorBreakdown: {
    ability: FactorContribution[];
    intent: FactorContribution[];
  };
  agentCallScript: string;
  computedAt: string | Date;
}

export interface ScoreSimulationResult {
  loanNo: string;
  baseline: {
    abilityScore: number;
    abilityBand: ScoreBand;
    intentScore: number;
    intentBand: ScoreBand;
    cohort: CohortType;
  };
  simulated: {
    abilityScore: number;
    abilityBand: ScoreBand;
    intentScore: number;
    intentBand: ScoreBand;
    cohort: CohortType;
  };
  deltas: {
    deltaAbility: number;
    deltaIntent: number;
    cohortChanged: boolean;
  };
  simulationSummary: string;
  simulatedScore: BorrowerScore;
}

// Module 2.5: Ravi's Morning Floor Director Types
export interface CohortDriftRecord {
  cohort: CohortType;
  displayName: string;
  countYesterday: number;
  countToday: number;
  countDelta: number;
  outstandingDelta: number;
  inflowCount: number;
  outflowCount: number;
  netRiskShift: 'IMPROVED' | 'DETERIORATED' | 'STABLE';
}

export interface DayOverDayDriftSummary {
  snapshotDate: string;
  baselineDate: string;
  totalPortfolioCount: number;
  overnightNetDeteriorated: number;
  overnightNetRepaired: number;
  cohorts: CohortDriftRecord[];
  topAttentionCohort: CohortType;
}

export interface CellCapacityRecommendation {
  cohort: CohortType;
  displayName: string;
  routingLane: RoutingLane;
  totalBorrowers: number;
  allocatedCalls: number;
  allocationPercentage: number;
  expectedRecoveryRate: number; // 0-1 (e.g. 0.65 for Fence-Sitter)
  expectedRecoveryYield: number; // In Rupees
  recommendedAction: string;
}

export interface CapacityAllocationPlan {
  totalCapacity: number; // 2,000 calls
  totalAllocated: number;
  totalExpectedRecoveryYield: number; // In Rupees
  cellAllocations: Record<CohortType, CellCapacityRecommendation>;
  floorDirectives: string[];
}

export type PersonaType = 'RAVI' | 'MEENA';

export interface FilterState {
  state: string;
  product: string;
  odBucket: string;
  minOutstanding?: number;
  maxOutstanding?: number;
  searchQuery: string;
  sortBy: 'rvp' | 'od_days' | 'outstanding_principal' | 'ability_score' | 'intent_score';
  sortOrder: 'ASC' | 'DESC';
}
