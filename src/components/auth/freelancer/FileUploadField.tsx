
import { useState } from "react";
import { FormLabel } from "@/components/ui/form";
import { UploadCloud } from "lucide-react";
import { MAX_FILE_SIZE } from "./FreelancerSignupSchema";

interface FileUploadFieldProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  label: string;
  acceptTypes?: string;
}

const FileUploadField = ({
  file,
  onFileChange,
  label,
  acceptTypes = ".pdf",
}: FileUploadFieldProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <div className="border border-input rounded-md p-2">
        <label className="flex items-center justify-center gap-2 cursor-pointer h-20 rounded-md border border-dashed border-gray-300 px-6 text-sm hover:bg-gray-50">
          <UploadCloud className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">
            {file ? file.name : `Upload PDF (max ${MAX_FILE_SIZE / (1024 * 1024)}MB)`}
          </span>
          <input
            type="file"
            accept={acceptTypes}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default FileUploadField;
