import React from 'react';
import { Database, FileJson, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore.ts';

export function DataSourceBadge() {
  const { isFixtureMode, toggleFixtureMode, isBackendHealthy } = useAppStore();

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={toggleFixtureMode}
        title={
          isFixtureMode
            ? 'Running on Frozen Fixture Bundle (Click to switch to Live Backend)'
            : isBackendHealthy
            ? 'Connected to Live PostgreSQL Backend :3000 (Click to toggle Fixtures)'
            : 'Live Backend Unreachable, Auto-fallback Active (Click to retry)'
        }
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all shadow-xs ${
          isFixtureMode
            ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            : isBackendHealthy
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
        }`}
      >
        {isFixtureMode ? (
          <>
            <FileJson className="w-3.5 h-3.5 text-amber-600" />
            <span>Fixtures Active</span>
          </>
        ) : isBackendHealthy ? (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Live API (:3000)</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>API Offline (Fallback)</span>
          </>
        )}
      </button>
    </div>
  );
}
