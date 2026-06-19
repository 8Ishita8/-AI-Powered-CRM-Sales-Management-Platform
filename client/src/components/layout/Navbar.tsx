import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 text-slate-300">
      {/* Search Input bar */}
      <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-1.5 w-80 shadow-inner">
        <Search className="w-4 h-4 text-slate-500 mr-2" />
        <input
          type="text"
          placeholder="Search leads, pipelines..."
          className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-full"
        />
      </div>

      {/* Top right status/actions */}
      <div className="flex items-center space-x-6">
        {/* AI status badge */}
        <div className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>AI Lead Scoring Engine Active</span>
        </div>

        {/* Notification bell */}
        <button className="relative p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full"></span>
        </button>

        {/* Divider */}
        <div className="w-[1px] h-6 bg-slate-800"></div>

        {/* User preview */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-white leading-none">{user?.name}</p>
            <span className="text-[10px] text-slate-400 capitalize">{user?.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
