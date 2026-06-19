import React from 'react';
import { UserPlus, Award, TrendingUp } from 'lucide-react';

export const TeamView: React.FC = () => {
  const members = [
    { id: '1', name: 'John Doe', role: 'Sales Executive', pipelineVal: '$120k', rank: '1' },
    { id: '2', name: 'Alice Smith', role: 'Sales Executive', pipelineVal: '$95k', rank: '2' },
    { id: '3', name: 'Bob Johnson', role: 'Sales Executive', pipelineVal: '$85k', rank: '3' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Team Performance</h2>
          <p className="text-slate-400 text-sm mt-1">Monitor sales executive pipelines and assign incoming leads.</p>
        </div>
        <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          <UserPlus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-lg">
                  {member.name.charAt(0)}
                </div>
                <span className="flex items-center space-x-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-semibold">
                  <Award className="w-3.5 h-3.5" />
                  <span>Rank #{member.rank}</span>
                </span>
              </div>

              <h3 className="font-bold text-white text-lg mt-4">{member.name}</h3>
              <p className="text-xs text-slate-400">{member.role}</p>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Pipeline Value</span>
                <span className="text-lg font-bold text-white mt-0.5">{member.pipelineVal}</span>
              </div>
              <button className="flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
                <TrendingUp className="w-4 h-4" />
                <span>View Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamView;
