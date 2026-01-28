import api from "@/lib/axios";
import { ApiResponsePlans, SubscriptionPlan } from "@/types/subscription";

export const pricingService = {
    getAllPlans: async (): Promise<SubscriptionPlan[]> => {
        // The user specified /admin/pricing
        const response = await api.get<ApiResponsePlans<SubscriptionPlan[] | SubscriptionPlan>>("/admin/pricing");
        const data = response.data.data;

        if (Array.isArray(data)) {
            return data;
        } else if (data && typeof data === 'object') {
            // If it's a single object, wrap it in an array
            return [data as SubscriptionPlan];
        }

        return [];
    },
    updatePlan: async (id: string, data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> => {
        const response = await api.put<ApiResponsePlans<SubscriptionPlan>>(`/admin/pricing`, data);
        return response.data.data;
    },
};
