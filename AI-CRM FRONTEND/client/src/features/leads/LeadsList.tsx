import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Plus } from 'lucide-react';
import AIInsights from './components/AIInsights';

export const LeadsList: React.FC = () => {
  const { user } = useAuth();

  const leads = [
    { id: '1', name: 'James Carter', company: 'Google', score: 92, stage: 'proposal', status: 'Hot' },
    { id: '2', name: 'Sarah Lin', company: 'Meta', score: 87, stage: 'negotiation', status: 'Hot' },
    { id: '3', name: 'Robert Downey', company: 'Stark Industries', score: 65, stage: 'qualified', status: 'Warm' },
    { id: '4', name: 'Selena Gomez', company: 'Rare Beauty', score: 43, stage: 'new_lead', status: 'Cold' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Leads & CRM</h2>
          <p className="text-slate-400 text-sm mt-1">
            {user?.role === 'executive' 
              ? 'Showing only leads assigned to you (Sales Executive filter active).' 
              : 'Showing all team leads (Manager/Admin view).'}
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* AI Insights Card widget */}
      <AIInsights />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase">
              <th className="p-4">Name</th>
              <th className="p-4">Company</th>
              <th className="p-4">AI Score</th>
              <th className="p-4">Sales Stage</th>
              <th className="p-4">Priority</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-850/40 transition-colors">
                <td className="p-4 font-semibold text-white">{lead.name}</td>
                <td className="p-4">{lead.company}</td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      lead.score >= 80 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : lead.score >= 50 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {lead.score}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                </td>
                <td className="p-4 capitalize">
                  <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs">
                    {lead.stage.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                    lead.status === 'Hot' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsList;
