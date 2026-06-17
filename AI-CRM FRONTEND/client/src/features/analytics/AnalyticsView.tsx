import React from 'react';
import { ShieldCheck, BarChart3, Users, Zap } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl w-max">
        <ShieldCheck className="w-5 h-5" />
        <span className="text-xs font-semibold uppercase tracking-wider">Administrator Security Clearance Active</span>
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Global Analytics & Auditing</h2>
        <p className="text-slate-400 text-sm mt-1">Access global velocity stats, platform diagnostic metrics, and audit logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm">System Latency</h3>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-bold text-white">42ms</p>
          <span className="text-xs text-slate-500">LLM API prompt generation response time</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm">Daily API Cost</h3>
            <BarChart3 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-bold text-white">$14.82</p>
          <span className="text-xs text-slate-500">Vetted prompt counts: 374 tokens parsed</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm">Active Session Count</h3>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-bold text-white">128</p>
          <span className="text-xs text-slate-500">Distributed across 4 regional office segments</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-4">Recent Administrator Activity Log</h3>
        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between border-b border-slate-800/60 pb-2">
            <span className="text-slate-400">[2026-06-17 19:41:00] user.role updated to 'admin' (Test simulated)</span>
            <span className="text-indigo-400">SUCCESS</span>
          </div>
          <div className="flex justify-between border-b border-slate-800/60 pb-2">
            <span className="text-slate-400">[2026-06-17 19:35:12] campaign 'Pricing Drop' queued via scheduler</span>
            <span className="text-indigo-400">QUEUED</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-slate-400">[2026-06-17 19:30:45] lead_scoring engine background worker initialized</span>
            <span className="text-indigo-400">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
