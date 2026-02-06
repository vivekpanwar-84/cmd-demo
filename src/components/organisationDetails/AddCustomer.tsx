"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { User, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createCustomerSchema } from "@/lib/Schema/AddCustomerValidation";
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/useAdmin";
import { useEffect } from "react";
import { Customer } from "@/types/customertsx";

type FormValues = z.infer<typeof createCustomerSchema>;

export default function AddCustomerPage({
  organizationId,
  onClose,
  initialData,
}: {
  organizationId: string;
  onClose: () => void;
  initialData?: Customer;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(createCustomerSchema),
    mode: "onTouched",
    defaultValues: initialData || {},
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const createCustomer = useCreateCustomer(organizationId);
  const updateCustomer = useUpdateCustomer(organizationId);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (initialData) {
      updateCustomer.mutate(
        { customerId: initialData._id, data },
        {
          onSuccess: () => {
            toast.success("Customer updated successfully");
            onClose();
          },
          onError: (err) => {
            console.error("Failed to update customer", err);
            toast.error("Failed to update customer");
          },
        },
      );
    } else {
      createCustomer.mutate(data, {
        onSuccess: () => {
          toast.success("Customer created successfully");
          reset();
          onClose(); // ✅ close dialog
        },
        onError: (err) => {
          console.error("Failed to create customer", err);
          toast.error("Failed to create customer");
        },
      });
    }
  };

  const isLoading = isSubmitting || createCustomer.isPending || updateCustomer.isPending;

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
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
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
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
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
            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <Input
                placeholder="Phone"
                type="number"
                {...register("phone")}
                onKeyDown={(e) => {
                  // Prevent typing 'e', '+', '-', '.'
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
                className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.phone
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-primary focus:ring-primary/20"
                  }`}
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
            {initialData ? "Update Customer" : "Create Customer"}
          </Button>
        </div>
      </form>
    </div>
  );
}
