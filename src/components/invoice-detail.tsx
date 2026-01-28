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

interface InvoiceDetailProps {
  invoiceId: string;
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

export function InvoiceDetail({ invoiceId }: InvoiceDetailProps) {
  const router = useRouter();
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const invoice = mockInvoiceData[invoiceId];

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
      {/* Back Button */}
      <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      {/* Invoice Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">{invoice.id}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getStatusColor(invoice.status)}>
                {invoice.status.toUpperCase()}
              </Badge>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">Due: {invoice.dueDate}</span>
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
                <Separator />
                <div className="text-sm text-gray-600">
                  {invoice.customer.address}
                </div>
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
      />
    </div>
  );
}
