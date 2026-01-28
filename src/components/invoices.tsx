"use client";

import { useMemo, useState } from "react";
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
  ChevronDown,
  LayoutGrid,
  List,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useOrganizationInvoice } from "@/hooks/useAdmin";
import type { Invoice } from "@/types/invoice";

/* ================= TYPES ================= */

interface InvoicesProps {
  organizationId: string;
}

type ViewType = "card" | "list";
type SortKey = "name" | "staff" | "customers" | "invoices" | "status" | "";

/* ================= COMPONENT ================= */

export function Invoices({ organizationId }: InvoicesProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortKey>("");
  const [view, setView] = useState<ViewType>("list");

  const {
    data: response,
    isLoading,
    error,
  } = useOrganizationInvoice(organizationId);

  /* ================= FILTER + SEARCH ================= */

  const invoices = useMemo<Invoice[]>(() => {
    const list = response?.data ?? [];

    return list.filter((invoice) => {
      const matchesOrg = invoice.org_id === organizationId;

      const search = searchQuery.toLowerCase();

      const matchesSearch =
        invoice.invoice_number.toLowerCase().includes(search) ||
        invoice.customer_id?.phone?.toLowerCase().includes(search) ||
        false;

      return matchesOrg && matchesSearch;
    });
  }, [response, organizationId, searchQuery]);

  /* ================= RENDER ================= */

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Invoices</h1>
          <p className="text-gray-500 mt-1">
            Manage invoices and billing
          </p>
        </div>

        <Button className="bg-primary hover:bg-primary/90 text-white">
          <FileText className="w-4 h-4 mr-2" />
          Add Invoice
        </Button>
      </div>

      {/* Search / Sort / View */}
      <Card>
        <CardContent className="p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search by invoice or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 text-sm"
            />
          </div>

          <div className="flex gap-2">
            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Sort By
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(
                  [
                    ["name", "Organization Name"],
                    ["staff", "Staff Count"],
                    ["customers", "Customers"],
                    ["invoices", "Invoices"],
                    ["status", "Status"],
                  ] as const
                ).map(([key, label]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => setSortBy(key)}
                  >
                    {label}
                    {sortBy === key && (
                      <CheckCircle className="w-4 h-4 ml-auto text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {view === "card" ? (
                    <LayoutGrid className="w-4 h-4 mr-2" />
                  ) : (
                    <List className="w-4 h-4 mr-2" />
                  )}
                  {view === "card" ? "Card View" : "List View"}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setView("card")}>
                  Card View
                  {view === "card" && (
                    <CheckCircle className="w-4 h-4 ml-auto text-primary" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView("list")}>
                  List View
                  {view === "list" && (
                    <CheckCircle className="w-4 h-4 ml-auto text-primary" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Invoice List */}
      <Card>
        <CardContent className="p-0">
          <div className="max-h-[70vh] overflow-y-auto">
            {/* Header */}
            <div className="grid grid-cols-6 gap-4 px-4 py-3 text-sm font-medium text-gray-500 border-b sticky top-0 bg-white">
              <div className="col-span-2">Invoice</div>
              <div>Customer</div>
              <div>Status</div>
              <div>Amount</div>
              <div className="text-center">Action</div>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}

            {/* Error */}
            {error && !isLoading && (
              <div className="py-10 text-center text-red-500">
                Failed to load invoices
              </div>
            )}

            {/* Rows */}
            {!isLoading &&
              invoices.map((invoice) => (
                <div
                  key={invoice._id}
                  className="grid grid-cols-6 gap-4 px-4 py-4 items-center border-b hover:bg-gray-50"
                >
                  {/* Invoice */}
                  <div className="col-span-2 flex gap-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {invoice.invoice_number}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="flex items-center gap-1 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    {invoice.customer_id?.phone ?? "—"}
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

                  {/* Amount */}
                  <div className="font-medium">INR</div>

                  {/* Action */}
                  <div className="flex justify-center">
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </Button>
                  </div>
                </div>
              ))}

            {/* Empty */}
            {!isLoading && invoices.length === 0 && (
              <div className="py-10 text-center text-gray-500">
                No invoices found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}