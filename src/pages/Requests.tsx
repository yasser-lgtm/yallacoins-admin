import React, { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { mockWithdrawalRequests } from '../mockData';
import { WithdrawalRequest } from '../types';
import { Search, Filter, ChevronRight, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const Requests: React.FC = () => {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [appFilter, setAppFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredRequests = useMemo(() => {
    return mockWithdrawalRequests.filter(req => {
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
  }, [searchTerm, statusFilter, appFilter, countryFilter, dateFrom, dateTo]);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      submitted: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <AlertCircle size={14} /> },
      under_review: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <AlertCircle size={14} /> },
      approved: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle size={14} /> },
      needs_correction: { bg: 'bg-orange-100', text: 'text-orange-800', icon: <AlertCircle size={14} /> },
      paid: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: <CheckCircle size={14} /> },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: <XCircle size={14} /> },
    };

    const badge = badges[status] || badges.submitted;
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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Withdrawal Requests</h2>
        <p className="text-gray-600 mt-1">Review and manage creator withdrawal requests</p>
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
            className="select-admin"
          >
            <option value="">All Status</option>
            <option value="submitted">Submitted</option>
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
            className="select-admin"
          >
            <option value="">All Apps</option>
            <option value="bigo">Bigo Live</option>
            <option value="kiti">Kiti</option>
            <option value="xena">Xena Live</option>
          </select>

          {/* Country Filter */}
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="select-admin"
          >
            <option value="">All Countries</option>
            <option value="Egypt">Egypt</option>
            <option value="UAE">UAE</option>
          </select>

          {/* Date From */}
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="input-admin"
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
              setAppFilter('');
              setCountryFilter('');
              setDateFrom('');
              setDateTo('');
            }}
            className="btn-admin-secondary btn-admin-sm"
          >
            Clear Filters
          </button>
          <span className="text-sm text-gray-600 self-center">
            {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      {/* Requests Table */}
      <div className="card-admin overflow-x-auto">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 font-medium">No requests found</p>
            <p className="text-sm text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <table className="table-admin">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Date</th>
                <th>App</th>
                <th>Account ID</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>USD</th>
                <th>Payout</th>
                <th>Country</th>
                <th>Method</th>
                <th>Status</th>
                <th>Assigned</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id}>
                  <td className="font-mono font-semibold text-[#012D90]">{req.id}</td>
                  <td className="text-xs text-gray-500">
                    {new Date(req.submittedAt).toLocaleDateString()}
                  </td>
                  <td>{getAppBadge(req.app)}</td>
                  <td className="font-mono text-sm">{req.accountId}</td>
                  <td className="font-mono text-sm">{req.phone}</td>
                  <td className="font-semibold">
                    {req.amountSubmitted.toLocaleString()} {req.currency}
                  </td>
                  <td className="font-semibold text-green-700">${req.estimatedUSD}</td>
                  <td className="font-semibold text-[#012D90]">
                    {req.estimatedPayout} {req.payoutCurrency}
                  </td>
                  <td>{req.country}</td>
                  <td className="text-sm">{req.payoutMethod}</td>
                  <td>{getStatusBadge(req.status)}</td>
                  <td className="text-sm text-gray-600">{req.assignedTo ? 'Assigned' : '—'}</td>
                  <td>
                    <button
                      onClick={() => setLocation(`/requests/${req.id}`)}
                      className="inline-flex items-center gap-1 text-[#012D90] hover:text-[#0A1F5C] font-semibold transition-colors"
                    >
                      <Eye size={16} />
                      View
                      <ChevronRight size={16} />
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
