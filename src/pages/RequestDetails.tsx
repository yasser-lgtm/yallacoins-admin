import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { getWithdrawalRequestDetail, updateWithdrawalRequestStatus, getUsers } from '../services/api';
import { ChevronLeft, CheckCircle, AlertCircle, Clock, FileText, DollarSign, Loader } from 'lucide-react';

interface WithdrawalRequestDetail {
  id: string;
  appId: string;
  accountId: string;
  phone: string;
  amount: number;
  status: string;
  payoutCountry: string;
  payoutMethod: string;
  payoutInfo: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  notes?: string;
  snapshot?: {
    conversionLogic: string;
    payoutRate: number;
    fee: number;
    estimatedPayout: number;
    payoutFields: Record<string, any>;
  };
}

export const RequestDetails: React.FC = () => {
  const [, params] = useRoute('/requests/:id');
  const [, setLocation] = useLocation();
  const [request, setRequest] = useState<WithdrawalRequestDetail | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState('');
  const [actionType, setActionType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [assignedUser, setAssignedUser] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch request details
        if (params?.id) {
          console.log('[ADMIN] Fetching request details for:', params.id);
          const requestData = await getWithdrawalRequestDetail(params.id);
          setRequest(requestData);
          setAssignedUser(requestData.assignedTo || '');
        }

        // Fetch users for assignment
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (err) {
        console.error('[ADMIN] Error fetching request details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load request details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.id]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-blue-100 text-blue-800',
      submitted: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      needs_correction: 'bg-orange-100 text-orange-800',
      paid: 'bg-emerald-100 text-emerald-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.pending;
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!request) return;

    try {
      setSubmitting(true);
      console.log('[ADMIN] Updating request status:', newStatus);
      
      await updateWithdrawalRequestStatus(request.id, {
        status: newStatus,
        notes: activeNote,
      });

      // Refresh request details
      const updatedRequest = await getWithdrawalRequestDetail(request.id);
      setRequest(updatedRequest);
      setActiveNote('');
      setActionType('');
    } catch (err) {
      console.error('[ADMIN] Error updating status:', err);
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="card-admin text-center py-12">
          <Loader size={48} className="mx-auto text-gray-400 mb-4 animate-spin" />
          <p className="text-gray-600 font-medium">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="card-admin text-center py-12">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => setLocation('/requests')}
            className="mt-4 text-[#012D90] hover:text-[#0A1F5C] font-semibold"
          >
            Back to Requests
          </button>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-8">
        <div className="card-admin text-center py-12">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 font-medium">Request not found</p>
          <button
            onClick={() => setLocation('/requests')}
            className="mt-4 text-[#012D90] hover:text-[#0A1F5C] font-semibold"
          >
            Back to Requests
          </button>
        </div>
      </div>
    );
  }

  const estimatedUSD = request.amount;
  const fee = request.snapshot?.fee || 0;
  const feeAmount = (estimatedUSD * fee) / 100;
  const finalPayout = request.snapshot?.estimatedPayout || (estimatedUSD - feeAmount);

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
          <h2 className="text-3xl font-bold text-gray-900">Request {request.id.substring(0, 8)}</h2>
          <p className="text-gray-600 mt-1">Submitted {new Date(request.createdAt).toLocaleString()}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(request.status)}`}>
          {request.status.replace('_', ' ').toUpperCase()}
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
                <p className="text-sm text-gray-600">App</p>
                <p className="text-lg font-bold capitalize">{request.appId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-lg font-bold">${request.amount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Submitted Date</p>
                <p className="text-lg font-bold">{new Date(request.createdAt).toLocaleDateString()}</p>
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
                <p className="text-lg font-semibold">{request.payoutCountry}</p>
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
          {request.snapshot && (
            <div className="card-admin">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign size={20} />
                System Calculation
              </h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-700">Amount Submitted:</span>
                  <span className="font-semibold">${estimatedUSD}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Conversion Rate:</span>
                  <span className="font-semibold">{request.snapshot.payoutRate}</span>
                </div>
                <div className="flex justify-between border-t border-gray-300 pt-3">
                  <span className="text-gray-700">Fee ({request.snapshot.fee}%):</span>
                  <span className="font-semibold">-${feeAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-3 text-[#012D90]">
                  <span>Final Payout:</span>
                  <span>${finalPayout.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Status Timeline */}
          <div className="card-admin">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={20} />
              Status Timeline
            </h3>
            <div className="space-y-4">
              {['pending', 'submitted', 'under_review', 'approved', 'paid'].map((status, idx) => (
                <div key={status} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      ['pending', 'submitted', 'under_review', 'approved', 'paid'].indexOf(request.status) >= idx
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      <CheckCircle size={16} />
                    </div>
                    {idx < 4 && <div className="w-0.5 h-8 bg-gray-300 mt-2" />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 capitalize">{status.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-600">
                      {['pending', 'submitted', 'under_review', 'approved', 'paid'].indexOf(request.status) >= idx
                        ? 'Completed'
                        : 'Pending'}
                    </p>
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
              <button
                onClick={() => handleStatusChange('approved')}
                disabled={submitting}
                className="w-full btn-admin-primary btn-admin-sm disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Approve'}
              </button>
              <button
                onClick={() => handleStatusChange('under_review')}
                disabled={submitting}
                className="w-full btn-admin-secondary btn-admin-sm disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Mark Under Review'}
              </button>
              <button
                onClick={() => handleStatusChange('needs_correction')}
                disabled={submitting}
                className="w-full bg-orange-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Needs Correction'}
              </button>
              <button
                onClick={() => handleStatusChange('rejected')}
                disabled={submitting}
                className="w-full btn-admin-danger btn-admin-sm disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Reject'}
              </button>
              <button
                onClick={() => handleStatusChange('paid')}
                disabled={submitting}
                className="w-full bg-emerald-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Mark Paid'}
              </button>
            </div>
          </div>

          {/* Assign To */}
          <div className="card-admin">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Assign To</h3>
            <select
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
              className="select-admin text-sm"
            >
              <option value="">Select user...</option>
              {users.map(user => (
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
            <button
              onClick={() => handleStatusChange(request.status)}
              disabled={submitting || !activeNote}
              className="w-full btn-admin-primary btn-admin-sm disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add Note'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
