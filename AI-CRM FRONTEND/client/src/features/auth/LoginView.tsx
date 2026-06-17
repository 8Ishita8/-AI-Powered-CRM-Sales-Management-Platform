import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../context/AuthContext';
import { Sparkles, Shield, UserCheck, Briefcase } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleLogin = (role: UserRole) => {
    const defaultEmails = {
      admin: 'admin.sales@aicrm.com',
      manager: 'manager.alpha@aicrm.com',
      executive: 'exec.john@aicrm.com',
    };
    login(defaultEmails[role], role);
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0f19] px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl shadow-indigo-950/20 text-center">
        <div className="w-14 h-14 bg-indigo-600/10 border border-indigo-500/25 text-indigo-400 flex items-center justify-center rounded-2xl mx-auto mb-5">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Antigravity CRM</h2>
        <p className="text-sm text-slate-400 mb-8">
          Welcome back! Select a role to sign in instantly and test the RBAC shell features.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => handleRoleLogin('admin')}
            className="w-full flex items-center justify-between p-4 bg-slate-850 hover:bg-slate-800 border border-slate-750 hover:border-slate-700 text-left rounded-xl transition-all group"
          >
            <div className="flex items-center space-x-3.5">
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2.5 rounded-lg group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Administrator Access</p>
                <p className="text-xs text-slate-400">Full platform settings & global analytics</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleRoleLogin('manager')}
            className="w-full flex items-center justify-between p-4 bg-slate-850 hover:bg-slate-800 border border-slate-750 hover:border-slate-700 text-left rounded-xl transition-all group"
          >
            <div className="flex items-center space-x-3.5">
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-2.5 rounded-lg group-hover:scale-105 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Sales Manager Access</p>
                <p className="text-xs text-slate-400">Team performance metrics & campaigns</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleRoleLogin('executive')}
            className="w-full flex items-center justify-between p-4 bg-slate-850 hover:bg-slate-800 border border-slate-750 hover:border-slate-700 text-left rounded-xl transition-all group"
          >
            <div className="flex items-center space-x-3.5">
              <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 p-2.5 rounded-lg group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Sales Executive Access</p>
                <p className="text-xs text-slate-400">Leads management & scheduled follow-ups</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
