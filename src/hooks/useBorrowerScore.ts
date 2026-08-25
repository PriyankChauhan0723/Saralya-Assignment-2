import { useQuery } from '@tanstack/react-query';
import { DataConnector } from '../api/connector.ts';
import { useAppStore } from '../store/useAppStore.ts';
import { Borrower } from '../domain/types.ts';

export function useBorrowerScore(borrower: Borrower | null) {
  const isFixtureMode = useAppStore((state) => state.isFixtureMode);

  return useQuery({
    queryKey: ['borrower-score', borrower?.loanNo, isFixtureMode],
    queryFn: async () => {
      if (!borrower) return null;
      const result = await DataConnector.getBorrowerScore(borrower.loanNo, borrower);
      return result.data;
    },
    enabled: !!borrower,
    staleTime: 60000
  });
}
