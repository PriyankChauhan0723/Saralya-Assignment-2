import React, { ReactNode } from 'react';

interface StatMetricProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  highlight?: boolean;
}

export function StatMetric({
  label,
  value,
  subValue,
  icon,
  trend,
  trendLabel,
  highlight = false
}: StatMetricProps) {
  return (
    <div
      className={`p-3 rounded-xl border transition-all ${
        highlight
          ? 'bg-blue-50/70 border-blue-200 shadow-sm'
          : 'bg-white border-slate-200/80 shadow-xs'
      }`}
    >
      <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
        <span>{label}</span>
        {icon && <span className="text-slate-400">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold text-slate-900 tabular-nums tracking-tight">
          {value}
        </span>
        {subValue && (
          <span className="text-xs text-slate-500 font-medium tabular-nums">
            {subValue}
          </span>
        )}
      </div>
      {trendLabel && (
        <div className="mt-1 flex items-center gap-1 text-2xs">
          <span
            className={`font-semibold ${
              trend === 'up'
                ? 'text-emerald-600'
                : trend === 'down'
                ? 'text-rose-600'
                : 'text-slate-500'
            }`}
          >
            {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '●'} {trendLabel}
          </span>
        </div>
      )}
    </div>
  );
}
