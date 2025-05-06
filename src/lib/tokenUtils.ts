
// Token utility functions
import { LoyaltyTier, LoyaltyTierInfo, TokenStats } from '@/types/token';

// Define tier thresholds
export const LOYALTY_TIERS: Record<LoyaltyTier, LoyaltyTierInfo> = {
  Bronze: {
    name: 'Bronze',
    requiredTokens: 0,
    benefits: [
      'Access to all basic features',
      'Standard support response time'
    ],
    color: '#CD7F32',
    icon: 'medal'
  },
  Silver: {
    name: 'Silver',
    requiredTokens: 500,
    benefits: [
      'Access to all basic features',
      'Priority support response',
      '5% discount on token purchases'
    ],
    color: '#C0C0C0',
    icon: 'award'
  },
  Gold: {
    name: 'Gold',
    requiredTokens: 1500,
    benefits: [
      'Access to all premium features',
      'Fast-track support',
      '10% discount on token purchases',
      'Early access to new features'
    ],
    color: '#FFD700',
    icon: 'trophy'
  },
  Platinum: {
    name: 'Platinum',
    requiredTokens: 5000,
    benefits: [
      'Access to all premium features',
      'VIP support with dedicated manager',
      '15% discount on token purchases',
      'Early access to new features',
      'Custom branding options'
    ],
    color: '#E5E4E2',
    icon: 'diamond'
  }
};

// Calculate loyalty tier based on lifetime tokens purchased
export const calculateLoyaltyTier = (lifetimePurchased: number): LoyaltyTier => {
  if (lifetimePurchased >= LOYALTY_TIERS.Platinum.requiredTokens) {
    return 'Platinum';
  } else if (lifetimePurchased >= LOYALTY_TIERS.Gold.requiredTokens) {
    return 'Gold';
  } else if (lifetimePurchased >= LOYALTY_TIERS.Silver.requiredTokens) {
    return 'Silver';
  } else {
    return 'Bronze';
  }
};

// Calculate next tier information
export const getNextTier = (stats: Partial<TokenStats>): { name: LoyaltyTier, tokensNeeded: number } | null => {
  const { lifetimePurchased } = stats;
  
  if (!lifetimePurchased) return { name: 'Silver', tokensNeeded: LOYALTY_TIERS.Silver.requiredTokens };
  
  if (lifetimePurchased < LOYALTY_TIERS.Silver.requiredTokens) {
    return {
      name: 'Silver',
      tokensNeeded: LOYALTY_TIERS.Silver.requiredTokens - lifetimePurchased
    };
  } else if (lifetimePurchased < LOYALTY_TIERS.Gold.requiredTokens) {
    return {
      name: 'Gold',
      tokensNeeded: LOYALTY_TIERS.Gold.requiredTokens - lifetimePurchased
    };
  } else if (lifetimePurchased < LOYALTY_TIERS.Platinum.requiredTokens) {
    return {
      name: 'Platinum',
      tokensNeeded: LOYALTY_TIERS.Platinum.requiredTokens - lifetimePurchased
    };
  }
  
  return null; // Already at highest tier
};

// Token pricing
export const TOKEN_PACKAGES = [
  { id: 'starter', tokens: 150, price: 1500, popular: false, description: 'Perfect for small projects' },
  { id: 'standard', tokens: 350, price: 3000, popular: true, description: 'Most popular choice' },
  { id: 'power', tokens: 800, price: 6000, popular: false, description: 'Best value for money' },
  { id: 'premium', tokens: 2000, price: 12000, popular: false, description: 'For professional users' }
];

// Get price per token (discounted based on tier)
export const getPricePerToken = (tier: LoyaltyTier, packageId: string): number => {
  const tokenPackage = TOKEN_PACKAGES.find(pkg => pkg.id === packageId);
  if (!tokenPackage) return 0;
  
  const basePrice = tokenPackage.price / tokenPackage.tokens;
  
  // Apply tier discounts
  let discount = 0;
  if (tier === 'Silver') discount = 0.05;
  else if (tier === 'Gold') discount = 0.10;
  else if (tier === 'Platinum') discount = 0.15;
  
  return basePrice * (1 - discount);
};

// Format a number as currency
export const formatCurrency = (amount: number): string => {
  return `$${(amount / 100).toFixed(2)}`;
};
