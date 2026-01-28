export interface PlanServices {
  email: number;
  sms: number;
  whatsapp: number;
  call: number;
}

export interface SubscriptionPlan {
  _id: string;
  base_price: number;
  per_staff: number;
  per_customer: number;
  per_invoice: number;
  services: PlanServices;
  __v?: number;
  name?: string; // Optional, might need to be derived or added if backend provides it
  description?: string; // Optional
}

export interface ApiResponsePlans<T> {
  success: boolean;
  data: T;
}
