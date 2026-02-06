export interface AdminStaff {
  _id: string;
  full_name: string;
  phone: string;
  email: string;
  role: string;
  permissions: string[];
  is_active: boolean;
  created_by: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiResponseAdminStaff {
  success: boolean;
  data: AdminStaff[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponseAdminStaffPermissions {
  success: boolean;
  data: string[];
}

export interface Staff {
  _id: string;
  org_id: string;
  full_name: string;
  phone: string;
  email: string;
  role: "STAFF" | "ADMIN";
  permissions: (
    | "VIEW_CUSTOMER"
    | "CREATE_INVOICE"
    | "VIEW_INVOICE"
  )[];
  is_active: boolean;
  created_by: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiResponseStaff<T> {
  success: boolean;
  data: T;
}

export interface RegisterStaffPayload {
  full_name: string;
  phone: string;
  email: string;
  password: string;
  permissions: string[];
  org_id?: string;
}

export type StaffPermission =
  | "VIEW_ORGANIZATION"
  | "CREATE_ORGANIZATION"
  | "VIEW_STAFF"
  | "CREATE_STAFF"
  | "VIEW_CUSTOMERS"
  | "CREATE_CUSTOMER"
  | "DELETE_CUSTOMER"
  | "UPDATE_STAFF"
  | "DELETE_STAFF"
  | "UPDATE_ORGANIZATION"
  | "DELETE_ORGANIZATION"
  | "UPDATE_CUSTOMER"
  | "VIEW_INVOICES";
