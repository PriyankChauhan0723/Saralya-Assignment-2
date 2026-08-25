import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useBorrowerList } from '../../hooks/useBorrowerList.ts';
import { useAppStore } from '../../store/useAppStore.ts';
import { useFilterStore } from '../../store/useFilterStore.ts';
import { COHORT_DEFINITIONS } from '../../domain/constants.ts';
import { FilterBar } from './FilterBar.tsx';
import { BorrowerRow } from './BorrowerRow.tsx';
import { TableRowSkeleton } from '../common/LoadingSkeleton.tsx';
import { EmptyState } from '../common/EmptyState.tsx';
import { ErrorBoundary } from '../common/ErrorBoundary.tsx';
import { Users, PhoneCall } from 'lucide-react';

export function VirtualBorrowerTable() {
  const selectedCohort = useAppStore((state) => state.selectedCohort);
  const { borrowers, isLoading, isError, error, totalRecords } = useBorrowerList();
  const resetFilters = useFilterStore((state) => state.resetFilters);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const parentRef = useRef<HTMLDivElement>(null);
  const meta = COHORT_DEFINITIONS[selectedCohort];

  // TanStack Virtualizer setup
  const rowVirtualizer = useVirtualizer({
    count: borrowers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 58, // Row height in px
    overscan: 10 // Pre-render 10 items above & below viewport
  });

  return (
    <ErrorBoundary fallbackTitle="Borrower List Error">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col h-[520px]">
        {/* Table Header: Cohort title & Count */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200 font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                  {meta?.displayName || selectedCohort}
                </h3>
                <span className="text-3xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                  {totalRecords} Borrowers
                </span>
              </div>
              <p className="text-3xs text-slate-500 font-medium">
                {meta?.recommendedAction}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-2xs text-slate-500 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <PhoneCall className="w-3 h-3 text-blue-600" />
            <span>Click any borrower or press <kbd className="font-mono font-bold bg-white px-1 border rounded">Enter</kbd> to open Cockpit</span>
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <FilterBar searchInputRef={searchInputRef} />

        {/* Virtualized List Container */}
        <div
          ref={parentRef}
          className="flex-1 overflow-y-auto pr-1 focus:outline-none"
          tabIndex={0}
        >
          {isLoading ? (
            <TableRowSkeleton />
          ) : isError ? (
            <div className="p-8 text-center text-red-600">
              <p className="text-xs font-semibold">Failed to fetch borrower records.</p>
              <p className="text-2xs text-slate-500 mt-1">{(error as Error)?.message}</p>
            </div>
          ) : borrowers.length === 0 ? (
            <EmptyState
              title={`Zero Borrowers in ${meta?.displayName || 'this cohort'}`}
              description="Either all accounts in this operational cell have cured/resolved, or your current filter criteria matched zero records."
              isFiltered={true}
              onResetFilters={resetFilters}
            />
          ) : (
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative'
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const borrower = borrowers[virtualRow.index];
                if (!borrower) return null;
                return (
                  <div
                    key={borrower.loanNo}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`
                    }}
                    className="py-1"
                  >
                    <BorrowerRow
                      borrower={borrower}
                      rankIndex={virtualRow.index + 1}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
