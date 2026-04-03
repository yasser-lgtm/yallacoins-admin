import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Country, PayoutMethod } from '../types';
import { getCountries, getPayoutMethods, updatePayoutMethod } from '../services/api';
import { Edit2, Save, X, Trash2, AlertCircle, Loader } from 'lucide-react';

export const Countries: React.FC = () => {
  const { token } = useAuth();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCountryId, setEditingCountryId] = useState<string | null>(null);
  const [editingMethodId, setEditingMethodId] = useState<string | null>(null);
  const [editMethodValues, setEditMethodValues] = useState<Partial<PayoutMethod>>({});
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const [savingMethod, setSavingMethod] = useState(false);

  useEffect(() => {
    if (token) {
      loadCountries();
    }
  }, [token]);

  const loadCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCountries(token!);
      setCountries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load countries');
    } finally {
      setLoading(false);
    }
  };

  const handleEditMethod = (method: PayoutMethod) => {
    setEditingMethodId(method.id);
    setEditMethodValues(method);
  };

  const handleSaveMethod = async () => {
    if (!editingMethodId || !token) return;

    try {
      setSavingMethod(true);
      await updatePayoutMethod(
        token,
        editingMethodId,
        editMethodValues.feeValue || 0,
        editMethodValues.recommended
      );
      
      // Reload countries to reflect changes
      await loadCountries();
      setEditingMethodId(null);
      setEditMethodValues({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save payout method');
    } finally {
      setSavingMethod(false);
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

  const CountryCard = ({ country }: { country: Country }) => {
    const isExpanded = expandedCountry === country.id;

    return (
      <div className="card-admin">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{country.name}</h3>
            <p className="text-sm text-gray-600">{country.code} • {country.currency}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              country.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {country.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Payout Methods */}
        <div>
          <button
            onClick={() => setExpandedCountry(isExpanded ? null : country.id)}
            className="text-sm font-semibold text-[#012D90] hover:underline mb-3"
          >
            {isExpanded ? '▼' : '▶'} Payout Methods ({country.payoutMethods?.length || 0})
          </button>

          {isExpanded && (
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              {country.payoutMethods && country.payoutMethods.length > 0 ? (
                country.payoutMethods.map(method => (
                  <div key={method.id} className="bg-white p-3 rounded border border-gray-200">
                    {editingMethodId === method.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Fee Value (%)</label>
                            <input
                              type="number"
                              value={editMethodValues.feeValue || 0}
                              onChange={(e) => setEditMethodValues({ ...editMethodValues, feeValue: parseFloat(e.target.value) })}
                              className="input-admin text-sm"
                              step="0.1"
                            />
                          </div>
                          <div>
                            <label className="flex items-center gap-2 mt-5">
                              <input
                                type="checkbox"
                                checked={editMethodValues.recommended || false}
                                onChange={(e) => setEditMethodValues({ ...editMethodValues, recommended: e.target.checked })}
                                className="w-4 h-4"
                              />
                              <span className="text-xs font-semibold text-gray-700">Recommended</span>
                            </label>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveMethod}
                            disabled={savingMethod}
                            className="flex-1 btn-admin-primary btn-admin-sm text-xs disabled:opacity-50"
                          >
                            {savingMethod ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={() => {
                              setEditingMethodId(null);
                              setEditMethodValues({});
                            }}
                            className="flex-1 btn-admin-secondary btn-admin-sm text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{method.name}</p>
                          <p className="text-xs text-gray-600">{method.feeValue}% fee</p>
                          {method.recommended && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded">Recommended</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditMethod(method)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Edit2 size={14} className="text-gray-600" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600 text-center py-4">No payout methods available</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Countries & Payout Methods</h2>
        <p className="text-gray-600 mt-1">Manage payment methods and fees by country</p>
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

      {/* Countries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {countries.map(country => (
          <CountryCard key={country.id} country={country} />
        ))}
      </div>
    </div>
  );
};
