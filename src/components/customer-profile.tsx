"use client";
import { ArrowLeft, User, Mail, Phone, Building2, FileText, DollarSign, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CustomerProfileProps {
  customerId: string;
}

const mockCustomerData = {
  '6979dcffc90088095de647c8': {
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    company: 'Tech Corp',
    address: '123 Tech Street, San Francisco, CA 94105',
    status: 'active',
    totalSpent: 24500,
    outstandingBalance: 1200,
    invoices: [
      { id: 'INV-001', date: '2026-01-15', amount: 1200, status: 'due', items: 3 },
      { id: 'INV-002', date: '2025-12-10', amount: 2500, status: 'paid', items: 5 },
      { id: 'INV-003', date: '2025-11-05', amount: 1800, status: 'paid', items: 4 },
    ],
    payments: [
      { id: 'PAY-001', date: '2025-12-15', amount: 2500, method: 'Credit Card', invoice: 'INV-002' },
      { id: 'PAY-002', date: '2025-11-12', amount: 1800, method: 'Bank Transfer', invoice: 'INV-003' },
      { id: 'PAY-003', date: '2025-10-18', amount: 3200, method: 'Credit Card', invoice: 'INV-004' },
    ],
    notes: [
      { id: '1', date: '2026-01-10', author: 'Admin', content: 'Customer requested extended payment terms for next invoice.' },
      { id: '2', date: '2025-12-05', author: 'Sales', content: 'Interested in upgrading to Enterprise plan.' },
    ]
  },
};

export function CustomerProfile({ customerId }: CustomerProfileProps) {
  const router = useRouter();
  const [newNote, setNewNote] = useState('');
  const customer = mockCustomerData[customerId as keyof typeof mockCustomerData];

  if (!customer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Customer not found</h2>
        <Button className="mt-4" asChild onClick={() => router.back()}>
          <span>Go Back</span>
        </Button>
      </div>
    );
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      alert(`Note added: ${newNote}`);
      setNewNote('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      {/* <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button> */}



      {/* Customer Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="bg-orange-50 hover:bg-orange-100 rounded-full shadow-sm"

            onClick={() => router.back()}
          >

            <ArrowLeft className="w-4 h-4 text-orange-600" />

          </Button>
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-semibold text-gray-900">{customer.name}</h1>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                {customer.status}
              </Badge>
            </div>
            <p className="text-gray-500 mt-1">{customer.company}</p>
            <div className="flex flex-wrap gap-4 mt-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                {customer.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                {customer.phone}
              </div>
            </div>
          </div>

        </div>
        <Button variant="outline" className="border-primary text-primary hover:bg-accent">
          Edit Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  ${customer.totalSpent.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Outstanding Balance</p>
                <p className="text-2xl font-semibold text-red-600 mt-1">
                  ${customer.outstandingBalance.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Invoices</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {customer.invoices.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="invoices" className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
          <TabsTrigger
            value="invoices"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Invoices
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Payment History
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Notes
          </TabsTrigger>
        </TabsList>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Customer Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customer.invoices.map((invoice) => (
                  <Link href={`/invoices/${invoice.id}`} key={invoice.id}>
                    <div
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{invoice.id}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar className="w-3 h-3" />
                            {invoice.date}
                            <span>•</span>
                            <span>{invoice.items} items</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 sm:mt-0">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${invoice.amount.toLocaleString()}</p>
                          <Badge
                            variant={invoice.status === 'paid' ? 'default' : 'destructive'}
                            className={`mt-1 ${invoice.status === 'paid' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}`}
                          >
                            {invoice.status}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline" tabIndex={-1}>View</Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="payments">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customer.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{payment.id}</p>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-1">
                          <span>{payment.date}</span>
                          <span>•</span>
                          <span>{payment.method}</span>
                          <span>•</span>
                          <span>Invoice: {payment.invoice}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right mt-3 sm:mt-0">
                      <p className="font-semibold text-green-600 text-lg">
                        ${payment.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Customer Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Note */}
              <div className="space-y-3">
                <Textarea
                  placeholder="Add a note about this customer..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="min-h-[100px] bg-white border-gray-200 rounded-lg"
                />
                <Button
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={handleAddNote}
                >
                  Add Note
                </Button>
              </div>

              {/* Notes List */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                {customer.notes.map((note) => (
                  <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{note.author}</p>
                          <p className="text-xs text-gray-500">{note.date}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{note.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
