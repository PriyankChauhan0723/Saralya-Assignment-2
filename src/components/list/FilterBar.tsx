import React from 'react';
import { Search, ArrowUpDown, RotateCcw } from 'lucide-react';
import { useFilterStore } from '../../store/useFilterStore.ts';
import { OrderingExplainer } from './OrderingExplainer.tsx';

interface FilterBarProps {
  searchInputRef?: React.RefObject<HTMLInputElement>;
}

export function FilterBar({ searchInputRef }: FilterBarProps) {
  const {
    state,
    setState,
    product,
    setProduct,
    odBucket,
    setOdBucket,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    resetFilters
  } = useFilterStore();

  const isFiltered = !!(state || product || odBucket || searchQuery || sortBy !== 'rvp');

  return (
    <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs mb-3 space-y-2.5">
      {/* Top row: Search input & Calling Order Explainer */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Borrower Name, Loan ID, District, or State (Press '/' to focus)..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>
        <OrderingExplainer />
      </div>

      {/* Bottom row: Faceted Filters & Sorting Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* State Filter */}
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-2xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All States</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
          </select>

          {/* Product Filter */}
          <select
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-2xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Products</option>
            <option value="JLG Microloan">JLG Microloan</option>
            <option value="Individual Business">Individual Business</option>
            <option value="Agri Dairy Loan">Agri Dairy Loan</option>
            <option value="2-Wheeler Loan">2-Wheeler Loan</option>
          </select>

          {/* OD Bucket Filter */}
          <select
            value={odBucket}
            onChange={(e) => setOdBucket(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-2xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All OD Buckets</option>
            <option value="1-30 DPD">1-30 DPD</option>
            <option value="31-60 DPD">31-60 DPD</option>
            <option value="61-90 DPD">61-90 DPD</option>
            <option value="90+ DPD">90+ DPD</option>
          </select>

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 px-2 py-1 text-2xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Sorting Controller */}
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-2xs font-bold text-slate-800 cursor-pointer focus:ring-1 focus:ring-blue-500"
          >
            <option value="rvp">RVP Priority (Recommended)</option>
            <option value="od_days">Days Past Due (DPD)</option>
            <option value="outstanding_principal">Outstanding Principal</option>
            <option value="intent_score">Intent Score</option>
            <option value="ability_score">Ability Score</option>
          </select>

          <button
            onClick={toggleSortOrder}
            className="p-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title={`Toggle Sort Order (Currently ${sortOrder})`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
