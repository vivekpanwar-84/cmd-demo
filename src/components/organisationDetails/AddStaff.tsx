"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, SubmitHandler, Resolver } from "react-hook-form";
import { User, Lock, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useCreateStaff, useUpdateStaff } from "@/hooks/useAdmin";
import {
  RegisterStaffPayload,
  Staff,
} from "@/types/staff";

/* ================= SCHEMA ================= */
const staffSchema = (isEditMode: boolean) => z.object({
  full_name: z.string().min(2, "Full name is required").max(50),
  email: z.string().email("Invalid email").max(100),
  phone: z.string().min(8, "Invalid phone number"),
  password: isEditMode
    ? z.string().max(20).optional().or(z.literal(""))
    : z.string().min(6, "Password must be at least 6 characters").max(20),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

type FormValues = RegisterStaffPayload;

export default function AddStaffPage({
  organizationId,
  onClose,
  initialData,
}: {
  organizationId: string;
  onClose?: () => void;
  initialData?: Staff;
}) {
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(staffSchema(isEditMode)) as unknown as Resolver<FormValues>,
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
      permissions: [],
    },
  });

  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [pendingUpdateData, setPendingUpdateData] = useState<FormValues | null>(null);

  const createStaff = useCreateStaff(organizationId);
  const updateStaff = useUpdateStaff(organizationId);

  useEffect(() => {
    if (initialData) {
      reset({
        full_name: initialData.full_name,
        email: initialData.email,
        phone: initialData.phone,
        password: "",
        permissions: (initialData.permissions || []) as string[],
      });
    }
  }, [initialData, reset]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (isEditMode) {
      setPendingUpdateData(data);
      setShowUpdateConfirm(true);
    } else {
      createStaff.mutate(data, {
        onSuccess: () => {
          toast.success("Staff created successfully");
          onClose?.();
        },
        onError: (err) => {
          console.error(err);
          toast.error("Failed to create staff");
        },
      });
    }
  };

  const handleConfirmUpdate = () => {
    if (!pendingUpdateData) return;
    const { password, ...rest } = pendingUpdateData;
    const updatedData = password && password.trim() !== "" ? pendingUpdateData : rest;

    updateStaff.mutate(
      {
        staffId: initialData!._id,
        data: updatedData as Partial<RegisterStaffPayload>,
      },
      {
        onSuccess: () => {
          toast.success("Staff updated successfully");
          setShowUpdateConfirm(false);
          onClose?.();
        },
        onError: (err) => {
          console.error(err);
          toast.error("Failed to update staff");
          setShowUpdateConfirm(false);
        },
        onSettled: () => {
          setShowUpdateConfirm(false);
        }
      }
    );
  };

  const isPending = createStaff.isPending || updateStaff.isPending;

  return (
    <div className="w-full px-2 sm:px-4 pb-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* ================= STAFF DETAILS ================= */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 mt-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-gray-700" />
            <h2 className="text-base font-semibold text-gray-800">Staff Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 ml-1">Full Name</label>
              <Input
                placeholder="Full Name"
                className="bg-gray-50 border-none h-10 rounded-lg focus-visible:ring-primary/20 text-sm"
                {...register("full_name")}
              />
              {errors.full_name && <p className="text-[10px] text-red-500 ml-1">{errors.full_name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 ml-1">Email</label>
              <Input
                placeholder="Email"
                className="bg-gray-50 border-none h-10 rounded-lg focus-visible:ring-primary/20 text-sm"
                {...register("email")}
              />
              {errors.email && <p className="text-[10px] text-red-500 ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 ml-1">Phone</label>
              <Input
                placeholder="Phone"
                type="number"
                {...register("phone")}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-", "."].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (target.value.length > 10) {
                    target.value = target.value.slice(0, 10);
                  }
                }}
                className="bg-gray-50 border-none h-10 rounded-lg focus-visible:ring-primary/20 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {errors.phone && <p className="text-[10px] text-red-500 ml-1">{errors.phone.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 ml-1">Password {isEditMode && "(Optional)"}</label>
              <Input
                type="password"
                placeholder="Password"
                className="bg-gray-50 border-none h-10 rounded-lg focus-visible:ring-primary/20 text-sm"
                {...register("password")}
              />
              {errors.password && <p className="text-[10px] text-red-500 ml-1">{errors.password.message}</p>}
            </div>
          </div>
        </div>

        {/* ================= PERMISSIONS ================= */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-gray-700" />
            <h2 className="text-base font-semibold text-gray-800">Permissions</h2>
          </div>

          <div className="border border-gray-100 rounded-lg overflow-x-auto">
            <Controller
              name="permissions"
              control={control}
              render={({ field }) => {
                const modules = [
                  { key: "CUSTOMER", label: "Customer" },
                  { key: "INVOICE", label: "Invoice" },
                ];
                const actions = [
                  { key: "CREATE", label: "Create" },
                  { key: "READ", label: "Read" },
                ];

                const getPermissionKey = (module: string, action: string) => {
                  if (module === "CUSTOMER" && action === "READ") return "VIEW_CUSTOMERS";
                  if (module === "INVOICE" && action === "CREATE") return "CREATE_INVOICE";
                  if (module === "INVOICE" && action === "READ") return "VIEW_INVOICES";
                  return "";
                };

                const togglePermission = (perm: string, checked: boolean) => {
                  const currentParams = field.value || [];
                  if (checked) {
                    field.onChange([...currentParams, perm]);
                  } else {
                    field.onChange(currentParams.filter((p) => p !== perm));
                  }
                };

                return (
                  <table className="w-full text-left min-w-[400px]">
                    <thead className="bg-gray-50/80">
                      <tr>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-600">Module</th>
                        {actions.map((act) => (
                          <th key={act.key} className="px-4 py-2 text-xs font-semibold text-gray-600 text-center">{act.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {modules.map((mod) => (
                        <tr key={mod.key} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-2 text-xs text-gray-700 font-medium">{mod.label}</td>
                          {actions.map((act) => {
                            const perm = getPermissionKey(mod.key, act.key);

                            if (!perm) {
                              return <td key={act.key} className="px-4 py-2 text-center text-gray-300">-</td>;
                            }

                            const isChecked = field.value?.includes(perm);
                            return (
                              <td key={act.key} className="px-4 py-2 text-center">
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={(val) => togglePermission(perm, !!val)}
                                  className="w-4 h-4 border-gray-300 data-[state=checked]:bg-[#FF8A5B] data-[state=checked]:border-[#FF8A5B]"
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              }}
            />
          </div>
          {errors.permissions && <p className="text-[10px] text-red-500 mt-3 ml-1">{errors.permissions.message}</p>}
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex items-center justify-end gap-3 pt-6 pb-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="px-8 rounded-xl h-11"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isPending}
            className="bg-[#FF8A5B] hover:bg-[#FF7A4B] text-white px-8 rounded-xl h-11 shadow-md shadow-primary/20 min-w-[140px]"
          >
            {(isSubmitting || isPending) && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {isEditMode ? "Update Staff" : "Create Staff"}
          </Button>
        </div>
      </form>

      <AlertDialog open={showUpdateConfirm} onOpenChange={setShowUpdateConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update this staff member&apos;s details and permissions?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateStaff.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#FF8A5B] hover:bg-[#FF7A4B] text-white"
              onClick={(e) => {
                e.preventDefault();
                handleConfirmUpdate();
              }}
              disabled={updateStaff.isPending}
            >
              {updateStaff.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Confirm Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
