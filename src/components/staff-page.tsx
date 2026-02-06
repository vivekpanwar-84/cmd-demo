"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  CheckCircle,
  XCircle,
  Pencil,
  Power,
  Search,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";

import { useDebounce } from "@/hooks/useDebounce";
import { useOrganizationStaff, useUpdateStaff } from "@/hooks/useAdmin";
import type { Staff as StaffType } from "@/types/staff";
import AddStaffPage from "./organisationDetails/AddStaff";
import { Loader2 } from "lucide-react";

/* ================= TYPES ================= */

type ViewMode = "list" | "card";

interface StaffProps {
  organizationId: string;
}

/* ================= COMPONENT ================= */

export function StaffPage({ organizationId }: StaffProps) {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<StaffType | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [statusToggleStaff, setStatusToggleStaff] = useState<StaffType | null>(null);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);

  const limit = 5;
  const debouncedSearch = useDebounce(search, 600);

  /* ---------- API ---------- */
  const { data, isLoading, error } = useOrganizationStaff(organizationId, {
    page,
    limit,
    search: debouncedSearch,
  });

  const updateStaffMutation = useUpdateStaff(organizationId);

  const staffList: StaffType[] = data?.data ?? [];
  const meta = data?.pagination;
  console.log("Staff Data:", data);

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
      (_, i) => start + i
    );
  };

  const handleToggleStatus = async () => {
    if (!statusToggleStaff) return;
    const newStatus = !statusToggleStaff.is_active;

    updateStaffMutation.mutate({
      staffId: statusToggleStaff._id,
      data: { is_active: newStatus }
    }, {
      onSuccess: () => {
        toast.success(`Staff member marked as ${newStatus ? 'Active' : 'Inactive'} successfully`);
        setShowStatusConfirm(false);
        setStatusToggleStaff(null);
      },
      onError: (err) => {
        console.error(err);
        toast.error("Failed to update staff status");
      },
    });
  };

  /* ================= PAGINATION ================= */

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
                handlePageChange(
                  Number((e.target as HTMLInputElement).value)
                );
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
      {/* Edit Staff Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Edit Staff</DialogTitle>
          </DialogHeader>

          {selectedStaff && (
            <AddStaffPage
              organizationId={organizationId}
              onClose={() => {
                setEditOpen(false);
                setSelectedStaff(null);
              }}
              initialData={selectedStaff}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Staff Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Add Staff</DialogTitle>
          </DialogHeader>

          <AddStaffPage
            organizationId={organizationId}
            onClose={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Staff</h1>

          <Button onClick={() => setOpen(true)}>
            <User className="w-4 h-4 mr-2" />
            Add Staff
          </Button>
        </div>

        {/* Status Toggle Confirmation Modal */}
        <AlertDialog open={showStatusConfirm} onOpenChange={setShowStatusConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Change Staff Status?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to change the status of this staff member? This will toggle their access to the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={updateStaffMutation.isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleToggleStatus();
                }}
                disabled={updateStaffMutation.isPending}
                className={statusToggleStaff?.is_active ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}
              >
                {updateStaffMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Power className="w-4 h-4 mr-2" />}
                {statusToggleStaff?.is_active ? "Mark Inactive" : "Mark Active"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Search + View Toggle */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Manage staff relationships and access
          </p>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8 w-[220px]"
                placeholder="Search staff..."
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
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-10">
            <span className="text-sm text-muted-foreground">
              Loading staff...
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center text-red-500 py-6">
            Failed to load staff
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <Card>
            <CardContent className="p-0">
              {staffList.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No staff members found
                </div>
              ) : viewMode === "list" ? (
                <div className="divide-y">
                  {staffList.map((staff) => (
                    <div
                      key={staff._id}
                      className="grid grid-cols-6 gap-4 px-4 py-4 hover:bg-muted"
                    >
                      <div className="col-span-2 flex gap-3">
                        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{staff.full_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined{" "}
                            {new Date(staff.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="truncate">{staff.email ?? "—"}</div>
                      <div>{staff.phone ?? "—"}</div>

                      <div>
                        {staff.is_active ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-500">
                            <XCircle className="w-4 h-4" />
                          </span>
                        )}
                      </div>

                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedStaff(staff);
                            setEditOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className={staff.is_active ? "text-red-500 hover:text-red-700 hover:bg-red-50" : "text-green-500 hover:text-green-700 hover:bg-green-50"}
                          onClick={() => {
                            setStatusToggleStaff(staff);
                            setShowStatusConfirm(true);
                          }}
                        >
                          <Power className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {staffList.map((staff) => (
                    <Card key={staff._id}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{staff.full_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {staff.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className={staff.is_active ? "text-green-600" : "text-gray-500"}>
                            {staff.is_active ? "Active" : "Inactive"}
                          </span>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedStaff(staff);
                                setEditOpen(true);
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className={staff.is_active ? "text-red-500 hover:text-red-700 hover:bg-red-50" : "text-green-500 hover:text-green-700 hover:bg-green-50"}
                              onClick={() => {
                                setStatusToggleStaff(staff);
                                setShowStatusConfirm(true);
                              }}
                            >
                              <Power className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
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
