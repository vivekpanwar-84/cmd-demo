import { z } from "zod";


/* ================= SCHEMA ================= */

export const createOrganizationSchema = z.object({
  orgName: z.string().min(2, "Organization name is required"),
  country: z.string().min(1, "Country is required"),
  timezone: z.string().min(1, "Timezone is required"),
  currency: z.string().min(1, "Currency is required"),

  adminName: z.string().min(2, "Admin name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
  phone: z.string().min(8, "Invalid phone number"),
});
