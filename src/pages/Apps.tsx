import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { App } from '../types';
import { getAppRates } from '../services/api';
import { AlertCircle, Loader } from 'lucide-react';

export const Apps: React.FC = () => {
  const { token } = useAuth();
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadApps();
    }
  }, [token]);

  const loadApps = async () => {
    try {
      setLoading(true);
      setError(null);
      const rates = await getAppRates(token!);
      // Convert app rates to app format for display
      const appData: App[] = rates.map(rate => ({
        id: rate.appId,
        name: rate.appName,
        status: 'active',
        conversionUnitLabel: rate.appName === 'Bigo' ? 'Beans' : rate.appName === 'Kiti' ? 'Points' : 'Coins',
        minWithdrawal: rate.minWithdrawal,
        rate: rate.rate,
        fee: rate.fee,
      }));
      setApps(appData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load apps');
    } finally {
      setLoading(false);
    }
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

  const AppCard = ({ app }: { app: App }) => (
    <div className="card-admin">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 capitalize">{app.name}</h3>
          <p className="text-sm text-gray-600">Application Details</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          app.status === 'active' ? 'bg-green-100 text-green-800' :
          app.status === 'limited' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {app.status}
        </span>
      </div>

      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600 font-semibold">Conversion Unit</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{app.conversionUnitLabel}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-semibold">Exchange Rate</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">${app.rate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-semibold">Min Withdrawal</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{app.minWithdrawal} {app.conversionUnitLabel}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-semibold">Fee</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{app.fee}%</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Applications</h2>
        <p className="text-gray-600 mt-1">Manage supported applications and their settings</p>
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

      {/* Apps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {apps.map(app => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>

      {apps.length === 0 && !loading && (
        <div className="card-admin text-center py-12">
          <p className="text-gray-600 font-medium">No applications found</p>
        </div>
      )}
    </div>
  );
};
