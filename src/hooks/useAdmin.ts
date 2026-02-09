import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { pricingService } from "@/services/pricing.service";
import { useAuth } from "@/providers/AuthProvider";
import type { ApiResponseStaff, RegisterStaffPayload, Staff } from "@/types/staff";

import { Customer, RegisterCustomerPayload, UseOrganizationCustomerParams } from "@/types/customertsx";
import { DashboardStats } from "@/types/dashboard";
import { Organization } from "@/types/organization";

import {
  OrganizationDetail,
  OrganizationUser
} from "@/types/organizationdetail";
import { CreateInvoicePayload, Invoice } from "@/types/orgInvoices";

/* =========================
   DASHBOARD
========================= */

export const useDashboardStats = () => {
  const { isAuthenticated } = useAuth();

  return useQuery<DashboardStats>({
    queryKey: ["admin", "dashboard"],
    queryFn: adminService.getDashboardStats,
    enabled: Boolean(isAuthenticated),
    staleTime: 1000 * 60 * 5,
  });
};

/* =========================
   ORGANIZATIONS (MAIN LIST PAGE)
========================= */

export const useOrganizations = (
  params: { page: number; limit: number; search?: string }
) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["organizations", params],
    queryFn: () => adminService.getOrganizations(params),
    enabled: Boolean(isAuthenticated),
    // keepPreviousData: true, // smooth UX for pagination
  });
};

/* =========================
   CREATE NEW ORGANISATION
========================= */

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["organization-detail-list"] });
    },
  });
};

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orgId: string) => adminService.deleteOrganization(orgId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["organization-detail-list"] });
    },
  });
};



/* =========================
   ORGANIZATION DETAIL LIST (FOR SWITCHER)
========================= */

export const useOrganizationsDetail = () => {
  const { isAuthenticated } = useAuth();

  return useQuery<OrganizationDetail[]>({
    queryKey: ["organization-detail-list"],
    queryFn: adminService.getAllOrganizations, // same API, different type
    enabled: Boolean(isAuthenticated),
  });
};

/* =========================
   SINGLE ORGANIZATION DETAIL
========================= */

export const useOrganizationDetail = (orgId: string) => {
  const { isAuthenticated } = useAuth();

  return useQuery<OrganizationDetail>({
    queryKey: ["organization-detail", orgId],
    queryFn: () => adminService.getOrganizationById(orgId),
    enabled: Boolean(isAuthenticated && orgId),
  });
};

/* =========================
   CUSTOMERS BY ORG
========================= */

export const useOrganizationCustomer = (
  orgId: string,
  params: { page: number; limit: number; search?: string }
) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["organization", "customers", orgId, params],
    queryFn: () => adminService.getCustomerByOrg(orgId, params),
    enabled: Boolean(isAuthenticated && orgId),
    // keepPreviousData: true,
  });
};



/* =========================
   CREATE CUSTOMERS
========================= */

export const useCreateCustomer = (orgId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterCustomerPayload) =>
      adminService.createCustomer(orgId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization", "customers", orgId],
      });
      queryClient.invalidateQueries({
        queryKey: ["organization-detail", orgId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
};
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orgId, customerId }: { orgId: string; customerId: string }) =>
      adminService.deleteCustomer(orgId, customerId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["organization", "customers", variables.orgId],
      });
      queryClient.invalidateQueries({
        queryKey: ["organization", "invoice", variables.orgId],
      });
      queryClient.invalidateQueries({
        queryKey: ["organization-detail", variables.orgId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      // Also invalidate global list if orgId was empty
      if (!variables.orgId) {
        queryClient.invalidateQueries({
          queryKey: ["organization", "customers", ""],
        });
      }
    },
  });
};

export const useUpdateCustomer = (orgId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      data,
    }: {
      customerId: string;
      data: Partial<RegisterCustomerPayload>;
    }) => adminService.updateCustomer(customerId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["organization", "customers", orgId],
      });
      queryClient.invalidateQueries({
        queryKey: ["customer", "composite", variables.customerId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
};

// /* =========================
//    STAFF / USERS BY ORG
// ========================= */

// export const useOrganizationUsers = (orgId: string) => {
//   const { isAuthenticated } = useAuth();

//   return useQuery<OrganizationUser[]>({
//     queryKey: ["organization-users", orgId],
//     queryFn: () => adminService.getStaffByOrg(orgId),
//     enabled: Boolean(isAuthenticated && orgId),
//   });
// };

/* =========================
   STAFF ALIAS (OPTIONAL)
========================= */

/* =========================
   STAFF BY ORG
========================= */
export const useOrganizationStaff = (
  orgId: string,
  params: { page: number; limit: number; search?: string }
) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["organization", "staff", orgId, params],
    queryFn: () => adminService.getStaffByOrg(orgId, params),
    enabled: Boolean(isAuthenticated && orgId),
    // keepPreviousData: true, // ⭐ smooth pagination
  });
};


