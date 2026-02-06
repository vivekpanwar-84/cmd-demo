"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { FileText, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createInvoiceSchema } from "@/lib/Schema/AddInvoiceValidations";
import { useCreateInvoice } from "@/hooks/useAdmin";

type FormValues = z.infer<typeof createInvoiceSchema>;

export default function AddInvoicePage({
  orgId,
  customerId,
  onClose,
}: {
  orgId: string;
  customerId: string;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(createInvoiceSchema),
    mode: "onTouched",
    defaultValues: {
      paid_amount: 0,
    },
  });

  const createInvoice = useCreateInvoice();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    createInvoice.mutate(
      {
        orgId,
        customerId,
        data,
      },
      {
        onSuccess: () => {
          toast.success("Invoice created successfully");
          reset();
          onClose();
        },
        onError: (err) => {
          console.error(err);
          toast.error("Failed to create invoice");
        },
      },
    );
  };

  const isLoading = isSubmitting || createInvoice.isPending;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ================= INVOICE INFO ================= */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Invoice Details
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Issue Date */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Issue Date
              </label>
              <Input type="date" {...register("issue_date")} />
              {errors.issue_date && (
                <p className="text-xs text-red-500">
                  {errors.issue_date.message}
                </p>
              )}
            </div>

            {/* Due Date */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Due Date
              </label>
              <Input type="date" {...register("due_date")} />
              {errors.due_date && (
                <p className="text-xs text-red-500">
                  {errors.due_date.message}
                </p>
              )}
            </div>

            {/* Total Amount */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Total Amount
              </label>
              <Input
                type="number"
                placeholder="0.00"
                {...register("total_amount", { valueAsNumber: true })}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-", "."].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.total_amount && (
                <p className="text-xs text-red-500">
                  {errors.total_amount.message}
                </p>
              )}
            </div>

            {/* Paid Amount */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Paid Amount
              </label>
              <Input
                type="number"
                placeholder="0.00"
                {...register("paid_amount", { valueAsNumber: true })}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-", "."].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.paid_amount && (
                <p className="text-xs text-red-500">
                  {errors.paid_amount.message}
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
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 mr-2" />
            )}
            Create Invoice
          </Button>
        </div>
      </form>
    </div>
  );
}
