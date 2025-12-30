// Subscription types
export type SubscriptionType = "free" | "pro";

export interface SubscriptionStatus {
  canCreate: boolean;
  remaining: number | null;
  used?: number;
  limit: number | null;
  subscriptionType: SubscriptionType;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  phone: string;
  company_name?: string;
  subscription_type?: SubscriptionType;
  subscription_expires_at?: string | null;
  subscription?: {
    id: string;
    plan: {
      id: string;
      name: string;
      price: number;
    };
    status: string;
    start_date: string;
    end_date: string | null;
  };
  created_at: string;
}