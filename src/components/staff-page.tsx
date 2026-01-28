"use client";

import {
  User,
  CheckCircle,
  XCircle,
  Pencil,
  Search,
  ChevronDown,
  LayoutGrid,
  List,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOrganizationStaff } from "@/hooks/useAdmin";
import type { Staff as StaffType } from "@/types/staff";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,  
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

interface StaffProps {
  organizationId: string;
}

export function StaffPage({ organizationId }: StaffProps) {
  const route = useRouter()
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [view, setView] = useState("list");

  const {
    data: response,
    isLoading,
  } = useOrganizationStaff(organizationId);

  // ✅ Build-safe typed staff list
  const staffList = useMemo(() => {
    let list: StaffType[] = response?.data ?? [];

    // Filter org + search
    list = list.filter((staff: StaffType) => {
      const matchesOrg = staff.org_id === organizationId;
      const matchesSearch =
        staff.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.phone.includes(searchQuery);

      return matchesOrg && matchesSearch;
    });

    // Sort
    if (sortBy === "name") {
      list.sort((a: StaffType, b: StaffType) =>
        a.full_name.localeCompare(b.full_name)
      );
    }

    if (sortBy === "status") {
      list.sort((a: StaffType, b: StaffType) =>
        Number(b.is_active) - Number(a.is_active)
      );
    }

    if (sortBy === "date") {
      list.sort((a: StaffType, b: StaffType) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    }

    return list;
  }, [response, organizationId, searchQuery, sortBy]);

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Staff</h1>
          <p className="text-gray-500 mt-1">
            Manage staff relationships and billing
          </p>
        </div>

        <Button onClick={()=>route.push(`${organizationId}/add-staff`)} className="bg-primary hover:bg-primary/90 text-white">
          <User className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </div>

     {/* -------------------- SEARCH / SORT / VIEW -------------------- */}
      <Card className="shadow-sm">
        <CardContent className="p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search staff by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 text-sm"
            />
          </div>

          <div className="flex gap-2">
            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  Sort By
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {[
                  ["name", "Organization Name"],
                  ["staff", "Staff Count"],
                  ["customers", "Customers"],
                  ["invoices", "Invoices"],
                  ["status", "Status"],
                ].map(([key, label]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => setSortBy(key as string)}
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
                <Button variant="outline" size="sm" className="gap-2">
                  {view === "card" ? (
                    <LayoutGrid className="w-4 h-4" />
                  ) : (
                    <List className="w-4 h-4" />
                  )}
                  {view === "card" ? "Card View" : "List View"}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
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

      {/* ================= STAFF LIST ================= */}
<Card>
  <CardContent className="p-0">
    <div className="max-h-[70vh] overflow-y-auto">
      {/* Header */}
      <div className="grid grid-cols-6 gap-4 px-4 py-3 text-sm font-medium text-gray-500 border-b sticky top-0 bg-white z-10">
        <div className="col-span-2 text-left">Staff Member</div>
        <div>Email</div>
        <div>Phone</div>
        <div>Status</div>
        <div className="text-center">Action</div>
      </div>

      {!isLoading && staffList.map((staff) => (
        <div
          key={staff._id}
          className="grid grid-cols-6 gap-4 px-4 py-4 items-center border-b hover:bg-gray-50 transition"
        >
          {/* Staff Info */}
          <div className="col-span-2 flex gap-3 items-center min-w-0">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>

            <div className="min-w-0">
              <p className="font-medium truncate">{staff.full_name}</p>
              <p className="text-xs text-gray-500">
                Joined {new Date(staff.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="text-sm truncate">{staff.email ?? "—"}</div>

          {/* Phone */}
          <div className="text-sm">{staff.phone ?? "—"}</div>

          {/* Status */}
          <div className="text-sm">
            {staff.is_active ? (
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <CheckCircle className="w-4 h-4" /> 
              </span>
            ) : (
              <span className="flex items-center gap-1 text-gray-500 font-medium">
                <XCircle className="w-4 h-4" /> 
              </span>
            )}
          </div>

          {/* Action */}
          <div className="flex justify-center">
            <Button size="sm" variant="ghost" className="hover:bg-accent p-2 rounded-md">
              <Pencil className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        </div>
      ))}

      {!isLoading && staffList.length === 0 && (
        <div className="py-12 text-center text-sm text-gray-500">
          No staff members found
        </div>
      )}
    </div>
  </CardContent>
</Card>


    </div>
  );
}
