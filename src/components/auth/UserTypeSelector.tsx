
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Briefcase, UserPlus } from "lucide-react";
import { Control } from "react-hook-form";

interface UserTypeSelectorProps {
  control: Control<any>;
  disabled?: boolean;
}

const UserTypeSelector = ({ control, disabled = false }: UserTypeSelectorProps) => {
  return (
    <FormField
      control={control}
      name="userType"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>I want to join as a</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
              disabled={disabled}
            >
              <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-slate-50">
                <RadioGroupItem value="client" id="client" />
                <label htmlFor="client" className="flex items-center gap-2 cursor-pointer font-medium">
                  <Briefcase className="h-5 w-5 text-indigo-ink" />
                  Client
                </label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-slate-50">
                <RadioGroupItem value="freelancer" id="freelancer" />
                <label htmlFor="freelancer" className="flex items-center gap-2 cursor-pointer font-medium">
                  <UserPlus className="h-5 w-5 text-indigo-ink" />
                  Freelancer
                </label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default UserTypeSelector;
