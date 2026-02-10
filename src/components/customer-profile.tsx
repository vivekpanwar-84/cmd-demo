"use client";
import { ArrowLeft, User, Users, Mail, Phone, Building2, FileText, DollarSign, Calendar, Eye, ChevronDown, TrendingUp, ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCustomerInvoices } from '@/hooks/useAdmin';
import { Loader2 } from 'lucide-react';
import { Invoice } from '@/types/invoice';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddCustomerPage from "./organisationDetails/AddCustomer";
import { Pencil } from 'lucide-react';
import { ReminderModal } from './reminder-modal';

interface CustomerProfileProps {
  customerId: string;
}



const mockPaymentHistory = [
  { id: 'PAY-001', date: '2025-12-15', amount: 2500, method: 'Credit Card', invoice: 'INV-002' },
  { id: 'PAY-002', date: '2025-11-12', amount: 1800, method: 'Bank Transfer', invoice: 'INV-003' },
  { id: 'PAY-003', date: '2025-10-18', amount: 3200, method: 'Credit Card', invoice: 'INV-004' },
];

export function CustomerProfile({ customerId }: CustomerProfileProps) {
  const router = useRouter();
  const [newNote, setNewNote] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [page, setPage] = useState(1);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [selectedInvoiceForReminder, setSelectedInvoiceForReminder] = useState<any>(null);
  const limit = 5;

  const { data: invoicesData, isLoading: isInvoicesLoading } = useCustomerInvoices(customerId, { page, limit });
  const customer = (invoicesData as any)?.data?.customer;
  const rawInvoices: Invoice[] = (invoicesData as any)?.data?.invoices ?? [];
  const meta = (invoicesData as any)?.pagination || (invoicesData as any)?.data?.pagination;

  // Client-side pagination fallback if server metadata is missing
  const invoices = meta ? rawInvoices : rawInvoices.slice((page - 1) * limit, page * limit);
  const effectiveMeta = meta || {
    totalPages: Math.ceil(rawInvoices.length / limit),
    totalRecords: rawInvoices.length,
    currentPage: page
  };

  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<Set<string>>(new Set());

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(selectedInvoiceIds);
      invoices.forEach((inv) => newSelected.add(inv._id));
      setSelectedInvoiceIds(newSelected);
    } else {
      const newSelected = new Set(selectedInvoiceIds);
      invoices.forEach((inv) => newSelected.delete(inv._id));
      setSelectedInvoiceIds(newSelected);
    }
  };

  const handleSelectOne = (checked: boolean, id: string) => {
    const newSelected = new Set(selectedInvoiceIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedInvoiceIds(newSelected);
  };

  const handleBulkReminder = () => {
    // Create a bulk invoice object for the modal
    const selectedInvoices = invoices.filter(inv => selectedInvoiceIds.has(inv._id));

    if (selectedInvoices.length === 0) {
      toast.error("No invoices selected");
      return;
    }

    // Create a "bulk" invoice object for the modal
    const bulkInvoice = {
      id: 'bulk', // Special identifier for bulk operations
      invoice_number: `${selectedInvoices.length} Invoices`,
      customer: {
        name: customer.full_name,
        email: customer.email || '',
        phone: customer.phone || ''
      },
      total: selectedInvoices.reduce((sum, inv) => sum + inv.total_amount, 0),
      dueDate: 'Multiple dates'
    };

    setSelectedInvoiceForReminder(bulkInvoice);
    setReminderModalOpen(true);
  };

  if (isInvoicesLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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



      {/* Customer Header Redesign */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 bg-orange-50 hover:bg-orange-100 rounded-full flex items-center justify-center shrink-0 cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5 text-orange-600" />
          </Button>

          <div className="flex items-center justify-between flex-1">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center border border-orange-100">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-gray-900 leading-none">{customer.full_name}</h1>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-medium px-3 py-0.5 rounded-full">
                    {customer.status || 'Active'}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 mt-4 ml-1">
                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <Mail className="w-4.5 h-4.5 text-gray-500" />
                  <span>{customer.email || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <Phone className="w-4.5 h-4.5 text-gray-500" />
                  <span>{customer.phone || '—'}</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 cursor-pointer"
              onClick={() => setShowEditConfirm(true)}
            >
              <Pencil className="w-4 h-4 ml-1" />
              {/* <span className="mr-1">Edit Profile</span> */}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  ${(customer.totalSpent ?? 0).toLocaleString()}
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
                  ${(customer.outstandingBalance ?? 0).toLocaleString()}
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
                  {invoices.length}
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
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle>Customer Invoices</CardTitle>

      {selectedInvoiceIds.size > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleBulkReminder}
          className="text-orange-600 border-orange-200 hover:bg-orange-50"
        >
          <Bell className="w-4 h-4 mr-2" />
          Send Reminder ({selectedInvoiceIds.size})
        </Button>
      )}
    </CardHeader>

    <CardContent>
      {invoices.length === 0 ? (
        <div className="py-10 text-center text-sm text-muted-foreground">
          No invoices found for this customer.
        </div>
      ) : (
        <div className="space-y-2">

          {/* ===== HEADER ===== */}
          <div className="hidden md:grid grid-cols-[40px_1.8fr_1fr_1fr_120px_80px] items-center px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase rounded-md">
            <Checkbox
              checked={invoices.every(inv => selectedInvoiceIds.has(inv._id))}
              onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
            />
            <span className='pl-8'>Invoice</span>
            <span className='pl-8'>Dates</span>
            <span className="pr-4 text-right">Amount</span>
            <span className="pr-4 text-center">Status</span>
            <span className="pr-4 text-right">Action</span>
          </div>

          {/* ===== ROWS ===== */}
          {invoices.map((invoice) => (
            <div
              key={invoice._id}
              className={`grid grid-cols-1 md:grid-cols-[40px_1.8fr_1fr_1fr_120px_80px]
              items-center gap-3 px-4 py-4 rounded-lg bg-white border
              ${selectedInvoiceIds.has(invoice._id)
                ? "border-orange-200 bg-orange-50/40"
                : "border-gray-100"
              }`}
            >
              {/* Checkbox */}
              <Checkbox
                checked={selectedInvoiceIds.has(invoice._id)}
                onCheckedChange={(checked) =>
                  handleSelectOne(checked as boolean, invoice._id)
                }
              />

              {/* Invoice No */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {invoice.invoice_number}
                  </p>
                  <p className="text-xs text-gray-500 md:hidden">
                    Due: {new Date(invoice.due_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="text-sm text-gray-600 hidden md:block">
                <p> <b>Issued:</b> {new Date(invoice.issue_date).toLocaleDateString()}</p>
                <p> <b>Due:</b> {new Date(invoice.due_date).toLocaleDateString()}</p>
              </div>

              {/* Amount */}
              <div className="text-right font-semibold text-gray-900">
                ₹ {invoice.total_amount.toLocaleString()}
              </div>

              {/* Status */}
              <div className="flex justify-center">
                <Badge
                  className={`capitalize rounded-full px-3 py-1 text-xs font-medium
                    ${invoice.status === "paid"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                    }`}
                >
                  {invoice.status}
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-1">
                <Link href={`/invoices/${invoice.invoice_number}?customerId=${customerId}`}>
                  <Button size="icon" variant="ghost">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>

                <Button
                  size="icon"
                  variant="ghost"
                  className="text-orange-600 hover:bg-orange-50"
                  onClick={() => {
                    setSelectedInvoiceForReminder({
                      id: invoice._id,
                      invoice_number: invoice.invoice_number,
                      customer: {
                        name: customer.full_name,
                        email: customer.email || "",
                        phone: customer.phone || "",
                      },
                      total: invoice.total_amount,
                      dueDate: new Date(invoice.due_date).toLocaleDateString(),
                    });
                    setReminderModalOpen(true);
                  }}
                >
                  <Bell className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
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
                {mockPaymentHistory.map((payment) => (
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
                  className="min-h-25 bg-white border-gray-200 rounded-lg"
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
                {(customer.notes ?? []).map((note: any) => (
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

      {/* Edit Customer Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>

          <AddCustomerPage
            organizationId={customer.org_id || ""}
            onClose={() => setEditOpen(false)}
            initialData={customer}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Confirmation Modal */}
      <AlertDialog open={showEditConfirm} onOpenChange={setShowEditConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Customer profile?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to edit this customer&apos;s information?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowEditConfirm(false);
                setEditOpen(true);
              }}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reminder Modal */}
      {
        selectedInvoiceForReminder && (
          <ReminderModal
            open={reminderModalOpen}
            onOpenChange={setReminderModalOpen}
            invoice={selectedInvoiceForReminder}
            orgId={customer.org_id || ""}
          />
        )
      }
    </div >
  );
}
