import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardStats } from '../services/api';
import { DashboardStats } from '../types';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getDashboardStats(token);
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-600">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Requests"
          value={stats.totalRequests}
          icon={<CheckCircle className="w-6 h-6" />}
          color="blue"
        />
        <KPICard
          title="Pending"
          value={stats.pendingRequests}
          icon={<AlertCircle className="w-6 h-6" />}
          color="yellow"
        />
        <KPICard
          title="Under Review"
          value={stats.underReviewRequests}
          icon={<TrendingUp className="w-6 h-6" />}
          color="purple"
        />
        <KPICard
          title="Approved"
          value={stats.approvedRequests}
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
        />
        <KPICard
          title="Needs Correction"
          value={stats.needsCorrectionRequests}
          icon={<AlertCircle className="w-6 h-6" />}
          color="orange"
        />
        <KPICard
          title="Paid"
          value={stats.paidRequests}
          icon={<CheckCircle className="w-6 h-6" />}
          color="emerald"
        />
        <KPICard
          title="Rejected"
          value={stats.rejectedRequests}
          icon={<TrendingDown className="w-6 h-6" />}
          color="red"
        />
        <KPICard
          title="Total Payout Value"
          value={`$${stats.totalPayoutValue.toLocaleString()}`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="indigo"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Requests by App" data={stats.requestsByApp} />
        <ChartCard title="Requests by Country" data={stats.requestsByCountry} />
        <ChartCard title="Requests by Payout Method" data={stats.requestsByPayoutMethod} />
      </div>
    </div>
  );
};

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    red: 'bg-red-50 text-red-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} p-6 rounded-lg shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className="opacity-20">{icon}</div>
      </div>
    </div>
  );
};

interface ChartCardProps {
  title: string;
  data: Record<string, number>;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, data }) => {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {Object.entries(data).map(([label, value]) => (
          <div key={label}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">{label}</span>
              <span className="text-sm font-medium text-gray-900">{value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
