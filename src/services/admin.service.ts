import { ApiResponseOrganizationDetail, OrganizationDetail, RegisterOrganizationPayload } from '@/types/organizationdetail';
// import api from "@/lib/axios";

// import {
//   OrganizationDetail,
//   ApiResponseOrganizationDetail,
//   OrganizationUser,
// } from "@/types/organizationdetail";

// import { ApiResponse, DashboardStats } from "@/types/dashboard";
// import { ApiResponsecustomer, Customer } from "@/types/customertsx";
// import { Organization } from "@/types/admin";

// /* =========================
//    ADMIN SERVICE
// ========================= */

// export const adminService = {
//   /* DASHBOARD */
//   getDashboardStats: async (): Promise<DashboardStats> => {
//     const response =
//       await api.get<ApiResponse<DashboardStats>>("/admin/dashboard");
//     return response.data.data;
//   },

//   /* ORGANIZATIONS */
//    getAllOrganizations: async (): Promise<Organization[]> => {
//     const response = await api.get<ApiResponse<Organization[]>>(
//       "/admin/organizations",
//     );
//     return response.data.data;
//   },
//   /* USERS BY ORGANIZATION */
//   getOrganizationUsers: async (orgId: string): Promise<OrganizationUser[]> => {
//     const response = await api.get<
//       ApiResponseOrganizationDetail<OrganizationUser[]>
//     >(`/admin/organizations/${orgId}/users`);
//     return response.data.data;
//   },

//   /* INVOICES */
//   getInvoicesByOrg: async (orgId: string) => {
//     const response = await api.get(`/admin/organizations/${orgId}/invoices`);
//     return response.data.data;
//   },

//   /* TOGGLE ORG STATUS */
//   toggleOrganizationStatus: async (orgId: string) => {
//     const response = await api.patch(
//       `/admin/organizations/${orgId}/toggle-status`,
//     );
//     return response.data;
//   },

//   /* REGISTER ORGANIZATION */
//   registerOrganization: async (data: string) => {
//     const response = await api.post("/admin/registerorganization", data);
//     return response.data;
//   },

//   /* CUSTOMERS */
//   getCustomerByOrg: async (orgId: string): Promise<Customer[]> => {
//     const response = await api.get<ApiResponsecustomer<Customer[]>>(
//       `/admin/organizations/${orgId}/customers`,
//     );
//     return response.data.data;
//   },

//   /* STAFF */
//   getStaffByOrg: async (orgId: string): Promise<OrganizationUser[]> => {
//     const response = await api.get(`/admin/organizations/${orgId}/staff`);
//     return response.data.data; // FIXED
//   },
// };




import api from "@/lib/axios";
// import { Organization, OrganizationUser } from "@/types/admin";
import { ApiResponse, DashboardStats } from "@/types/dashboard";
import { ApiResponsecustomer, Customer, RegisterCustomerPayload } from "@/types/customertsx";
import { ApiResponseOrganizations, Organization } from "@/types/organization";
import { RegisterStaffPayload, ApiResponseAdminStaff, ApiResponseAdminStaffPermissions } from '@/types/staff';
import { PaginatedResponse } from '@/types/pagination';

export const adminService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response =
      await api.get<ApiResponse<DashboardStats>>("/admin/dashboard");
    return response.data.data;
  },
  getOrganizations: async (
    params: { page: number; limit: number; search?: string }
  ) => {
    const res = await api.get("/admin/organizations", {
      params: {
        page: params.page,
        limit: params.limit,
        ...(params.search ? { search: params.search } : {}), // 🔑 only include search if present
      },
    });

    return res.data; // 👈 return full response with data + pagination
  },
  getAllOrganizations: async (): Promise<Organization[]> => {
    const response = await api.get("/admin/organizations", {
      params: { page: 1, limit: 1000 }
    });
    return response.data.data;
  },
  getOrganizationById: async (orgId: string): Promise<OrganizationDetail> => {
    const res = await api.get<ApiResponseOrganizationDetail<OrganizationDetail[]>>(
      `/admin/organizations/${orgId}`
    );
    return res.data.data[0];
  },
  getInvoicesByOrg: async (
    orgId: string,
    params: { page: number; limit: number; search?: string }
  ) => {
    const response = await api.get(
      `/admin/organizations/${orgId}/invoices`,
      { params }
    );

    return response.data; // { data, pagination }
  },


  // toggleOrganizationStatus: async (orgId: string) => {
  //   const response = await api.patch(
  //     `/admin/organizations/${orgId}/toggle-status`,
  //   );
  //   return response.data;
  // },
  // registerOrganization: async (data: string) => {
  //   const response = await api.post("/admin/registerorganization", data);
  //   return response.data;
  // },

  getCustomerByOrg: async (
    orgId: string,
    params: { page: number; limit: number; search?: string }
  ) => {
    const res = await api.get(`/admin/organizations/${orgId}/customers`, {
      params: {
        page: params.page,
        limit: params.limit,
        ...(params.search ? { search: params.search } : {}), // 🔑 IMPORTANT
      },
    });

    return res.data; // 👈 return full response
  },
  getStaffByOrg: async (
    orgId: string,
    params: { page: number; limit: number; search?: string }
  ) => {
    const response = await api.get(
      `/admin/organizations/${orgId}/staffs`,
      { params }
    );

    return response.data;
  },
  createOrganization: async (data: RegisterOrganizationPayload) => {
    const response = await api.post(`/admin/rgsorganization`, data);
    return response.data;
  },
  createCustomer: async (orgId: string, data: RegisterCustomerPayload) => {
    const response = await api.post(`/admin/organizations/${orgId}/customer`, data);
    return response.data;
  },
  createStaff: async (org_id: string, data: RegisterStaffPayload) => {
    const response = await api.post(`/admin/organizations/${org_id}/staff`, data);
    return response.data;
  },
  getAdminStaff: async (page: number = 1, limit: number = 10, org_id?: string, search?: string): Promise<ApiResponseAdminStaff> => {
    const response = await api.get<ApiResponseAdminStaff>(`/admin/adminstaff`, {
      params: { page, limit, org_id, search },
    });
    return response.data;
  },
  createAdminStaff: async (data: RegisterStaffPayload) => {
    const response = await api.post(`/admin/rgsstaff`, data);
    return response.data;
  },
  getAdminStaffPermissions: async (): Promise<ApiResponseAdminStaffPermissions> => {
    const response = await api.get<ApiResponseAdminStaffPermissions>(`/admin/adminstaff/permission`);
    return response.data;
  },
  updateAdminStaff: async (staffId: string, data: Partial<RegisterStaffPayload>) => {
    const response = await api.patch(`/admin/adminstaff/${staffId}`, data);
    return response.data;
  },
  deleteAdminStaff: async (staffId: string) => {
    const response = await api.delete(`/admin/adminstaff/${staffId}`);
    return response.data;
  },

  /* INVOICES */
  createInvoice: async (
    orgId: string,
    customerId: string,
    data: {
      invoice_number: string;
      issue_date: string;
      due_date: string;
      total_amount: number;
      paid_amount: number;
    }
  ) => {
    const response = await api.post(
      `/admin/organizations/${orgId}/invoices/${customerId}`,
      data
    );
    return response.data;
  },



};
