// Admin Portal Types

export type UserRole = 'super_admin' | 'operations_admin' | 'finance_admin' | 'rate_manager' | 'support_agent' | 'auditor';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  active: boolean;
  lastLogin: string;
  createdAt: string;
}

export type WithdrawalStatus = 'submitted' | 'under_review' | 'needs_correction' | 'approved' | 'paid' | 'rejected' | 'cancelled';

export interface WithdrawalRequest {
  id: string;
  creatorId: string;
  app: 'kiti' | 'bigo' | 'xena';
  accountId: string;
  phone: string;
  amountSubmitted: number;
  currency: string;
  estimatedUSD: number;
  estimatedPayout: number;
  payoutCurrency: string;
  country: string;
  payoutMethod: string;
  payoutInfo: string;
  proofUrl?: string;
  status: WithdrawalStatus;
  assignedTo?: string;
  notes: string[];
  financeNotes: string[];
  riskTags: string[];
  submittedAt: string;
  updatedAt: string;
  paidAt?: string;
  rejectionReason?: string;
  rateSnapshot: {
    rate: number;
    fee: number;
    timestamp: string;
  };
}

export interface AppRate {
  id: string;
  appName: 'kiti' | 'bigo' | 'xena';
  conversionLogic: string;
  publicRate: number;
  internalRate: number;
  feeType: 'percentage' | 'fixed';
  feeValue: number;
  minimumWithdrawal: number;
  etaText: string;
  status: 'active' | 'limited' | 'disabled';
  publicNote: string;
  updatedBy: string;
  updatedAt: string;
  versionHistory: AppRateVersion[];
}

export interface AppRateVersion {
  version: number;
  rate: number;
  fee: number;
  updatedBy: string;
  updatedAt: string;
  reason: string;
}

export interface PayoutMethod {
  id: string;
  name: string;
  feeType: 'percentage' | 'fixed';
  feeValue: number;
  etaText: string;
  enabled: boolean;
  recommended: boolean;
  publicNote: string;
  internalNote: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  currency: string;
  active: boolean;
  payoutMethods: PayoutMethod[];
  updatedAt: string;
}

export interface App {
  id: string;
  name: 'kiti' | 'bigo' | 'xena';
  logo: string;
  status: 'active' | 'limited' | 'disabled';
  conversionUnitLabel: string;
  idHelperText: string;
  uploadInstructions: string;
  publicMessages: string;
  internalRules: string;
}

export interface ContentBlock {
  id: string;
  key: string;
  label: string;
  value: string;
  type: 'text' | 'textarea' | 'richtext';
  updatedBy: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  actionType: string;
  entityType: string;
  entityId: string;
  oldValue?: string;
  newValue?: string;
  comment?: string;
}

export interface DashboardStats {
  totalRequestsToday: number;
  pendingRequests: number;
  underReview: number;
  approved: number;
  needsCorrection: number;
  paid: number;
  rejected: number;
  totalPayoutValue: number;
  requestsByApp: Record<string, number>;
  requestsByCountry: Record<string, number>;
  requestsByPayoutMethod: Record<string, number>;
}

export interface AuthState {
  isAuthenticated: boolean;
  user?: AdminUser;
  token?: string;
}
