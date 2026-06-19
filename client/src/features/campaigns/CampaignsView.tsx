import React from 'react';
import { Mail, Plus, Play, Trash } from 'lucide-react';

export const CampaignsView: React.FC = () => {
  const campaigns = [
    { id: '1', name: 'Pricing Drop Outreach', template: 'Follow-up template', status: 'Active', sentCount: 154, target: 500 },
    { id: '2', name: 'Winter Demo Offer', template: 'Proposal Template', status: 'Scheduled', sentCount: 0, target: 1200 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Email Campaigns</h2>
          <p className="text-slate-400 text-sm mt-1">Design automated templates and split dispatch schedules to fit SMTP limits.</p>
        </div>
        <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {campaigns.map((camp) => (
          <div key={camp.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl mt-1">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{camp.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Template: <span className="font-mono text-indigo-400">{camp.template}</span></p>
                
                <div className="flex items-center space-x-4 mt-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                    camp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {camp.status}
                  </span>
                  
                  <span className="text-xs text-slate-500">
                    Dispatched: <strong>{camp.sentCount}</strong> / {camp.target} Leads
                  </span>
                </div>
              </div>
            </div>

            {/* Campaign Progress Bar */}
            <div className="w-full md:w-64 bg-slate-950 border border-slate-805 h-3 rounded-full overflow-hidden relative">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${(camp.sentCount / camp.target) * 100}%` }}
              ></div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center space-x-2">
              <button className="p-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-400 hover:text-white rounded-xl transition-all">
                <Play className="w-4 h-4" />
              </button>
              <button className="p-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-750 text-slate-400 hover:text-red-400 rounded-xl transition-all">
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignsView;
