"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { User, Lock, Loader2 } from "lucide-react";
import { useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useCreateAdminStaff,
  useAdminStaffPermissions,
  useUpdateAdminStaff,
} from "@/hooks/useAdmin";
import { RegisterStaffPayload, AdminStaff } from "@/types/staff";

/* ================= SCHEMA ================= */
const createStaffSchema = z.object({
  full_name: z.string().min(2).max(50),
  email: z.string().email().max(100),
  phone: z.string().min(8),
  password: z.string().min(6).max(20),
  permissions: z.array(z.string()).min(1),
});

type FormValues = RegisterStaffPayload;

export default function AddAdminStaff({
  organizationId,
  onClose,
  initialData,
}: {
  organizationId: string;
  onClose?: () => void;
  initialData?: AdminStaff;
}) {
  const isEditMode = !!initialData;
  const { isLoading: permsLoading } = useAdminStaffPermissions();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
      permissions: [],
    },
  });

  const createAdminStaff = useCreateAdminStaff(organizationId);
  const updateAdminStaff = useUpdateAdminStaff(
    initialData?._id || "",
    organizationId
  );

  useEffect(() => {
    reset({
      full_name: initialData?.full_name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      password: "",
      permissions: initialData?.permissions || [],
    });
  }, [initialData, reset]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (isEditMode) {
      const { password, ...rest } = data;
      updateAdminStaff.mutate(password ? data : rest, {
        onSuccess: () => onClose?.(),
      });
    } else {
      createAdminStaff.mutate(
        { ...data, org_id: organizationId },
        { onSuccess: () => onClose?.() }
      );
    }
  };

  if (permsLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ================= STAFF DETAILS ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-4 h-4" /> Staff Details
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input placeholder="Full Name" maxLength={50} {...register("full_name")} />
            <Input placeholder="Email" maxLength={100} {...register("email")} />
            <Input placeholder="Phone" {...register("phone")} />
            <Input
              type="password"
              placeholder="Password"
              maxLength={20}
              {...register("password")}
            />
          </CardContent>
        </Card>

        {/* ================= PERMISSIONS ================= */}
        {/* ================= PERMISSIONS ================= */}
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Lock className="w-4 h-4" /> Permissions
    </CardTitle>
  </CardHeader>

  <CardContent>
    <Controller
      name="permissions"
      control={control}
      render={({ field }) => {
        const modules = [
          { key: "organization", label: "Organization" },
          { key: "staff", label: "Staff" },
          { key: "customer", label: "Customer" },
        ];

        const actions = ["create", "read", "update", "delete"];

        const togglePermission = (perm: string, checked: boolean) => {
          if (checked) {
            field.onChange([...field.value, perm]);
          } else {
            field.onChange(field.value.filter((p) => p !== perm));
          }
        };

        return (
          <div className="w-full overflow-hidden">
            <table className="w-full border rounded-lg table-fixed">
              <thead className="bg-muted">
                <tr>
                  <th className="w-[35%] text-left text-sm font-medium p-3 border-b">
                    Module
                  </th>
                  {actions.map((action) => (
                    <th
                      key={action}
                      className="text-center text-sm font-medium p-3 border-b capitalize"
                    >
                      {action}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {modules.map((module) => (
                  <tr
                    key={module.key}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <td className="p-3 text-sm font-medium border-b">
                      {module.label}
                    </td>

                    {actions.map((action) => {
                      const perm = `${module.key}:${action}`;
                      const checked = field.value.includes(perm);

                      return (
                        <td
                          key={perm}
                          className="p-3 text-center border-b"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(val) =>
                              togglePermission(perm, Boolean(val))
                            }
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }}
    />

    {errors.permissions && (
      <p className="text-xs text-red-500 mt-2">
        {errors.permissions.message}
      </p>
    )}
  </CardContent>
</Card>


        {/* ================= ACTIONS ================= */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEditMode ? "Update Staff" : "Create Staff"}
          </Button>
        </div>
      </form>
    </div>
  );
}
