import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, TrendingUp, Users, Target, CheckCircle, Sparkles } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1. Executive Role Access Warning
  if (user?.role === 'executive') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center bg-slate-900/40 backdrop-blur-md rounded-2xl border border-indigo-500/10 max-w-xl mx-auto my-6">
        <div className="w-16 h-16 bg-amber-950/45 text-amber-450 flex items-center justify-center rounded-2xl mb-5 border border-amber-500/25">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          The Performance Analytics and Management Dashboard requires 
          <strong> Administrative or Sales Manager</strong> clearance level. 
          Your current account role is <span className="font-mono text-indigo-400 bg-slate-800 px-2 py-0.5 rounded">sales executive</span>.
        </p>
        <div className="text-[10px] text-slate-500 uppercase tracking-widest bg-slate-950/65 py-2.5 px-4 rounded-xl border border-slate-800/80">
          Use the switcher in the sidebar to simulate Admin/Manager credentials.
        </div>
      </div>
    );
  }

  // 2. Manager / Admin Analytics view
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white font-outfit">Management & Performance Dashboard</h2>
        <p className="text-slate-400 text-sm mt-1">
          Full CRM health stats, pipeline aggregates, and representative summaries.
        </p>
      </div>

      {/* KPI Stats cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Forecast</p>
            <p className="text-2xl font-bold text-white mt-0.5">$305,400</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Avg Conversion Rate</p>
            <p className="text-2xl font-bold text-white mt-0.5">72.4%</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Team Leads</p>
            <p className="text-2xl font-bold text-white mt-0.5">48 Active</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Closed / Won deals</p>
            <p className="text-2xl font-bold text-white mt-0.5">18 Deals</p>
          </div>
        </div>
      </div>

      {/* Analytics Chart Panel & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">Pipeline Distribution Value</h3>
          <div className="h-64 flex items-end space-x-4 justify-between pt-8 border-b border-slate-800">
            {[
              { label: 'New', val: 32 },
              { label: 'Qualified', val: 56 },
              { label: 'Proposal', val: 78 },
              { label: 'Negotiation', val: 94 },
              { label: 'Won', val: 110 },
              { label: 'Lost', val: 15 },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center group">
                <div
                  style={{ height: `${(col.val / 120) * 100}%` }}
                  className="w-full bg-indigo-650 hover:bg-indigo-500 rounded-t-lg transition-all relative"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-950 text-[10px] text-white py-1 px-1.5 rounded border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${col.val}k
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 mt-2 truncate max-w-full font-medium">{col.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Campaign Performance */}
        <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/15 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold w-max mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Campaigns Active</span>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Automated outreach has 84% positive score</h4>
            <p className="text-slate-350 text-xs leading-relaxed">
              Out of 174 templates delivered this week, AI analysis reveals a significant sentiment lift. 
              The response rate is 2.4x higher than standard outreach templates.
            </p>
          </div>
          <button 
            onClick={() => navigate(user?.role === 'admin' ? '/analytics' : '/leads')}
            className="w-full mt-6 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs transition-colors shadow-lg shadow-indigo-600/20 active:scale-95 transition-all duration-150"
          >
            View Analytics Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
