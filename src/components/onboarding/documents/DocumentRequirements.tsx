
import { AlertCircle } from 'lucide-react';

const DocumentRequirements = () => {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-blue-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">Document Requirements</h3>
          <div className="mt-2 text-sm text-blue-700">
            <ul className="list-disc list-inside space-y-1">
              <li>Business registration documents must be valid and up-to-date</li>
              <li>Tax certificates should be from the current fiscal year</li>
              <li>ID documents must be government-issued and not expired</li>
              <li>All documents should be in PDF, JPG, or PNG format</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentRequirements;
