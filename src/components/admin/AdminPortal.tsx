import React, { useState } from 'react';
import { LayoutDashboard, Palmtree, Users, Palette, Settings, LogOut, ExternalLink, Compass } from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { AdminPackages } from './AdminPackages';
import { AdminLeads } from './AdminLeads';
import { AdminBranding } from './AdminBranding';
import { AdminSettings } from './AdminSettings';
import { useApp } from '../../context/AppContext';

interface AdminPortalProps {
  adminToken: string;
  onLogout: () => void;
  onBackToWebsite: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ adminToken, onLogout, onBackToWebsite }) => {
  const { branding } = useApp();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'packages' | 'leads' | 'branding' | 'settings'>('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'packages', label: 'Kerala Packages', icon: Palmtree },
    { id: 'leads', label: 'Customer Leads', icon: Users },
    { id: 'branding', label: 'Branding & Logo', icon: Palette },
    { id: 'settings', label: 'Admin Settings', icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-neutral-900 text-white shrink-0 flex flex-col justify-between">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-white font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold font-heading text-white">
                  {branding.companyName || 'TravStories'}
                </h2>
                <span className="text-[10px] text-emerald-400 font-semibold tracking-wide uppercase">
                  Admin CMS
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isCurrent = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-emerald-300' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom utility: Return to public website & logout */}
        <div className="p-4 border-t border-neutral-800 space-y-1">
          <button
            onClick={onBackToWebsite}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-emerald-400" />
            <span>View Live Website</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 overflow-y-auto max-h-screen">
        {activeTab === 'dashboard' && (
          <AdminDashboard
            adminToken={adminToken}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === 'packages' && <AdminPackages adminToken={adminToken} />}
        {activeTab === 'leads' && <AdminLeads adminToken={adminToken} />}
        {activeTab === 'branding' && <AdminBranding adminToken={adminToken} />}
        {activeTab === 'settings' && <AdminSettings adminToken={adminToken} />}
      </main>

    </div>
  );
};
