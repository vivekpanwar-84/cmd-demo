"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface AssignPlanDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultValues?: any;
}

// Reuse constants or pass as props preferably, but duplicating for self-containment in this context as per rapid proto
const PRICES = {
    CUSTOMER_UNIT: 5,
    STAFF_UNIT: 8,
    INVOICE: { WEEKLY: 50, SIX_WEEKS: 200, YEARLY: 1000 },
    SERVICES: { WHATSAPP: 200, EMAIL: 100, VOICE_CALL: 300 },
};

export function AssignPlanDialog({ open, onOpenChange, defaultValues }: AssignPlanDialogProps) {
    // Dummy Plans Data (normally from props or query)
    const PLANS = [
        { id: "p1", name: "Standard Plan", prices: { cust: 5, staff: 8, inv: { w: 50, m: 200, y: 1000 }, srv: { wa: 200, em: 100, vc: 300 } } },
        { id: "p2", name: "Enterprise Plus", prices: { cust: 10, staff: 15, inv: { w: 100, m: 300, y: 1500 }, srv: { wa: 400, em: 200, vc: 600 } } },
    ];

    const [orgId, setOrgId] = useState<string>("");
    const [selectedPlanId, setSelectedPlanId] = useState<string>("");
    const [customerCount, setCustomerCount] = useState<number>(15);
    const [staffCount, setStaffCount] = useState<number>(5);

    const [invoiceFreq, setInvoiceFreq] = useState<string>("weekly");
    const [services, setServices] = useState({ whatsapp: true, email: true, voice_call: true });

    const selectedPlan = PLANS.find(p => p.id === selectedPlanId);

    // Calculate total dynamically based on Plan Template
    const total = selectedPlan
        ? (customerCount * selectedPlan.prices.cust) +
        (staffCount * selectedPlan.prices.staff) +
        (invoiceFreq === "weekly" ? selectedPlan.prices.inv.w : invoiceFreq === "monthly" ? selectedPlan.prices.inv.m : selectedPlan.prices.inv.y) +
        (services.whatsapp ? selectedPlan.prices.srv.wa : 0) +
        (services.email ? selectedPlan.prices.srv.em : 0) +
        (services.voice_call ? selectedPlan.prices.srv.vc : 0)
        : 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Assign Plan to Organization</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Org & Plan Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Select Organization</Label>
                            <Select value={orgId} onValueChange={setOrgId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Organization" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="acme">Acme Corporation</SelectItem>
                                    <SelectItem value="global">Global Tech</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Assign Plan Template</Label>
                            <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PLANS.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Separator />

                    {selectedPlan ? (
                        <>
                            {/* Inputs for Counts */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Customers Count</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            value={customerCount}
                                            onChange={(e) => setCustomerCount(Number(e.target.value))}
                                        />
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">× ₹{selectedPlan.prices.cust}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Staff Count</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            value={staffCount}
                                            onChange={(e) => setStaffCount(Number(e.target.value))}
                                        />
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">× ₹{selectedPlan.prices.staff}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Invoice Frequency</Label>
                                <RadioGroup
                                    value={invoiceFreq}
                                    onValueChange={setInvoiceFreq}
                                    className="grid grid-cols-3 gap-4"
                                >
                                    <div className={`flex items-center justify-between border rounded p-2 ${invoiceFreq === 'weekly' ? 'border-primary bg-primary/5' : ''}`}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="weekly" id="m-weekly" />
                                            <Label htmlFor="m-weekly">Weekly</Label>
                                        </div>
                                        <span className="text-xs font-bold">₹{selectedPlan.prices.inv.w}</span>
                                    </div>
                                    <div className={`flex items-center justify-between border rounded p-2 ${invoiceFreq === 'monthly' ? 'border-primary bg-primary/5' : ''}`}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="monthly" id="m-monthly" />
                                            <Label htmlFor="m-monthly">Monthly</Label>
                                        </div>
                                        <span className="text-xs font-bold">₹{selectedPlan.prices.inv.m}</span>
                                    </div>
                                    <div className={`flex items-center justify-between border rounded p-2 ${invoiceFreq === 'yearly' ? 'border-primary bg-primary/5' : ''}`}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="yearly" id="m-yearly" />
                                            <Label htmlFor="m-yearly">Yearly</Label>
                                        </div>
                                        <span className="text-xs font-bold">₹{selectedPlan.prices.inv.y}</span>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-2">
                                <Label>Enabled Services</Label>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="m-wa"
                                            checked={services.whatsapp}
                                            onCheckedChange={(c) => setServices(p => ({ ...p, whatsapp: !!c }))}
                                        />
                                        <Label htmlFor="m-wa">WhatsApp (₹{selectedPlan.prices.srv.wa})</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="m-em"
                                            checked={services.email}
                                            onCheckedChange={(c) => setServices(p => ({ ...p, email: !!c }))}
                                        />
                                        <Label htmlFor="m-em">Email (₹{selectedPlan.prices.srv.em})</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="m-vc"
                                            checked={services.voice_call}
                                            onCheckedChange={(c) => setServices(p => ({ ...p, voice_call: !!c }))}
                                        />
                                        <Label htmlFor="m-vc">Voice Call (₹{selectedPlan.prices.srv.vc})</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-muted/50 p-4 rounded-lg flex justify-between items-center border">
                                <span className="font-semibold">Calculated Monthly Total:</span>
                                <span className="font-bold text-2xl text-primary">₹{total}</span>
                            </div>
                        </>
                    ) : (
                        <div className="h-40 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                            Select a Plan Template to view pricing details
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={() => onOpenChange(false)} disabled={!selectedPlan}>Update Subscription</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