/* =========================
   ADMIN STAFF LIST
========================= */
export const useAdminStaff = (page: number = 1, limit: number = 10, organizationId?: string, search?: string) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["admin", "adminstaff", page, limit, organizationId, search],
    queryFn: () => adminService.getAdminStaff(page, limit, organizationId, search),
    enabled: Boolean(isAuthenticated),
  });
};

/* =========================
   STAFF BY ORG
========================= */
export const useCreateStaff = (orgId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterStaffPayload) =>
      adminService.createStaff(orgId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization", "staff", orgId],
      });
      queryClient.invalidateQueries({
        queryKey: ["organization-detail", orgId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
};

export const useUpdateStaff = (orgId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      staffId,
      data,
    }: {
      staffId: string;
      data: Partial<RegisterStaffPayload>;
    }) => adminService.updateStaff(staffId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization", "staff", orgId],
      });
      // Also invalidate composite customer data if needed, but staff is usually independent.
    },
  });
};

export const useDeleteStaff = (orgId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (staffId: string) => adminService.deleteStaff(staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization", "staff", orgId],
      });
      queryClient.invalidateQueries({
        queryKey: ["organization-detail", orgId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
};

export const useCreateAdminStaff = (organizationId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterStaffPayload) =>
      adminService.createAdminStaff(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "adminstaff"],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      if (organizationId) {
        queryClient.invalidateQueries({
          queryKey: ["admin", "adminstaff", organizationId],
        });
      }
    },
  });
};

export const useUpdateAdminStaff = (staffId: string, organizationId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<RegisterStaffPayload>) =>
      adminService.updateAdminStaff(staffId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "adminstaff"],
      });
      if (organizationId) {
        queryClient.invalidateQueries({
          queryKey: ["admin", "adminstaff", organizationId],
        });
      }
    },
  });
};

export const useDeleteAdminStaff = (organizationId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (staffId: string) => adminService.deleteAdminStaff(staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "adminstaff"],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      if (organizationId) {
        queryClient.invalidateQueries({
          queryKey: ["admin", "adminstaff", organizationId],
        });
      }
    },
  });
};

export const useAdminStaffPermissions = () => {
  return useQuery({
    queryKey: ["admin", "adminstaff", "permissions"],
    queryFn: adminService.getAdminStaffPermissions,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

/* =========================
   INVOICE BY ORG
========================= */
export const useOrganizationInvoice = (
  orgId: string,
  params: { page: number; limit: number; search?: string }
) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["organization", "invoice", orgId, params],
    queryFn: () => adminService.getInvoicesByOrg(orgId, params),
    enabled: Boolean(isAuthenticated && orgId),
    // keepPreviousData: true,
  });
};

export const useSendReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orgId, invoiceId, data }: { orgId: string; invoiceId: string; data: { channel: string } }) =>
      adminService.sendReminder(orgId, invoiceId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["organization", "invoice", variables.orgId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      // Also invalidate composite customer if needed
    },
  });
};




export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orgId,
      customerId,
      data,
    }: {
      orgId: string;
      customerId: string;
      data: CreateInvoicePayload;
    }): Promise<Invoice> => {
      return adminService.createInvoice(orgId, customerId, data);
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["organization", "invoice", variables.orgId] });
      queryClient.invalidateQueries({ queryKey: ["organization", "customers", variables.orgId] });
      queryClient.invalidateQueries({ queryKey: ["customer", "composite", variables.customerId] });
      queryClient.invalidateQueries({ queryKey: ["organization-detail", variables.orgId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export const useCustomerInvoices = (customerId: string, params?: { page: number; limit: number }) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["customer", "composite", customerId, params],
    queryFn: () => adminService.getCustomerInvoices(customerId, params),
    enabled: Boolean(isAuthenticated && customerId),
  });
};

/* =========================
   PRICING / PLANS
========================= */

export const usePlans = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["admin", "plans"],
    queryFn: () => pricingService.getAllPlans(),
    enabled: Boolean(isAuthenticated),
  });
};


