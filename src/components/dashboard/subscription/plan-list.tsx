import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { SubscriptionPlan } from "@/types/subscription";

// Helper to map dummy data to SubscriptionPlan type if needed, or just use `any` for the transition
// The DUMMY_PLANS structure is slightly different from SubscriptionPlan.
// I will adjust the usage or the dummy data.

const DUMMY_PLANS = [
    {
        _id: "1", // Changed from id: number to _id: string to match SubscriptionPlan
        name: "Standard Plan",
        base_price: 500, // Added base_price
        per_customer: 5, // Renamed from custPrice
        per_staff: 8, // Renamed from staffPrice
        per_invoice: 200, // Using monthly as default per_invoice
        services: { email: 10, sms: 5, whatsapp: 15, call: 20 }, // Added services
        // invoices: { weekly: 50, monthly: 200, yearly: 1000 }, // Keeping for UI display if needed, but not in type
        status: "Active"
    },
    {
        _id: "2",
        name: "Enterprise Plus",
        base_price: 1000,
        per_customer: 10,
        per_staff: 15,
        per_invoice: 400,
        services: { email: 20, sms: 10, whatsapp: 30, call: 40 },
        status: "Active"
    },
];

interface PlanListProps {
    onEdit?: (plan: SubscriptionPlan) => void;
}

export function PlanList({ onEdit }: PlanListProps) {
    return (
        <div className="border rounded-lg shadow-sm bg-card">
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold text-lg">Created Plans</h3>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Plan Name</TableHead>
                        <TableHead>Unit Prices</TableHead>
                        <TableHead>Invoice Prices (Base)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {DUMMY_PLANS.map((plan) => (
                        <TableRow key={plan._id}>
                            <TableCell className="font-medium">{plan.name}</TableCell>
                            <TableCell>
                                <div className="text-sm">
                                    <span className="text-muted-foreground text-xs">Cust:</span> ₹{plan.per_customer}
                                </div>
                                <div className="text-sm">
                                    <span className="text-muted-foreground text-xs">Staff:</span> ₹{plan.per_staff}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2 flex-wrap max-w-[200px]">
                                    {/* Just showing base price now since structure changed */}
                                    <Badge variant="outline" className="text-xs">Base: ₹{plan.base_price}</Badge>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 shadow-none">
                                    {plan.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => onEdit?.(plan as unknown as SubscriptionPlan)}
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
