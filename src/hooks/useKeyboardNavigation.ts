import { useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore.ts';
import { CohortType } from '../domain/types.ts';

const COHORT_NUMBER_MAP: Record<string, CohortType> = {
  '1': CohortType.WILFUL_DEFAULTER,
  '2': CohortType.PROCRASTINATOR,
  '3': CohortType.OOPS,
  '4': CohortType.EVASION_RISK,
  '5': CohortType.FENCE_SITTER,
  '6': CohortType.CASHFLOW_CRUNCH,
  '7': CohortType.LOST_CAUSE,
  '8': CohortType.STRUGGLER,
  '9': CohortType.DISTRESSED
};

export function useKeyboardNavigation(
  onFocusSearch?: () => void
) {
  const {
    setSelectedCohort,
    isCockpitOpen,
    closeCockpit
  } = useAppStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      if (e.key === 'Escape') {
        if (isCockpitOpen) {
          closeCockpit();
          e.preventDefault();
        }
        return;
      }

      if (isInput) return;

      // 1-9 to select 3x3 grid cells
      if (COHORT_NUMBER_MAP[e.key]) {
        setSelectedCohort(COHORT_NUMBER_MAP[e.key]);
        e.preventDefault();
        return;
      }

      // '/' to focus search
      if (e.key === '/') {
        e.preventDefault();
        onFocusSearch?.();
        return;
      }
    },
    [
      isCockpitOpen,
      closeCockpit,
      setSelectedCohort,
      onFocusSearch
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
