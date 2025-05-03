
export interface TokenTransaction {
  id: string;
  amount: number;
  type: "purchase" | "usage" | "reward" | "referral";
  description: string;
  timestamp: Date;
  status: "completed" | "pending" | "failed";
}

export type LoyaltyTier = "Bronze" | "Silver" | "Gold" | "Platinum";

export interface LoyaltyTierInfo {
  name: LoyaltyTier;
  requiredTokens: number;
  benefits: string[];
  color: string;
  icon: string;
}

export interface TokenStats {
  lifetimePurchased: number;
  lifetimeUsed: number;
  currentBalance: number;
  loyaltyTier: LoyaltyTier;
  nextTier?: {
    name: LoyaltyTier;
    tokensNeeded: number;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  progress?: {
    current: number;
    target: number;
  };
  reward?: number;
  icon: string;
}

export interface Referral {
  code: string;
  usageCount: number;
  tokensEarned: number;
}

export interface Subscription {
  id: string;
  userId: string;
  tier: 'free' | 'basic' | 'pro';
  status: 'active' | 'canceled' | 'past_due' | 'pending';
  currentPeriodEnd: Date | null;
  paymentMethod: 'card' | 'cash' | null;
  createdAt: Date;
}
