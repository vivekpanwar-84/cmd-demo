"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Building2, User, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createOrganizationSchema } from "@/lib/Schema/AddOrganisationValidation";
import { useCreateOrganization } from "@/hooks/useAdmin";

type FormValues = z.infer<typeof createOrganizationSchema>;

export default function AddOrganizationPage({ onClose }: { onClose?: () => void }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(createOrganizationSchema),
    mode: "onTouched",
  });

  const createOrganization = useCreateOrganization();

  const onSubmit = async (data: FormValues) => {
    createOrganization.mutate(data, {
      onSuccess: () => {
        reset();
        // alert("Organization created successfully!");
        onClose?.();
      },
      onError: (error: unknown) => {
        console.error("Failed to create organization", error);
      },
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Organization Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              Organization Details
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["orgName", "country", "timezone", "currency"].map((field) => (
              <div key={field}>
                <Input
                  placeholder={
                    field === "orgName"
                      ? "Organization Name"
                      : field === "country"
                        ? "Country"
                        : field === "timezone"
                          ? "Timezone"
                          : "Currency (USD / INR)"
                  }
                  {...register(field as keyof FormValues)}
                  className={
                    errors[field as keyof FormValues]
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-primary focus:ring-primary/20"
                  }
                />
                {errors[field as keyof FormValues] && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors[field as keyof FormValues]?.message as string}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Admin Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Admin Details
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["adminName", "email", "password", "phone"].map((field) => (
              <div key={field}>
                <Input
                  type={field === "email" ? "email" : field === "password" ? "password" : "text"}
                  placeholder={
                    field === "adminName"
                      ? "Admin Name"
                      : field === "email"
                        ? "Admin Email"
                        : field === "password"
                          ? "Password"
                          : "Phone Number"
                  }
                  {...register(field as keyof FormValues)}
                  className={
                    errors[field as keyof FormValues]
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-primary focus:ring-primary/20"
                  }
                />
                {errors[field as keyof FormValues] && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors[field as keyof FormValues]?.message as string}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => onClose?.()}>
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create Organization
          </Button>
        </div>
      </form>
    </div>
  );
}
