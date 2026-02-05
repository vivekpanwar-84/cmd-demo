"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Building2, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createOrganizationSchema } from "@/lib/Schema/AddOrganisationValidation";
import { useCreateOrganization } from "@/hooks/useAdmin";

type FormValues = z.infer<typeof createOrganizationSchema>;

export default function AddOrganizationPage({
  onClose,
}: {
  onClose?: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(createOrganizationSchema),
    mode: "onTouched",
    defaultValues: {
      country: "India",
      timezone: "IST (GMT+5:30)",
      currency: "INR",
    },
  });

  const createOrganization = useCreateOrganization();

  const onSubmit = (data: FormValues) => {
    const payload = {
      ...data,
      adminName: data.adminName.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
    };

    createOrganization.mutate(payload, {
      onSuccess: () => {
        reset();
        onClose?.();
      },
      onError: (error: any) => {
        console.error(
          "Create organization failed:",
          error?.response?.data || error.message
        );
      },
    });
  };

  const inputClass = (error?: boolean) =>
    error
      ? "border-red-500 focus:ring-red-200"
      : "border-gray-300 focus:border-primary focus:ring-primary/20";

  const lockedInputClass =
    "bg-gray-100 cursor-not-allowed text-gray-600";

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              Organization Details
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label>Organization Name</Label>
              <Input
                placeholder="Acme Solutions Pvt Ltd"
                {...register("orgName")}
                className={inputClass(!!errors.orgName)}
              />
              {errors.orgName && (
                <p className="text-xs text-red-500">{errors.orgName.message}</p>
              )}
            </div>

            {/* 🔒 Country (LOCKED) */}
            <div className="space-y-1.5">
              <Label>Country</Label>
              <Input
                readOnly
                {...register("country")}
                className={`${inputClass(!!errors.country)} ${lockedInputClass}`}
              />
            </div>

            {/* 🔒 Timezone (LOCKED) */}
            <div className="space-y-1.5">
              <Label>Timezone</Label>
              <Input
                readOnly
                {...register("timezone")}
                className={`${inputClass(!!errors.timezone)} ${lockedInputClass}`}
              />
            </div>

            {/* 🔒 Currency (LOCKED) */}
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Input
                readOnly
                {...register("currency")}
                className={`${inputClass(!!errors.currency)} ${lockedInputClass}`}
              />
            </div>
          </CardContent>

          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label>Organization Admin Name</Label>
              <Input
                placeholder="Full Name"
                {...register("adminName")}
                className={inputClass(!!errors.adminName)}
              />
              {errors.adminName && (
                <p className="text-xs text-red-500">
                  {errors.adminName.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="admin@company.com"
                {...register("email")}
                className={inputClass(!!errors.email)}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Minimum 6 characters"
                {...register("password")}
                className={inputClass(!!errors.password)}
              />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Phone Number</Label>
              <Input
                placeholder="+91 XXXXX-XXXXX"
                maxLength={10}
                {...register("phone")}
                className={inputClass(!!errors.phone)}
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => onClose?.()}>
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Create Organization
          </Button>
        </div>
      </form>
    </div>
  );
}
