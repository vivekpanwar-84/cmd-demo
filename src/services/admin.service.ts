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
import { RegisterStaffPayload } from '@/types/staff';

export const adminService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response =
      await api.get<ApiResponse<DashboardStats>>("/admin/dashboard");
    return response.data.data;
  },
  getAllOrganizations: async (): Promise<Organization[]> => {
    const res = await api.get<ApiResponseOrganizations<Organization[]>>(
      "/admin/organizations"
    );
    return res.data.data;
  },
  getOrganizationById: async (orgId: string): Promise<OrganizationDetail> => {
    const res = await api.get<ApiResponseOrganizationDetail<OrganizationDetail>>(
      `/admin/organizations/${orgId}`
    );
    return res.data.data;
  },
  getInvoicesByOrg: async (orgId: string) => {
    const response = await api.get(`/admin/organizations/${orgId}/invoices`);
    return response.data; // returns only invoice data.
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

  getCustomerByOrg: async (orgId: string): Promise<Customer[]> => {
    const response = await api.get<ApiResponsecustomer<Customer[]>>(
      `/admin/organizations/${orgId}/customers`,
    );

    return response.data.data; // return only customers array
  },
  getStaffByOrg: async (orgId: string) => {
    const response = await api.get(`/admin/organizations/${orgId}/staffs`);
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
  createStaff: async (orgId: string, data: RegisterStaffPayload) => {
    const response = await api.post(`/admin/organizations/${orgId}/staff`, data);
    return response.data;
  },
};
