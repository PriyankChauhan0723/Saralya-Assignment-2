import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { DataConnector } from '../api/connector.ts';
import { useAppStore } from '../store/useAppStore.ts';
import { useFilterStore } from '../store/useFilterStore.ts';
import { sortBorrowers } from '../domain/orderingEngine.ts';
import { Borrower } from '../domain/types.ts';

export function useBorrowerList() {
  const selectedCohort = useAppStore((state) => state.selectedCohort);
  const isFixtureMode = useAppStore((state) => state.isFixtureMode);

  const {
    state,
    product,
    odBucket,
    minOutstanding,
    maxOutstanding,
    searchQuery,
    sortBy,
    sortOrder
  } = useFilterStore();

  const query = useQuery({
    queryKey: [
      'cohort-borrowers',
      selectedCohort,
      state,
      product,
      odBucket,
      minOutstanding,
      maxOutstanding,
      isFixtureMode
    ],
    queryFn: async () => {
      const result = await DataConnector.getCohortBorrowers(selectedCohort, {
        limit: 200,
        state: state || undefined,
        product: product || undefined,
        od_bucket: odBucket || undefined,
        minOutstanding,
        maxOutstanding
      });
      return result.data;
    },
    staleTime: 20000
  });

  // Client-side search and RVP sorting pipeline
  const processedBorrowers = useMemo(() => {
    if (!query.data?.items) return [];

    let items = [...query.data.items];

    // Search query filter (Loan No or Name or District)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        (b: Borrower) =>
          (b.loanNo || '').toLowerCase().includes(q) ||
          (b.memberName || '').toLowerCase().includes(q) ||
          (b.district || '').toLowerCase().includes(q) ||
          (b.state || '').toLowerCase().includes(q)
      );
    }

    // Mathematical RVP or custom sorting
    return sortBorrowers(items, sortBy, sortOrder);
  }, [query.data?.items, searchQuery, sortBy, sortOrder]);

  return {
    ...query,
    borrowers: processedBorrowers,
    totalRecords: query.data?.pagination?.totalRecords ?? processedBorrowers.length
  };
}
