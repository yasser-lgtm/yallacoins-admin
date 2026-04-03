// YallaCoins Admin API Service Layer
// Handles all communication with the backend API for admin operations

// PRODUCTION REQUIREMENT: VITE_API_URL MUST be set in environment
// NO FALLBACK TO LOCALHOST - This ensures production deployments fail fast if misconfigured
const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  console.error(
    "❌ FATAL: VITE_API_URL environment variable is not set. " +
    "The admin portal cannot function without a valid API URL. " +
    "Please ensure VITE_API_URL is configured in your deployment environment."
  );
  throw new Error(
    "VITE_API_URL environment variable is required for admin portal to function"
  );
}

// ============================================================================
// AUTH ENDPOINTS
// ============================================================================

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export async function adminLogin(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

// ============================================================================
// WITHDRAWAL REQUESTS ENDPOINTS
// ============================================================================

export interface WithdrawalRequest {
  id: string;
  appId: string;
  accountId: string;
  phone: string;
  amount: number;
  status: string;
  payoutCountry: string;
  payoutMethod: string;
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getWithdrawalRequests(
  token: string,
  filters?: {
    status?: string;
    app?: string;
    country?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }
): Promise<{ data: WithdrawalRequest[]; total: number }> {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.app) params.append("app", filters.app);
    if (filters?.country) params.append("country", filters.country);
    if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters?.dateTo) params.append("dateTo", filters.dateTo);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await fetch(
      `${API_BASE_URL}/withdrawal-requests?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch requests");
    return await response.json();
  } catch (error) {
    console.error("Fetch requests error:", error);
    throw error;
  }
}

export async function getWithdrawalRequestDetail(
  token: string,
  id: string
): Promise<WithdrawalRequest> {
  try {
    const response = await fetch(`${API_BASE_URL}/withdrawal-requests/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch request details");
    return await response.json();
  } catch (error) {
    console.error("Fetch request detail error:", error);
    throw error;
  }
}

export async function updateWithdrawalRequestStatus(
  token: string,
  id: string,
  status: string,
  notes?: string
): Promise<WithdrawalRequest> {
  try {
    const response = await fetch(`${API_BASE_URL}/withdrawal-requests/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, notes }),
    });

    if (!response.ok) throw new Error("Failed to update request");
    return await response.json();
  } catch (error) {
    console.error("Update request error:", error);
    throw error;
  }
}

// ============================================================================
// DASHBOARD ENDPOINTS
// ============================================================================

export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  underReviewRequests: number;
  approvedRequests: number;
  needsCorrectionRequests: number;
  paidRequests: number;
  rejectedRequests: number;
  totalPayoutValue: number;
  requestsByApp: Record<string, number>;
  requestsByCountry: Record<string, number>;
  requestsByPayoutMethod: Record<string, number>;
}

export async function getDashboardStats(token: string): Promise<DashboardStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch dashboard stats");
    return await response.json();
  } catch (error) {
    console.error("Fetch dashboard stats error:", error);
    throw error;
  }
}

// ============================================================================
// RATES ENDPOINTS
// ============================================================================

export interface AppRate {
  id: string;
  appId: string;
  appName: string;
  rate: number;
  fee: number;
  minWithdrawal: number;
  eta: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export async function getAppRates(token: string): Promise<AppRate[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/rates`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch rates");
    return await response.json();
  } catch (error) {
    console.error("Fetch rates error:", error);
    throw error;
  }
}

export async function updateAppRate(
  token: string,
  appId: string,
  rate: number,
  fee: number,
  minWithdrawal?: number,
  eta?: string
): Promise<AppRate> {
  try {
    const response = await fetch(`${API_BASE_URL}/rates/${appId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rate, fee, minWithdrawal, eta }),
    });

    if (!response.ok) throw new Error("Failed to update rate");
    return await response.json();
  } catch (error) {
    console.error("Update rate error:", error);
    throw error;
  }
}

// ============================================================================
// COUNTRIES & PAYOUT METHODS ENDPOINTS
// ============================================================================

export interface Country {
  id: string;
  name: string;
  code: string;
  flag: string;
  sortOrder: number;
  active: boolean;
}

export interface PayoutMethod {
  id: string;
  countryId: string;
  method: string;
  fee: number;
  feeType: string;
  recommended: boolean;
  sortOrder: number;
}

export async function getCountries(token: string): Promise<Country[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/countries`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch countries");
    return await response.json();
  } catch (error) {
    console.error("Fetch countries error:", error);
    throw error;
  }
}

export async function getPayoutMethods(
  token: string,
  countryId: string
): Promise<PayoutMethod[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/countries/${countryId}/payout-methods`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch payout methods");
    return await response.json();
  } catch (error) {
    console.error("Fetch payout methods error:", error);
    throw error;
  }
}

export async function updatePayoutMethod(
  token: string,
  methodId: string,
  fee: number,
  recommended?: boolean
): Promise<PayoutMethod> {
  try {
    const response = await fetch(`${API_BASE_URL}/countries/payout-methods/${methodId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fee, recommended }),
    });

    if (!response.ok) throw new Error("Failed to update payout method");
    return await response.json();
  } catch (error) {
    console.error("Update payout method error:", error);
    throw error;
  }
}

// ============================================================================
// AUDIT LOG ENDPOINTS
// ============================================================================

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  changes: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export async function getAuditLogs(
  token: string,
  filters?: {
    userId?: string;
    action?: string;
    entity?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }
): Promise<{ data: AuditLog[]; total: number }> {
  try {
    const params = new URLSearchParams();
    if (filters?.userId) params.append("userId", filters.userId);
    if (filters?.action) params.append("action", filters.action);
    if (filters?.entity) params.append("entity", filters.entity);
    if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters?.dateTo) params.append("dateTo", filters.dateTo);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await fetch(`${API_BASE_URL}/audit-logs?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch audit logs");
    return await response.json();
  } catch (error) {
    console.error("Fetch audit logs error:", error);
    throw error;
  }
}

// ============================================================================
// REPORTS ENDPOINTS
// ============================================================================

export interface ReportData {
  period: string;
  totalRequests: number;
  totalPayoutValue: number;
  averagePayoutTime: number;
  requestsByStatus: Record<string, number>;
  requestsByApp: Record<string, number>;
  requestsByCountry: Record<string, number>;
}

export async function getReports(
  token: string,
  filters?: {
    dateFrom?: string;
    dateTo?: string;
    groupBy?: string;
  }
): Promise<ReportData> {
  try {
    const params = new URLSearchParams();
    if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters?.dateTo) params.append("dateTo", filters.dateTo);
    if (filters?.groupBy) params.append("groupBy", filters.groupBy);

    const response = await fetch(`${API_BASE_URL}/reports?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch reports");
    return await response.json();
  } catch (error) {
    console.error("Fetch reports error:", error);
    throw error;
  }
}

// ============================================================================
// USERS ENDPOINTS
// ============================================================================

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  active: boolean;
  lastLogin: string;
  createdAt: string;
}

export async function getUsers(token: string): Promise<AdminUser[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
  } catch (error) {
    console.error("Fetch users error:", error);
    throw error;
  }
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
}
