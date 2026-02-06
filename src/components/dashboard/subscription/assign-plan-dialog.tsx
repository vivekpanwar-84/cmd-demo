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
import { usePlans, useOrganizations } from "@/hooks/useAdmin";
import { Loader2 } from "lucide-react";

interface AssignPlanDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultValues?: any;
}

export function AssignPlanDialog({ open, onOpenChange, defaultValues }: AssignPlanDialogProps) {
    const { data: plans, isLoading: plansLoading } = usePlans();
    const { data: orgsData, isLoading: orgsLoading } = useOrganizations({ page: 1, limit: 100 });

    const organizations = orgsData?.data || [];

    const [orgId, setOrgId] = useState<string>("");
    const [selectedPlanId, setSelectedPlanId] = useState<string>("");
    const [customerCount, setCustomerCount] = useState<number>(15);
    const [staffCount, setStaffCount] = useState<number>(5);

    const [invoiceFreq, setInvoiceFreq] = useState<string>("monthly");
    const [services, setServices] = useState({ whatsapp: true, email: true, voice_call: true });

    const selectedPlan = plans?.find(p => p._id === selectedPlanId);

    // Calculate total dynamically based on real Plan Template
    const total = selectedPlan
        ? (customerCount * (selectedPlan.per_customer || 0)) +
        (staffCount * (selectedPlan.per_staff || 0)) +
        (selectedPlan.base_price || 0) +
        (services.whatsapp ? (selectedPlan.services?.whatsapp || 0) : 0) +
        (services.email ? (selectedPlan.services?.email || 0) : 0) +
        (services.voice_call ? (selectedPlan.services?.call || 0) : 0)
        : 0;

    const isLoading = plansLoading || orgsLoading;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Assign Plan to Organization</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <>
                            {/* Org & Plan Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Select Organization</Label>
                                    <Select value={orgId} onValueChange={setOrgId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Organization" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {organizations.map((org: any) => (
                                                <SelectItem key={org._id} value={org._id}>{org.name}</SelectItem>
                                            ))}
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
                                            {(plans || []).map(p => (
                                                <SelectItem key={p._id} value={p._id}>{p.name || `Plan ${p._id.slice(-4)}`}</SelectItem>
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
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">× ₹{selectedPlan.per_customer}</span>
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
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">× ₹{selectedPlan.per_staff}</span>
                                            </div>
                                        </div>
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
                                                <Label htmlFor="m-wa">WhatsApp (₹{selectedPlan.services?.whatsapp || 0})</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="m-em"
                                                    checked={services.email}
                                                    onCheckedChange={(c) => setServices(p => ({ ...p, email: !!c }))}
                                                />
                                                <Label htmlFor="m-em">Email (₹{selectedPlan.services?.email || 0})</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="m-vc"
                                                    checked={services.voice_call}
                                                    onCheckedChange={(c) => setServices(p => ({ ...p, voice_call: !!c }))}
                                                />
                                                <Label htmlFor="m-vc">Voice Call (₹{selectedPlan.services?.call || 0})</Label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-muted/50 p-4 rounded-lg flex justify-between items-center border">
                                        <div className="flex flex-col">
                                            <span className="font-semibold">Calculated Total:</span>
                                            <span className="text-xs text-muted-foreground">Incl. Base Price: ₹{selectedPlan.base_price || 0}</span>
                                        </div>
                                        <span className="font-bold text-2xl text-primary">₹{total}</span>
                                    </div>
                                </>
                            ) : (
                                <div className="h-40 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                                    Select a Plan Template to view pricing details
                                </div>
                            )}
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={() => onOpenChange(false)} disabled={!selectedPlan || !orgId}>Update Subscription</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
