
import { LoyaltyTier, LoyaltyTierInfo, TokenStats } from "@/types/token";

export const LOYALTY_TIERS: Record<LoyaltyTier, LoyaltyTierInfo> = {
  Bronze: {
    name: "Bronze",
    requiredTokens: 0,
    benefits: ["Basic token usage", "Standard support"],
    color: "#CD7F32",
    icon: "award"
  },
  Silver: {
    name: "Silver",
    requiredTokens: 500,
    benefits: ["5% bonus tokens on purchases", "Priority support", "Extended brief visibility"],
    color: "#C0C0C0",
    icon: "award"
  },
  Gold: {
    name: "Gold",
    requiredTokens: 1000,
    benefits: ["10% bonus tokens on purchases", "Premium support", "Featured briefs", "Discounted boosts"],
    color: "#FFD700",
    icon: "award"
  },
  Platinum: {
    name: "Platinum",
    requiredTokens: 2500,
    benefits: ["15% bonus tokens on purchases", "Dedicated account manager", "Premium placement", "Free monthly boosts"],
    color: "#E5E4E2",
    icon: "medal"
  }
};

export const calculateLoyaltyTier = (lifetimePurchased: number): LoyaltyTier => {
  if (lifetimePurchased >= LOYALTY_TIERS.Platinum.requiredTokens) {
    return "Platinum";
  } else if (lifetimePurchased >= LOYALTY_TIERS.Gold.requiredTokens) {
    return "Gold";
  } else if (lifetimePurchased >= LOYALTY_TIERS.Silver.requiredTokens) {
    return "Silver";
  } else {
    return "Bronze";
  }
};

export const getNextTier = (currentStats: TokenStats): { name: LoyaltyTier; tokensNeeded: number } | undefined => {
  const currentTier = currentStats.loyaltyTier;
  
  if (currentTier === "Bronze") {
    return {
      name: "Silver",
      tokensNeeded: LOYALTY_TIERS.Silver.requiredTokens - currentStats.lifetimePurchased
    };
  } else if (currentTier === "Silver") {
    return {
      name: "Gold",
      tokensNeeded: LOYALTY_TIERS.Gold.requiredTokens - currentStats.lifetimePurchased
    };
  } else if (currentTier === "Gold") {
    return {
      name: "Platinum",
      tokensNeeded: LOYALTY_TIERS.Platinum.requiredTokens - currentStats.lifetimePurchased
    };
  }
  
  return undefined; // Already at highest tier
};

export const ACHIEVEMENTS = [
  {
    id: "first_brief",
    name: "First Brief",
    description: "Post your first project brief",
    icon: "star",
    reward: 10
  },
  {
    id: "five_briefs",
    name: "Regular Client",
    description: "Post 5 project briefs",
    icon: "star",
    reward: 25
  },
  {
    id: "first_hire",
    name: "First Hire",
    description: "Hire your first freelancer",
    icon: "users",
    reward: 15
  },
  {
    id: "first_referral",
    name: "Spread the Word",
    description: "Refer your first client",
    icon: "user-plus",
    reward: 50
  }
];

export const generateReferralCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'PV-';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};
