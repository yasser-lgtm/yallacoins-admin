import React, { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { mockWithdrawalRequests, mockUsers } from '../mockData';
import { WithdrawalRequest } from '../types';
import { ChevronLeft, CheckCircle, AlertCircle, Clock, FileText, DollarSign } from 'lucide-react';

export const RequestDetails: React.FC = () => {
  const [, params] = useRoute('/requests/:id');
  const [, setLocation] = useLocation();
  const [activeNote, setActiveNote] = useState('');
  const [actionType, setActionType] = useState('');

  const request = mockWithdrawalRequests.find(r => r.id === params?.id);

  if (!request) {
    return (
      <div className="p-8">
        <div className="card-admin text-center py-12">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 font-medium">Request not found</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      submitted: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      needs_correction: 'bg-orange-100 text-orange-800',
      paid: 'bg-emerald-100 text-emerald-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.submitted;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button
            onClick={() => setLocation('/requests')}
            className="inline-flex items-center gap-2 text-[#012D90] hover:text-[#0A1F5C] font-semibold mb-4"
          >
            <ChevronLeft size={20} />
            Back to Requests
          </button>
          <h2 className="text-3xl font-bold text-gray-900">Request {request.id}</h2>
          <p className="text-gray-600 mt-1">Submitted {new Date(request.submittedAt).toLocaleString()}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(request.status)}`}>
          {request.status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Request Summary */}
          <div className="card-admin">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={20} />
              Request Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Request ID</p>
                <p className="text-lg font-mono font-bold text-[#012D90]">{request.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Creator ID</p>
                <p className="text-lg font-mono font-bold">{request.creatorId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">App</p>
                <p className="text-lg font-bold capitalize">{request.app}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Submitted Date</p>
                <p className="text-lg font-bold">{new Date(request.submittedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Submitted Information */}
          <div className="card-admin">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Submitted Information</h3>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-600 mb-1">Account ID</p>
                <p className="font-mono text-lg font-semibold">{request.accountId}</p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                <p className="font-mono text-lg font-semibold">{request.phone}</p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-600 mb-1">Payout Country</p>
                <p className="text-lg font-semibold">{request.country}</p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-600 mb-1">Payout Method</p>
                <p className="text-lg font-semibold">{request.payoutMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Payout Account Details</p>
                <p className="font-mono text-lg font-semibold bg-gray-50 p-3 rounded">{request.payoutInfo}</p>
              </div>
            </div>
          </div>

          {/* System Calculation */}
          <div className="card-admin">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={20} />
              System Calculation
            </h3>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="text-gray-700">Amount Submitted:</span>
                <span className="font-semibold">{request.amountSubmitted} {request.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Conversion Rate:</span>
                <span className="font-semibold">${request.rateSnapshot.rate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Estimated USD:</span>
                <span className="font-semibold text-green-700">${request.estimatedUSD}</span>
              </div>
              <div className="flex justify-between border-t border-gray-300 pt-3">
                <span className="text-gray-700">Fee ({request.rateSnapshot.fee}%):</span>
                <span className="font-semibold">-${(request.estimatedUSD * request.rateSnapshot.fee / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-3 text-[#012D90]">
                <span>Final Payout:</span>
                <span>{request.estimatedPayout} {request.payoutCurrency}</span>
              </div>
            </div>
          </div>

          {/* Audit Trail */}
          <div className="card-admin">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={20} />
              Status Timeline
            </h3>
            <div className="space-y-4">
              {['submitted', 'under_review', 'approved', 'paid'].map((status, idx) => (
                <div key={status} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      ['submitted', 'under_review', 'approved', 'paid'].indexOf(request.status) >= idx
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      <CheckCircle size={16} />
                    </div>
                    {idx < 3 && <div className="w-0.5 h-8 bg-gray-300 mt-2" />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 capitalize">{status.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Admin Actions */}
        <div className="space-y-6">
          {/* Admin Review Panel */}
          <div className="card-admin">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Admin Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn-admin-primary btn-admin-sm">
                Approve
              </button>
              <button className="w-full btn-admin-secondary btn-admin-sm">
                Mark Under Review
              </button>
              <button className="w-full bg-orange-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-orange-700 transition-colors">
                Needs Correction
              </button>
              <button className="w-full btn-admin-danger btn-admin-sm">
                Reject
              </button>
              <button className="w-full bg-emerald-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-emerald-700 transition-colors">
                Mark Paid
              </button>
            </div>
          </div>

          {/* Assign To */}
          <div className="card-admin">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Assign To</h3>
            <select className="select-admin text-sm">
              <option value="">Select user...</option>
              {mockUsers.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>

          {/* Add Note */}
          <div className="card-admin">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Add Note</h3>
            <textarea
              value={activeNote}
              onChange={(e) => setActiveNote(e.target.value)}
              placeholder="Add internal note..."
              className="textarea-admin text-sm h-24 mb-2"
            />
            <button className="w-full btn-admin-primary btn-admin-sm">
              Add Note
            </button>
          </div>

          {/* Risk Tags */}
          <div className="card-admin">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Risk Tags</h3>
            <div className="flex flex-wrap gap-2">
              {request.riskTags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                  {tag}
                </span>
              ))}
              {request.riskTags.length === 0 && (
                <p className="text-sm text-gray-600">No risk tags</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
