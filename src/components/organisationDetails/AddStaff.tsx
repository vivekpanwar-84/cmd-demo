"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { User, Lock, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateStaff } from "@/hooks/useAdmin";
import {
  RegisterStaffPayload,
  StaffPermission,
} from "@/types/staff";

/* ================= SCHEMA ================= */
const createStaffSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(8, "Invalid phone number"),
  password: z.string().min(6, "Minimum 6 characters"),
  permissions: z
    .array(z.string())
    .min(1, "Select at least one permission"),
});

type FormValues = RegisterStaffPayload;

/* ================= PERMISSIONS ================= */
const PERMISSIONS: { key: StaffPermission; label: string }[] = [
  { key: "VIEW_CUSTOMER", label: "View Customers" },
  { key: "CREATE_CUSTOMER", label: "Create Customer" },
  { key: "VIEW_INVOICE", label: "View Invoices" },
];

export default function AddStaffPage({
  organizationId,
  onClose,
}: {
  organizationId: string;
  onClose?: () => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      permissions: [],
    },
  });

  const createStaff = useCreateStaff(organizationId);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    createStaff.mutate(data, {
      onSuccess: () => {
        reset();
        onClose?.(); // ✅ close modal
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* ================= STAFF DETAILS ================= */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-4 h-4" /> Staff Details
            </CardTitle>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <Input placeholder="Full Name" {...register("full_name")} />
              {errors.full_name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            <div>
              <Input placeholder="Email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Input placeholder="Phone" {...register("phone")} />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

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
              render={({ field }) => (
                <div className="space-y-2">
                  {PERMISSIONS.map((perm) => (
                    <label
                      key={perm.key}
                      className="flex gap-2 items-center text-sm"
                    >
                      <Checkbox
                        checked={field.value.includes(perm.key)}
                        onCheckedChange={(checked) =>
                          checked
                            ? field.onChange([...field.value, perm.key])
                            : field.onChange(
                              field.value.filter((p) => p !== perm.key)
                            )
                        }
                      />
                      {perm.label}
                    </label>
                  ))}
                </div>
              )}
            />

            {errors.permissions && (
              <p className="text-xs text-red-500 mt-2">
                {errors.permissions.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting || createStaff.isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting || createStaff.isPending}
          >
            {(isSubmitting || createStaff.isPending) && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Create Staff
          </Button>
        </div>
      </form>
    </div>
  );
}
