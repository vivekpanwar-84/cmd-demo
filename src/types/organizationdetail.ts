export interface ApiResponseOrganizationDetail<T> {
  success: boolean;
  data: T;
}

export interface OrganizationLimits {
  staff: number;
  customers: number;
  invoices: number;
}

export interface OrganizationUsage {
  staff: number;
  customers: number;
  invoices: number;
}

export interface OrganizationServices {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
}

export interface OrganizationDetail {
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

export interface OrganizationUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}


export interface RegisterOrganizationPayload {
  country: string;
  timezone: string;
  currency: string;
  orgName: string;
  adminName: string;
  email: string;
  password: string;
  phone: string;
}
