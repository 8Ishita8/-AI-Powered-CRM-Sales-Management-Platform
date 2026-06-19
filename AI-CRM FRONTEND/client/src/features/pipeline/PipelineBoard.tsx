import React, { useState } from 'react';
import { Sparkles, Plus } from 'lucide-react';

interface LeadCard {
  id: string;
  name: string;
  company: string;
  score: number;
  stage: 'new_lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
}

const INITIAL_LEADS: LeadCard[] = [
  { id: 'lead-1', name: 'James Carter', company: 'Google Inc.', score: 92, stage: 'proposal' },
  { id: 'lead-2', name: 'Sarah Lin', company: 'Meta Platforms', score: 87, stage: 'negotiation' },
  { id: 'lead-3', name: 'Robert Downey', company: 'Stark Industries', score: 65, stage: 'qualified' },
  { id: 'lead-4', name: 'Selena Gomez', company: 'Rare Beauty', score: 43, stage: 'new_lead' },
  { id: 'lead-5', name: 'Bruce Wayne', company: 'Wayne Enterprises', score: 95, stage: 'won' },
  { id: 'lead-6', name: 'Lex Luthor', company: 'LexCorp', score: 18, stage: 'lost' },
];

const STAGES = [
  { id: 'new_lead', title: 'New Leads', color: 'border-blue-500/30 text-blue-400 bg-blue-500/5' },
  { id: 'qualified', title: 'Qualified', color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' },
  { id: 'proposal', title: 'Proposal', color: 'border-purple-500/30 text-purple-400 bg-purple-500/5' },
  { id: 'negotiation', title: 'Negotiation', color: 'border-amber-500/30 text-amber-400 bg-amber-500/5' },
  { id: 'won', title: 'Won', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' },
  { id: 'lost', title: 'Lost', color: 'border-rose-500/30 text-rose-400 bg-rose-500/5' },
] as const;

export const PipelineBoard: React.FC = () => {
  const [leads, setLeads] = useState<LeadCard[]>(INITIAL_LEADS);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stage: LeadCard['stage']) => {
    e.preventDefault();
    if (!draggedId) return;

    setLeads((prev) =>
      prev.map((lead) => (lead.id === draggedId ? { ...lead, stage } : lead))
    );
    setDraggedId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Interactive Sales Pipeline</h2>
          <p className="text-slate-400 text-sm mt-1">
            Drag and drop cards across columns to update lead deal stages instantly.
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" />
          <span>New Lead Card</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {STAGES.map((col) => {
          const colLeads = leads.filter((lead) => lead.stage === col.id);
          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl flex flex-col min-w-[200px] min-h-[480px]"
            >
              {/* Column header banner */}
              <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-800">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide border uppercase ${col.color}`}>
                  {col.title}
                </span>
                <span className="text-xs text-slate-500 font-bold">{colLeads.length}</span>
              </div>

              {/* Cards grid list */}
              <div className="flex-1 space-y-3">
                {colLeads.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card.id)}
                    className={`bg-slate-900 border border-slate-800 hover:border-indigo-500 p-4 rounded-xl cursor-grab active:cursor-grabbing transition-all hover:shadow-lg hover:shadow-indigo-950/10 ${
                      draggedId === card.id ? 'opacity-40 scale-95 border-dashed border-indigo-500' : ''
                    }`}
                  >
                    <p className="font-bold text-white text-xs tracking-tight">{card.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{card.company}</p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-1 text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full font-semibold border border-indigo-500/20">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Score: {card.score}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {colLeads.length === 0 && (
                  <div className="h-full flex items-center justify-center border border-dashed border-slate-800/60 rounded-xl p-4 min-h-[120px]">
                    <span className="text-[10px] text-slate-600 font-medium tracking-wide uppercase">Stage Empty</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineBoard;
