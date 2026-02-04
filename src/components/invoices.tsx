"use client";

import { useState } from "react";
import {
  FileText,
  User,
  Calendar,
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
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useDebounce } from "@/hooks/useDebounce";
import { useOrganizationInvoice } from "@/hooks/useAdmin";
import type { Invoice } from "@/types/invoice";

/* ================= TYPES ================= */

type ViewMode = "list" | "card";

interface InvoicesProps {
  organizationId: string;
  useDummy?: boolean; // new flag to use dummy data
}

/* ================= DUMMY DATA ================= */

const dummyInvoices: Invoice[] = Array.from({ length: 23 }, (_, i) => ({
  _id: `inv_${i + 1}`,
  invoice_number: `INV-${1000 + i}`,
  createdAt: new Date().toISOString(),
  status: ["paid", "pending", "overdue"][i % 3] as
    | "paid"
    | "pending"
    | "overdue",
  org_id: "org_1",
  customer_id: { phone: `98765432${i}` },
})) as Invoice[];

const dummyPagination = (page: number, limit: number) => {
  const total = dummyInvoices.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    page,
    limit,
    total,
    totalPages,
    data: dummyInvoices.slice(start, end),
  };
};

/* ================= COMPONENT ================= */

export function Invoices({ organizationId, useDummy = false }: InvoicesProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pageInput, setPageInput] = useState("1");

  const limit = 5;
  const debouncedSearch = useDebounce(search, 600);

  /* ================= API / DUMMY ================= */

  const { data, isLoading, error } = useDummy
    ? {
      data: dummyPagination(page, limit),
      isLoading: false,
      error: null,
    }
    : useOrganizationInvoice(organizationId, {
      page,
      limit,
      search: debouncedSearch,
    });

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
    const validPage = Math.min(Math.max(newPage, 1), meta.totalPages);
    setPage(validPage);
    setPageInput(String(validPage));
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Invoices</h1>
          <p className="text-muted-foreground mt-1">
            Manage invoices and billing
          </p>
        </div>

        {/* <Button>
          <FileText className="w-4 h-4 mr-2" />
          Add Invoice
        </Button> */}
      </div>

      {/* Search + View Toggle */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8 w-[260px]"
            placeholder="Search invoice or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex items-center border rounded-md overflow-hidden">
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-none h-8 w-8 p-0"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>

          <Button
            variant={viewMode === "card" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-none h-8 w-8 p-0"
            onClick={() => setViewMode("card")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
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
                  <div
                    key={invoice._id}
                    className="grid grid-cols-6 gap-4 px-4 py-4 hover:bg-muted"
                  >
                    <div className="col-span-2 flex gap-3">
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

                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4 text-muted-foreground" />
                      {invoice.customer_id?.phone ?? "—"}
                    </div>

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

                    <div className="font-medium">INR</div>

                    <div className="flex justify-center">
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
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

            <Pagination />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
