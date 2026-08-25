import React from 'react';
import { CheckCircle2, FilterX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  isFiltered?: boolean;
  onResetFilters?: () => void;
}

export function EmptyState({
  title = 'No Borrowers in this Cohort',
  description = 'There are currently 0 delinquent loans matching this 3x3 operational grid cell. Portfolio accounts in this band are fully resolved.',
  isFiltered = false,
  onResetFilters
}: EmptyStateProps) {
  return (
    <div className="py-12 px-4 flex flex-col items-center justify-center text-center bg-white rounded-xl border border-dashed border-slate-200 shadow-sm">
      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
        {isFiltered ? <FilterX className="w-6 h-6 text-amber-500" /> : <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">{description}</p>
      {isFiltered && onResetFilters && (
        <button
          onClick={onResetFilters}
          className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
        >
          Clear Active Filters
        </button>
      )}
    </div>
  );
}
