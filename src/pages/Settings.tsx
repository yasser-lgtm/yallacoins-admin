import React, { useState } from 'react';
import { AlertCircle, Save, X } from 'lucide-react';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    requestIdFormat: 'REQ-YYYY-NNNN',
    defaultTimingText: '24-48 hours',
    minWithdrawalAmount: 100,
    maxWithdrawalAmount: 50000,
    notificationEmail: 'admin@yallacoins.com',
    enableAutoApproval: false,
    autoApprovalThreshold: 1000,
    requireScreenshot: true,
    maintenanceMode: false,
    maintenanceMessage: 'System is under maintenance. Please try again later.',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState(settings);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValues(settings);
  };

  const handleSave = () => {
    setSettings(editValues);
    setSaveMessage('Settings saved successfully');
    setIsEditing(false);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValues(settings);
  };

  const SettingSection = ({ title, description, children }: any) => (
    <div className="card-admin">
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      {children}
    </div>
  );

  const SettingField = ({ label, value, onChange, type = 'text' }: any) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      {type === 'checkbox' ? (
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          disabled={!isEditing}
          className="w-4 h-4"
        />
      ) : type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!isEditing}
          className="input-admin"
          rows={4}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!isEditing}
          className="input-admin"
        />
      )}
    </div>
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">System Settings</h2>
          <p className="text-gray-600 mt-1">Configure system-wide settings and preferences</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="btn-admin-primary btn-admin-sm flex items-center gap-2"
              >
                <Save size={16} />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="btn-admin-secondary btn-admin-sm flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="btn-admin-primary btn-admin-sm"
            >
              Edit Settings
            </button>
          )}
        </div>
      </div>

      {/* Success Message */}
      {saveMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">{saveMessage}</p>
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Withdrawal Settings */}
        <SettingSection
          title="Withdrawal Settings"
          description="Configure withdrawal request parameters"
        >
          <SettingField
            label="Request ID Format"
            value={editValues.requestIdFormat}
            onChange={(val: string) => setEditValues({ ...editValues, requestIdFormat: val })}
          />
          <SettingField
            label="Default Processing Time"
            value={editValues.defaultTimingText}
            onChange={(val: string) => setEditValues({ ...editValues, defaultTimingText: val })}
          />
          <SettingField
            label="Minimum Withdrawal Amount ($)"
            value={editValues.minWithdrawalAmount}
            onChange={(val: string) => setEditValues({ ...editValues, minWithdrawalAmount: parseInt(val) })}
            type="number"
          />
          <SettingField
            label="Maximum Withdrawal Amount ($)"
            value={editValues.maxWithdrawalAmount}
            onChange={(val: string) => setEditValues({ ...editValues, maxWithdrawalAmount: parseInt(val) })}
            type="number"
          />
        </SettingSection>

        {/* Approval Settings */}
        <SettingSection
          title="Approval Settings"
          description="Configure automatic approval rules"
        >
          <SettingField
            label="Enable Auto-Approval"
            value={editValues.enableAutoApproval}
            onChange={(val: boolean) => setEditValues({ ...editValues, enableAutoApproval: val })}
            type="checkbox"
          />
          <SettingField
            label="Auto-Approval Threshold ($)"
            value={editValues.autoApprovalThreshold}
            onChange={(val: string) => setEditValues({ ...editValues, autoApprovalThreshold: parseInt(val) })}
            type="number"
          />
          <SettingField
            label="Require Screenshot Proof"
            value={editValues.requireScreenshot}
            onChange={(val: boolean) => setEditValues({ ...editValues, requireScreenshot: val })}
            type="checkbox"
          />
        </SettingSection>

        {/* Notification Settings */}
        <SettingSection
          title="Notification Settings"
          description="Configure notification preferences"
        >
          <SettingField
            label="Notification Email"
            value={editValues.notificationEmail}
            onChange={(val: string) => setEditValues({ ...editValues, notificationEmail: val })}
            type="email"
          />
        </SettingSection>

        {/* Maintenance Settings */}
        <SettingSection
          title="Maintenance Settings"
          description="Configure system maintenance mode"
        >
          <SettingField
            label="Enable Maintenance Mode"
            value={editValues.maintenanceMode}
            onChange={(val: boolean) => setEditValues({ ...editValues, maintenanceMode: val })}
            type="checkbox"
          />
          <SettingField
            label="Maintenance Message"
            value={editValues.maintenanceMessage}
            onChange={(val: string) => setEditValues({ ...editValues, maintenanceMessage: val })}
            type="textarea"
          />
        </SettingSection>
      </div>
    </div>
  );
};
