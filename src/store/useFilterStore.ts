import { create } from 'zustand';
import { FilterState } from '../domain/types.ts';

interface FilterStore extends FilterState {
  setState: (state: string) => void;
  setProduct: (product: string) => void;
  setOdBucket: (odBucket: string) => void;
  setOutstandingRange: (min?: number, max?: number) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: FilterState['sortBy']) => void;
  setSortOrder: (sortOrder: 'ASC' | 'DESC') => void;
  toggleSortOrder: () => void;
  resetFilters: () => void;
}

const initialFilterState: FilterState = {
  state: '',
  product: '',
  odBucket: '',
  minOutstanding: undefined,
  maxOutstanding: undefined,
  searchQuery: '',
  sortBy: 'rvp', // Default to mathematically defended Recovery Velocity Priority
  sortOrder: 'DESC'
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialFilterState,

  setState: (state) => set({ state }),
  setProduct: (product) => set({ product }),
  setOdBucket: (odBucket) => set({ odBucket }),
  setOutstandingRange: (minOutstanding, maxOutstanding) => set({ minOutstanding, maxOutstanding }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  toggleSortOrder: () => set((state) => ({ sortOrder: state.sortOrder === 'ASC' ? 'DESC' : 'ASC' })),
  resetFilters: () => set(initialFilterState)
}));
