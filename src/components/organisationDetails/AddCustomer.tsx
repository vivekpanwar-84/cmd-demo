"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { User, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCustomerSchema } from "@/lib/Schema/AddCustomerValidation";
import { useCreateCustomer } from "@/hooks/useAdmin";

type FormValues = z.infer<typeof createCustomerSchema>;

export default function AddCustomerPage({
  organizationId,
  onClose,
}: {
  organizationId: string;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(createCustomerSchema),
    mode: "onTouched",
  });

  const createCustomer = useCreateCustomer(organizationId);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    createCustomer.mutate(data, {
      onSuccess: () => {
        reset();
        onClose(); // ✅ close dialog
      },
      onError: (err) => {
        console.error("Failed to create customer", err);
      },
    });
  };

  const isLoading = isSubmitting || createCustomer.isPending;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      {/* <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Add Customer
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create a new customer record
        </p>
      </div> */}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ================= CUSTOMER INFO ================= */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Customer Details
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <Input
                placeholder="Full Name"
                {...register("full_name")}
                className={
                  errors.full_name
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-primary focus:ring-primary/20"
                }
              />
              {errors.full_name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Input
                placeholder="Email"
                {...register("email")}
                className={
                  errors.email
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-primary focus:ring-primary/20"
                }
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="md:col-span-2">
              <Input
                placeholder="Phone"
                {...register("phone")}
                className={
                  errors.phone
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-primary focus:ring-primary/20"
                }
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-white"
          >
            {isLoading && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Create Customer
          </Button>
        </div>
      </form>
    </div>
  );
}
