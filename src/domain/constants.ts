import { CohortType, ScoreBand, RoutingLane, CohortMetadata } from './types.ts';

export const COHORT_DEFINITIONS: Record<CohortType, CohortMetadata> = {
  [CohortType.WILFUL_DEFAULTER]: {
    cohort: CohortType.WILFUL_DEFAULTER,
    displayName: 'Wilful Defaulter',
    abilityBand: ScoreBand.HIGH,
    intentBand: ScoreBand.LOW,
    routingLane: RoutingLane.ML_LLM_REVIEW,
    recommendedAction: 'Escalate to Legal Notice & Field Visit',
    operationalChannel: 'Legal / Intensive Field Enforcement',
    description: 'Borrower can afford to repay but refuses or evades payment commitments.',
    policyConstraints: {
      maxGraceDays: 0,
      allowOTS: false,
      allowRestructure: false,
      allowDigitalLink: true
    }
  },
  [CohortType.PROCRASTINATOR]: {
    cohort: CohortType.PROCRASTINATOR,
    displayName: 'Procrastinator',
    abilityBand: ScoreBand.HIGH,
    intentBand: ScoreBand.MEDIUM,
    routingLane: RoutingLane.RULE_BASED,
    recommendedAction: 'Direct Phone Call with Strict Payment Deadline',
    operationalChannel: 'Outbound Call Center',
    description: 'Borrower has adequate financial capacity but delays payments without firm nudges.',
    policyConstraints: {
      maxGraceDays: 2,
      allowOTS: false,
      allowRestructure: false,
      allowDigitalLink: true
    }
  },
  [CohortType.OOPS]: {
    cohort: CohortType.OOPS,
    displayName: 'Oops',
    abilityBand: ScoreBand.HIGH,
    intentBand: ScoreBand.HIGH,
    routingLane: RoutingLane.RULE_BASED,
    recommendedAction: 'Automated SMS / WhatsApp Payment Link Reminder',
    operationalChannel: 'Digital Messaging',
    description: 'High capacity and high intent; non-payment is usually an unintentional oversight.',
    policyConstraints: {
      maxGraceDays: 5,
      allowOTS: false,
      allowRestructure: false,
      allowDigitalLink: true
    }
  },
  [CohortType.EVASION_RISK]: {
    cohort: CohortType.EVASION_RISK,
    displayName: 'Evasion Risk',
    abilityBand: ScoreBand.MEDIUM,
    intentBand: ScoreBand.LOW,
    routingLane: RoutingLane.ML_LLM_REVIEW,
    recommendedAction: 'In-person Field Verification and Hard PTP Agreement',
    operationalChannel: 'Field Agent Team',
    description: 'Moderate financial capacity coupled with evasive repayment behavior.',
    policyConstraints: {
      maxGraceDays: 1,
      allowOTS: false,
      allowRestructure: false,
      allowDigitalLink: true
    }
  },
  [CohortType.FENCE_SITTER]: {
    cohort: CohortType.FENCE_SITTER,
    displayName: 'Fence-Sitter',
    abilityBand: ScoreBand.MEDIUM,
    intentBand: ScoreBand.MEDIUM,
    routingLane: RoutingLane.ML,
    recommendedAction: 'Targeted Call Negotiation with Immediate UPI Link',
    operationalChannel: 'Tele-calling Agent',
    description: 'Borrower is undecided; proactive negotiation can successfully recover arrears.',
    policyConstraints: {
      maxGraceDays: 4,
      allowOTS: false,
      allowRestructure: true,
      allowDigitalLink: true
    }
  },
  [CohortType.CASHFLOW_CRUNCH]: {
    cohort: CohortType.CASHFLOW_CRUNCH,
    displayName: 'Cashflow Crunch',
    abilityBand: ScoreBand.MEDIUM,
    intentBand: ScoreBand.HIGH,
    routingLane: RoutingLane.ML,
    recommendedAction: 'Offer Short Grace Period / Partial Split Payment',
    operationalChannel: 'Relationship Manager',
    description: 'Willing borrower experiencing temporary cashflow shortfall (delayed harvest/salary).',
    policyConstraints: {
      maxGraceDays: 7,
      allowOTS: false,
      allowRestructure: true,
      allowDigitalLink: true
    }
  },
  [CohortType.LOST_CAUSE]: {
    cohort: CohortType.LOST_CAUSE,
    displayName: 'Lost Cause',
    abilityBand: ScoreBand.LOW,
    intentBand: ScoreBand.LOW,
    routingLane: RoutingLane.ML_LLM_REVIEW,
    recommendedAction: 'Evaluate for One-Time Settlement (OTS) or Write-Off',
    operationalChannel: 'Settlement Desk',
    description: 'Severe financial distress with zero willingness or ability to repay.',
    policyConstraints: {
      maxGraceDays: 0,
      allowOTS: true,
      allowRestructure: false,
      allowDigitalLink: false
    }
  },
  [CohortType.STRUGGLER]: {
    cohort: CohortType.STRUGGLER,
    displayName: 'Struggler',
    abilityBand: ScoreBand.LOW,
    intentBand: ScoreBand.MEDIUM,
    routingLane: RoutingLane.ML_LLM_REVIEW,
    recommendedAction: 'Token Installment Plan and Multi-party Guarantee Check',
    operationalChannel: 'Branch Collections Supervisor',
    description: 'Borrower wants to repay but has constrained household income.',
    policyConstraints: {
      maxGraceDays: 3,
      allowOTS: true,
      allowRestructure: true,
      allowDigitalLink: true
    }
  },
  [CohortType.DISTRESSED]: {
    cohort: CohortType.DISTRESSED,
    displayName: 'Distressed',
    abilityBand: ScoreBand.LOW,
    intentBand: ScoreBand.HIGH,
    routingLane: RoutingLane.ML_LLM_REVIEW,
    recommendedAction: 'Formal Loan Restructuring (Tenure Extension / EMI Reduction)',
    operationalChannel: 'Credit Operations Desk',
    description: 'High willingness to pay but crippled by external shock; needs tenure restructuring.',
    policyConstraints: {
      maxGraceDays: 10,
      allowOTS: false,
      allowRestructure: true,
      allowDigitalLink: true
    }
  }
};

export const ROUTING_LANE_CONFIG = {
  [RoutingLane.RULE_BASED]: {
    name: 'Rule-Based Routing',
    shortName: 'Rule-Based',
    symbol: '●',
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-200 ring-teal-500/20',
    iconColor: 'text-teal-600',
    borderClass: 'border-teal-400',
    bgClass: 'bg-teal-50/50',
    description: 'Automated rules for unambiguous high-intent or fast-nudge accounts.'
  },
  [RoutingLane.ML]: {
    name: 'ML Routing',
    shortName: 'ML Routing',
    symbol: '◆',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-500/20',
    iconColor: 'text-amber-600',
    borderClass: 'border-amber-400',
    bgClass: 'bg-amber-50/50',
    description: 'Empirical logistic regression scoring for high-leverage negotiation accounts.'
  },
  [RoutingLane.ML_LLM_REVIEW]: {
    name: 'ML + LLM Review',
    shortName: 'ML + LLM',
    symbol: '⬡',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200 ring-indigo-500/20',
    iconColor: 'text-indigo-600',
    borderClass: 'border-indigo-400',
    bgClass: 'bg-indigo-50/50',
    description: 'Scoring augmented with LLM narrative review for high-risk/complex cases.'
  }
};

export const SCORE_BAND_THRESHOLDS = {
  HIGH_MIN: 70,
  MED_MIN: 40,
  LOW_MAX: 39
};
