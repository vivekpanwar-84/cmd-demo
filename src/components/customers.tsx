"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  User,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  List,
  LayoutGrid,
  FileText,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import AddCustomerPage from "./organisationDetails/AddCustomer";
import { useDebounce } from "@/hooks/useDebounce";
import { useOrganizationCustomer } from "@/hooks/useAdmin";
import { Customer } from "@/types/customertsx";
import AddInvoicePage from "./organisationDetails/AddInvoice";
import { Invoice } from "@/types/invoice";

/* ================= TYPES ================= */

type ViewMode = "list" | "card";

interface CustomersProps {
  organizationId?: string;
}

/* ================= COMPONENT ================= */

export function Customers({ organizationId }: CustomersProps) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );

  const limit = 5;
  const debouncedSearch = useDebounce(search, 600);

  /* ---------- API ---------- */
  const { data, isLoading, error } = useOrganizationCustomer(
    organizationId ?? "",
    {
      page,
      limit,
      search: debouncedSearch,
    },
  );

  const customers: Customer[] = data?.data ?? [];
  const meta = data?.pagination;

  /* ---------- Helpers ---------- */

  const handlePageChange = (newPage: number) => {
    if (!meta) return;
    setPage(Math.min(Math.max(newPage, 1), meta.totalPages));
  };

  const getSlidingPages = (): number[] => {
    if (!meta) return [];

    const start = Math.max(1, Math.min(page, meta.totalPages - 2));
    return Array.from(
      { length: Math.min(3, meta.totalPages - start + 1) },
      (_, i) => start + i,
    );
  };

  const capitalize = (value?: string) =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : "—";

  /* ================= SUB COMPONENTS ================= */

  const Pagination = () => {
    if (!meta || meta.totalPages <= 1) return null;

    return (
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t">
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
            <ChevronLeft className="w-4 h-4" />
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
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span>Go to page:</span>
          <Input
            type="number"
            min={1}
            max={meta.totalPages}
            defaultValue={page}
            className="w-20 h-8"
            onBlur={(e) => handlePageChange(Number(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handlePageChange(Number((e.target as HTMLInputElement).value));
              }
            }}
          />
        </div>
      </div>
    );
  };

  /* ================= RENDER ================= */

  return (
    <>
      {/* Add Customer Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Add Customer</DialogTitle>
          </DialogHeader>

          <AddCustomerPage
            organizationId={organizationId ?? ""}
            onClose={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">Customers</h1>
            {/* <p className="text-gray-500 mt-1">
              Manage customer relationships and billing
            </p> */}
          </div>

          <Button onClick={() => setOpen(true)}>
            <User className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>

        {/* Search + View Toggle */}
        <div className="flex items-center justify-between">
          {/* Left text */}
          <h3 className="text-gray-500">
            Manage customer relationships and billing
          </h3>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8 w-55"
                placeholder="Search organization or plan..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* View toggle */}
            <div className="flex items-center border rounded-md overflow-hidden">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-none h-8 w-8 p-0"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>

              <div className="w-px h-4 bg-border" />

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
            Failed to load customers
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <Card>
            <CardContent className="p-0">
              {customers.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No customers found
                </div>
              ) : viewMode === "list" ? (
                <div className="divide-y">
                  {customers.map((customer) => (
                    <div
                      key={customer._id}
                      className="grid grid-cols-6 gap-4 px-4 py-4 hover:bg-muted"
                    >
                      <div className="col-span-2 flex gap-3">
                        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {capitalize(customer.full_name)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Created{" "}
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="truncate">{customer.email ?? "—"}</div>
                      <div>{customer.phone ?? "—"}</div>
                      <div className="flex justify-center">
                        <Link
                          href={`/customers/${customer._id}`}
                          className="p-2 rounded hover:bg-accent"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>

                      {/* //add Invoice model */}

                      <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader className="sr-only">
                            <DialogTitle>Add Invoice</DialogTitle>
                          </DialogHeader>

                          {selectedCustomerId && (
                            <AddInvoicePage
                              orgId={organizationId ?? ""}
                              customerId={selectedCustomerId}
                              onClose={() => setInvoiceOpen(false)}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        onClick={() => {
                          setSelectedCustomerId(customer._id);
                          setInvoiceOpen(true);
                        }}
                        className="bg-primary hover:bg-primary/90 text-white w-full"
                        variant="default"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Add Invoice
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {customers.map((customer) => (
                    <Card key={customer._id}>
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold truncate">
                              {capitalize(customer.full_name)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(
                                customer.createdAt,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm space-y-1">
                          <p>Email: {customer.email ?? "—"}</p>
                          <p>Phone: {customer.phone ?? "—"}</p>
                        </div>
                        <div className="flex justify-end">
                          <Link
                            href={`/customers/${customer._id}`}
                            className="text-sm text-primary inline-flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                        </div>

                        {/* add invoice modal */}

                        <Dialog
                          open={invoiceOpen}
                          onOpenChange={setInvoiceOpen}
                        >
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader className="sr-only">
                              <DialogTitle>Add Invoice</DialogTitle>
                            </DialogHeader>

                            {selectedCustomerId && (
                              <AddInvoicePage
                                orgId={organizationId ?? ""}
                                customerId={selectedCustomerId}
                                onClose={() => setInvoiceOpen(false)}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          onClick={() => {
                            setSelectedCustomerId(customer._id);
                            setInvoiceOpen(true);
                          }}
                          className="bg-primary hover:bg-primary/90 text-white w-full"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Add Invoice
                        </Button>
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
    </>
  );
}
