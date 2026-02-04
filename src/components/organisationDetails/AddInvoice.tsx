"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { FileText, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
          reset();
          onClose();
        },
        onError: (err) => {
          console.error(err);
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
            {/* Invoice Number */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Invoice Number
              </label>
              <Input placeholder="INV-001" {...register("invoice_number")} />
              {errors.invoice_number && (
                <p className="text-xs text-red-500">
                  {errors.invoice_number.message}
                </p>
              )}
            </div>

            {/* Issue Date */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
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
              <label className="text-sm font-medium text-muted-foreground">
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
              <label className="text-sm font-medium text-muted-foreground">
                Total Amount
              </label>
              <Input
                type="number"
                placeholder="0.00"
                {...register("total_amount", { valueAsNumber: true })}
              />
              {errors.total_amount && (
                <p className="text-xs text-red-500">
                  {errors.total_amount.message}
                </p>
              )}
            </div>

            {/* Paid Amount */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">
                Paid Amount
              </label>
              <Input
                type="number"
                placeholder="0.00"
                {...register("paid_amount", { valueAsNumber: true })}
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