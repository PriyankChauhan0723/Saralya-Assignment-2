import { apiClient } from './client.ts';
import {
  CohortGridSummary,
  PaginatedBorrowersResult,
  BorrowerScore,
  ScoreSimulationResult
} from '../domain/types.ts';

export interface BorrowerQueryParams {
  page?: number;
  limit?: number;
  sortBy?: 'od_days' | 'outstanding_principal' | 'ability_score' | 'intent_score';
  sortOrder?: 'ASC' | 'DESC';
  state?: string;
  product?: string;
  od_bucket?: string;
  minOutstanding?: number;
  maxOutstanding?: number;
}

export async function getCohortSummaryApi(): Promise<CohortGridSummary> {
  const response = await apiClient.get<{ success: boolean; data: CohortGridSummary }>('/cohorts/summary');
  return response.data.data;
}

export async function getCohortBorrowersApi(
  cohortKey: string,
  params: BorrowerQueryParams = {}
): Promise<PaginatedBorrowersResult> {
  const response = await apiClient.get<{ success: boolean; data: PaginatedBorrowersResult }>(
    `/cohorts/${encodeURIComponent(cohortKey)}/borrowers`,
    { params }
  );
  return response.data.data;
}

export async function getBorrowerScoreApi(loanId: string): Promise<BorrowerScore> {
  const response = await apiClient.get<{ success: boolean; data: BorrowerScore }>(
    `/borrowers/${encodeURIComponent(loanId)}/score`
  );
  return response.data.data;
}

export async function simulateScoreApi(
  loanId: string,
  overrides: Record<string, any>
): Promise<ScoreSimulationResult> {
  const response = await apiClient.post<{ success: boolean; data: ScoreSimulationResult }>(
    '/score/simulate',
    { loanId, overrides }
  );
  return response.data.data;
}

export async function checkBackendHealthApi(): Promise<boolean> {
  try {
    const res = await apiClient.get('/health', { timeout: 3000 });
    return res.status === 200;
  } catch {
    return false;
  }
}
