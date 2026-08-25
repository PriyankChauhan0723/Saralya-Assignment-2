import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, MessageSquare, Send, Clock } from 'lucide-react';
import { CohortMetadata } from '../../domain/types.ts';

interface AllowedActionCardProps {
  meta: CohortMetadata;
  agentCallScript?: string;
  borrowerName: string;
  outstandingAmount: number;
}

export function AllowedActionCard({
  meta,
  agentCallScript,
  borrowerName,
  outstandingAmount
}: AllowedActionCardProps) {
  const [copied, setCopied] = useState(false);
  const [sentLink, setSentLink] = useState(false);

  const policy = meta.policyConstraints;
  const scriptText = agentCallScript || `Namaste ${borrowerName} ji, I am calling from SaralCollect. We noticed your overdue installment of ₹${outstandingAmount.toLocaleString('en-IN')}. ${meta.recommendedAction}. How can we assist you today?`;

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(scriptText)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.warn('Clipboard write failed, falling back to manual selection:', err);
          // Fallback if browser permission is blocked
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendUpi = () => {
    setSentLink(true);
    setTimeout(() => setSentLink(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Approved Policy Constraints & Allowed Offers
          </h3>
        </div>
        <span className="text-3xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          Channel: {meta.operationalChannel}
        </span>
      </div>

      {/* 4 Policy Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-2xs">
        {/* Grace Period */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-0.5">
          <div className="flex items-center gap-1 text-slate-500 font-semibold text-3xs">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Max Grace Period</span>
          </div>
          <div className="font-extrabold text-xs text-slate-900">
            {policy.maxGraceDays > 0 ? `${policy.maxGraceDays} Days Max` : 'No Grace Allowed'}
          </div>
        </div>

        {/* One-Time Settlement (OTS) */}
        <div className={`p-2.5 rounded-xl border space-y-0.5 ${
          policy.allowOTS ? 'bg-amber-50/80 border-amber-200 text-amber-950' : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}>
          <div className="text-3xs font-semibold">OTS / Haircut</div>
          <div className="font-extrabold text-xs">
            {policy.allowOTS ? 'Eligible for OTS' : 'Strictly Prohibited'}
          </div>
        </div>

        {/* Restructuring */}
        <div className={`p-2.5 rounded-xl border space-y-0.5 ${
          policy.allowRestructure ? 'bg-indigo-50/80 border-indigo-200 text-indigo-950' : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}>
          <div className="text-3xs font-semibold">Tenure Restructure</div>
          <div className="font-extrabold text-xs">
            {policy.allowRestructure ? 'Allowed (Tenure Ext)' : 'Not Permitted'}
          </div>
        </div>

        {/* Digital Payment Link */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div className="text-3xs font-semibold text-slate-500">Instant UPI Link</div>
          <button
            onClick={handleSendUpi}
            disabled={sentLink || !policy.allowDigitalLink}
            className={`mt-1 py-0.5 px-2 rounded-lg text-3xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1 ${
              sentLink
                ? 'bg-emerald-600 text-white'
                : policy.allowDigitalLink
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {sentLink ? (
              <>
                <Check className="w-2.5 h-2.5" />
                <span>Link Dispatched!</span>
              </>
            ) : (
              <>
                <Send className="w-2.5 h-2.5" />
                <span>Send WhatsApp UPI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Speakable Live Call Script Box */}
      <div className="p-3 bg-blue-50/70 border border-blue-200/90 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-2xs font-extrabold text-blue-900">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>Recommended Telecaller Script (Read aloud on call):</span>
          </div>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-3xs font-bold text-blue-700 bg-white hover:bg-blue-100 px-2 py-1 rounded-lg border border-blue-200 shadow-2xs transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied!' : 'Copy Script'}</span>
          </button>
        </div>
        <p className="text-xs text-blue-950 font-medium leading-relaxed italic bg-white/80 p-2.5 rounded-lg border border-blue-100">
          "{scriptText}"
        </p>
      </div>
    </div>
  );
}
