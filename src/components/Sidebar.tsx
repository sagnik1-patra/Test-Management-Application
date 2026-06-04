import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle } from 'lucide-react';
import logoImg from '../assets/logo.png';

export const Sidebar: React.FC = () => {
  const linkStyles = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-heading font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-primary-600 text-white shadow-md shadow-primary-600/15'
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
    }`;

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0 select-none">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200 space-x-3">
        <img src={logoImg} alt="Preproute Logo" className="w-8 h-8 object-contain filter drop-shadow-[0_2px_6px_rgba(79,70,229,0.2)]" />
        <span className="text-lg font-heading font-black text-slate-900 uppercase tracking-widest">
          Preproute
        </span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-2.5">
        <NavLink to="/dashboard" className={linkStyles}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/tests/create" className={linkStyles}>
          <PlusCircle size={18} />
          <span>Create Test</span>
        </NavLink>
      </nav>

      {/* Footer copyright */}
      <div className="p-4 border-t border-slate-100 text-center">
        <p className="text-xxs text-slate-400 font-medium">
          Preproute © 2026 Admin Panel
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
