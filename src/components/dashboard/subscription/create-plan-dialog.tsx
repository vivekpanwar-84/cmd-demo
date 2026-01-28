"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

interface CreatePlanDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreatePlanDialog({ open, onOpenChange }: CreatePlanDialogProps) {
    const [planName, setPlanName] = useState("");
    const [customerPrice, setCustomerPrice] = useState(100);
    const [staffPrice, setStaffPrice] = useState(200);

    const [invoicePrices, setInvoicePrices] = useState({ weekly: 100, monthly: 200, yearly: 300 });
    const [defaultInvoice, setDefaultInvoice] = useState("monthly");

    const [servicePrices, setServicePrices] = useState({ whatsapp: 20, email: 40, voice: 60 });

    const handleReset = () => {
        setPlanName("");
        setCustomerPrice(100);
        setStaffPrice(200);
        setInvoicePrices({ weekly: 100, monthly: 200, yearly: 300 });
        setDefaultInvoice("monthly");
        setServicePrices({ whatsapp: 20, email: 40, voice: 60 });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Custom Plan</DialogTitle>
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

                        <div className="grid grid-cols-3 items-start gap-4 pt-2">
                            <Label className="text-right pt-2">Invoice Type:</Label>
                            <div className="col-span-2 space-y-2">
                                <RadioGroup value={defaultInvoice} onValueChange={setDefaultInvoice} className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="weekly" id="d-weekly" />
                                        <Label htmlFor="d-weekly" className="text-muted-foreground font-normal">Weekly</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="monthly" id="d-monthly" />
                                        <Label htmlFor="d-monthly" className="text-muted-foreground font-normal">Monthly</Label>
                                    </div>
                                    {/* Yearly hidden in basic view or add if needed, kept concise for layout */}
                                </RadioGroup>
                                <div className="flex gap-2">
                                    <Input
                                        className="w-20 h-8"
                                        value={invoicePrices.weekly}
                                        onChange={(e) => setInvoicePrices(p => ({ ...p, weekly: Number(e.target.value) }))}
                                    />
                                    <Input
                                        className="w-20 h-8 bg-muted"
                                        value={invoicePrices.monthly}
                                        onChange={(e) => setInvoicePrices(p => ({ ...p, monthly: Number(e.target.value) }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 items-start gap-4 pt-2">
                            <Label className="text-right pt-2">Service Pricing:</Label>
                            <div className="col-span-2 space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="font-normal text-muted-foreground">WhatsApp Price</Label>
                                    <Input
                                        className="w-20 h-8"
                                        value={servicePrices.whatsapp}
                                        onChange={(e) => setServicePrices(p => ({ ...p, whatsapp: Number(e.target.value) }))}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="font-normal text-muted-foreground">Email Price</Label>
                                    <Input
                                        className="w-20 h-8"
                                        value={servicePrices.email}
                                        onChange={(e) => setServicePrices(p => ({ ...p, email: Number(e.target.value) }))}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="font-normal text-muted-foreground">Voice Call Price</Label>
                                    <Input
                                        className="w-20 h-8"
                                        value={servicePrices.voice}
                                        onChange={(e) => setServicePrices(p => ({ ...p, voice: Number(e.target.value) }))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-start">
                    <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Create Plan</Button>
                    <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto mt-2 sm:mt-0">Reset</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
