import React, { useState } from 'react';
import { Clock, User, PhoneCall, Plus } from 'lucide-react';

interface FollowupTask {
  id: string;
  title: string;
  description: string;
  time: string;
  date: 'Today' | 'Tomorrow' | 'Next Week';
  lead: string;
  completed: boolean;
}

const INITIAL_FOLLOWUPS: FollowupTask[] = [
  { id: 'task-1', title: 'Pricing Call', description: 'Discuss volume discount structure', time: '10:30 AM', date: 'Today', lead: 'James Carter', completed: false },
  { id: 'task-2', title: 'Contract Review', description: 'Review SLA terms with legal team', time: '2:00 PM', date: 'Today', lead: 'Sarah Lin', completed: true },
  { id: 'task-3', title: 'Outreach Followup', description: 'Introduce enterprise platform features', time: '11:00 AM', date: 'Tomorrow', lead: 'Robert Downey', completed: false },
  { id: 'task-4', title: 'Technical Briefing', description: 'Review API payload specifications', time: '4:15 PM', date: 'Tomorrow', lead: 'Bruce Wayne', completed: false },
  { id: 'task-5', title: 'Executive Sync', description: 'Quarterly review roadmap alignment', time: '9:00 AM', date: 'Next Week', lead: 'Lex Luthor', completed: false },
];

export const FollowupsCalendar: React.FC = () => {
  const [tasks, setTasks] = useState<FollowupTask[]>(INITIAL_FOLLOWUPS);

  const toggleTaskCompleted = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const dates: ('Today' | 'Tomorrow' | 'Next Week')[] = ['Today', 'Tomorrow', 'Next Week'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Follow-ups & Tasks</h2>
          <p className="text-slate-400 text-sm mt-1">
            Stay on top of your client schedule. Toggle checkboxes to mark tasks as completed.
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agenda list grouped by date */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          {dates.map((dateGroup) => {
            const groupTasks = tasks.filter((t) => t.date === dateGroup);
            if (groupTasks.length === 0) return null;
            return (
              <div key={dateGroup} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 pb-1 border-b border-slate-800/80">
                  {dateGroup}
                </h3>
                <div className="space-y-2.5">
                  {groupTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-xl border transition-all flex items-start justify-between ${
                        task.completed
                          ? 'bg-slate-950/20 border-slate-850/60 opacity-60'
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
                              task.completed ? 'line-through text-slate-500' : 'text-white'
                            }`}
                          >
                            {task.title}
                          </h4>
                          <p className={`text-xs mt-0.5 ${task.completed ? 'text-slate-650' : 'text-slate-400'}`}>
                            {task.description}
                          </p>

                          <div className="flex items-center space-x-3 text-[10px] text-slate-500 pt-2 font-medium">
                            <span className="flex items-center">
                              <Clock className="w-3.5 h-3.5 mr-1 text-indigo-450" />
                              {task.time}
                            </span>
                            <span className="flex items-center">
                              <User className="w-3.5 h-3.5 mr-1 text-purple-450" />
                              {task.lead}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="flex items-center space-x-1.5 text-[10px] bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg transition-all font-semibold">
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
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-max">
          <h3 className="text-lg font-bold text-white mb-4">Quick Call Logger</h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Lead Name</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500">
                <option>James Carter (Google)</option>
                <option>Sarah Lin (Meta)</option>
                <option>Bruce Wayne (Wayne Enterprises)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Duration (Seconds)</label>
              <input
                type="number"
                placeholder="e.g. 180"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Call Summary & Notes</label>
              <textarea
                rows={4}
                placeholder="Mention interest level, objections, and next steps..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
              ></textarea>
            </div>

            <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs transition-all shadow-lg shadow-indigo-600/10">
              Save Call Record
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FollowupsCalendar;
