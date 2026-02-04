import { z } from "zod";

export const createInvoiceSchema = z.object({
  invoice_number: z
    .string()
    .min(1, "Invoice number is required"),

  issue_date: z
    .string()
    .min(1, "Issue date is required"),

  due_date: z
    .string()
    .min(1, "Due date is required"),

  total_amount: z
    .number("Total amount is required" )
    .positive("Amount must be greater than 0"),

  paid_amount: z
    .number("Paid amount is required" )
    .min(0, "Paid amount cannot be negative"),
});
