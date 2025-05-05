
import * as React from "react";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { UseFormRegister } from "react-hook-form";
import { BriefFormData } from "../BriefCreationForm";

interface DatePickerProps {
  id: keyof BriefFormData;  // Use keyof to ensure id is a valid field name
  value: string;
  onChange: (date: string) => void;
  register: UseFormRegister<BriefFormData>;
}

export function DatePicker({ id, value, onChange, register }: DatePickerProps) {
  // Register the field but handle the value manually
  register(id, { required: true });
  
  // Handle the date conversion
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      onChange(formattedDate);
    }
  };

  // Try to convert the string date to a Date object if it exists
  const selectedDate = value ? new Date(value) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {value ? (
            format(selectedDate!, "PPP")
          ) : (
            <span>Select deadline date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateChange}
          initialFocus
          disabled={(date) => date < new Date()} // Can't select dates in the past
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}
