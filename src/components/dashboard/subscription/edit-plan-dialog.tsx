"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SubscriptionPlan } from "@/types/subscription";
import { pricingService } from "@/services/pricing.service";
import { toast } from "sonner";

interface EditPlanDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plan: SubscriptionPlan | null;
    onPlanUpdated?: () => void;
}

export function EditPlanDialog({ open, onOpenChange, plan, onPlanUpdated }: EditPlanDialogProps) {
    const [loading, setLoading] = useState(false);

    // Form State
    const [planName, setPlanName] = useState("");
    const [customerPrice, setCustomerPrice] = useState(0);
    const [staffPrice, setStaffPrice] = useState(0);

    const [invoicePrices, setInvoicePrices] = useState({ weekly: 0, monthly: 0, yearly: 0 });
    const [defaultInvoice, setDefaultInvoice] = useState("monthly");

    const [servicePrices, setServicePrices] = useState({ whatsapp: 0, email: 0, voice: 0, sms: 0 });

    useEffect(() => {
        if (plan && open) {
            setPlanName(plan.name || "Standard Plan");
            setCustomerPrice(plan.per_customer);
            setStaffPrice(plan.per_staff);
            setInvoicePrices({
                weekly: plan.per_invoice || 0,
                monthly: plan.per_invoice || 0,
                yearly: plan.per_invoice || 0
            });
            setServicePrices({
                whatsapp: plan.services.whatsapp,
                email: plan.services.email,
                voice: plan.services.call,
                sms: plan.services.sms
            });
        }
    }, [plan, open]);

    const handleSave = async () => {
        if (!plan) return;
        setLoading(true);

        // Calculate base_price
        // User request: "base_price ko total calculate kar k update karna hai jese perstaff+percustomer+services"
        // Interpretation: Is it sum of unit prices? Or sum of some default package? 
        // "services" is an object with prices. 
        // Let's assume Base Price = Staff Price + Customer Price + Sum(Service Prices)
        // Or maybe it is a separate field that the user wants auto-calculated.
        // I'll calculate it as: per_staff + per_customer + email + sms + whatsapp + call
        // Note: `sms` is in the payload but not in the `servicePrices` state in `CreatePlanDialog` example (it had voice/email/whatsapp).
        // I will add SMS to the state.

        const totalServices = servicePrices.email + servicePrices.whatsapp + servicePrices.voice + servicePrices.sms;

        // Wait, the CreatePlanDialog didn't have SMS in the View I read? 
        // Let me re-read CreatePlanDialog... it had whatsapp, email, voice. 
        // The user request JSON has: email, sms, whatsapp, call.
        // I should probably add SMS to the UI.

        // I will calculate base_price = per_staff + per_customer + totalServices (including SMS if added).
        // Let's stick to the User Request field names.

        const calculatedBasePrice = staffPrice + customerPrice + totalServices;
        // Actually, I'll add SMS input to the form to be complete.

        const payload = {
            base_price: calculatedBasePrice,
            per_staff: staffPrice,
            per_customer: customerPrice,
            per_invoice: invoicePrices.monthly, // Mapping monthly for now
            services: {
                email: servicePrices.email,
                sms: servicePrices.sms,
                whatsapp: servicePrices.whatsapp,
                call: servicePrices.voice
            }
        };

        try {
            await pricingService.updatePlan(plan._id, payload);
            toast.success("Plan updated successfully");
            onOpenChange(false);
            onPlanUpdated?.();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update plan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Plan</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-4">
                        {/* Plan Name */}
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label className="text-right">Plan Name:</Label>
                            <Input
                                value={planName}
                                onChange={(e) => setPlanName(e.target.value)}
                                className="col-span-2"
                                placeholder="e.g. Silver Plan"
                            />
                        </div>

                        {/* Unit Prices */}
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label className="text-right">Price Per Customer:</Label>
                            <Input
                                type="number"
                                value={customerPrice}
                                onChange={(e) => setCustomerPrice(Number(e.target.value))}
                                className="col-span-1"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label className="text-right">Price Per Staff:</Label>
                            <Input
                                type="number"
                                value={staffPrice}
                                onChange={(e) => setStaffPrice(Number(e.target.value))}
                                className="col-span-1"
                            />
                        </div>

                        {/* Invoice Prices - Simplified to match Type for now, but keeping UI structure */}
                        <div className="grid grid-cols-3 items-start gap-4 pt-2">
                            <Label className="text-right pt-2">Price Per Invoice:</Label>
                            <div className="col-span-2">
                                <Input
                                    type="number"
                                    value={invoicePrices.monthly}
                                    onChange={(e) => setInvoicePrices(p => ({ ...p, monthly: Number(e.target.value) }))}
                                />
                                <p className="text-xs text-muted-foreground mt-1">Base price per invoice generated</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 items-start gap-4 pt-2">
                            <Label className="text-right pt-2">Service Pricing:</Label>
                            <div className="col-span-2 space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="font-normal text-muted-foreground">WhatsApp</Label>
                                    <Input
                                        className="w-20 h-8"
                                        type="number"
                                        value={servicePrices.whatsapp}
                                        onChange={(e) => setServicePrices(p => ({ ...p, whatsapp: Number(e.target.value) }))}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="font-normal text-muted-foreground">Email</Label>
                                    <Input
                                        className="w-20 h-8"
                                        type="number"
                                        value={servicePrices.email}
                                        onChange={(e) => setServicePrices(p => ({ ...p, email: Number(e.target.value) }))}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="font-normal text-muted-foreground">Voice Call</Label>
                                    <Input
                                        className="w-20 h-8"
                                        type="number"
                                        value={servicePrices.voice}
                                        onChange={(e) => setServicePrices(p => ({ ...p, voice: Number(e.target.value) }))}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="font-normal text-muted-foreground">SMS</Label>
                                    <Input // Added SMS field
                                        className="w-20 h-8"
                                        type="number"
                                        value={servicePrices.sms}
                                        onChange={(e) => setServicePrices(p => ({ ...p, sms: Number(e.target.value) }))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-start">
                    <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
                        {loading ? "Updating..." : "Update Plan"}
                    </Button>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto mt-2 sm:mt-0">Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}