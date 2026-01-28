"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  User,
  Loader2,
  ChevronDown,
  CheckCircle,
  List,
  LayoutGrid,
  Eye,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useOrganizationCustomer } from "@/hooks/useAdmin";
import type { Customer } from "@/types/customertsx";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

interface CustomersProps {
  organizationId?: string;
}

type ViewType = "card" | "list";
type SortKey = "name" | "staff" | "customers" | "invoices" | "status" | "";

/* ================= COMPONENT ================= */

export function Customers({ organizationId }: CustomersProps) {
  const route = useRouter()
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortKey>("");
  const [view, setView] = useState<ViewType>("list");

  const {
    data: customers,
    isLoading: isLoadingCustomer,
    error,
  } = useOrganizationCustomer(organizationId ?? "");

  /* ================= HELPERS ================= */

  const capitalize = (value?: string): string =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

  /* ================= FILTER ================= */

  const filteredCustomers = useMemo<Customer[]>(() => {
    if (!customers) return [];

    const query = searchQuery.toLowerCase();

    return customers.filter((customer) => {
      return (
        customer.full_name?.toLowerCase().includes(query) ||
        customer.email?.toLowerCase().includes(query) ||
        customer.phone?.toLowerCase().includes(query)
      );
    });
  }, [customers, searchQuery]);

  /* ================= RENDER ================= */

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Customers</h1>
          <p className="text-gray-500 mt-1">
            Manage customer relationships and billing
          </p>
        </div>

        <Button onClick={()=>route.push(`${organizationId}/add-customer`)} className="bg-primary hover:bg-primary/90 text-white">
          <User className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search / Sort / View */}
      <Card>
        <CardContent className="p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search customers by name, email, or phone..."
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

      {/* Loading */}
      {isLoadingCustomer && (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      {/* Error */}
      {error && !isLoadingCustomer && (
        <div className="text-center text-red-500 py-6">
          Failed to load customers
        </div>
      )}

      {/* List */}
      <Card>
        <CardContent className="p-0">
          <div className="max-h-[70vh] overflow-y-auto">
            {/* Header */}
            <div className="grid grid-cols-6 gap-4 px-4 py-3 text-sm font-medium text-gray-500 border-b sticky top-0 bg-white">
              <div className="col-span-2">Customer</div>
              <div>Email</div>
              <div>Phone</div>
              <div className="text-center">Action</div>
            </div>

            {!isLoadingCustomer &&
              filteredCustomers.map((customer) => (
                <div
                  key={customer._id}
                  className="grid grid-cols-6 gap-4 px-4 py-4 items-center border-b hover:bg-gray-50"
                >
                  {/* Customer */}
                  <div className="col-span-2 flex gap-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {capitalize(customer.full_name)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created{" "}
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="text-sm truncate">
                    {customer.email ?? "—"}
                  </div>

                  {/* Phone */}
                  <div className="text-sm">
                    {customer.phone ?? "—"}
                  </div>

                  {/* Action */}
                  <div className="flex justify-center">
                    <Link
                      href={`/customers/${customer._id}`}
                      className="p-2 rounded-md hover:bg-accent"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </Link>
                  </div>
                </div>
              ))}

            {!isLoadingCustomer && filteredCustomers.length === 0 && (
              <div className="py-12 text-center text-sm text-gray-500">
                No customers found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
