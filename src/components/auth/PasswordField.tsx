
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Control } from "react-hook-form";

interface PasswordFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  showToggle?: boolean;
  showPasswordState?: boolean;
  onTogglePassword?: () => void;
  disabled?: boolean;
}

const PasswordField = ({ 
  control, 
  name, 
  label, 
  showToggle = false, 
  showPasswordState = false,
  onTogglePassword,
  disabled = false
}: PasswordFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input 
                placeholder="••••••••" 
                type={showPasswordState ? "text" : "password"} 
                className="pl-10" 
                disabled={disabled}
                {...field} 
              />
              {showToggle && (
                <button 
                  type="button"
                  onClick={onTogglePassword}
                  className="absolute right-3 top-2.5 text-gray-400"
                >
                  {showPasswordState ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PasswordField;
