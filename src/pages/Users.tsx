import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AdminUser, UserRole } from '../types';
import { getUsers } from '../services/api';
import { AlertCircle, Loader } from 'lucide-react';

const roles: { value: UserRole; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'operations_admin', label: 'Operations Admin' },
  { value: 'finance_admin', label: 'Finance Admin' },
  { value: 'rate_manager', label: 'Rate Manager' },
  { value: 'support_agent', label: 'Support Agent' },
  { value: 'auditor', label: 'Auditor' },
];

export const Users: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadUsers();
    }
  }, [token]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers(token!);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Users & Roles</h2>
          <p className="text-gray-600 mt-1">Manage admin users and permissions</p>
        </div>
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

      {/* Users Table */}
      <div className="card-admin overflow-x-auto">
        <table className="table-admin">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="font-semibold">{user.name}</td>
                <td className="font-mono text-sm">{user.email}</td>
                <td className="font-mono text-sm">{user.phone || '-'}</td>
                <td>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                    {roles.find(r => r.value === (user.role as UserRole))?.label || user.role}
                  </span>
                </td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="text-sm text-gray-600">
                  {new Date(user.lastLogin).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <div className="card-admin text-center py-12">
          <p className="text-gray-600 font-medium">No users found</p>
        </div>
      )}
    </div>
  );
};
