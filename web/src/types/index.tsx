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
  id: number;
  email: string;
  name: string;
  company_name?: string;
  subscription_type?: SubscriptionType;
  subscription_expires_at?: string | null;
  subscription?: SubscriptionStatus;
  created_at: string;
}