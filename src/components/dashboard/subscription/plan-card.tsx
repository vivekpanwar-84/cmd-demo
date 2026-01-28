import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Pencil } from "lucide-react";
import { SubscriptionPlan } from "@/types/subscription";

interface PlanCardProps {
    plan: SubscriptionPlan;
    onSelect?: (plan: SubscriptionPlan) => void;
    onEdit?: (plan: SubscriptionPlan) => void;
}

export function PlanCard({ plan, onEdit }: PlanCardProps) {
    // Helper to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };


    return (
        <Card className="w-full flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
                <CardTitle className="text-xl font-bold flex justify-between items-center">
                    <span>{plan.name || "Default Plan"}</span>
                    <Badge variant="secondary">Active</Badge>
                </CardTitle>
                <CardDescription>
                    Base Price: <span className="text-foreground font-semibold text-lg">{formatCurrency(plan.base_price)}</span> / month
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                {/* Usage Costs */}
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Usage Costs</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between border-b pb-1">
                            <span>Per Staff</span>
                            <span className="font-semibold">{formatCurrency(plan.per_staff)}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                            <span>Per Customer</span>
                            <span className="font-semibold">{formatCurrency(plan.per_customer)}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1 col-span-2">
                            <span>Per Invoice</span>
                            <span className="font-semibold">{formatCurrency(plan.per_invoice)}</span>
                        </div>
                    </div>
                </div>

                {/* Included Services */}
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Services Included</h4>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>Email: <strong>{formatCurrency(plan.services.email)}</strong> </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>SMS: <strong>{formatCurrency(plan.services.sms)}</strong> </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>WhatsApp: <strong>{formatCurrency(plan.services.whatsapp)}</strong> </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>Calls: <strong>{formatCurrency(plan.services.call)}</strong> </span>
                        </li>
                    </ul>
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" size="sm" onClick={() => onEdit?.(plan)}><Pencil></Pencil></Button>
            </CardFooter>
        </Card>
    );
}
