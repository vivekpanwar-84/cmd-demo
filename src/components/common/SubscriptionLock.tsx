"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useOrganizationDetail } from "@/hooks/useAdmin";

interface SubscriptionLockProps {
    organizationId: string;
    isOpen: boolean;
    onClose: () => void;
    actionName?: string;
    isLimitReached?: boolean;
}

export function SubscriptionLock({
    organizationId,
    isOpen,
    onClose,
    actionName = "this action",
    isLimitReached = false,
}: SubscriptionLockProps) {
    const { data: org } = useOrganizationDetail(organizationId);

    const isActive = org?.plan_status === "active";
    const shouldBlock = !isActive || isLimitReached;

    if (!shouldBlock && isOpen) {
        onClose();
        return null;
    }

    const showInactive = !isActive;
    const title = showInactive ? "Subscription Inactive" : "Usage Limit Reached";
    const description = showInactive
        ? `Your subscription for ${org?.name || "this organization"} is currently inactive. You need to update your plan to ${actionName}.`
        : `You have reached the ${actionName.split(" ").pop()} limit for this organization. Please upgrade your plan to increase your limits.`;

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <AlertDialogTitle className="text-xl">{title}</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-gray-600 text-sm leading-relaxed">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6 flex flex-col sm:flex-row gap-2">
                    <AlertDialogCancel onClick={onClose} className="sm:flex-1">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction asChild className="sm:flex-1 bg-primary hover:bg-primary/90 text-white">
                        <Link href="/subscriptions" className="flex items-center justify-center gap-2">
                            Upgrade Plan
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
