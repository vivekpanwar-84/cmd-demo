"use client";
import { ArrowLeft, FileText, User, Calendar, Mail, Phone, MessageSquare, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { ReminderModal } from './reminder-modal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCustomerInvoices } from '@/hooks/useAdmin';
import { Loader2 } from 'lucide-react';
import { Invoice as BackendInvoice } from '@/types/invoice';

interface InvoiceDetailProps {
  invoiceId: string;
  customerId?: string;
  orgId: string;
}

interface Invoice {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
  };
  date: string;
  dueDate: string;
  status: 'paid' | 'partial' | 'due';
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  paid: number;
  notes: string;
}

const mockInvoiceData: Record<string, Invoice> = {
  'INV-001': {
    id: 'INV-001',
    customer: {
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      company: 'Tech Corp',
      address: '123 Tech Street, San Francisco, CA 94105'
    },
    date: '2026-01-15',
    dueDate: '2026-02-15',
    status: 'due',
    items: [
      { id: '1', description: 'Website Design Service', quantity: 1, rate: 500, amount: 500 },
      { id: '2', description: 'Logo Design', quantity: 1, rate: 300, amount: 300 },
      { id: '3', description: 'Business Cards (1000 pcs)', quantity: 1, rate: 400, amount: 400 },
    ],
    subtotal: 1200,
    tax: 0,
    total: 1200,
    paid: 0,
    notes: 'Payment due within 30 days. Late payments may incur additional fees.'
  },
};

export function InvoiceDetail({ invoiceId, customerId, orgId }: InvoiceDetailProps) {
  const router = useRouter();
  const [reminderModalOpen, setReminderModalOpen] = useState(false);

  const { data: invoicesData, isLoading } = useCustomerInvoices(customerId ?? '');
  const customerData = (invoicesData as any)?.data?.customer;
  const invoices: BackendInvoice[] = (invoicesData as any)?.data?.invoices ?? [];
  const backendInvoice = invoices.find(inv => inv.invoice_number === invoiceId);

  // If we have backend data, we'll merge it with mock data for fields not in backend
  const invoice = backendInvoice ? {
    id: backendInvoice._id,
    customer: {
      name: customerData?.full_name || 'Customer',
      email: customerData?.email || 'customer@example.com',
      phone: customerData?.phone || backendInvoice.customer_id?.phone || '—',
      company: typeof backendInvoice.org_id === 'object' ? (backendInvoice.org_id as any).name : '—',
      address: '—'
    },
    date: new Date(backendInvoice.issue_date).toLocaleDateString(),
    dueDate: new Date(backendInvoice.due_date).toLocaleDateString(),
    status: backendInvoice.status === 'pending' ? 'due' : (backendInvoice.status === 'paid' ? 'paid' : 'due'),
    items: [
      { id: '1', description: 'Services Rendered', quantity: 1, rate: backendInvoice.total_amount, amount: backendInvoice.total_amount },
    ],
    subtotal: backendInvoice.total_amount,
    tax: 0,
    total: backendInvoice.total_amount,
    paid: backendInvoice.paid_amount,
    notes: 'Payment information fetched from backend.'
  } : mockInvoiceData[invoiceId];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Invoice not found</h2>
        <Button className="mt-4" asChild onClick={() => router.back()}>
          <span>Go Back</span>
        </Button>
      </div>
    );
  }

  const remaining = invoice.total - invoice.paid;
  const isPaid = invoice.status === 'paid';

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'partial':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'due':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 bg-orange-50 hover:bg-orange-100 rounded-full flex items-center justify-center shrink-0"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5 text-orange-600" />
            </Button>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center border border-orange-100">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-gray-900 leading-none">{invoice.id}</h1>
                  <Badge className={getStatusColor(invoice.status as any)}>
                    {invoice.status.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500 font-medium">Due: {invoice.dueDate}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              Download PDF
            </Button>
            {!isPaid && (
              <Button
                className="bg-primary hover:bg-primary/90 text-white gap-2"
                onClick={() => setReminderModalOpen(true)}
              >
                <Bell className="w-4 h-4" />
                Send Reminder
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{invoice.customer.name}</p>
                    <p className="text-sm text-gray-500">{invoice.customer.company}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-600">{invoice.customer.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-600">{invoice.customer.phone}</p>
                </div>
                {/* <Separator /> */}
                {/* <div className="text-sm text-gray-600">
                  {invoice.customer.address}
                </div> */}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Invoice Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Description</th>
                      <th className="text-center py-3 px-2 text-sm font-medium text-gray-500">Qty</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Rate</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-4 px-2 text-sm text-gray-900">{item.description}</td>
                        <td className="py-4 px-2 text-sm text-gray-600 text-center">{item.quantity}</td>
                        <td className="py-4 px-2 text-sm text-gray-600 text-right">${item.rate}</td>
                        <td className="py-4 px-2 text-sm font-medium text-gray-900 text-right">${item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mt-6 space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">${invoice.subtotal.toLocaleString()}</span>
                </div>
                {invoice.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span className="text-gray-900">${invoice.tax.toLocaleString()}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-semibold text-gray-900 text-xl">${invoice.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
                  <p className="text-sm text-gray-600">{invoice.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Invoice Date</p>
                <p className="font-medium text-gray-900 mt-1">{invoice.date}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="font-medium text-gray-900 mt-1">{invoice.dueDate}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  ${invoice.total.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount Paid</p>
                <p className="text-2xl font-semibold text-green-600 mt-1">
                  ${invoice.paid.toLocaleString()}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">Remaining Balance</p>
                <p className={`text-2xl font-semibold mt-1 ${remaining > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${remaining.toLocaleString()}
                </p>
              </div>
              {!isPaid && (
                <Button className="w-full bg-primary hover:bg-primary/90 text-white mt-4">
                  Record Payment
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Mail className="w-4 h-4" />
                Email Invoice
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="w-4 h-4" />
                Duplicate Invoice
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 text-red-600 hover:text-red-700">
                <FileText className="w-4 h-4" />
                Void Invoice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reminder Modal */}
      <ReminderModal
        open={reminderModalOpen}
        onOpenChange={setReminderModalOpen}
        invoice={invoice}
        orgId={orgId}
      />
    </div>
  );
}
