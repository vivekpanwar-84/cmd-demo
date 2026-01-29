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
import { useCreateAdminStaff, useAdminStaffPermissions, useUpdateAdminStaff } from "@/hooks/useAdmin";
import {
    RegisterStaffPayload,
    AdminStaff,
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
    const { data: permResponse, isLoading: permsLoading } = useAdminStaffPermissions();
    const permissions = permResponse?.data || [];

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(createStaffSchema),
        defaultValues: {
            full_name: initialData?.full_name || "",
            email: initialData?.email || "",
            phone: initialData?.phone || "",
            password: "",
            permissions: initialData?.permissions || [],
        },
    });

    const createAdminStaff = useCreateAdminStaff(organizationId);
    const updateAdminStaff = useUpdateAdminStaff(initialData?._id || "", organizationId);

    // Sync form with initialData when it changes (e.g. switching between edit/add)
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
            const { password, ...updateData } = data;
            const finalData = password ? data : updateData;
            updateAdminStaff.mutate(finalData, {
                onSuccess: (res) => {
                    console.log("Admin Staff Updated Successfully:", res);
                    onClose?.();
                },
            });
        } else {
            const payload = { ...data, org_id: organizationId };
            console.log("Submitting Admin Staff Payload:", payload);
            createAdminStaff.mutate(payload, {
                onSuccess: (res) => {
                    console.log("Admin Staff Created Successfully:", res);
                    reset();
                    onClose?.(); // ✅ close modal
                },
                onError: (err) => {
                    console.error("Error creating Admin Staff:", err);
                }
            });
        }
    };

    if (permsLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {permissions.map((perm) => (
                                        <label
                                            key={perm}
                                            className="flex gap-2 items-center text-sm cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                                        >
                                            <Checkbox
                                                checked={field.value.includes(perm)}
                                                onCheckedChange={(checked) =>
                                                    checked
                                                        ? field.onChange([...field.value, perm])
                                                        : field.onChange(
                                                            field.value.filter((p) => p !== perm)
                                                        )
                                                }
                                            />
                                            {perm.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
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
                        disabled={isSubmitting || createAdminStaff.isPending}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={isSubmitting || createAdminStaff.isPending}
                    >
                        {(isSubmitting || createAdminStaff.isPending) && (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        Create Staff
                    </Button>
                </div>
            </form>
        </div>
    );
}
