import React, { useState } from 'react';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

interface AIAnalysis {
  score: number;
  class: 'high' | 'medium' | 'low';
  summary: string;
  nextSteps: string[];
}

const ANALYSES: AIAnalysis[] = [
  {
    score: 87,
    class: 'high',
    summary: 'Lead visited the pricing page 5 times within the last 24 hours. They have completed product demo video tours and responded positively to the initial discovery call.',
    nextSteps: [
      'Email a custom enterprise volume pricing proposal.',
      'Invite their technical lead to a developer integration Q&A.',
    ],
  },
  {
    score: 54,
    class: 'medium',
    summary: 'Lead opened the email campaign newsletters but has not visited the catalog sheets yet. The initial callback was marked as missed.',
    nextSteps: [
      'Trigger automated follow-up SMS sequence tomorrow morning.',
      'Log another phone outreach attempts during standard business hours.',
    ],
  },
  {
    score: 18,
    class: 'low',
    summary: 'No active web interface sessions detected in over 30 days. Last outreach was cataloged as rejected (low budget alignment).',
    nextSteps: [
      'Transition this contact to the quarterly cold re-engagement queue.',
      'Monitor for subsequent visits or inbound quote requests.',
    ],
  },
];

export const AIInsights: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const current = ANALYSES[index];

  const handleRegenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % ANALYSES.length);
      setLoading(false);
    }, 1200);
  };

  // SVGs circumference constants for circular progress bar
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (current.score / 100) * circumference;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
      {/* Header section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-white tracking-tight text-sm">AI Lead Scoring Intelligence</h3>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={loading}
          className={`flex items-center space-x-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-900 disabled:opacity-50 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-all ${
            loading ? 'cursor-not-allowed' : ''
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          <span>{loading ? 'Analyzing...' : 'Refresh'}</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-center space-y-3">
          <div className="w-10 h-10 border-2 border-indigo-600/30 border-t-indigo-400 rounded-full animate-spin"></div>
          <p className="text-xs text-indigo-300 font-semibold tracking-wider uppercase animate-pulse">
            Processing event history & logs...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Circular score gauge */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative flex items-center justify-center">
              <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
                <circle
                  stroke="#1e293b"
                  fill="transparent"
                  strokeWidth={stroke}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />
                <circle
                  stroke={current.class === 'high' ? '#10b981' : current.class === 'medium' ? '#f59e0b' : '#ef4444'}
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeDasharray={circumference + ' ' + circumference}
                  style={{ strokeDashoffset }}
                  strokeLinecap="round"
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-bold text-white leading-none">{current.score}%</span>
                <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Score</span>
              </div>
            </div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-3 capitalize border ${
              current.class === 'high' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                : current.class === 'medium' 
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' 
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
            }`}>
              {current.class} Intent
            </span>
          </div>

          {/* AI narrative summary */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                "{current.summary}"
              </p>
            </div>

            {/* Next Best Action panel */}
            <div className="space-y-2">
              <span className="flex items-center space-x-1.5 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                <AlertCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Next Best Actions</span>
              </span>
              <ul className="space-y-2">
                {current.nextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start text-xs text-slate-400">
                    <span className="text-indigo-500 mr-2 font-bold select-none">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
