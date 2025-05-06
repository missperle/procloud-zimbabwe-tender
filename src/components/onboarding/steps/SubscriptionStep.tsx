
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: any;
}

interface SubscriptionStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const SubscriptionStep = ({ formData, updateFormData }: SubscriptionStepProps) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    formData.selectedPlan?.id || null
  );
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .order('price');

        if (error) throw error;
        
        setPlans(data || []);
        
        // If no plan is selected but plans are available, select the first one
        if (!selectedPlanId && data && data.length > 0) {
          setSelectedPlanId(data[0].id);
          updateFormData({ selectedPlan: data[0] });
        }
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
        toast({
          title: "Error",
          description: "Failed to load subscription plans",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionPlans();
  }, []);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlanId(plan.id);
    updateFormData({ selectedPlan: plan });
  };

  const getFeaturesList = (features: any) => {
    if (!features) return [];
    
    const featuresList = [];
    
    if (features.tokens) {
      featuresList.push(`${features.tokens} tokens per month`);
    }
    
    if (features.ai_assistance) {
      featuresList.push('AI Brief Building Assistant');
    }
    
    if (features.premium_features) {
      featuresList.push('Access to premium features');
    }
    
    if (features.dedicated_support) {
      featuresList.push('Dedicated customer support');
    }
    
    // Add default features that all plans have
    featuresList.push('Unlimited job postings');
    featuresList.push('Access to Zimbabwe freelancer network');
    
    return featuresList;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 border-4 border-t-procloud-green rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Choose Your Subscription Plan</h3>
        <p className="text-gray-500 mb-4">
          Select a subscription plan that best suits your business needs. You can change your plan at any time.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          const featuresList = getFeaturesList(plan.features);
          
          return (
            <Card
              key={plan.id}
              className={`p-6 cursor-pointer transition-all ${
                isSelected 
                  ? 'ring-2 ring-procloud-green border-procloud-green' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleSelectPlan(plan)}
            >
              <div className="relative">
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-procloud-green text-white rounded-full p-1">
                    <Check size={16} />
                  </div>
                )}
                
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold">${(plan.price / 100).toFixed(2)}</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <ul className="space-y-2">
                  {featuresList.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check size={16} className="mr-2 mt-1 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          );
        })}
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md mt-8">
        <h4 className="font-medium mb-2">Payment Information</h4>
        <p className="text-sm text-gray-600">
          You'll be asked to provide payment details after completing the onboarding process. 
          Your subscription will begin once your account is verified and approved.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionStep;
