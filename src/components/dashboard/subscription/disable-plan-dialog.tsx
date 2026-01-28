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
import { AlertTriangle } from "lucide-react";

interface DisablePlanDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    planName?: string;
    onConfirm: () => void;
}

export function DisablePlanDialog({ open, onOpenChange, planName = "this plan", onConfirm }: DisablePlanDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center gap-3 text-destructive mb-2">
                        <AlertTriangle className="h-6 w-6" />
                        <AlertDialogTitle>Disable {planName}?</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-base">
                        Are you sure you want to disable this plan? Any organizations currently on this plan will need to be migrated.
                        This action can be reversed at any time.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Disable Plan
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
