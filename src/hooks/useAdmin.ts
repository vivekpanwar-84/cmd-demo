import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { useAuth } from "@/providers/AuthProvider";
import type { ApiResponseStaff, RegisterStaffPayload, Staff } from "@/types/staff";

import { Customer, RegisterCustomerPayload } from "@/types/customertsx";
import { DashboardStats } from "@/types/dashboard";
import { Organization } from "@/types/organization";

import {
  OrganizationDetail,
  OrganizationUser
} from "@/types/organizationdetail";
import { ApiResponse, Invoice } from "@/types/invoice";

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

export const useOrganizations = () => {
  const { isAuthenticated } = useAuth();

  return useQuery<Organization[]>({
    queryKey: ["organizations"],
    queryFn: adminService.getAllOrganizations,
    enabled: Boolean(isAuthenticated),
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

export const useOrganizationCustomer = (orgId: string) => {
  const { isAuthenticated } = useAuth();

  return useQuery<Customer[]>({
    queryKey: ["organization", "customer", orgId],
    queryFn: () => adminService.getCustomerByOrg(orgId),
    enabled: Boolean(isAuthenticated && orgId),
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
        queryKey: ["organization", "customer", orgId],
      });
    },
  });
};

/* =========================
   STAFF / USERS BY ORG
========================= */

export const useOrganizationUsers = (orgId: string) => {
  const { isAuthenticated } = useAuth();

  return useQuery<OrganizationUser[]>({
    queryKey: ["organization-users", orgId],
    queryFn: () => adminService.getStaffByOrg(orgId),
    enabled: Boolean(isAuthenticated && orgId),
  });
};

/* =========================
   STAFF ALIAS (OPTIONAL)
========================= */

/* =========================
   STAFF BY ORG
========================= */
export const useOrganizationStaff = (orgId: string) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['organization', 'staff', orgId],
    queryFn: () => adminService.getStaffByOrg(orgId),
    enabled: isAuthenticated && !!orgId, // 🔒 FIXED
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
    },
  });
};

/* =========================
   INVOICE BY ORG
========================= */
export const useOrganizationInvoice = (orgId: string) => {
  const { isAuthenticated } = useAuth();

  return useQuery<ApiResponse<Invoice[]>>({
    queryKey: ['organization', 'invoice', orgId],
    queryFn: () => adminService.getInvoicesByOrg(orgId),
    enabled: isAuthenticated && !!orgId, // 🔒 FIXED
  });
};