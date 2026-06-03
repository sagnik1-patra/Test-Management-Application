import React from 'react';
import { LogOut, User as UserIcon, ShieldAlert } from 'lucide-react';
import type { User } from '../types/auth.types';
import { useAuthStore } from '../store/authStore';

interface NavbarProps {
  user: User | null;
  logout: () => void;
  isMock: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ user, logout, isMock }) => {
  const setMockMode = useAuthStore((state) => state.setMockMode);

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0 shadow-sm">
      {/* Title */}
      <div className="flex items-center space-x-3">
        <h1 className="text-xl font-heading font-extrabold text-slate-800 tracking-tight m-0 select-none">
          Preproute Portal
        </h1>
        {isMock && (
          <div 
            onClick={() => setMockMode(false)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors"
            title="API calls timed out or failed. Click to re-attempt Live API Mode."
          >
            <ShieldAlert size={13} />
            <span>Mock Mode</span>
          </div>
        )}
        {!isMock && (
          <div 
            onClick={() => setMockMode(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors"
            title="Connected to Staging. Click to force local Mock Mode."
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live API</span>
          </div>
        )}
      </div>

      {/* Right User Bar */}
      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-3 pr-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-heading font-bold text-slate-800 leading-none">
                {user.name}
              </p>
              <p className="text-xxs text-slate-400 font-medium capitalize mt-0.5">
                {user.role} Account
              </p>
            </div>
            
            {/* User Avatar */}
            <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm border border-primary-100">
              {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={16} />}
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={logout}
          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-200 border border-transparent hover:border-rose-100"
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
