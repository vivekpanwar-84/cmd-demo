export interface Staff {
  _id: string;
  org_id: string;
  full_name: string;
  phone: string;
  email: string;
  role: "STAFF" | "ADMIN";
  permissions: (
    | "VIEW_CUSTOMERS"
    | "CREATE_INVOICE"
    | "VIEW_INVOICES"
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
  permissions: StaffPermission[];
}

export type StaffPermission =
  | "VIEW_CUSTOMERS"
  | "CREATE_INVOICE"
  | "VIEW_INVOICES";
