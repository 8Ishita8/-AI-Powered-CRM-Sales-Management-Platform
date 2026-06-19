import React, { useState } from 'react';
import { Clock, User, PhoneCall, Plus, X, CheckCircle2 } from 'lucide-react';

interface FollowupTask {
  id: string;
  title: string;
  description: string;
  time: string;
  date: 'Today' | 'Tomorrow' | 'Next Week';
  lead: string;
  completed: boolean;
}

export const FollowupsCalendar: React.FC = () => {
  const [tasks, setTasks] = useState<FollowupTask[]>([
    { id: 'task-1', title: 'Pricing Call', description: 'Discuss volume discount structure', time: '10:30 AM', date: 'Today', lead: 'James Carter', completed: false },
    { id: 'task-2', title: 'Contract Review', description: 'Review SLA terms with legal team', time: '2:00 PM', date: 'Today', lead: 'Sarah Lin', completed: true },
    { id: 'task-3', title: 'Outreach Followup', description: 'Introduce enterprise platform features', time: '11:00 AM', date: 'Tomorrow', lead: 'Robert Downey', completed: false },
    { id: 'task-4', title: 'Technical Briefing', description: 'Review API payload specifications', time: '4:15 PM', date: 'Tomorrow', lead: 'Bruce Wayne', completed: false },
    { id: 'task-5', title: 'Executive Sync', description: 'Quarterly review roadmap alignment', time: '9:00 AM', date: 'Next Week', lead: 'Lex Luthor', completed: false },
  ]);

  // Form states for Quick Call Logger
  const [formLeadName, setFormLeadName] = useState('James Carter');
  const [formDuration, setFormDuration] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Add Task Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskLead, setNewTaskLead] = useState('James Carter');
  const [newTaskTime, setNewTaskTime] = useState('10:00 AM');
  const [newTaskDate, setNewTaskDate] = useState<'Today' | 'Tomorrow' | 'Next Week'>('Today');

  // Success message state
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const triggerToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
  };

  const toggleTaskCompleted = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const handleLogCallClick = (leadName: string) => {
    setFormLeadName(leadName);
    // Focus the duration input field
    const durationInput = document.getElementById('call-duration');
    if (durationInput) {
      durationInput.focus();
    }
    triggerToast(`Active log session opened for ${leadName}!`);
  };

  const handleSaveCallRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLeadName || !formDuration) return;

    triggerToast(`Call record for ${formLeadName} successfully saved to MongoDB and queued for AI scoring!`);
    
    // Reset Form
    setFormDuration('');
    setFormNotes('');
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskDesc) return;

    const newTask: FollowupTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDesc,
      time: newTaskTime,
      date: newTaskDate,
      lead: newTaskLead,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setIsAddModalOpen(false);

    // Reset Form
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskLead('James Carter');
    setNewTaskTime('10:00 AM');
    setNewTaskDate('Today');

    triggerToast(`Task "${newTask.title}" added to schedule!`);
  };

  const dates: ('Today' | 'Tomorrow' | 'Next Week')[] = ['Today', 'Tomorrow', 'Next Week'];

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
          <h2 className="text-3xl font-bold tracking-tight text-white font-outfit">Follow-ups & Tasks</h2>
          <p className="text-slate-400 text-sm mt-1">
            Stay on top of your client schedule. Toggle checkboxes to mark tasks as completed.
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 transform active:scale-95 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agenda list grouped by date */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 shadow-xl shadow-slate-950/40">
          {dates.map((dateGroup) => {
            const groupTasks = tasks.filter((t) => t.date === dateGroup);
            if (groupTasks.length === 0) return null;
            return (
              <div key={dateGroup} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 pb-1.5 border-b border-slate-800/80">
                  {dateGroup}
                </h3>
                <div className="space-y-2.5">
                  {groupTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-xl border transition-all flex items-start justify-between ${
                        task.completed
                          ? 'bg-slate-950/20 border-slate-850/40 opacity-60'
                          : 'bg-slate-950/60 border-slate-850 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex items-start space-x-3.5">
                        {/* Custom checkbox */}
                        <div className="flex items-center h-5 mt-0.5">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskCompleted(task.id)}
                            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
                          />
                        </div>

                        <div>
                          <h4
                            className={`font-semibold text-sm ${
                              task.completed ? 'line-through text-slate-500' : 'text-white font-outfit'
                            }`}
                          >
                            {task.title}
                          </h4>
                          <p className={`text-xs mt-1 ${task.completed ? 'text-slate-500' : 'text-slate-400'}`}>
                            {task.description}
                          </p>

                          <div className="flex items-center space-x-3 text-[10px] text-slate-500 pt-2 font-medium">
                            <span className="flex items-center">
                              <Clock className="w-3.5 h-3.5 mr-1 text-indigo-400" />
                              {task.time}
                            </span>
                            <span className="flex items-center">
                              <User className="w-3.5 h-3.5 mr-1 text-purple-405" />
                              {task.lead}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleLogCallClick(task.lead)}
                        className="flex items-center space-x-1.5 text-[10px] bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-450 hover:text-white px-2.5 py-1.5 rounded-lg transition-all font-semibold"
                      >
                        <PhoneCall className="w-3 h-3 text-emerald-450" />
                        <span>Log Call</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Log Form */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-max shadow-xl shadow-slate-950/40">
          <h3 className="text-lg font-bold text-white mb-4 font-outfit">Quick Call Logger</h3>
          <form className="space-y-4" onSubmit={handleSaveCallRecord}>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Lead Name</label>
              <select 
                value={formLeadName}
                onChange={(e) => setFormLeadName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="James Carter">James Carter (Google)</option>
                <option value="Sarah Lin">Sarah Lin (Meta)</option>
                <option value="Robert Downey">Robert Downey (Stark Industries)</option>
                <option value="Bruce Wayne">Bruce Wayne (Wayne Enterprises)</option>
                <option value="Lex Luthor">Lex Luthor (LexCorp)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Duration (Seconds)</label>
              <input
                id="call-duration"
                type="number"
                required
                value={formDuration}
                onChange={(e) => setFormDuration(e.target.value)}
                placeholder="e.g. 180"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Call Summary & Notes</label>
              <textarea
                rows={4}
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Mention interest level, objections, and next steps..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs transition-all shadow-lg shadow-indigo-600/10 active:scale-95 transform duration-150"
            >
              Save Call Record
            </button>
          </form>
        </div>
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative animate-scale-in">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-450 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-1 font-outfit">Schedule Follow-up Task</h3>
            <p className="text-xs text-slate-400 mb-5">Create a task touchpoint for your sales calendar.</p>

            <form onSubmit={handleAddTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Task Title</label>
                <input 
                  type="text" 
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Contract Review Session"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description / Objective</label>
                <input 
                  type="text" 
                  required
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="e.g. Align SLA terms and volume pricing brackets"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Associated Lead</label>
                <select 
                  value={newTaskLead}
                  onChange={(e) => setNewTaskLead(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="James Carter">James Carter (Google)</option>
                  <option value="Sarah Lin">Sarah Lin (Meta)</option>
                  <option value="Robert Downey">Robert Downey (Stark Industries)</option>
                  <option value="Bruce Wayne">Bruce Wayne (Wayne Enterprises)</option>
                  <option value="Lex Luthor">Lex Luthor (LexCorp)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Schedule Date</label>
                  <select 
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Next Week">Next Week</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Scheduled Time</label>
                  <input 
                    type="text" 
                    required
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    placeholder="e.g. 11:30 AM"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs transition-all shadow-lg shadow-indigo-600/20 active:scale-98 transform duration-150"
              >
                Schedule Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowupsCalendar;
