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

// Contact types
export interface Contact {
  id: string;
  user_id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

// Debt Transaction types
export type DebtTransactionType = "debt" | "receivable";
export type DebtTransactionStatus = "active" | "closed";

export interface DebtTransaction {
  id: string;
  user_id: string;
  contact_id: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  contact_address?: string;
  contact_notes?: string;
  type: DebtTransactionType;
  amount: string;
  remaining_amount: string;
  due_date: string;
  description?: string | null;
  status: DebtTransactionStatus;
  created_at: string;
  updated_at: string;
}

// Payment types
export interface Payment {
  id: string;
  transaction_id: string;
  amount: string;
  payment_date: string;
  description?: string | null;
  created_at: string;
}

// Dashboard types
export interface DashboardData {
  today_due: DebtTransaction[];
  total_receivable: number;
  total_debt: number;
  net_position: number;
}

// Activity Log types
export interface ActivityLog {
  id: string;
  user_id: string;
  category: "contact" | "debt_transaction" | "payment";
  action: "created" | "updated" | "deleted";
  entity_type: string;
  entity_id: string | null;
  description: string | null;
  metadata: {
    contact_name?: string;
    amount?: string;
    payment_date?: string;
    transaction_type?: string;
    type?: string;
    type_label?: string;
  } | null;
  created_at: string;
}