import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, MessageSquare, Phone, Trash2, Eye, Calendar, Tag, CheckCircle, Clock, X, AlertCircle } from 'lucide-react';
import { LeadItem, PackageItem } from '../../types';

interface AdminLeadsProps {
  adminToken: string;
}

export const AdminLeads: React.FC<AdminLeadsProps> = ({ adminToken }) => {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [packageFilter, setPackageFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Selected Lead for view/edit detail modal
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (packageFilter) params.append('packageId', packageFilter);
      if (dateFilter) params.append('date', dateFilter);

      const res = await fetch(`/api/admin/leads?${params.toString()}`, {
        headers: { 'x-admin-token': adminToken }
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (e) {
      console.error('Failed to load leads:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/admin/packages', {
        headers: { 'x-admin-token': adminToken }
      });
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchPackages();
  }, [adminToken, statusFilter, packageFilter, dateFilter]);

  const handleStatusChange = async (leadId: string, newStatus: LeadItem['status']) => {
    try {
      setIsUpdatingStatus(true);
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        const updated = await res.json();
        setLeads(prev => prev.map(l => l.id === leadId ? updated : l));
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(updated);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;

    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': adminToken }
      });
      if (res.ok) {
        setLeads(prev => prev.filter(l => l.id !== leadId));
        if (selectedLead?.id === leadId) setSelectedLead(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportExcel = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (packageFilter) params.append('packageId', packageFilter);
      if (dateFilter) params.append('date', dateFilter);

      const res = await fetch(`/api/admin/leads/export?${params.toString()}`, {
        headers: { 'x-admin-token': adminToken }
      });

      if (!res.ok) throw new Error('Failed to generate Excel file');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TravStories_Leads_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      alert('Error exporting leads: ' + e);
    }
  };

  const filteredLeads = leads.filter(l => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      l.name.toLowerCase().includes(term) ||
      l.mobile.includes(term) ||
      (l.packageName && l.packageName.toLowerCase().includes(term)) ||
      l.id.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Contacted': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Interested': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Converted': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Lost': return 'bg-neutral-100 text-neutral-600 border-neutral-200';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-neutral-900">
            Customer Inquiries & Leads
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Real-time lead capture, WhatsApp follow-ups, and formatted XLSX spreadsheet exports.
          </p>
        </div>

        <button
          onClick={handleExportExcel}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export to Excel (.xlsx)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, phone, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs"
          />
        </div>

        {/* Status filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs text-neutral-700"
          >
            <option value="">All Lead Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Interested">Interested / Quoted</option>
            <option value="Converted">Converted / Booked</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        {/* Package filter */}
        <div>
          <select
            value={packageFilter}
            onChange={(e) => setPackageFilter(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs text-neutral-700"
          >
            <option value="">All Packages</option>
            {packages.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Date filter */}
        <div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs text-neutral-700"
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
              <tr>
                <th className="p-3.5 pl-6">ID</th>
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Mobile Number</th>
                <th className="p-3.5">Interested Package / Plan</th>
                <th className="p-3.5">Inquiry Type</th>
                <th className="p-3.5">Travel Dates</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Created</th>
                <th className="p-3.5 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-3.5 pl-6 font-mono text-[10px] text-neutral-400">
                      {lead.id.slice(0, 10)}
                    </td>
                    <td className="p-3.5 font-bold text-neutral-900">
                      {lead.name}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-neutral-800">
                          +91 {lead.mobile}
                        </span>
                        <a
                          href={`https://wa.me/91${lead.mobile}?text=${encodeURIComponent(`Hi ${lead.name}, thank you for contacting TravStories regarding Kerala travel!`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                          title="Chat on WhatsApp"
                        >
                          <MessageSquare className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                    <td className="p-3.5 max-w-xs truncate text-neutral-700">
                      {lead.packageName || (lead.inquiryType === 'CUSTOM_TRIP' ? 'Custom Kerala Itinerary' : 'Direct Inquiry')}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-semibold">
                        {lead.inquiryType}
                      </span>
                    </td>
                    <td className="p-3.5 text-neutral-500 whitespace-nowrap">
                      {lead.travelDate || 'Flexible'}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                        className={`text-[11px] font-bold py-1 px-2.5 rounded-full border cursor-pointer focus:outline-none ${getStatusBadge(lead.status)}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Interested">Interested</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-neutral-400 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3.5 pr-6 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-neutral-400">
                    No leads found matching current criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail View Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden">
            
            <div className="p-6 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono">
                  LEAD ID: {selectedLead.id}
                </span>
                <h3 className="text-lg font-bold font-heading text-neutral-900">
                  {selectedLead.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-50 p-3 rounded-xl">
                  <div className="text-neutral-400 font-medium">Mobile Number</div>
                  <div className="font-mono font-bold text-neutral-900 text-sm mt-0.5">
                    +91 {selectedLead.mobile}
                  </div>
                </div>

                <div className="bg-neutral-50 p-3 rounded-xl">
                  <div className="text-neutral-400 font-medium">Inquiry Type</div>
                  <div className="font-bold text-neutral-900 mt-0.5">
                    {selectedLead.inquiryType}
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50 p-3 rounded-xl">
                <div className="text-neutral-400 font-medium">Package / Inquiry Subject</div>
                <div className="font-bold text-neutral-900 text-sm mt-0.5">
                  {selectedLead.packageName || 'Custom Kerala Itinerary'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-50 p-3 rounded-xl">
                  <div className="text-neutral-400 font-medium">Travel Dates</div>
                  <div className="font-semibold text-neutral-800 mt-0.5">
                    {selectedLead.travelDate || 'Flexible'}
                  </div>
                </div>

                <div className="bg-neutral-50 p-3 rounded-xl">
                  <div className="text-neutral-400 font-medium">Travellers</div>
                  <div className="font-semibold text-neutral-800 mt-0.5">
                    {selectedLead.travellers || '2 Adults'}
                  </div>
                </div>
              </div>

              {selectedLead.notes && (
                <div className="bg-neutral-50 p-3 rounded-xl">
                  <div className="text-neutral-400 font-medium mb-1">Customer Preferences / Notes:</div>
                  <div className="text-neutral-700 leading-relaxed italic bg-white p-2.5 rounded-lg border border-neutral-200">
                    "{selectedLead.notes}"
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <span className="font-bold text-neutral-800">Update Lead Status:</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as any)}
                  className={`text-xs font-bold py-1.5 px-3 rounded-xl border cursor-pointer ${getStatusBadge(selectedLead.status)}`}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Interested">Interested / Quoted</option>
                  <option value="Converted">Converted / Booked</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex gap-2">
                <a
                  href={`https://wa.me/91${selectedLead.mobile}?text=${encodeURIComponent(`Hi ${selectedLead.name}, greetings from TravStories Kerala!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-center flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
                <a
                  href={`tel:${selectedLead.mobile}`}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 font-bold hover:bg-neutral-50 flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
