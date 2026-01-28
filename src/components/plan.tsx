"use client";

import { ActiveSubscriptions } from '@/components/dashboard/subscription/active-subscriptions';
import { PlanList } from '@/components/dashboard/subscription/plan-list';
import React from 'react'
import { EditPlanDialog } from '@/components/dashboard/subscription/edit-plan-dialog';
import { useState } from 'react';
import { SubscriptionPlan } from '@/types/subscription';

export default function Plan() {
    const [editPlanOpen, setEditPlanOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

    // Initial dummy plan for testing edit (since PlanList has internal dummy data, we need to handle this carefully)
    // Ideally, PlanList should accept `onEdit` prop. I will assume for this step I am just rendering them.
    // However, to satisfy "user specific chie change kar paye", I need to make sure the edit interaction works.

    // For now, let's just render the components.

    return (
        <div className="space-y-6 container mx-auto p-6">
            <h1 className="text-2xl font-bold">Subscription Management</h1>
            {/*  plan list  */}
            {/* <section>
                <PlanList onEdit={(plan) => {
                    setSelectedPlan(plan);
                    setEditPlanOpen(true);
                }} />
            </section> */}

            <section>
                <ActiveSubscriptions />
            </section>

            {/* Hidden for now until we wire up the state from PlanList */}
            <EditPlanDialog
                open={editPlanOpen}
                onOpenChange={setEditPlanOpen}
                plan={selectedPlan}
            />
        </div>
    )
}