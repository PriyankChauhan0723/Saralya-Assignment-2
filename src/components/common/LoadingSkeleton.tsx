import React from 'react';

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2.5 w-full">
      {Array.from({ length: 9 }).map((_, idx) => (
        <div
          key={idx}
          className="h-28 rounded-xl border border-slate-200 bg-white p-3 shadow-sm animate-pulse flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div className="h-4 bg-slate-200 rounded w-24"></div>
            <div className="h-4 bg-slate-200 rounded w-12"></div>
          </div>
          <div className="space-y-1.5">
            <div className="h-5 bg-slate-200 rounded w-16"></div>
            <div className="h-3 bg-slate-100 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="h-11 rounded-lg bg-slate-100/80 animate-pulse border border-slate-200/50"
        />
      ))}
    </div>
  );
}
