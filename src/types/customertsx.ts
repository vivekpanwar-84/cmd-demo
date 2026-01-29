export interface Customer {
  _id: string;
  org_id: string;
  created_by: string;
  full_name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiResponsecustomer<T> {
  success: boolean;
  data: T;
}

export interface RegisterCustomerPayload {
  full_name: string;
  email: string;
  phone: string;
}

export interface UseOrganizationCustomerParams {
  page: number;
  limit: number;
  search?: string;
}