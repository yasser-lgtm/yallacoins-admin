import React, { useState } from 'react';
import { mockAppRates } from '../mockData';
import { AppRate } from '../types';
import { Edit2, Save, X, History } from 'lucide-react';

export const Rates: React.FC = () => {
  const [rates, setRates] = useState<AppRate[]>(mockAppRates);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<AppRate>>({});
  const [showHistory, setShowHistory] = useState<string | null>(null);

  const handleEdit = (rate: AppRate) => {
    setEditingId(rate.id);
    setEditValues(rate);
  };

  const handleSave = () => {
    if (editingId) {
      setRates(rates.map(r => r.id === editingId ? { ...r, ...editValues } : r));
      setEditingId(null);
      setEditValues({});
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const RateCard = ({ rate }: { rate: AppRate }) => {
    const isEditing = editingId === rate.id;

    return (
      <div className="card-admin">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 capitalize">{rate.appName} Live</h3>
            <p className="text-sm text-gray-600">{rate.conversionLogic}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              rate.status === 'active' ? 'bg-green-100 text-green-800' :
              rate.status === 'limited' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {rate.status}
            </span>
            {!isEditing && (
              <button
                onClick={() => handleEdit(rate)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit2 size={16} className="text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Public Rate</label>
                <input
                  type="number"
                  step="0.001"
                  value={editValues.publicRate || 0}
                  onChange={(e) => setEditValues({ ...editValues, publicRate: parseFloat(e.target.value) })}
                  className="input-admin"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Internal Rate</label>
                <input
                  type="number"
                  step="0.001"
                  value={editValues.internalRate || 0}
                  onChange={(e) => setEditValues({ ...editValues, internalRate: parseFloat(e.target.value) })}
                  className="input-admin"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Fee Value</label>
                <input
                  type="number"
                  step="0.1"
                  value={editValues.feeValue || 0}
                  onChange={(e) => setEditValues({ ...editValues, feeValue: parseFloat(e.target.value) })}
                  className="input-admin"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Minimum Withdrawal</label>
                <input
                  type="number"
                  value={editValues.minimumWithdrawal || 0}
                  onChange={(e) => setEditValues({ ...editValues, minimumWithdrawal: parseFloat(e.target.value) })}
                  className="input-admin"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">ETA Text</label>
                <input
                  type="text"
                  value={editValues.etaText || ''}
                  onChange={(e) => setEditValues({ ...editValues, etaText: e.target.value })}
                  className="input-admin"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <select
                  value={editValues.status || 'active'}
                  onChange={(e) => setEditValues({ ...editValues, status: e.target.value as any })}
                  className="select-admin"
                >
                  <option value="active">Active</option>
                  <option value="limited">Limited</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Public Note</label>
                <textarea
                  value={editValues.publicNote || ''}
                  onChange={(e) => setEditValues({ ...editValues, publicNote: e.target.value })}
                  className="textarea-admin h-20"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 btn-admin-primary btn-admin-sm flex items-center justify-center gap-2"
              >
                <Save size={16} />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 btn-admin-secondary btn-admin-sm flex items-center justify-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-600 mb-1">Public Rate</p>
              <p className="text-lg font-bold text-[#012D90]">${rate.publicRate}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-600 mb-1">Internal Rate</p>
              <p className="text-lg font-bold">${rate.internalRate}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-600 mb-1">Fee</p>
              <p className="text-lg font-bold">{rate.feeValue}%</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-600 mb-1">Min Withdrawal</p>
              <p className="text-lg font-bold">{rate.minimumWithdrawal}</p>
            </div>
            <div className="col-span-2 bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-600 mb-1">ETA</p>
              <p className="text-sm font-semibold">{rate.etaText}</p>
            </div>
          </div>
        )}

        {/* Version History */}
        {!isEditing && rate.versionHistory.length > 0 && (
          <button
            onClick={() => setShowHistory(showHistory === rate.id ? null : rate.id)}
            className="mt-4 text-sm text-[#012D90] hover:underline flex items-center gap-1"
          >
            <History size={14} />
            View History ({rate.versionHistory.length})
          </button>
        )}

        {showHistory === rate.id && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Version History</h4>
            <div className="space-y-3">
              {rate.versionHistory.map((version, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">Version {version.version}</span>
                    <span className="text-gray-600">{new Date(version.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700">Rate: ${version.rate} | Fee: {version.fee}%</p>
                  <p className="text-gray-600 text-xs mt-1">By {version.updatedBy}</p>
                  <p className="text-gray-600 text-xs">Reason: {version.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

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
        {rates.map(rate => (
          <RateCard key={rate.id} rate={rate} />
        ))}
      </div>
    </div>
  );
};
