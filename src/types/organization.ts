// ================= API RESPONSE =================
export interface ApiResponseOrganizations<T> {
  success: boolean;
  data: T;
}

// ================= LIMITS =================
export interface OrganizationLimits {
  staff: number;
  customers: number;
  invoices: number;
}

// ================= USAGE =================
export interface OrganizationUsage {
  staff: number;
  customers: number;
  invoices: number;
}

// ================= SERVICES =================
export interface OrganizationServices {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
}

// ================= MAIN ORGANIZATION TYPE =================
export interface Organization {
  _id: string;
  name: string;
  country: string;
  timezone: string;
  currency: string;

  plan_id: string | null;
  plan_status: "active" | "inactive";

  limits: OrganizationLimits;
  usage: OrganizationUsage;
  services: OrganizationServices;

  createdAt: string;
  updatedAt: string;
  __v: number;
}
