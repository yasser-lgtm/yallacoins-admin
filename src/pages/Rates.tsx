import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAppRates, updateAppRate } from '../services/api';
import { AppRate } from '../types';
import { Edit2, Save, X, Loader, AlertCircle } from 'lucide-react';

export const Rates: React.FC = () => {
  const { token } = useAuth();
  const [rates, setRates] = useState<AppRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  // Fetch rates from backend
  useEffect(() => {
    const fetchRates = async () => {
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getAppRates(token);
        setRates(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load rates');
        setRates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [token]);

  const handleEdit = (rate: AppRate) => {
    setEditingId(rate.id);
    setEditValues({
      rate: rate.rate,
      fee: rate.fee,
      minWithdrawal: rate.minWithdrawal,
      maxWithdrawal: rate.maxWithdrawal,
      eta: rate.eta,
    });
  };

  const handleSave = async (rateId: string) => {
    if (!token) return;

    try {
      setSaving(true);
      await updateAppRate(rateId, editValues, token);
      
      // Update local state
      setRates(rates.map(r => 
        r.id === rateId 
          ? { ...r, ...editValues, version: r.version + 1 }
          : r
      ));
      
      setEditingId(null);
      setEditValues({});
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update rate');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading rates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-semibold">Error loading rates</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Rate Management</h2>
        <p className="text-gray-600 mt-1">Update conversion rates and fees for each application</p>
      </div>

      {/* Info Box */}
      <div className="card-admin mb-6 bg-blue-50 border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Important:</strong> Rate changes only apply to new withdrawal requests. Existing requests retain the rate snapshot from their submission time.
        </p>
      </div>

      {/* Rate Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rates.map((rate) => (
          <div key={rate.id} className="card-admin">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{rate.appName}</h3>
                <p className="text-sm text-gray-600">v{rate.version}</p>
              </div>
              {editingId !== rate.id && (
                <button
                  onClick={() => handleEdit(rate)}
                  className="p-2 hover:bg-gray-100 rounded transition"
                >
                  <Edit2 size={18} className="text-gray-600" />
                </button>
              )}
            </div>

            {editingId === rate.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conversion Rate
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={editValues.rate}
                    onChange={(e) => setEditValues({ ...editValues, rate: parseFloat(e.target.value) })}
                    className="input-admin w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fee (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editValues.fee}
                    onChange={(e) => setEditValues({ ...editValues, fee: parseFloat(e.target.value) })}
                    className="input-admin w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Withdrawal ($)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={editValues.minWithdrawal}
                    onChange={(e) => setEditValues({ ...editValues, minWithdrawal: parseFloat(e.target.value) })}
                    className="input-admin w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Withdrawal ($)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={editValues.maxWithdrawal}
                    onChange={(e) => setEditValues({ ...editValues, maxWithdrawal: parseFloat(e.target.value) })}
                    className="input-admin w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ETA
                  </label>
                  <input
                    type="text"
                    value={editValues.eta}
                    onChange={(e) => setEditValues({ ...editValues, eta: e.target.value })}
                    className="input-admin w-full"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => handleSave(rate.id)}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition disabled:opacity-50"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Conversion Rate</span>
                  <span className="font-semibold text-gray-900">{rate.rate.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fee</span>
                  <span className="font-semibold text-gray-900">{rate.fee}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Withdrawal</span>
                  <span className="font-semibold text-gray-900">${rate.minWithdrawal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Withdrawal</span>
                  <span className="font-semibold text-gray-900">${rate.maxWithdrawal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ETA</span>
                  <span className="font-semibold text-gray-900">{rate.eta}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Last updated: {new Date(rate.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {rates.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No rates found</p>
        </div>
      )}
    </div>
  );
};
