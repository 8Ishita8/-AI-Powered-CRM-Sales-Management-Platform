import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Plus, X, Building, Mail, Phone, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import AIInsights from './components/AIInsights';

interface Lead {
  id: string;
  name: string;
  company: string;
  score: number;
  stage: 'new_lead' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  status: 'Hot' | 'Warm' | 'Cold';
  email: string;
  phone: string;
}

export const LeadsList: React.FC = () => {
  const { user } = useAuth();

  // State for leads list
  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', name: 'James Carter', company: 'Google', score: 92, stage: 'proposal', status: 'Hot', email: 'james.carter@google.com', phone: '+1 (555) 019-2834' },
    { id: '2', name: 'Sarah Lin', company: 'Meta', score: 87, stage: 'negotiation', status: 'Hot', email: 'sarah.lin@meta.com', phone: '+1 (555) 043-9812' },
    { id: '3', name: 'Robert Downey', company: 'Stark Industries', score: 65, stage: 'qualified', status: 'Warm', email: 'tony@stark.com', phone: '+1 (555) 300-3000' },
    { id: '4', name: 'Selena Gomez', company: 'Rare Beauty', score: 43, stage: 'new_lead', status: 'Cold', email: 'selena@rarebeauty.com', phone: '+1 (555) 872-4910' },
  ]);

  // Modals & Drawer States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form states for adding lead
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadStage, setNewLeadStage] = useState<Lead['stage']>('new_lead');
  const [newLeadStatus, setNewLeadStatus] = useState<Lead['status']>('Warm');

  // AI scoring / email simulation state
  const [isScoring, setIsScoring] = useState(false);
  const [isEmailGenerating, setIsEmailGenerating] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const triggerToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
  };

  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadCompany) return;

    const baseScore = newLeadStage === 'won' ? 100 : newLeadStage === 'negotiation' ? 90 : newLeadStage === 'proposal' ? 80 : 50;

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: newLeadName,
      company: newLeadCompany,
      score: baseScore,
      stage: newLeadStage,
      status: newLeadStatus,
      email: newLeadEmail || `${newLeadName.toLowerCase().replace(' ', '.')}@${newLeadCompany.toLowerCase().replace(' ', '')}.com`,
      phone: newLeadPhone || '+1 (555) 000-0000',
    };

    setLeads([newLead, ...leads]);
    setIsAddModalOpen(false);

    // Reset Form
    setNewLeadName('');
    setNewLeadCompany('');
    setNewLeadEmail('');
    setNewLeadPhone('');
    setNewLeadStage('new_lead');
    setNewLeadStatus('Warm');

    triggerToast(`Lead "${newLead.name}" added successfully and queued for background AI processing!`);
  };

  const handleTriggerScoring = (leadId: string) => {
    setIsScoring(true);
    setTimeout(() => {
      setLeads(prev =>
        prev.map(l => {
          if (l.id === leadId) {
            const randomScoreDiff = Math.floor(Math.random() * 15) - 5; // Change score slightly
            const nextScore = Math.max(10, Math.min(100, l.score + randomScoreDiff));
            const nextStatus = nextScore >= 80 ? 'Hot' : nextScore >= 50 ? 'Warm' : 'Cold';
            
            // If the selected lead is active in the drawer, update it too
            if (selectedLead && selectedLead.id === leadId) {
              setSelectedLead({ ...selectedLead, score: nextScore, status: nextStatus });
            }
            return { ...l, score: nextScore, status: nextStatus };
          }
          return l;
        })
      );
      setIsScoring(false);
      triggerToast('AI Conversion score recalculated successfully!');
    }, 1500);
  };

  const handleGenerateEmail = (leadName: string, company: string) => {
    setIsEmailGenerating(true);
    setGeneratedEmail(null);
    setTimeout(() => {
      setGeneratedEmail({
        subject: `Follow-up Discussion: CRM Demo for ${company}`,
        body: `Hi ${leadName},\n\nHope you are having a productive week.\n\nFollowing up on our recent discussion, I would love to schedule a quick 15-minute sync next week to address any outstanding technical questions about our CRM platform and review our customized pricing proposal.\n\nDo you have availability next Tuesday morning?\n\nBest regards,\n${user?.name || 'Sales Representative'}\nAntigravity Sales Team`,
      });
      setIsEmailGenerating(false);
      triggerToast('Personalized AI email draft ready!');
    }, 1200);
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center space-x-2.5 bg-emerald-500 text-white px-5 py-3.5 rounded-2xl shadow-xl shadow-emerald-950/20 font-semibold animate-slide-in border border-emerald-400/25">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm">{successToast}</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white font-outfit">Leads & CRM</h2>
          <p className="text-slate-400 text-sm mt-1">
            {user?.role === 'executive' 
              ? 'Showing only leads assigned to you (Sales Executive filter active).' 
              : 'Showing all team leads (Manager/Admin view).'}
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 transform active:scale-95 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* AI Insights Card widget */}
      <AIInsights />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-slate-950/40">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="p-4 pl-6">Name</th>
              <th className="p-4">Company</th>
              <th className="p-4">AI Score</th>
              <th className="p-4">Sales Stage</th>
              <th className="p-4">Priority</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-850/30 transition-all duration-150">
                <td className="p-4 pl-6 font-semibold text-white">{lead.name}</td>
                <td className="p-4 text-slate-300">{lead.company}</td>
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
                  <span className="bg-slate-850 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg text-xs font-medium">
                    {lead.stage.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    lead.status === 'Hot' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : lead.status === 'Warm' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="p-4 pr-6 text-right">
                  <button 
                    onClick={() => {
                      setSelectedLead(lead);
                      setGeneratedEmail(null);
                      setIsDrawerOpen(true);
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold px-3 py-1.5 hover:bg-indigo-500/10 rounded-lg transition-all"
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative animate-scale-in">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-450 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-1 font-outfit">Create New Lead</h3>
            <p className="text-xs text-slate-400 mb-5">Fill in the lead details below to seed onto the dashboard.</p>

            <form onSubmit={handleAddLeadSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Lead Name</label>
                <input 
                  type="text" 
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="e.g. Elon Musk"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Company / Organization</label>
                <input 
                  type="text" 
                  required
                  value={newLeadCompany}
                  onChange={(e) => setNewLeadCompany(e.target.value)}
                  placeholder="e.g. SpaceX"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                  <input 
                    type="text" 
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Sales Stage</label>
                  <select 
                    value={newLeadStage}
                    onChange={(e) => setNewLeadStage(e.target.value as Lead['stage'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="new_lead">New Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="won">Won / Closed</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Priority Level</label>
                  <select 
                    value={newLeadStatus}
                    onChange={(e) => setNewLeadStatus(e.target.value as Lead['status'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Hot">Hot (High)</option>
                    <option value="Warm">Warm (Medium)</option>
                    <option value="Cold">Cold (Low)</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs transition-all shadow-lg shadow-indigo-600/20 duration-200 transform active:scale-98"
              >
                Create Lead Document
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Profile Sliding Side Drawer */}
      {isDrawerOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full shadow-2xl p-6 relative flex flex-col justify-between overflow-y-auto animate-slide-left">
            <div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-6 mt-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center font-bold text-lg text-indigo-400 shadow-inner">
                  {selectedLead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-outfit leading-tight">{selectedLead.name}</h3>
                  <span className="text-xs text-indigo-400 font-semibold">{selectedLead.company}</span>
                </div>
              </div>

              <div className="space-y-5">
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-300 truncate">{selectedLead.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-300">{selectedLead.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-300">{selectedLead.company} HQ</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-300">Added: 3 days ago</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI Scoring Analysis</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      selectedLead.score >= 80 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                        : selectedLead.score >= 50 
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                    }`}>
                      {selectedLead.status} Intent
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Conversion Probability</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Calculated using background AI services</p>
                      </div>
                    </div>
                    <span className="text-2xl font-extrabold text-white">{selectedLead.score}%</span>
                  </div>

                  <button
                    onClick={() => handleTriggerScoring(selectedLead.id)}
                    disabled={isScoring}
                    className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 disabled:opacity-50 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-755 rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 transition-all"
                  >
                    {isScoring ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin"></div>
                        <span>Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                        <span>Recalculate AI Score</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI Communication Assistant</h4>
                  
                  {generatedEmail ? (
                    <div className="space-y-3 animate-fade-in">
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-450">
                        <span className="font-semibold text-slate-300">Subject:</span> {generatedEmail.subject}
                      </div>
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed font-medium whitespace-pre-line max-h-48 overflow-y-auto">
                        {generatedEmail.body}
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(generatedEmail.body);
                          triggerToast('Copied draft to clipboard!');
                        }}
                        className="w-full py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg font-semibold text-xs transition-colors"
                      >
                        Copy Draft to Clipboard
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleGenerateEmail(selectedLead.name, selectedLead.company)}
                      disabled={isEmailGenerating}
                      className="w-full py-2.5 bg-indigo-600/10 hover:bg-indigo-650/20 disabled:opacity-50 text-indigo-450 border border-indigo-500/20 hover:border-indigo-500/30 rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 transition-all"
                    >
                      {isEmailGenerating ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-indigo-500/30 border-t-indigo-450 rounded-full animate-spin"></div>
                          <span>Generating Draft...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Generate AI Follow-up Email</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-850 mt-6 flex justify-between items-center text-xs">
              <span className="text-slate-500">Lead ID: {selectedLead.id}</span>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="flex items-center space-x-1.5 text-slate-400 hover:text-white font-semibold"
              >
                <span>Close Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsList;

