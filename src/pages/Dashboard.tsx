import React, { useMemo } from 'react';
import { mockWithdrawalRequests } from '../mockData';
import { DashboardStats } from '../types';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const stats = useMemo((): DashboardStats => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRequests = mockWithdrawalRequests.filter(r => {
      const submitDate = new Date(r.submittedAt);
      submitDate.setHours(0, 0, 0, 0);
      return submitDate.getTime() === today.getTime();
    });

    const requestsByStatus = {
      submitted: mockWithdrawalRequests.filter(r => r.status === 'submitted').length,
      under_review: mockWithdrawalRequests.filter(r => r.status === 'under_review').length,
      approved: mockWithdrawalRequests.filter(r => r.status === 'approved').length,
      needs_correction: mockWithdrawalRequests.filter(r => r.status === 'needs_correction').length,
      paid: mockWithdrawalRequests.filter(r => r.status === 'paid').length,
      rejected: mockWithdrawalRequests.filter(r => r.status === 'rejected').length,
    };

    const requestsByApp = {
      bigo: mockWithdrawalRequests.filter(r => r.app === 'bigo').length,
      kiti: mockWithdrawalRequests.filter(r => r.app === 'kiti').length,
      xena: mockWithdrawalRequests.filter(r => r.app === 'xena').length,
    };

    const requestsByCountry = {
      Egypt: mockWithdrawalRequests.filter(r => r.country === 'Egypt').length,
      UAE: mockWithdrawalRequests.filter(r => r.country === 'UAE').length,
    };

    const requestsByPayoutMethod = {
      'Vodafone Cash': mockWithdrawalRequests.filter(r => r.payoutMethod === 'Vodafone Cash').length,
      'InstaPay': mockWithdrawalRequests.filter(r => r.payoutMethod === 'InstaPay').length,
      'Bank Transfer': mockWithdrawalRequests.filter(r => r.payoutMethod === 'Bank Transfer').length,
    };

    const totalPayout = mockWithdrawalRequests
      .filter(r => r.status === 'paid')
      .reduce((sum, r) => sum + r.estimatedPayout, 0);

    return {
      totalRequestsToday: todayRequests.length,
      pendingRequests: requestsByStatus.submitted,
      underReview: requestsByStatus.under_review,
      approved: requestsByStatus.approved,
      needsCorrection: requestsByStatus.needs_correction,
      paid: requestsByStatus.paid,
      rejected: requestsByStatus.rejected,
      totalPayoutValue: totalPayout,
      requestsByApp,
      requestsByCountry,
      requestsByPayoutMethod,
    };
  }, []);

  const KPICard = ({ label, value, icon: Icon, trend, color }: any) => (
    <div className="card-admin">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend > 0 ? (
                <TrendingUp size={16} className="text-green-600" />
              ) : (
                <TrendingDown size={16} className="text-red-600" />
              )}
              <span className={trend > 0 ? 'text-green-600' : 'text-red-600'} style={{ fontSize: '12px' }}>
                {Math.abs(trend)}% from yesterday
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Welcome back! Here's your operations overview.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="admin-grid mb-8">
        <KPICard
          label="Total Requests Today"
          value={stats.totalRequestsToday}
          icon={AlertCircle}
          color="bg-blue-600"
          trend={12}
        />
        <KPICard
          label="Pending Review"
          value={stats.pendingRequests}
          icon={AlertCircle}
          color="bg-yellow-600"
          trend={-5}
        />
        <KPICard
          label="Approved"
          value={stats.approved}
          icon={CheckCircle}
          color="bg-green-600"
          trend={8}
        />
        <KPICard
          label="Under Review"
          value={stats.underReview}
          icon={AlertCircle}
          color="bg-orange-600"
        />
        <KPICard
          label="Needs Correction"
          value={stats.needsCorrection}
          icon={AlertCircle}
          color="bg-red-600"
        />
        <KPICard
          label="Paid"
          value={stats.paid}
          icon={CheckCircle}
          color="bg-emerald-600"
          trend={15}
        />
        <KPICard
          label="Rejected"
          value={stats.rejected}
          icon={AlertCircle}
          color="bg-gray-600"
        />
        <KPICard
          label="Total Payout Value"
          value={`$${stats.totalPayoutValue.toLocaleString()}`}
          icon={TrendingUp}
          color="bg-[#012D90]"
          trend={20}
        />
      </div>

      {/* Requests by App */}
      <div className="admin-grid-2 mb-8">
        <div className="card-admin">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Requests by App</h3>
          <div className="space-y-3">
            {Object.entries(stats.requestsByApp).map(([app, count]) => (
              <div key={app} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 capitalize">{app}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#012D90]"
                      style={{ width: `${(count / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-admin">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Requests by Country</h3>
          <div className="space-y-3">
            {Object.entries(stats.requestsByCountry).map(([country, count]) => (
              <div key={country} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{country}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#F0E68F]"
                      style={{ width: `${(count / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="card-admin">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/requests" className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
            <p className="text-sm font-semibold text-[#012D90]">View All Requests</p>
          </a>
          <a href="/rates" className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
            <p className="text-sm font-semibold text-green-700">Manage Rates</p>
          </a>
          <a href="/countries" className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
            <p className="text-sm font-semibold text-purple-700">Payout Methods</p>
          </a>
          <a href="/reports" className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
            <p className="text-sm font-semibold text-orange-700">View Reports</p>
          </a>
        </div>
      </div>
    </div>
  );
};
