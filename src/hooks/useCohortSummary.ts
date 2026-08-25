import { useQuery } from '@tanstack/react-query';
import { DataConnector } from '../api/connector.ts';
import { useAppStore } from '../store/useAppStore.ts';

export function useCohortSummary() {
  const isFixtureMode = useAppStore((state) => state.isFixtureMode);
  const setBackendHealthy = useAppStore((state) => state.setBackendHealthy);

  return useQuery({
    queryKey: ['cohort-summary', isFixtureMode],
    queryFn: async () => {
      const result = await DataConnector.getCohortSummary();
      setBackendHealthy(!result.isFixture);
      return result.data;
    },
    staleTime: 30000, // 30 seconds fresh
    refetchInterval: 60000 // Polling every 1 minute
  });
}
