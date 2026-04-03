import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { getWithdrawalRequests } from '../services/api';
import { WithdrawalRequest } from '../types';
import { Search, Filter, ChevronRight, Eye, CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';

export const Requests: React.FC = () => {
  const [, setLocation] = useLocation();
  const { token } = useAuth();
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [appFilter, setAppFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Fetch requests from backend
  useEffect(() => {
    const fetchRequests = async () => {
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getWithdrawalRequests(token);
        setRequests(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load requests');
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesSearch = 
        req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.accountId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.phone.includes(searchTerm);
      
      const matchesStatus = !statusFilter || req.status === statusFilter;
      const matchesApp = !appFilter || req.app === appFilter;
      const matchesCountry = !countryFilter || req.country === countryFilter;
      
      let matchesDate = true;
      if (dateFrom || dateTo) {
        const reqDate = new Date(req.submittedAt);
        if (dateFrom) matchesDate = matchesDate && reqDate >= new Date(dateFrom);
        if (dateTo) matchesDate = matchesDate && reqDate <= new Date(dateTo);
      }

      return matchesSearch && matchesStatus && matchesApp && matchesCountry && matchesDate;
    });
  }, [requests, searchTerm, statusFilter, appFilter, countryFilter, dateFrom, dateTo]);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      pending: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <AlertCircle size={14} /> },
      under_review: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <AlertCircle size={14} /> },
      approved: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle size={14} /> },
      needs_correction: { bg: 'bg-orange-100', text: 'text-orange-800', icon: <AlertCircle size={14} /> },
      paid: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: <CheckCircle size={14} /> },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: <XCircle size={14} /> },
    };

    const badge = badges[status] || badges.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.icon}
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getAppBadge = (app: string) => {
    const colors: Record<string, string> = {
      bigo: 'bg-cyan-100 text-cyan-800',
      kiti: 'bg-pink-100 text-pink-800',
      xena: 'bg-purple-100 text-purple-800',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[app] || 'bg-gray-100 text-gray-800'}`}>
        {app.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-semibold">Error loading requests</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Withdrawal Requests</h2>
        <p className="text-gray-600 mt-1">Review and manage creator withdrawal requests ({filteredRequests.length})</p>
      </div>

      {/* Filters */}
      <div className="card-admin mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ID, account, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-admin pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-admin"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="needs_correction">Needs Correction</option>
            <option value="paid">Paid</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* App Filter */}
          <select
            value={appFilter}
            onChange={(e) => setAppFilter(e.target.value)}
            className="input-admin"
          >
            <option value="">All Apps</option>
            <option value="bigo">Bigo</option>
            <option value="kiti">Kiti</option>
            <option value="xena">Xena</option>
          </select>

          {/* Country Filter */}
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="input-admin"
          >
            <option value="">All Countries</option>
            <option value="EG">Egypt</option>
            <option value="AE">UAE</option>
            <option value="SA">Saudi Arabia</option>
            <option value="KW">Kuwait</option>
          </select>

          {/* Date Range */}
          <div className="flex gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="input-admin flex-1"
              placeholder="From"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="input-admin flex-1"
              placeholder="To"
            />
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="card-admin overflow-x-auto">
        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p>No requests found matching your filters</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Request ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">App</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Account</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Country</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm text-gray-900">{req.id.substring(0, 8)}...</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(req.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">{getAppBadge(req.app)}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{req.accountId}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-900">${req.amount}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{req.country}</td>
                  <td className="py-3 px-4">{getStatusBadge(req.status)}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setLocation(`/requests/${req.id}`)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-sm font-medium"
                    >
                      <Eye size={14} />
                      View
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
