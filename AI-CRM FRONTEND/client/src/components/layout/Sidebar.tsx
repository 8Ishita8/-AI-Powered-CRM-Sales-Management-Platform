import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Kanban,
  Layers,
  Calendar,
  Mail,
  ShieldCheck,
  LogOut,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, switchRole, logout } = useAuth();
  const role = user?.role || 'executive';

  // Navigation Items with RBAC definitions
  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'manager', 'executive'],
    },
    {
      name: 'Leads & CRM',
      path: '/leads',
      icon: Layers,
      roles: ['admin', 'manager', 'executive'],
    },
    {
      name: 'Sales Pipeline',
      path: '/pipeline',
      icon: Kanban,
      roles: ['admin', 'manager', 'executive'],
    },
    {
      name: 'Follow-ups & Tasks',
      path: '/followups',
      icon: Calendar,
      roles: ['admin', 'manager', 'executive'],
    },
    {
      name: 'Email Campaigns',
      path: '/campaigns',
      icon: Mail,
      roles: ['admin', 'manager'],
    },
    {
      name: 'Team Performance',
      path: '/team-management',
      icon: Users,
      roles: ['admin', 'manager'],
    },
    {
      name: 'Global Analytics',
      path: '/analytics',
      icon: ShieldCheck,
      roles: ['admin'],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen text-slate-300">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/30">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight leading-none">Antigravity CRM</h1>
          <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">AI Powered</span>
        </div>
      </div>

      {/* Tester Role Switcher */}
      <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-950/40">
        <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-2">Simulate User Role</p>
        <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800/80">
          {(['admin', 'manager', 'executive'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => switchRole(r)}
              className={`text-[10px] py-1.5 px-1 rounded font-medium capitalize transition-all ${
                role === r
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {r === 'executive' ? 'Exec' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-2 text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-2">Navigation</p>
        {navItems
          .filter((item) => item.roles.includes(role))
          .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                      : 'hover:bg-slate-800/50 hover:text-white border border-transparent'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-105" />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className="w-3 h-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-indigo-400" />
              </NavLink>
            );
          })}
      </nav>

      {/* Footer Profile Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/20 flex flex-col space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-inner">
            {user?.name.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white truncate">{user?.name}</h4>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700 capitalize mt-0.5">
              {role}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 hover:bg-slate-800/50 hover:text-red-400 text-slate-400 text-sm rounded-lg transition-colors font-medium border border-transparent hover:border-slate-800"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
