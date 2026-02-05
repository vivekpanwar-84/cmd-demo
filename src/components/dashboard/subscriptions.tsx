"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRightLeft, List, LayoutGrid, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { CustomPlan } from "./subscription/custom-plan";
// import { CreatePlanDialog } from "./subscription/create-plan-dialog";
import { ActiveSubscriptions } from "./subscription/active-subscriptions";
import { DisablePlanDialog } from "./subscription/disable-plan-dialog";
import { AssignPlanDialog } from "./subscription/assign-plan-dialog";
import { pricingService } from "@/services/pricing.service";
import { SubscriptionPlan } from "@/types/subscription";
import { PlanCard } from "./subscription/plan-card";
import { PlanListItem } from "./subscription/plan-list-item";
import { EditPlanDialog } from "./subscription/edit-plan-dialog";

export function Subscriptions() {
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  const [showCreatePlan, setShowCreatePlan] = useState(false);

  // Plan List State
  const [showPlanList, setShowPlanList] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    if (showPlanList) {
      fetchPlans();
    }
  }, [showPlanList]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await pricingService.getAllPlans();
      setPlans(data || []);
    } catch (error) {
      console.error("Failed to fetch plans", error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(plans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPlans = plans.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto p-4 md:p-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plans & Subscriptions</h1>
          <p className="text-muted-foreground mt-1">Manage pricing plans and active organization subscriptions.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={showCreatePlan ? "default" : "outline"}
            onClick={() => {
              setShowCreatePlan(true);
              setShowPlanList(false);
            }}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Update Plan
          </Button>

          <Button
            variant={showPlanList ? "default" : "outline"}
            onClick={() => {
              setShowPlanList(true);
              setShowCreatePlan(false);
            }}
          >
            <List className="w-4 h-4 mr-2" />
            Plan List
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowAssignModal(true)}
          >
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Assign Plan
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 space-y-8">

          {showCreatePlan ? (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <CustomPlan onClose={() => {
                setShowCreatePlan(false);
                setShowPlanList(true);
              }} />
            </div>
          ) : showPlanList && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex justify-between items-center bg-card p-4 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold">Available Plans</h2>
                <div className="flex items-center gap-2">
                  {/* View Toggle */}
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <Button
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                      size="sm"
                      className="rounded-none h-8 w-8 p-0"
                      onClick={() => setViewMode('list')}
                      title="List View"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <div className="w-[1px] h-4 bg-border" />
                    <Button
                      variant={viewMode === 'card' ? 'secondary' : 'ghost'}
                      size="sm"
                      className="rounded-none h-8 w-8 p-0"
                      onClick={() => setViewMode('card')}
                      title="Card View"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center p-8">Loading plans...</div>
              ) : plans.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">No plans found.</div>
              ) : (
                <>
                  {viewMode === 'card' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentPlans.map((plan) => (
                        <PlanCard key={plan._id} plan={plan} onEdit={setEditingPlan} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentPlans.map((plan) => (
                        <PlanListItem key={plan._id} plan={plan} onEdit={setEditingPlan} />
                      ))}
                    </div>
                  )}

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          {/*  Subscribed Organizations plan list  */}
          {/* {showPlanList && (
            <div className="pt-8 border-t">
              <ActiveSubscriptions onUpdateClick={() => setShowAssignModal(true)} />
            </div>
          )} */}

        </div>
      </div>

      {/* Modals */}
      <DisablePlanDialog
        open={showDisableModal}
        onOpenChange={setShowDisableModal}
        onConfirm={() => setShowDisableModal(false)}
      />

      <AssignPlanDialog
        open={showAssignModal}
        onOpenChange={setShowAssignModal}
      />

      {editingPlan && (
        <EditPlanDialog
          open={!!editingPlan}
          onOpenChange={(open) => !open && setEditingPlan(null)}
          plan={editingPlan}
          onPlanUpdated={() => {
            fetchPlans();
            setEditingPlan(null);
          }}
        />
      )}
    </div>
  );
}