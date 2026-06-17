import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export const Layout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar Layout */}
      <Sidebar />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar Header */}
        <Navbar />

        {/* Content Outlet scrollable container */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
