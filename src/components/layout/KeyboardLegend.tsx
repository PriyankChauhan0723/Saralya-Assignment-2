import React, { useState } from 'react';
import { Keyboard, X } from 'lucide-react';

export function KeyboardLegend() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        title="Keyboard Navigation Shortcuts"
        aria-label="Keyboard Shortcuts"
      >
        <Keyboard className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-9 w-64 p-3 bg-white rounded-xl shadow-xl border border-slate-200 z-50 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-800 pb-2 border-b border-slate-100 mb-2">
            <span>Operations Shortcuts</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1.5 text-slate-600">
            <div className="flex items-center justify-between">
              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-2xs font-bold text-slate-800">
                1 - 9
              </span>
              <span>Jump to 3x3 Grid Cell</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-2xs font-bold text-slate-800">
                /
              </span>
              <span>Focus Filter Search</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-2xs font-bold text-slate-800">
                Esc
              </span>
              <span>Close Modal / Cockpit</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
