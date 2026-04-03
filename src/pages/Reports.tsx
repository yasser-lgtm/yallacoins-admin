import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getReports } from '../services/api';
import { BarChart3, Download, FileText, AlertCircle, Loader } from 'lucide-react';

export const Reports: React.FC = () => {
  const { token } = useAuth();
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [groupBy, setGroupBy] = useState('day');

  useEffect(() => {
    if (token) {
      loadReports();
    }
  }, [token]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReports(token!, {
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        groupBy: groupBy || undefined,
      });
      setReportData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // In production, this would generate actual CSV/Excel/PDF
    alert(`Exporting as ${exportFormat.toUpperCase()}...`);
  };

  const ReportCard = ({ title, description, icon: Icon, onClick }: any) => (
    <button
      onClick={onClick}
      className="card-admin-hover text-left"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Icon size={24} className="text-blue-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </button>
  );

  const StatBox = ({ label, value, trend }: any) => (
    <div className="card-admin">
      <p className="text-sm text-gray-600 font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      {trend && (
        <p className={`text-xs mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '+' : ''}{trend}% from last period
        </p>
      )}
    </div>
  );

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
        <h2 className="text-3xl font-bold text-gray-900">Reports & Exports</h2>
        <p className="text-gray-600 mt-1">Generate and export operational reports</p>
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

      {/* Filter Options */}
      <div className="card-admin mb-8 bg-blue-50 border border-blue-200">
        <h3 className="font-bold text-gray-900 mb-4">Report Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="input-admin"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="input-admin"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Group By</label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="select-admin"
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={loadReports}
              className="btn-admin-primary btn-admin-sm w-full"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="card-admin mb-8 bg-green-50 border border-green-200">
        <h3 className="font-bold text-gray-900 mb-4">Export Data</h3>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Format</label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="select-admin"
            >
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          <button
            onClick={handleExport}
            className="btn-admin-primary btn-admin-sm flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Report Statistics */}
      {reportData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatBox
              label="Total Requests"
              value={reportData.totalRequests || 0}
              trend={5}
            />
            <StatBox
              label="Total Payout Value"
              value={`$${(reportData.totalPayoutValue || 0).toLocaleString()}`}
              trend={8}
            />
            <StatBox
              label="Average Payout Time"
              value={`${Math.round(reportData.averagePayoutTime || 0)} hrs`}
              trend={-2}
            />
            <StatBox
              label="Period"
              value={reportData.period || 'Current'}
            />
          </div>

          {/* Detailed Report Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Requests by Status */}
            <div className="card-admin">
              <h3 className="font-bold text-gray-900 mb-4">Requests by Status</h3>
              <div className="space-y-3">
                {reportData.requestsByStatus && Object.entries(reportData.requestsByStatus).map(([status, count]: any) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">{status.replace('_', ' ')}</span>
                    <span className="font-bold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requests by App */}
            <div className="card-admin">
              <h3 className="font-bold text-gray-900 mb-4">Requests by App</h3>
              <div className="space-y-3">
                {reportData.requestsByApp && Object.entries(reportData.requestsByApp).map(([app, count]: any) => (
                  <div key={app} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">{app}</span>
                    <span className="font-bold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requests by Country */}
            <div className="card-admin">
              <h3 className="font-bold text-gray-900 mb-4">Requests by Country</h3>
              <div className="space-y-3">
                {reportData.requestsByCountry && Object.entries(reportData.requestsByCountry).map(([country, count]: any) => (
                  <div key={country} className="flex items-center justify-between">
                    <span className="text-gray-700">{country}</span>
                    <span className="font-bold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {!reportData && !loading && (
        <div className="card-admin text-center py-12">
          <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 font-medium">No report data available</p>
          <p className="text-sm text-gray-500 mt-1">Generate a report using the filters above</p>
        </div>
      )}
    </div>
  );
};
