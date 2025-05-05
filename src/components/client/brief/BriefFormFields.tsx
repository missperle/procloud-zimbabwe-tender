
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BriefFormData } from "../BriefCreationForm";

interface BriefFormFieldsProps {
  register: UseFormRegister<BriefFormData>;
  watch: UseFormWatch<BriefFormData>;
}

const BriefFormFields = ({ register, watch }: BriefFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <Input
          id="title"
          className="col-span-3"
          {...register("title", { required: true })}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="original_description" className="text-right">
          Description
        </Label>
        <Textarea
          id="original_description"
          className="col-span-3 min-h-[80px]"
          {...register("original_description", { required: true })}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="budget" className="text-right">
          Budget
        </Label>
        <Input
          id="budget"
          placeholder="$1000"
          className="col-span-3"
          {...register("budget", { required: true })}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="deadline" className="text-right">
          Deadline
        </Label>
        <Input
          id="deadline"
          type="date"
          className="col-span-3"
          {...register("deadline", { required: true })}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Category
        </Label>
        <select
          id="category"
          className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          {...register("category", { required: true })}
        >
          <option value="design">Design</option>
          <option value="development">Development</option>
          <option value="marketing">Marketing</option>
          <option value="writing">Writing & Translation</option>
          <option value="video">Video & Animation</option>
        </select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="attachments" className="text-right">
          Attachments
        </Label>
        <Input
          id="attachments"
          type="file"
          multiple
          className="col-span-3"
        />
      </div>
      <input 
        type="hidden" 
        id="attachment_url" 
        {...register("attachment_url")} 
      />
    </>
  );
};

export default BriefFormFields;
