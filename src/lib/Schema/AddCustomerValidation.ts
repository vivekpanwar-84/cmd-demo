import { z } from "zod";

/* ================= SCHEMA ================= */
export const createCustomerSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(8, "Invalid phone number"),
});
