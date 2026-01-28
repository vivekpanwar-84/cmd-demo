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
    .array(
      z.enum([
        "VIEW_CUSTOMERS",
        "CREATE_INVOICE",
        "VIEW_INVOICES",
      ])
    )
    .min(1, "Select at least one permission"),
});

/* 👇 IMPORTANT: form type comes from backend */
type FormValues = RegisterStaffPayload;

/* ================= PERMISSIONS ================= */
const PERMISSIONS: { key: StaffPermission; label: string }[] = [
  { key: "VIEW_CUSTOMERS", label: "View Customers" },
  { key: "CREATE_INVOICE", label: "Create Invoice" },
  { key: "VIEW_INVOICES", label: "View Invoices" },
];

export default function AddStaffPage({
  organizationId,
}: {
  organizationId: string;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
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
        alert("Staff created successfully!");
      },
      onError: (err) => {
        console.error("Failed to create staff", err);
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Add Staff</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-4 h-4" /> Staff Details
            </CardTitle>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-4">
            <Input placeholder="Full Name" {...register("full_name")} />
            <Input placeholder="Email" {...register("email")} />
            <Input placeholder="Phone" {...register("phone")} />
            <Input type="password" placeholder="Password" {...register("password")} />
          </CardContent>
        </Card>

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
                    <label key={perm.key} className="flex gap-2 items-center">
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
          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={isSubmitting || createStaff.isPending}
        >
          {(isSubmitting || createStaff.isPending) && (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          )}
          Create Staff
        </Button>
      </form>
    </div>
  );
}
