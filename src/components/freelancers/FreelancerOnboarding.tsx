
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Check, ChevronRight, UserCircle } from "lucide-react";

const stepOneSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters long" }),
  hourlyRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Hourly rate must be a positive number",
  }),
});

const stepTwoSchema = z.object({
  location: z.string().min(2, { message: "Location must be at least 2 characters long" }),
  yearsExperience: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Years of experience must be a non-negative number",
  }),
});

type StepOneFormValues = z.infer<typeof stepOneSchema>;
type StepTwoFormValues = z.infer<typeof stepTwoSchema>;

const FreelancerOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const stepOneForm = useForm<StepOneFormValues>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      title: "",
      bio: "",
      hourlyRate: "",
    },
  });

  const stepTwoForm = useForm<StepTwoFormValues>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      location: "",
      yearsExperience: "",
    },
  });

  const handleStepOneSubmit = (data: StepOneFormValues) => {
    setCurrentStep(2);
  };

  const handleStepTwoSubmit = async (data: StepTwoFormValues) => {
    if (!currentUser) return;
    
    setIsLoading(true);
    
    try {
      // Update freelancer profile
      const { error } = await supabase
        .from('freelancer_profiles')
        .upsert({
          id: currentUser.id,
          title: stepOneForm.getValues().title,
          bio: stepOneForm.getValues().bio,
          hourly_rate: parseFloat(stepOneForm.getValues().hourlyRate),
          location: data.location,
          years_experience: parseInt(data.yearsExperience),
        });
        
      if (error) throw error;
      
      // Update onboarding status
      const { error: updateError } = await supabase
        .from('users')
        .update({ onboarding_completed: true })
        .eq('id', currentUser.id);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Profile Updated",
        description: "Your freelancer profile has been created successfully.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepOne = () => (
    <Form {...stepOneForm}>
      <form onSubmit={stepOneForm.handleSubmit(handleStepOneSubmit)} className="space-y-4">
        <FormField
          control={stepOneForm.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Full Stack Developer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={stepOneForm.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell clients about your experience, skills, and expertise..." 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={stepOneForm.control}
          name="hourlyRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hourly Rate ($)</FormLabel>
              <FormControl>
                <Input type="number" min="1" placeholder="25" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">
          Continue <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );

  const renderStepTwo = () => (
    <Form {...stepTwoForm}>
      <form onSubmit={stepTwoForm.handleSubmit(handleStepTwoSubmit)} className="space-y-4">
        <FormField
          control={stepTwoForm.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Harare, Zimbabwe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={stepTwoForm.control}
          name="yearsExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-4 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setCurrentStep(1)}
            className="flex-1"
          >
            Back
          </Button>
          <Button 
            type="submit" 
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Complete Setup"}
          </Button>
        </div>
      </form>
    </Form>
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Set Up Your Freelancer Profile</CardTitle>
        <CardDescription>
          Complete your profile to start receiving job opportunities
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between mb-8">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 1 ? "bg-procloud-green border-procloud-green text-white" : "border-gray-300"
            }`}>
              {currentStep > 1 ? <Check className="h-5 w-5" /> : "1"}
            </div>
            <span className="text-xs mt-1">Basic Info</span>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className={`h-0.5 w-full ${currentStep > 1 ? "bg-procloud-green" : "bg-gray-200"}`}></div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              currentStep >= 2 ? "bg-procloud-green border-procloud-green text-white" : "border-gray-300"
            }`}>
              {currentStep > 2 ? <Check className="h-5 w-5" /> : "2"}
            </div>
            <span className="text-xs mt-1">Details</span>
          </div>
        </div>
        
        {currentStep === 1 && renderStepOne()}
        {currentStep === 2 && renderStepTwo()}
      </CardContent>
    </Card>
  );
};

export default FreelancerOnboarding;
