
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { Control } from "react-hook-form";

interface EmailFieldProps {
  control: Control<any>;
  disabled?: boolean;
}

const EmailField = ({ control, disabled = false }: EmailFieldProps) => {
  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <div className="relative">
              <Input 
                placeholder="your.email@example.com" 
                type="email" 
                className="pl-10" 
                disabled={disabled}
                {...field} 
              />
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EmailField;
