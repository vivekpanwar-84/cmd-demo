export interface CreateInvoicePayload {
  invoice_number?: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  paid_amount: number;
}

export interface Invoice {
  _id: string;
  org_id: string;
  customer_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  paid_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}
