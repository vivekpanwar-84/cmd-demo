"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Building2,
  Users,
  UsersRound,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  LayoutGrid,
  List,
  ChevronDown,
  Eye,
  Globe,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useOrganizations } from "@/hooks/useAdmin";
import type { Organization } from "@/types/organization";

/* ================= TYPES ================= */

type ViewType = "card" | "list";
type SortKey = "name" | "staff" | "customers" | "invoices" | "status";

/* ================= COMPONENT ================= */

export function Organizations() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<ViewType>("list");
  const [sortBy, setSortBy] = useState<SortKey>("name");

  const { data: organizations, isLoading, error } = useOrganizations();

  /* ================= FILTER + SORT ================= */

  const filteredAndSortedOrgs = useMemo<Organization[]>(() => {
    if (!organizations) return [];

    const query = searchQuery.toLowerCase();

    const filtered = organizations.filter((org) =>
      org.name?.toLowerCase().includes(query)
    );

    return [...filtered].sort((a, b) => {
      const aUsage = a.usage ?? { staff: 0, customers: 0, invoices: 0 };
      const bUsage = b.usage ?? { staff: 0, customers: 0, invoices: 0 };

      switch (sortBy) {
        case "staff":
          return (bUsage.staff ?? 0) - (aUsage.staff ?? 0);

        case "customers":
          return (bUsage.customers ?? 0) - (aUsage.customers ?? 0);

        case "invoices":
          return (bUsage.invoices ?? 0) - (aUsage.invoices ?? 0);

        case "status":
          return (a.plan_status ?? "").localeCompare(b.plan_status ?? "");

        case "name":
        default:
          return (a.name ?? "").localeCompare(b.name ?? "");
      }
    });
  }, [organizations, searchQuery, sortBy]);

  /* ================= LOADING ================= */

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center flex-col gap-4">
        <p className="text-red-500">Failed to load organizations</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  /* ================= RENDER ================= */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Organizations
          </h1>
          <p className="text-gray-500 mt-1">
            Manage all your client organizations
          </p>
        </div>

        <Button
          onClick={() => router.push("/organizations/add")}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Building2 className="w-4 h-4 mr-2" />
          Add Organization
        </Button>
      </div>

      {/* Search / Sort / View */}
      <Card>
        <CardContent className="p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search organizations..."
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

      {/* CARD VIEW */}
      {view === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAndSortedOrgs.map((org) => {
            const usage = org.usage ?? { staff: 0, customers: 0, invoices: 0 };
            const limits = org.limits ?? { staff: 0, customers: 0, invoices: 0 };

            return (
              <Card key={org._id} className="hover:shadow-lg transition">
                <CardContent className="p-7 space-y-5">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{org.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Globe className="w-4 h-4" />
                        {org.country ?? "N/A"}
                      </div>
                    </div>

                    <Badge
                      className={
                        org.plan_status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {org.plan_status ?? "unknown"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-t pt-5 text-sm">
                    <div className="flex items-center gap-2">
                      <UsersRound className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Staff</p>
                        <p className="font-semibold">
                          {usage.staff}/{limits.staff}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Customers</p>
                        <p className="font-semibold">
                          {usage.customers}/{limits.customers}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase">
                          Invoices
                        </p>
                        <p className="font-semibold">
                          {usage.invoices}/{limits.invoices}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button asChild className="w-full">
                    <Link href={`/organizations/${org._id}`}>
                      View Organization
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {view === "list" && (
        <Card>
          <CardContent className="p-0">
            <div className="max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-7 gap-4 px-4 py-3 text-sm font-medium text-gray-500 border-b sticky top-0 bg-white text-center">
                <div className="col-span-2 text-left">Organization</div>
                <div>Staff</div>
                <div>Customers</div>
                <div>Invoices</div>
                <div>Status</div>
                <div>Action</div>
              </div>

              {filteredAndSortedOrgs.map((org) => {
                const usage = org.usage ?? { staff: 0, customers: 0, invoices: 0 };

                return (
                  <div
                    key={org._id}
                    className="grid grid-cols-7 gap-4 px-4 py-4 items-center border-b hover:bg-gray-50 text-center"
                  >
                    <div className="col-span-2 flex items-center gap-3 text-left">
                      <div className="w-9 h-9 bg-accent rounded-md flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{org.name}</p>
                        <p className="text-xs text-gray-500">
                          {org.country ?? "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="font-medium">{usage.staff}</div>
                    <div className="font-medium">{usage.customers}</div>
                    <div className="font-medium">{usage.invoices}</div>

                    <div className="flex justify-center">
                      {org.plan_status === "active" ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          {/* Active */}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <XCircle className="w-5 h-5" />
                          {/* Inactive */}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center">
                      <Link
                        href={`/organizations/${org._id}`}
                        className="p-2 rounded-md hover:bg-accent"
                      >
                        <Eye className="w-4 h-4 text-gray-600 hover:text-primary" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}