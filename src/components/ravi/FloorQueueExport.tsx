import React, { useState } from 'react';
import { Download, Check, FileSpreadsheet } from 'lucide-react';
import { CapacityAllocationPlan } from '../../domain/types.ts';

interface FloorQueueExportProps {
  plan: CapacityAllocationPlan;
}

export function FloorQueueExport({ plan }: FloorQueueExportProps) {
  const [downloaded, setDownloaded] = useState(false);

  const handleExportCsv = () => {
    // Sanitize string to prevent CSV Formula Injection in spreadsheet software
    const sanitizeCsvCell = (val: any): string => {
      let str = String(val ?? '');
      // If starts with =, +, -, @, prefix with a single quote to neutralize formula execution
      if (/^[=+\-@\t\r]/.test(str)) {
        str = `'${str}`;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const headers = ['Cohort', 'Eligible_Borrowers', 'Allocated_Calls', 'Floor_Share_Pct', 'Expected_Conv_Rate', 'Expected_Yield_INR', 'Action_Directive'];
    const rows = Object.values(plan.cellAllocations).map((cell) => [
      sanitizeCsvCell(cell.displayName),
      Number(cell.totalBorrowers || 0),
      Number(cell.allocatedCalls || 0),
      sanitizeCsvCell(`${cell.allocationPercentage}%`),
      sanitizeCsvCell(`${(cell.expectedRecoveryRate * 100).toFixed(0)}%`),
      Number(cell.expectedRecoveryYield || 0),
      sanitizeCsvCell(cell.recommendedAction)
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SaralCollect_Floor_Strategy_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke Blob URL to prevent memory leaks
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <button
      onClick={handleExportCsv}
      className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
      title="Download optimized calling queue plan for floor telecallers"
    >
      {downloaded ? (
        <>
          <Check className="w-4 h-4 text-emerald-200" />
          <span>Queue Exported!</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>Deploy Queue to Floor (CSV)</span>
        </>
      )}
    </button>
  );
}
