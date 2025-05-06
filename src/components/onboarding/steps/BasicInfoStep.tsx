
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BasicInfoStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const BasicInfoStep = ({ formData, updateFormData }: BasicInfoStepProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Company Information</h3>
        <p className="text-gray-500 mb-4">
          Let us know about your business by providing these essential details.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="companyName">Company Name <span className="text-red-500">*</span></Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Legal company name"
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="tradingName">Trading Name (if different)</Label>
            <Input
              id="tradingName"
              name="tradingName"
              value={formData.tradingName}
              onChange={handleInputChange}
              placeholder="Name you trade under if different"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="registrationNumber">Company Registration Number</Label>
            <Input
              id="registrationNumber"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleInputChange}
              placeholder="e.g. 12345678"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="taxId">Tax ID</Label>
            <Input
              id="taxId"
              name="taxId"
              value={formData.taxId}
              onChange={handleInputChange}
              placeholder="VAT/Tax identification number"
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
