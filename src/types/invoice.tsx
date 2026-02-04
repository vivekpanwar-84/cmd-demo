export interface InvoiceCustomer {
  _id: string;
  phone: string;
}


export interface Invoice {
  _id: string;
  org_id: string;

  customer_id: InvoiceCustomer | null;

  invoice_number: string;

  issue_date: string; // ISO date
  due_date: string;   // ISO date

  total_amount: number;
  paid_amount: number;

  status: "pending" | "paid" | "overdue" | "cancelled";

  created_by: string;
  created_by_type: "USER" | "STAFF";

  last_reminder_sent_at: string | null;
  reminder_count: number;

  createdAt: string;
  updatedAt: string;

  __v: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}