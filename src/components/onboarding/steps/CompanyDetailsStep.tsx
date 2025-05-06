
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CompanyDetailsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const CompanyDetailsStep = ({ formData, updateFormData }: CompanyDetailsStepProps) => {
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({
      address: {
        ...formData.address,
        [name]: value
      }
    });
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({
      contact: {
        ...formData.contact,
        [name]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Address & Contact</h3>
        <p className="text-gray-500 mb-4">
          Provide your company address and primary contact details.
        </p>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Physical Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              name="street"
              value={formData.address.street}
              onChange={handleAddressChange}
              placeholder="Street address or P.O. Box"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={formData.address.city}
              onChange={handleAddressChange}
              placeholder="City"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="state">State/Province</Label>
            <Input
              id="state"
              name="state"
              value={formData.address.state}
              onChange={handleAddressChange}
              placeholder="State or province"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="postalCode">Postal/ZIP Code</Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={formData.address.postalCode}
              onChange={handleAddressChange}
              placeholder="Postal or ZIP code"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={formData.address.country}
              onChange={handleAddressChange}
              placeholder="Country"
              className="mt-1"
            />
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Primary Contact Person</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.contact.name}
              onChange={handleContactChange}
              placeholder="Full name of primary contact"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.contact.email}
              onChange={handleContactChange}
              placeholder="Email address"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.contact.phone}
              onChange={handleContactChange}
              placeholder="Phone number"
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsStep;
