"use client";

import {
  ArrowLeft,
  Building2,
  Users,
  UsersRound,
  FileText,
  TrendingUp,
  AlertCircle,
  Loader2,
  ChevronDown,
  Check,
  Search,
} from "lucide-react";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Customers } from "./customers";
import { Invoices } from "./invoices";
import { useOrganizationDetail, useOrganizations, useOrganizationsDetail } from "@/hooks/useAdmin";
import { useRef, useState, useEffect, useMemo } from "react";
import { StaffPage } from "./staff-page";

interface OrganizationDetailProps {
  organizationId: string;
}

export function OrganizationDetail({ organizationId }: OrganizationDetailProps) {
  const { data: org, isLoading: isLoadingOrg } = useOrganizationDetail(organizationId);
  console.log("Organization Detail Data:", org);
  const { data: organizations, isLoading: isLoadingOrgs } = useOrganizationsDetail();

  const [orgMenuOpen, setOrgMenuOpen] = useState(false);
  const orgMenuRef = useRef<HTMLDivElement>(null);
  const [orgSearch, setOrgSearch] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const activeTab = searchParams.get("tab") || "customers";

  const setActiveTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (orgMenuRef.current && !orgMenuRef.current.contains(e.target as Node)) {
        setOrgMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOrganizations = useMemo(() => {
    if (!orgSearch) return organizations;
    return organizations?.filter((o: any) =>
      o.name.toLowerCase().includes(orgSearch.toLowerCase())
    );
  }, [organizations, orgSearch]);

  if (isLoadingOrg) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">
          Organization not found
        </h2>
        <Button className="mt-4" asChild>
          <Link href="/organizations">Go Back</Link>
        </Button>
      </div>
    );
  }

  const isExpired = org.plan_status !== "active";

  return (
    <div onDoubleClick={() => router.push('/organizations')}>
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3 px-4 py-2">
          {/* Back old button */}
          {/* <Button variant="ghost" size="icon" asChild>
            <Link href="/organizations">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button> */}

          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 bg-orange-50 hover:bg-orange-100 rounded-full flex items-center justify-center shrink-0"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5 text-orange-600" />
          </Button>


          {/* Org Switch */}
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>

            {/* Dropdown */}
            <div className="relative" ref={orgMenuRef}>
              <button
                onClick={() => setOrgMenuOpen((v) => !v)}
                className="flex items-center gap-1 font-semibold text-gray-900"
              >
                {org.name}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${orgMenuOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {orgMenuOpen && (
                <div className="absolute left-0 mt-3 w-72 rounded-xl border bg-white shadow-lg z-50">
                  <div className="px-4 py-2 text-xs font-medium text-gray-500">
                    Switch organization
                  </div>

                  {/* Search */}
                  <div className="px-3 pb-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={orgSearch}
                        onChange={(e) => setOrgSearch(e.target.value)}
                        placeholder="Search organization..."
                        className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  {/* Org List */}
                  <div className="max-h-40 overflow-auto">
                    {filteredOrganizations?.length ? (
                      filteredOrganizations.map((o: any) => {
                        const isActive = o._id === organizationId;

                        return (
                          <button
                            key={o._id}
                            onClick={() => {
                              if (!isActive) {
                                window.location.href = `/organizations/${o._id}`;
                              }
                              setOrgMenuOpen(false);
                              setOrgSearch("");
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm ${isActive
                              ? "bg-accent text-primary"
                              : "hover:bg-gray-50"
                              }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-primary" />
                            </div>

                            <div className="flex-1 text-left">
                              <p className="font-medium">{o.name}</p>
                              <p className="text-xs text-gray-500">
                                {o.country}
                              </p>
                            </div>

                            {isActive && (
                              <Check className="w-4 h-4 text-primary" />
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-4 py-6 text-sm text-gray-500 text-center">
                        No organization found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            <Badge
              variant={org.plan_status === "active" ? "default" : "destructive"}
              className={
                org.plan_status === "active"
                  ? "bg-green-100 text-green-700"
                  : ""
              }
            >
              {org.plan_status === "active" ? "Active" : "Inactive"}
            </Badge>

            <span className="text-sm text-gray-500">{org.country}</span>
          </div>
        </div>

        {/* Warning */}
        {isExpired && (
          <div className="px-4 py-2 bg-red-50 text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Subscription inactive
          </div>
        )}
      </div>

      {/* Stats + Tabs */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 px-4 py-2 bg-gray-50 border-b">
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border text-sm">
            <UsersRound className="w-4 h-4 text-primary" />
            Staff {org?.usage?.staff ?? 0}/{org?.limits?.staff ?? 0}
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border text-sm">
            <Users className="w-4 h-4 text-primary" />
            Customers {org?.usage?.customers ?? 0}/{org?.limits?.customers ?? 0}
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border text-sm">
            <FileText className="w-4 h-4 text-primary" />
            Invoices {org?.usage?.invoices ?? 0}/{org?.limits?.invoices ?? 0}
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border text-sm">
            <TrendingUp className="w-4 h-4 text-primary" />
            {org?.currency || "—"}
          </div>
        </div>

        <div className="flex-1" />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
            <TabsTrigger
              value="customers"
              className="
    relative px-4 py-2 text-sm font-medium rounded-md
    text-gray-600
    transition-all duration-200
    data-[state=active]:bg-primary
    data-[state=active]:text-white
    data-[state=active]:shadow-sm
  "
            >
              Customers
            </TabsTrigger>

            <TabsTrigger
              value="staff"
              className="
    relative px-4 py-2 text-sm font-medium rounded-md
    text-gray-600
    transition-all duration-200
    data-[state=active]:bg-primary
    data-[state=active]:text-white
    data-[state=active]:shadow-sm
  "
            >
              Staff
            </TabsTrigger>

            <TabsTrigger
              value="invoices"
              className="
    relative px-4 py-2 text-sm font-medium rounded-md
    text-gray-600
    transition-all duration-200
    data-[state=active]:bg-primary
    data-[state=active]:text-white
    data-[state=active]:shadow-sm
  "
            >
              Invoices
            </TabsTrigger>

            <TabsTrigger
              value="subscription"
              className="
    relative px-4 py-2 text-sm font-medium rounded-md
    text-gray-600
    transition-all duration-200
    data-[state=active]:bg-primary
    data-[state=active]:text-white
    data-[state=active]:shadow-sm
  "
            >
              Subscription
            </TabsTrigger>

          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="px-4 pt-3 pb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="customers">
            <Customers organizationId={organizationId} />
          </TabsContent>

          {/* ✅ FIXED TAB VALUE */}
          <TabsContent value="staff">
            <StaffPage organizationId={organizationId} />
          </TabsContent>

          <TabsContent value="invoices">
            <Invoices organizationId={organizationId} />
          </TabsContent>

          <TabsContent value="subscription">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500">
                  Current Plan:{" "}
                  <span className="font-semibold">
                    {org.plan_id || "Standard Plan"}
                  </span>
                </p>

                <p className="text-sm text-gray-500">
                  Staff Limit:{" "}
                  <span className="font-semibold">
                    {org?.limits?.staff ?? 0} members
                  </span>
                </p>

                <Button className="bg-primary text-white" asChild>
                  <Link href="/subscriptions">
                    {isExpired ? "Renew Subscription" : "Upgrade Plan"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
