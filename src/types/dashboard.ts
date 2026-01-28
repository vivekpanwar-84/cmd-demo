// Generic API Response
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Invoice Stats
export interface InvoiceStat {
  _id: string;
  count: number;
  totalAmount: number;
}

// Dashboard Stats
export interface DashboardStats {
  totalOrgs: number;
  totalUsers: number;
  totalStaff: number;
  totalCustomers: number;
  invoiceStats: InvoiceStat[];
}

// Chart Types
export interface RevenueData {
  month: string;
  revenue: number;
  subscriptions: number;
}
export type SubscriptionPlan = {
  name: string;
  value: number;
  color: string;
} & Record<string, string | number>;
