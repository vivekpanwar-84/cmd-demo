import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SubscriptionPlan } from "@/types/subscription";
import { Mail, MessageSquare, Phone, MessageCircle, Pencil } from "lucide-react";

interface PlanListItemProps {
    plan: SubscriptionPlan;
    onSelect?: (plan: SubscriptionPlan) => void;
    onEdit?: (plan: SubscriptionPlan) => void;
}

export function PlanListItem({ plan, onSelect, onEdit }: PlanListItemProps) {
    // Helper to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div
            className="group flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer gap-4"
            onClick={() => onSelect?.(plan)}
        >
            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{plan.name || "Default Plan"}</h3>
                    <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                    <span>Base: <span className="text-foreground font-medium">{formatCurrency(plan.base_price)}</span></span>
                    <span>Staff: <span className="text-foreground font-medium">{formatCurrency(plan.per_staff)}</span></span>
                    <span>Cust: <span className="text-foreground font-medium">{formatCurrency(plan.per_customer)}</span></span>
                    <span>Inv: <span className="text-foreground font-medium">{formatCurrency(plan.per_invoice)}</span></span>
                </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">

                <div className="flex items-center gap-1" title="Emails">
                    <Mail className="w-4 h-4" />
                    <span>{plan.services.email}</span>
                </div>
                <div className="flex items-center gap-1" title="SMS">
                    <MessageSquare className="w-4 h-4" />
                    <span>{plan.services.sms}</span>
                </div>
                <div className="flex items-center gap-1" title="WhatsApp">
                    <MessageCircle className="w-4 h-4" />
                    <span>{plan.services.whatsapp}</span>
                </div>
                <div className="flex items-center gap-1" title="Calls">
                    <Phone className="w-4 h-4" />
                    <span>{plan.services.call}</span>
                </div>
            </div>

            <div>
                <Button variant="outline" size="sm" onClick={() => onEdit?.(plan)}><Pencil></Pencil></Button>
            </div>
        </div>
    );
}
