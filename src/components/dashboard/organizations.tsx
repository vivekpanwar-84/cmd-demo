"use client";

import { useState } from "react";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import { useOrganizations, useDeleteOrganization } from "@/hooks/useAdmin"; // new paginated hook
import {
  Search, Building2, Users, UsersRound, FileText,
  CheckCircle, XCircle, Loader2, LayoutGrid, List,
  ChevronDown, Eye, Globe, ChevronLeft, ChevronRight, Trash2
} from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Organization } from "@/types/organization";
import AddOrganizationPage from "./AddOrganisation";
import { toast } from "sonner";

/* ================= TYPES ================= */
type ViewMode = "list" | "card";

type ViewType = "card" | "list";
type SortKey = "name" | "staff" | "customers" | "invoices" | "status";

/* ================= COMPONENT ================= */

export function Organizations() {
  const [search, setSearch] = useState("");
  const [limit] = useState(5);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get page from URL or default to 1
  const urlPage = Number(searchParams.get("page")) || 1;
  const page = urlPage;

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, error } = useOrganizations({
    page,
    limit,
    search: debouncedSearch
  });

  const deleteOrgMutation = useDeleteOrganization();

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteOrgMutation.mutateAsync(deleteId);
      toast.success("Organization deleted successfully");
      setDeleteId(null);
    } catch (err: any) {
      console.error("Failed to delete organization:", err);
      toast.error(err.response?.data?.message || "Failed to delete organization");
    } finally {
      setIsDeleting(false);
    }
  };

  const organizations: Organization[] = data?.data ?? [];
  const meta = data?.pagination;

  const handlePageChange = (newPage: number) => {
    if (!meta) return;
    setPage(Math.min(Math.max(newPage, 1), meta.totalPages));
  };

  const getSlidingPages = (): number[] => {
    if (!meta) return [];
    const start = Math.max(1, Math.min(page, meta.totalPages - 2));
    return Array.from(
      { length: Math.min(3, meta.totalPages - start + 1) },
      (_, i) => start + i
    );
  };

  /* ================= RENDER ================= */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Organizations
          </h1>
          {/* <p className="text-gray-500 mt-1">
            Manage all your client organizations
          </p> */}
        </div>

        <Button
          className="bg-primary hover:bg-primary/90 text-white"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Building2 className="w-4 h-4 mr-2" />
          Add Organization
        </Button>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Organization</DialogTitle>
          </DialogHeader>
          <AddOrganizationPage onClose={() => setIsAddModalOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Search / Sort / View */}
      {/* Search / Sort / View */}
      <div className="flex items-center justify-between">
        {/* Left description */}
        <p className="text-muted-foreground">
          Manage all your client organizations
        </p>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8 w-[220px]"
              placeholder="Search Organizations..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // reset to first page on search
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
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="py-10 text-center text-red-500">
          Failed to load organizations
        </div>
      )}

      {/* Card View */}
      {viewMode === "card" && !isLoading && organizations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {organizations.map((org: Organization) => {
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

                    <Badge className={org.plan_status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                      {org.plan_status ?? "unknown"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-t pt-5 text-sm">
                    <div className="flex items-center gap-2">
                      <UsersRound className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Staff</p>
                        <p className="font-semibold">{usage.staff}/{limits.staff}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Customers</p>
                        <p className="font-semibold">{usage.customers}/{limits.customers}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Invoices</p>
                        <p className="font-semibold">{usage.invoices}/{limits.invoices}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link href={`/organizations/${org._id}`}>View Organization</Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => setDeleteId(org._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && !isLoading && (
        <Card>
          <CardContent className="p-0">
            <div className="max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-7 gap-4 px-4 py-3 text-sm font-medium text-gray-500 border-b sticky top-0 bg-white z-10">
                <div className="col-span-2 text-left">Organization</div>
                <div className="text-center">Staff</div>
                <div className="text-center">Customers</div>
                <div className="text-center">Invoices</div>
                <div className="text-center">Status</div>
                <div className="text-center">Action</div>
              </div>

              {organizations.map((org: Organization) => {
                const usage = org.usage ?? { staff: 0, customers: 0, invoices: 0 };

                return (
                  <div key={org._id} className="grid grid-cols-7 gap-4 px-4 py-4 items-center border-b hover:bg-gray-50 text-center">
                    <div className="col-span-2 flex items-center gap-3 text-left">
                      <div className="w-9 h-9 bg-accent rounded-md flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{org.name}</p>
                        <p className="text-xs text-gray-500">{org.country ?? "N/A"}</p>
                      </div>
                    </div>

                    <div className="font-medium">{usage.staff}</div>
                    <div className="font-medium">{usage.customers}</div>
                    <div className="font-medium">{usage.invoices}</div>

                    <div className="flex justify-center">
                      {org.plan_status === "active" ? (
                        <div className="flex items-center gap-1 text-green-600"><CheckCircle className="w-5 h-5" /></div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600"><XCircle className="w-5 h-5" /></div>
                      )}
                    </div>

                    <div className="flex justify-center">
                      <OrganizationActions orgId={org._id} onDelete={setDeleteId} />
                    </div>
                  </div>
                )
              })}

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t">
                  {/* Page info */}
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {meta.totalPages}
                  </p>

                  {/* Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>

                    {getSlidingPages().map(p => (
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

                  {/* Direct input */}
                  <div className="flex items-center gap-2 text-sm">
                    <span>Go to page:</span>
                    <Input
                      type="number"
                      min={1}
                      max={meta.totalPages}
                      value={page}
                      className="w-20 h-8 text-center"
                      onChange={(e) => handlePageChange(Number(e.target.value))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handlePageChange(Number((e.target as HTMLInputElement).value))
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Organization</DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Are you sure you want to delete this organization? This action cannot be undone.
            </p>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrganizationActions({ orgId, onDelete }: { orgId: string, onDelete: (id: string) => void }) {
  return (
    <div className="flex justify-center gap-5">
      <Link href={`/organizations/${orgId}`} className="p-2 rounded-md hover:bg-accent">
        <Eye className="w-4 h-4 text-gray-600 hover:text-primary" />
      </Link>
      <Button
        variant="ghost"
        size="sm"
        className="p-2 h-8 w-8  text-red-500 hover:text-red-700 hover:bg-red-50"
        onClick={() => onDelete(orgId)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
