
export interface OnboardingFormData {
  companyName: string;
  tradingName: string;
  registrationNumber: string;
  taxId: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  documents: any[];
  selectedPlan: any;
}

export interface Step {
  id: number;
  name: string;
}

export const DEFAULT_ONBOARDING_STEPS: Step[] = [
  { id: 1, name: 'Company Info' },
  { id: 2, name: 'Contact Details' },
  { id: 3, name: 'Documents' },
  { id: 4, name: 'Subscription' },
  { id: 5, name: 'Finish' }
];

export const DEFAULT_FORM_DATA: OnboardingFormData = {
  companyName: '',
  tradingName: '',
  registrationNumber: '',
  taxId: '',
  address: {
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  },
  contact: {
    name: '',
    email: '',
    phone: ''
  },
  documents: [],
  selectedPlan: null
};
