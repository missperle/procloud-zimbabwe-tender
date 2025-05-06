
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ChevronRight } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const stepOneSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters long" }),
  hourlyRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Hourly rate must be a positive number",
  }),
});

export type StepOneFormValues = z.infer<typeof stepOneSchema>;

interface BasicInfoFormProps {
  form: UseFormReturn<StepOneFormValues>;
  onSubmit: (data: StepOneFormValues) => void;
}

const BasicInfoForm = ({ form, onSubmit }: BasicInfoFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
};

export default BasicInfoForm;
