
export interface FreelancerOnboardingFormData {
  // Basic Profile
  profileImage: File | null;
  bio: string;
  title: string;
  
  // Skills & Service Categories
  skills: string[];
  industries: string[];
  serviceCategories: string[];
  
  // Portfolio
  portfolioItems: PortfolioItem[];
  
  // Rates & Availability
  hourlyRate: number;
  fixedPriceTiers: PriceTier[];
  timeZone: string;
  weeklyAvailability: WeeklyAvailability;
  responseTime: string;
  
  // Identity & Payment
  identityDocuments: File[];
  paymentMethod: PaymentMethod | null;
  
  // Terms & Agreements
  termsAccepted: boolean;
  privacyPolicyAccepted: boolean;
  
  // Optional Extras
  twoFactorEnabled: boolean;
  subscribedToAlerts: boolean;
}

export interface PortfolioItem {
  id: string;
  type: 'image' | 'pdf' | 'url' | 'code';
  content: string | File;
  description: string;
  role: string;
  outcome: string;
}

export interface PriceTier {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface WeeklyAvailability {
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
}

export interface DayAvailability {
  available: boolean;
  startTime?: string;
  endTime?: string;
}

export interface PaymentMethod {
  type: 'paypal' | 'bank_transfer' | 'stripe' | 'paynow' | 'other';
  details: any;
}

export interface Step {
  id: number;
  name: string;
  description: string;
  isRequired: boolean;
}

export const DEFAULT_FREELANCER_ONBOARDING_STEPS: Step[] = [
  { 
    id: 1, 
    name: 'Basic Profile', 
    description: 'Upload a photo and tell us about yourself',
    isRequired: true
  },
  { 
    id: 2, 
    name: 'Skills & Services', 
    description: 'Tell us what you can do',
    isRequired: true
  },
  { 
    id: 3, 
    name: 'Portfolio', 
    description: 'Showcase your past work',
    isRequired: true
  },
  { 
    id: 4, 
    name: 'Rates & Availability', 
    description: 'Set your pricing and working hours',
    isRequired: true
  },
  { 
    id: 5, 
    name: 'Identity & Payment', 
    description: 'Verify your identity and set up payments',
    isRequired: true
  },
  { 
    id: 6, 
    name: 'Terms & Agreements', 
    description: 'Review and accept our policies',
    isRequired: true
  },
  { 
    id: 7, 
    name: 'Optional Settings', 
    description: 'Configure additional options',
    isRequired: false
  }
];

export const DEFAULT_FREELANCER_FORM_DATA: FreelancerOnboardingFormData = {
  // Basic Profile
  profileImage: null,
  bio: '',
  title: '',
  
  // Skills & Service Categories
  skills: [],
  industries: [],
  serviceCategories: [],
  
  // Portfolio
  portfolioItems: [],
  
  // Rates & Availability
  hourlyRate: 0,
  fixedPriceTiers: [],
  timeZone: '',
  weeklyAvailability: {
    monday: { available: true },
    tuesday: { available: true },
    wednesday: { available: true },
    thursday: { available: true },
    friday: { available: true },
    saturday: { available: false },
    sunday: { available: false }
  },
  responseTime: '24 hours',
  
  // Identity & Payment
  identityDocuments: [],
  paymentMethod: null,
  
  // Terms & Agreements
  termsAccepted: false,
  privacyPolicyAccepted: false,
  
  // Optional Extras
  twoFactorEnabled: false,
  subscribedToAlerts: false,
};
