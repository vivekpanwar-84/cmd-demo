"use client";

import { useState } from "react";
import {
  FileText,
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Bell,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useDebounce } from "@/hooks/useDebounce";
import { useOrganizationInvoice } from "@/hooks/useAdmin";
import type { Invoice } from "@/types/invoice";
import { ReminderModal } from "./reminder-modal";

type ViewMode = "list" | "card";

interface InvoicesProps {
  organizationId: string;
}

export function Invoices({ organizationId }: InvoicesProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pageInput, setPageInput] = useState("1");
  const [reminderOpen, setReminderOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const limit = 5;
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, error } = useOrganizationInvoice(organizationId, {
    page,
    limit,
    search: debouncedSearch,
  });

  // const invoices = data?.data ?? [];
  const invoices: Invoice[] = data?.data ?? [];
  const meta = data?.pagination ?? {
    page: 1,
    limit,
    total: invoices.length,
    totalPages: 1,
  };

  /* ================= HELPERS ================= */

  const handlePageChange = (newPage: number) => {
    if (!meta) return;
    const valid = Math.min(Math.max(newPage, 1), meta.totalPages);
    setPage(valid);
    setPageInput(String(valid));
  };

  const getSlidingPages = (): number[] => {
    if (!meta) return [];
    const start = Math.max(1, Math.min(page, meta.totalPages - 2));
    return Array.from(
      { length: Math.min(3, meta.totalPages - start + 1) },
      (_, i) => start + i
    );
  };

  /* ================= PAGINATION ================= */

  const Pagination = () => {
    if (!meta || meta.totalPages <= 1) return null;

    return (
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 border-t">
        <p className="text-sm text-muted-foreground">
          Page {page} of {meta.totalPages}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
          </Button>

          {getSlidingPages().map((p) => (
            <Button
              key={p}
              size="sm"
              variant={p === page ? "default" : "outline"}
              onClick={() => handlePageChange(p)}
            >
              {p}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            disabled={page === meta.totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            <ChevronLeft className="rotate-180 ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span>Go to page:</span>
          <Input
            type="number"
            min={1}
            max={meta.totalPages}
            value={pageInput}
            className="w-20 h-8 text-center"
            onChange={(e) => setPageInput(e.target.value)}
            onBlur={() => handlePageChange(Number(pageInput))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handlePageChange(Number(pageInput));
              }
            }}
          />
        </div>
      </div>
    );
  };

  /* ================= RENDER ================= */

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Invoices</h1>
        <p className="text-muted-foreground">
          Manage invoices and billing
        </p>
      </div>

      {/* Search + View */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-[280px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search invoice or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex border rounded-md overflow-hidden self-end">
          <Button
            size="sm"
            variant={viewMode === "list" ? "secondary" : "ghost"}
            className="rounded-none"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === "card" ? "secondary" : "ghost"}
            className="rounded-none"
            onClick={() => setViewMode("card")}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center text-red-500 py-6">
          Failed to load invoices
        </div>
      )}

      {/* Content */}
      {!isLoading && (
        <Card>
          <CardContent className="p-0">
            {invoices.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No invoices found
              </div>
            ) : viewMode === "list" ? (
              <div className="divide-y">
                {invoices.map((invoice) => (
                  // <div
                  //   key={invoice._id}
                  //   className="grid grid-cols-6 gap-4 px-4 py-4 hover:bg-muted"
                  // >
                  //   <div className="col-span-2 flex gap-3">
                  //     <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  //       <FileText className="w-5 h-5 text-primary" />
                  //     </div>
                  //     <div>
                  //       <p className="font-medium">
                  //         {invoice.invoice_number}
                  //       </p>
                  //       <p className="text-xs text-muted-foreground">
                  //         {new Date(invoice.createdAt).toLocaleDateString()}
                  //       </p>
                  //     </div>
                  //   </div>

                  //   <div className="flex items-center gap-1">
                  //     <User className="w-4 h-4 text-muted-foreground" />
                  //     {invoice.customer_id?.phone ?? "—"}
                  //   </div>

                  //   <div>
                  //     {invoice.status === "paid" && (
                  //       <span className="flex items-center gap-1 text-green-600">
                  //         <CheckCircle className="w-4 h-4" /> Paid
                  //       </span>
                  //     )}
                  //     {invoice.status === "pending" && (
                  //       <span className="flex items-center gap-1 text-yellow-600">
                  //         <Clock className="w-4 h-4" /> Pending
                  //       </span>
                  //     )}
                  //     {invoice.status === "overdue" && (
                  //       <span className="flex items-center gap-1 text-red-600">
                  //         <AlertTriangle className="w-4 h-4" /> Overdue
                  //       </span>
                  //     )}
                  //   </div>

                  //   <div className="font-medium">INR</div>

                  //   <div className="flex justify-center gap-10">
                  //     <Button size="sm" variant="ghost">
                  //       <Eye className="w-4 h-4" />
                  //     </Button>
                  //     <Button
                  //       size="sm"
                  //       variant="ghost"
                  //       onClick={() => {
                  //         setSelectedInvoice(invoice);
                  //         setReminderOpen(true);
                  //       }}
                  //     >
                  //       <Bell className="w-4 h-4 text-orange-600" />
                  //     </Button>
                  //   </div>
                  // </div>
                  <div
                    key={invoice._id}
                    className="grid grid-cols-[300px_300px_280px_80px_180px] items-center px-4 py-4 hover:bg-muted"
                  >
                    {/* Invoice Number + Date */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {invoice.invoice_number}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(invoice.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{invoice.customer_id?.phone ?? "—"}</span>
                    </div>

                    {/* Status */}
                    <div>
                      {invoice.status === "paid" && (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" /> Paid
                        </span>
                      )}
                      {invoice.status === "pending" && (
                        <span className="flex items-center gap-1 text-yellow-600">
                          <Clock className="w-4 h-4" /> Pending
                        </span>
                      )}
                      {invoice.status === "overdue" && (
                        <span className="flex items-center gap-1 text-red-600">
                          <AlertTriangle className="w-4 h-4" /> Overdue
                        </span>
                      )}
                    </div>

                    {/* Currency */}
                    <div className="text-center font-medium">
                      INR
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-8">
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setReminderOpen(true);
                        }}
                      >
                        <Bell className="w-4 h-4 text-orange-600" />
                      </Button>
                    </div>
                  </div>

                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {invoices.map((invoice) => (
                  <Card key={invoice._id}>
                    <CardContent className="p-4 space-y-2">
                      <p className="font-semibold">{invoice.invoice_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.customer_id?.phone ?? "—"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reminder Modal */}
      {selectedInvoice && (
        <ReminderModal
          open={reminderOpen}
          onOpenChange={setReminderOpen}
          invoice={{
            id: selectedInvoice.invoice_number,
            customer: {
              name: selectedInvoice.customer_id?.phone ?? "Customer",
              email: "customer@example.com",
              phone: selectedInvoice.customer_id?.phone ?? "",
            },
            total: selectedInvoice.total_amount,
            dueDate: new Date(
              selectedInvoice.due_date
            ).toLocaleDateString(),
          }}
        />
      )}
    </div>
  );
}