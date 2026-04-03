import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuditLog } from '../types';
import { getAuditLogs } from '../services/api';
import { Filter, Search, AlertCircle, Loader } from 'lucide-react';

export const AuditLogPage: React.FC = () => {
  const { token } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    if (token) {
      loadAuditLogs();
    }
  }, [token]);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAuditLogs(token!, {
        action: actionFilter || undefined,
        entity: entityFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      setLogs(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    loadAuditLogs();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setActionFilter('');
    setEntityFilter('');
    setDateFrom('');
    setDateTo('');
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      (log.userId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.entityId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.comment || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getActionBadge = (action: string) => {
    const colors: Record<string, string> = {
      'status_change': 'bg-blue-100 text-blue-800',
      'rate_update': 'bg-green-100 text-green-800',
      'mark_paid': 'bg-emerald-100 text-emerald-800',
      'user_created': 'bg-purple-100 text-purple-800',
      'user_deleted': 'bg-red-100 text-red-800',
      'login': 'bg-cyan-100 text-cyan-800',
      'logout': 'bg-gray-100 text-gray-800',
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <Loader size={40} className="text-[#012D90] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Audit Log</h2>
        <p className="text-gray-600 mt-1">Complete audit trail of all system actions</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

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
              placeholder="Search user, entity, comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-admin pl-10"
            />
          </div>

          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
            }}
            className="select-admin"
          >
            <option value="">All Actions</option>
            <option value="status_change">Status Change</option>
            <option value="rate_update">Rate Update</option>
            <option value="mark_paid">Mark Paid</option>
            <option value="user_created">User Created</option>
            <option value="login">Login</option>
          </select>

          {/* Entity Filter */}
          <select
            value={entityFilter}
            onChange={(e) => {
              setEntityFilter(e.target.value);
            }}
            className="select-admin"
          >
            <option value="">All Entities</option>
            <option value="withdrawal_request">Withdrawal Request</option>
            <option value="app_rate">App Rate</option>
            <option value="user">User</option>
          </select>

          {/* Date From */}
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="input-admin"
          />

          {/* Date To */}
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="input-admin"
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              handleClearFilters();
              loadAuditLogs();
            }}
            className="btn-admin-secondary btn-admin-sm"
          >
            Clear Filters
          </button>
          <button
            onClick={handleFilterChange}
            className="btn-admin-primary btn-admin-sm"
          >
            Apply Filters
          </button>
          <span className="text-sm text-gray-600 self-center">
            {filteredLogs.length} log{filteredLogs.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="card-admin overflow-x-auto">
        <table className="table-admin">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Entity Type</th>
              <th>Entity ID</th>
              <th>Old Value</th>
              <th>New Value</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id}>
                <td className="text-sm text-gray-600">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="font-semibold">{log.userId}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getActionBadge(log.actionType)}`}>
                    {log.actionType.replace('_', ' ')}
                  </span>
                </td>
                <td className="text-sm text-gray-700">{log.entityType.replace('_', ' ')}</td>
                <td className="font-mono text-sm">{log.entityId}</td>
                <td className="text-sm text-gray-600">
                  {log.oldValue ? (
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{log.oldValue}</code>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="text-sm text-gray-600">
                  {log.newValue ? (
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{log.newValue}</code>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="text-sm text-gray-600">{log.comment || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLogs.length === 0 && !loading && (
        <div className="card-admin text-center py-12">
          <p className="text-gray-600 font-medium">No audit logs found</p>
        </div>
      )}
    </div>
  );
};
