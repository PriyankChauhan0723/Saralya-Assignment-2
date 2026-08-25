import { create } from 'zustand';
import { PersonaType, CohortType, Borrower } from '../domain/types.ts';
import { DataConnector } from '../api/connector.ts';

interface AppState {
  persona: PersonaType;
  selectedCohort: CohortType;
  selectedBorrower: Borrower | null;
  isCockpitOpen: boolean;
  isFixtureMode: boolean;
  isBackendHealthy: boolean;

  setPersona: (persona: PersonaType) => void;
  setSelectedCohort: (cohort: CohortType) => void;
  setSelectedBorrower: (borrower: Borrower | null) => void;
  openCockpit: (borrower: Borrower) => void;
  closeCockpit: () => void;
  toggleFixtureMode: () => void;
  setBackendHealthy: (healthy: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  persona: 'RAVI',
  selectedCohort: CohortType.FENCE_SITTER, // High-leverage operational default
  selectedBorrower: null,
  isCockpitOpen: false,
  isFixtureMode: false,
  isBackendHealthy: true,

  setPersona: (persona) => set({ persona }),
  setSelectedCohort: (selectedCohort) => set({ selectedCohort }),
  setSelectedBorrower: (selectedBorrower) => set({ selectedBorrower }),
  openCockpit: (borrower) => set({ selectedBorrower: borrower, isCockpitOpen: true }),
  closeCockpit: () => set({ isCockpitOpen: false }),
  toggleFixtureMode: () => set((state) => {
    const next = !state.isFixtureMode;
    DataConnector.setForceFixtureMode(next);
    return { isFixtureMode: next };
  }),
  setBackendHealthy: (isBackendHealthy) => set({ isBackendHealthy })
}));
