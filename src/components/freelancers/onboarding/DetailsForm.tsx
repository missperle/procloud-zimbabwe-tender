
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const stepTwoSchema = z.object({
  location: z.string().min(2, { message: "Location must be at least 2 characters long" }),
  yearsExperience: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Years of experience must be a non-negative number",
  }),
});

export type StepTwoFormValues = z.infer<typeof stepTwoSchema>;

interface DetailsFormProps {
  form: UseFormReturn<StepTwoFormValues>;
  onSubmit: (data: StepTwoFormValues) => void;
  onBack: () => void;
  isLoading: boolean;
}

const DetailsForm = ({ form, onSubmit, onBack, isLoading }: DetailsFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
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
          control={form.control}
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
            onClick={onBack}
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
};

export default DetailsForm;
