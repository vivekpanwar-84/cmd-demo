"use client";
import { Input } from "@/components/ui/input";
import { UserPlus, AlertCircle, Pencil, Trash2, Loader2, ChevronLeft, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import AddAdminStaff from "@/components/organisationDetails/AddAdminStaff";
import { useState, useEffect } from "react";
import { useAdminStaff, useDeleteAdminStaff } from "@/hooks/useAdmin";
import { toast } from "sonner";
import { AdminStaff as AdminStaffType } from "@/types/staff";

interface StaffProps {
  organizationId: string;
}

export function AdminStaff({ organizationId }: StaffProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: response, isLoading, refetch } = useAdminStaff(page, 5, organizationId, debouncedSearch);
  const { mutate: deleteStaff, isPending: isDeleting } = useDeleteAdminStaff(organizationId);

  const [open, setOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<AdminStaffType | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const staffList = response?.data || [];
  const pagination = response?.pagination || {
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1
  };
  const [pageInput, setPageInput] = useState(String(page));

  const getSlidingPages = () => {
    let start = page;
    const totalPages = pagination.totalPages;
    if (start + 2 > totalPages) {
      start = Math.max(totalPages - 2, 1);
    }
    return Array.from({ length: Math.min(3, totalPages - start + 1) }, (_, i) => start + i);
  };

  const handlePageChange = (newPage: number) => {
    const validPage = Math.min(Math.max(newPage, 1), pagination.totalPages);
    setPage(validPage);
    setPageInput(String(validPage));
  };



  if (isLoading && !debouncedSearch) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleDelete = () => {
    if (deleteConfirmId) {
      deleteStaff(deleteConfirmId, {
        onSuccess: () => {
          toast.success("Staff member deleted successfully");
          setDeleteConfirmId(null);
        },
        onError: (err: any) => {
          console.error("Delete staff failed:", err);
          toast.error(err?.response?.data?.message || "Failed to delete staff member");
          setDeleteConfirmId(null);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <Dialog open={open} onOpenChange={(val) => {
        setOpen(val);
        if (!val) setEditingStaff(null);
      }}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[95vh] overflow-y-auto p-0 border-none shadow-2xl rounded-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>{editingStaff ? "Edit Staff" : "Add Staff"}</DialogTitle>
          </DialogHeader>

          <AddAdminStaff
            organizationId={organizationId ?? ""}
            initialData={editingStaff || undefined}
            onClose={() => {
              setOpen(false);
              setEditingStaff(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Usage Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ">
            <div>
              <h3 className="font-semibold">Admin Staff members</h3>
              <p className="text-sm text-muted-foreground">
                Manage all Admin Staff members
              </p>
            </div>

            <Button onClick={() => setOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Staff Member
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="relative w-full sm:w-[320px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          className="pl-10 h-10 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-muted-foreground">Staff Members</CardTitle>
          <div className="text-sm text-muted-foreground">
            Total {pagination.total} staff members
          </div>
        </CardHeader>

        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Joined</th>
                <th className="text-left p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {staffList.map((staff) => (
                <tr key={staff._id} className="border-b">
                  <td className="p-3 font-medium">{staff.full_name}</td>
                  <td className="p-3">{staff.email}</td>
                  <td className="p-3">{staff.phone}</td>
                  <td className="p-3">
                    <Badge variant="outline">{staff.role}</Badge>
                  </td>
                  <td className="p-3">
                    <Badge
                      className={
                        staff.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {staff.is_active ? "active" : "inactive"}
                    </Badge>
                  </td>
                  <td className="p-3">{new Date(staff.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingStaff(staff);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteConfirmId(staff._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {staffList.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No staff members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {pagination.totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 border-t">
              <p className="text-sm text-muted-foreground">
                Page {page} of {pagination.totalPages}
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
                    variant={page === p ? "default" : "outline"}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === pagination.totalPages}
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
                  max={pagination.totalPages}
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
          )}
        </CardContent>
      </Card>

      {/* Mobile Cards View */}
      <div className="md:hidden space-y-4">
        {staffList.map((staff) => (
          <Card key={staff._id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{staff.full_name}</p>
                  <p className="text-sm text-muted-foreground">{staff.role}</p>
                </div>
                <Badge
                  className={
                    staff.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {staff.is_active ? "active" : "inactive"}
                </Badge>
              </div>

              <div className="text-sm space-y-1">
                <p>Email: {staff.email}</p>
                <p>Phone: {staff.phone}</p>
                <p>Joined: {new Date(staff.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setEditingStaff(staff);
                    setOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setDeleteConfirmId(staff._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Confirmation Alert */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(val) => !val && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the staff
              member and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
