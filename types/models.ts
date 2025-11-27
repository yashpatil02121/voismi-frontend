export interface User {
  id: string;
  org_id: string;
  name: string;
  email: string;
  status: "active" | "disabled";
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  tax_id: string;
  balance: number;
  created_at: string;
}

export interface OrganizationMember {
  id: string;
  org_id: string;
  user_id: string;
  role: "admin" | "member";
  status: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  transaction_id: string;
  organization_id: string;
  type: "credit" | "debit" | "upi";
  amount: number;
  note: string;
  created_at: string;
}

export interface Payment {
  id: string;
  organization_id: string;
  stripe_payment_intent_id: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed" | "refunded";
  created_at: string;
  updated_at: string;
}

export interface PhoneNumber {
  id: string;
  organization_id: string;
  user_id: string;
  telnyx_number_id: string;
  phone_number: string;
  created_at: string;
}

export interface WebRTCToken {
  id: string;
  user_id: string;
  organization_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}
