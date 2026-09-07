import React, { useEffect, useState } from 'react';
import { Users, Calendar, Palmtree, ArrowUpRight, Clock, CheckCircle2, Phone, Mail, ArrowRight } from 'lucide-react';
import { DashboardStats, LeadItem } from '../../types';

interface AdminDashboardProps {
  onNavigate: (tab: 'packages' | 'leads' | 'branding' | 'settings') => void;
  adminToken: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, adminToken }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/dashboard-stats', {
        headers: { 'x-admin-token': adminToken }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error('Failed to load stats:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [adminToken]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Contacted':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Interested':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Converted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Lost':
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-28 bg-neutral-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8">
      
      {/* Top Welcome & Notification Check */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold font-heading text-neutral-900">
            Welcome to TravStories Kerala CMS
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Real-time lead inquiries, dynamic Kerala package pricing, and business settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('leads')}
            className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manage All Leads</span>
          </button>
          <button
            onClick={() => onNavigate('packages')}
            className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Palmtree className="w-3.5 h-3.5 text-emerald-700" />
            <span>Tour Packages</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-500 font-medium">Total Travel Leads</div>
            <div className="text-3xl font-extrabold text-neutral-900 font-heading mt-1">
              {stats?.totalLeads || 0}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">Recorded from website</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-500 font-medium">Today's Inquiries</div>
            <div className="text-3xl font-extrabold text-neutral-900 font-heading mt-1">
              {stats?.todayLeads || 0}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">High intent travelers</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-500 font-medium">Published Packages</div>
            <div className="text-3xl font-extrabold text-neutral-900 font-heading mt-1">
              {stats?.publishedPackages || 0}
            </div>
            <span className="text-[11px] text-neutral-500">of {stats?.totalPackages || 0} total</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Palmtree className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-500 font-medium">Converted Trips</div>
            <div className="text-3xl font-extrabold text-emerald-700 font-heading mt-1">
              {stats?.statusCounts?.Converted || 0}
            </div>
            <span className="text-[11px] text-neutral-500">Confirmed bookings</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Recent Leads Table & Lead Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Inquiries (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-neutral-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-heading text-neutral-900">
                Recent Travel Inquiries
              </h3>
              <p className="text-xs text-neutral-500">Latest customer submissions</p>
            </div>
            <button
              onClick={() => onNavigate('leads')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
                <tr>
                  <th className="p-3.5 pl-6">Customer</th>
                  <th className="p-3.5">Mobile</th>
                  <th className="p-3.5">Package / Inquiry</th>
                  <th className="p-3.5">Travel Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 pr-6">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {stats?.recentLeads && stats.recentLeads.length > 0 ? (
                  stats.recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="p-3.5 pl-6 font-bold text-neutral-900">{lead.name}</td>
                      <td className="p-3.5">
                        <a
                          href={`https://wa.me/91${lead.mobile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 font-mono hover:underline font-bold"
                        >
                          +91 {lead.mobile}
                        </a>
                      </td>
                      <td className="p-3.5 text-neutral-700 max-w-xs truncate">
                        {lead.packageName || lead.inquiryType}
                      </td>
                      <td className="p-3.5 text-neutral-500">{lead.travelDate || 'Flexible'}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-3.5 pr-6 text-neutral-400 whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-neutral-400">
                      No inquiries yet. New submissions will show here automatically.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Status Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-neutral-200 shadow-2xs p-6 space-y-5">
          <div>
            <h3 className="text-base font-bold font-heading text-neutral-900">
              Lead Funnel Status
            </h3>
            <p className="text-xs text-neutral-500">Pipeline conversion stages</p>
          </div>

          <div className="space-y-3">
            {[
              { label: 'New Inquiries', count: stats?.statusCounts?.New || 0, color: 'bg-blue-600', key: 'New' },
              { label: 'Contacted', count: stats?.statusCounts?.Contacted || 0, color: 'bg-amber-500', key: 'Contacted' },
              { label: 'Interested / Quoted', count: stats?.statusCounts?.Interested || 0, color: 'bg-purple-600', key: 'Interested' },
              { label: 'Converted / Booked', count: stats?.statusCounts?.Converted || 0, color: 'bg-emerald-600', key: 'Converted' },
              { label: 'Lost / Cancelled', count: stats?.statusCounts?.Lost || 0, color: 'bg-neutral-400', key: 'Lost' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200/70">
                <div className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-xs font-semibold text-neutral-700">{item.label}</span>
                </div>
                <span className="text-sm font-extrabold text-neutral-900 font-heading">
                  {item.count}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-100">
            <button
              onClick={() => onNavigate('leads')}
              className="w-full py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-xs font-bold text-neutral-800 transition-colors"
            >
              Filter & Export All Leads to Excel
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
