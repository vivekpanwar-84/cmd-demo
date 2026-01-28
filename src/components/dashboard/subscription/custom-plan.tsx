"use client";

import { useState, useEffect } from "react";
import { Calculator, RotateCcw, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { pricingService } from "@/services/pricing.service";
import { toast } from "sonner";
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

// ✅ Min price logic
const MIN_PRICE = 100;

const safePrice = (value: number) => {
    if (!value || value < MIN_PRICE) return MIN_PRICE;
    return value;
};

// ✅ Prevent typing 0
const preventZero = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "0") e.preventDefault();
};

interface CustomPlanProps {
    onClose?: () => void;
}

export function CustomPlan({ onClose }: CustomPlanProps) {
    const [planId, setPlanId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [planName, setPlanName] = useState("");

    // Fixed Pricing
    const [pricePerCustomer, setPricePerCustomer] = useState<number>(100);
    const [pricePerStaff, setPricePerStaff] = useState<number>(200);

    // Invoice Pricing
    const [invoicePrices, setInvoicePrices] = useState({
        weekly: 100,
        monthly: 200,
        yearly: 300,
    });

    const [invoiceType, setInvoiceType] = useState<"weekly" | "monthly" | "yearly">("weekly");

    const [servicePrices, setServicePrices] = useState({
        whatsapp: 100,
        email: 100,
        voice_call: 100,
        sms: 100,
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const plans = await pricingService.getAllPlans();
                if (plans && plans.length > 0) {
                    const plan = plans[0]; // Assuming we update the first/main plan
                    setPlanId(plan._id);
                    setPlanName(plan.name || "Default Plan");
                    setPricePerCustomer(plan.per_customer);
                    setPricePerStaff(plan.per_staff);
                    setInvoicePrices({
                        weekly: plan.per_invoice,
                        monthly: plan.per_invoice,
                        yearly: plan.per_invoice,
                    });
                    setServicePrices({
                        whatsapp: plan.services.whatsapp,
                        email: plan.services.email,
                        voice_call: plan.services.call,
                        sms: plan.services.sms,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch plan data:", error);
                toast.error("Failed to load plan data");
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Total Price
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const invoicePrice = invoicePrices[invoiceType];

        const serviceTotal =
            servicePrices.whatsapp +
            servicePrices.email +
            servicePrices.voice_call;

        const totalPrice =
            pricePerCustomer +
            pricePerStaff +
            invoicePrice +
            serviceTotal;

        setTotal(totalPrice);
    }, [pricePerCustomer, pricePerStaff, invoicePrices, invoiceType, servicePrices]);

    const handleSaveClick = () => {
        if (!planName) {
            toast.error("Please enter a plan name");
            return;
        }
        setShowConfirm(true);
    };

    const confirmUpdate = async () => {
        if (!planId) return;
        setSubmitting(true);
        try {
            const payload = {
                name: planName,
                per_customer: pricePerCustomer,
                per_staff: pricePerStaff,
                per_invoice: invoicePrices[invoiceType],
                services: {
                    whatsapp: servicePrices.whatsapp,
                    email: servicePrices.email,
                    call: servicePrices.voice_call,
                    sms: servicePrices.sms,
                },
                base_price: total
            };

            await pricingService.updatePlan(planId, payload);
            toast.success("Plan updated successfully");
            onClose?.();
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Failed to update plan");
        } finally {
            setSubmitting(false);
            setShowConfirm(false);
        }
    };

    const handleReset = () => {
        // Option: reset to pre-filled data instead of defaults
        setPlanName("");
        setPricePerCustomer(100);
        setPricePerStaff(200);
        setInvoicePrices({
            weekly: 100,
            monthly: 200,
            yearly: 300,
        });
        setServicePrices({
            whatsapp: 100,
            email: 100,
            voice_call: 100,
            sms: 100,
        });
        setInvoiceType("weekly");
    };

    return (
        <Card className="w-full shadow-md border-border/50 relative">
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={onClose}
            >
                <X className="h-4 w-4" />
            </Button>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Update Subscription Plan
                </CardTitle>
                <CardDescription>
                    Admin can set fixed pricing for customers, staff, invoices and services.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">

                {/* Plan Name */}
                <div className="space-y-2">
                    <Label>Plan Name</Label>
                    <Input
                        placeholder="Enter plan name"
                        value={planName}
                        onChange={(e) => setPlanName(e.target.value)}
                    />
                </div>

                <Separator />

                {/* Fixed Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Price per Customer</Label>
                        <Input
                            type="number"
                            min={MIN_PRICE}
                            value={pricePerCustomer}
                            onKeyDown={preventZero}
                            onChange={(e) => setPricePerCustomer(safePrice(Number(e.target.value)))}
                            onBlur={() => setPricePerCustomer(safePrice(pricePerCustomer))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Price per Staff</Label>
                        <Input
                            type="number"
                            min={MIN_PRICE}
                            value={pricePerStaff}
                            onKeyDown={preventZero}
                            onChange={(e) => setPricePerStaff(safePrice(Number(e.target.value)))}
                            onBlur={() => setPricePerStaff(safePrice(pricePerStaff))}
                        />
                    </div>
                </div>

                <Separator />

                {/* Invoice Pricing */}
                <div className="space-y-4">
                    <Label className="text-base">Invoice Pricing</Label>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(["weekly", "monthly", "yearly"] as const).map((type) => (
                            <div key={type}>
                                <Label className="capitalize">{type} Price</Label>
                                <Input
                                    type="number"
                                    min={MIN_PRICE}
                                    value={invoicePrices[type]}
                                    onKeyDown={preventZero}
                                    onChange={(e) =>
                                        setInvoicePrices({
                                            ...invoicePrices,
                                            [type]: safePrice(Number(e.target.value)),
                                        })
                                    }
                                    onBlur={() =>
                                        setInvoicePrices({
                                            ...invoicePrices,
                                            [type]: safePrice(invoicePrices[type]),
                                        })
                                    }
                                />
                            </div>
                        ))}
                    </div>

                    {/* Invoice Type Selector */}
                    <div className="flex gap-4 mt-2">
                        {(["weekly", "monthly", "yearly"] as const).map((type) => (
                            <button
                                key={type}
                                className={`px-4 py-2 border rounded ${invoiceType === type ? "font-bold" : ""
                                    }`}
                                onClick={() => setInvoiceType(type)}
                            >
                                {type.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Service Pricing */}
                <div className="space-y-4">
                    <Label className="text-base">Service Pricing</Label>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { key: "whatsapp", label: "WhatsApp Price" },
                            { key: "email", label: "Email Price" },
                            { key: "voice_call", label: "Voice Call Price" },
                        ].map((service) => (
                            <div key={service.key} className="space-y-2">
                                <Label>{service.label}</Label>
                                <Input
                                    type="number"
                                    min={MIN_PRICE}
                                    value={servicePrices[service.key as keyof typeof servicePrices]}
                                    onKeyDown={preventZero}
                                    onChange={(e) =>
                                        setServicePrices({
                                            ...servicePrices,
                                            [service.key]: safePrice(Number(e.target.value)),
                                        })
                                    }
                                    onBlur={() =>
                                        setServicePrices({
                                            ...servicePrices,
                                            [service.key]: safePrice(
                                                servicePrices[service.key as keyof typeof servicePrices]
                                            ),
                                        })
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Summary */}
                <div className="rounded-lg p-6 border space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Customer Price:</span>
                        <span>₹{pricePerCustomer}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Staff Price:</span>
                        <span>₹{pricePerStaff}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Invoice Price ({invoiceType}):</span>
                        <span>₹{invoicePrices[invoiceType]}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Services Price:</span>
                        <span>
                            ₹{servicePrices.whatsapp + servicePrices.email + servicePrices.voice_call}
                        </span>
                    </div>

                    <Separator className="my-2" />

                    <div className="flex justify-between font-bold text-lg">
                        <span>Total Plan Price:</span>
                        <span>₹{total}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Button
                        className="flex-1"
                        size="lg"
                        onClick={handleSaveClick}
                        disabled={loading || submitting}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {submitting ? "Updating..." : "Update Plan"}
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleReset} disabled={loading || submitting}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                </div>

                {/* Confirmation Dialog */}
                <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Update</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to update the subscription plan? This will change the pricing for all organizations subscribed to this plan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={(e) => {
                                    e.preventDefault();
                                    confirmUpdate();
                                }}
                                disabled={submitting}
                            >
                                {submitting ? "Updating..." : "Confirm to Update"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
}
