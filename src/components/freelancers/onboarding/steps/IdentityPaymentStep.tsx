
import { useState } from "react";
import { FreelancerOnboardingFormData, PaymentMethod } from "@/hooks/useFreelancerOnboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  CreditCard, 
  Bank, 
  DollarSign
} from "lucide-react";

interface IdentityPaymentStepProps {
  formData: FreelancerOnboardingFormData;
  updateFormData: (data: Partial<FreelancerOnboardingFormData>) => void;
}

const IdentityPaymentStep = ({ formData, updateFormData }: IdentityPaymentStepProps) => {
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("id");
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentMethod["type"]>(
    formData.paymentMethod?.type || "paypal"
  );

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      updateFormData({
        identityDocuments: [...formData.identityDocuments, ...files]
      });
    }
  };

  const handleRemoveDocument = (index: number) => {
    const newDocs = [...formData.identityDocuments];
    newDocs.splice(index, 1);
    updateFormData({ identityDocuments: newDocs });
  };

  const handlePaymentMethodChange = (type: PaymentMethod["type"]) => {
    setSelectedPaymentType(type);
    updateFormData({
      paymentMethod: { type, details: {} }
    });
  };

  const handlePaymentDetailsChange = (details: any) => {
    updateFormData({
      paymentMethod: {
        ...formData.paymentMethod!,
        details
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Identity Verification */}
      <div>
        <h3 className="text-lg font-medium mb-4">Identity Verification (Optional)</h3>
        
        <div className="bg-amber-50 p-4 rounded-md mb-6">
          <p className="text-sm text-amber-700">
            Verifying your identity helps build trust with clients and may make you eligible for featured freelancer status. 
            Your documents are securely stored and only used for verification purposes.
          </p>
        </div>

        <Tabs defaultValue="id" onValueChange={setSelectedDocumentType}>
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="id">ID Card</TabsTrigger>
            <TabsTrigger value="passport">Passport</TabsTrigger>
            <TabsTrigger value="license">Driver's License</TabsTrigger>
          </TabsList>
          
          <TabsContent value="id" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upload ID Card</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleDocumentUpload}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Please upload a clear image of both sides of your ID card
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="passport" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upload Passport</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleDocumentUpload}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Please upload a clear image of your passport's photo page
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="license" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upload Driver's License</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleDocumentUpload}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Please upload a clear image of both sides of your driver's license
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {formData.identityDocuments.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Uploaded Documents</h4>
            <ul className="space-y-2">
              {formData.identityDocuments.map((doc, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm">{doc.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveDocument(index)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <div>
        <h3 className="text-lg font-medium mb-4">Payment Method (Required)</h3>
        
        <RadioGroup 
          value={selectedPaymentType} 
          onValueChange={(value) => handlePaymentMethodChange(value as PaymentMethod["type"])}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex">
            <RadioGroupItem value="paypal" id="paypal" className="sr-only" />
            <Label 
              htmlFor="paypal" 
              className={`flex flex-col items-center justify-center border rounded-lg p-4 w-full cursor-pointer hover:bg-gray-50 ${selectedPaymentType === 'paypal' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
            >
              <DollarSign className="h-6 w-6 mb-2" />
              <span className="font-medium">PayPal</span>
            </Label>
          </div>
          
          <div className="flex">
            <RadioGroupItem value="bank_transfer" id="bank_transfer" className="sr-only" />
            <Label 
              htmlFor="bank_transfer" 
              className={`flex flex-col items-center justify-center border rounded-lg p-4 w-full cursor-pointer hover:bg-gray-50 ${selectedPaymentType === 'bank_transfer' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
            >
              <Bank className="h-6 w-6 mb-2" />
              <span className="font-medium">Bank Transfer</span>
            </Label>
          </div>
          
          <div className="flex">
            <RadioGroupItem value="stripe" id="stripe" className="sr-only" />
            <Label 
              htmlFor="stripe" 
              className={`flex flex-col items-center justify-center border rounded-lg p-4 w-full cursor-pointer hover:bg-gray-50 ${selectedPaymentType === 'stripe' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
            >
              <CreditCard className="h-6 w-6 mb-2" />
              <span className="font-medium">Stripe</span>
            </Label>
          </div>
          
          <div className="flex">
            <RadioGroupItem value="paynow" id="paynow" className="sr-only" />
            <Label 
              htmlFor="paynow" 
              className={`flex flex-col items-center justify-center border rounded-lg p-4 w-full cursor-pointer hover:bg-gray-50 ${selectedPaymentType === 'paynow' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
            >
              <CreditCard className="h-6 w-6 mb-2" />
              <span className="font-medium">PayNow</span>
            </Label>
          </div>
        </RadioGroup>
        
        {/* PayPal Details */}
        {selectedPaymentType === 'paypal' && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg">
            <Label className="block mb-2">PayPal Email</Label>
            <Input 
              type="email"
              placeholder="your-email@example.com"
              value={formData.paymentMethod?.details?.email || ''}
              onChange={(e) => handlePaymentDetailsChange({ email: e.target.value })}
            />
          </div>
        )}
        
        {/* Bank Transfer Details */}
        {selectedPaymentType === 'bank_transfer' && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg space-y-4">
            <div>
              <Label className="block mb-2">Bank Name</Label>
              <Input 
                placeholder="Enter your bank name"
                value={formData.paymentMethod?.details?.bankName || ''}
                onChange={(e) => handlePaymentDetailsChange({ 
                  ...formData.paymentMethod?.details,
                  bankName: e.target.value 
                })}
              />
            </div>
            <div>
              <Label className="block mb-2">Account Holder Name</Label>
              <Input 
                placeholder="Enter the account holder name"
                value={formData.paymentMethod?.details?.accountName || ''}
                onChange={(e) => handlePaymentDetailsChange({ 
                  ...formData.paymentMethod?.details,
                  accountName: e.target.value 
                })}
              />
            </div>
            <div>
              <Label className="block mb-2">Account Number</Label>
              <Input 
                placeholder="Enter your account number"
                value={formData.paymentMethod?.details?.accountNumber || ''}
                onChange={(e) => handlePaymentDetailsChange({ 
                  ...formData.paymentMethod?.details,
                  accountNumber: e.target.value 
                })}
              />
            </div>
            <div>
              <Label className="block mb-2">Routing/Swift Number</Label>
              <Input 
                placeholder="Enter routing or SWIFT code"
                value={formData.paymentMethod?.details?.routingNumber || ''}
                onChange={(e) => handlePaymentDetailsChange({ 
                  ...formData.paymentMethod?.details,
                  routingNumber: e.target.value 
                })}
              />
            </div>
          </div>
        )}
        
        {/* Simplified detail fields for other methods */}
        {(selectedPaymentType === 'stripe' || selectedPaymentType === 'paynow') && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg">
            <Label className="block mb-2">
              {selectedPaymentType === 'stripe' ? 'Email for Stripe' : 'PayNow ID (Phone/UEN)'}
            </Label>
            <Input 
              placeholder={selectedPaymentType === 'stripe' ? "your-email@example.com" : "Phone number or UEN"}
              value={formData.paymentMethod?.details?.identifier || ''}
              onChange={(e) => handlePaymentDetailsChange({ identifier: e.target.value })}
            />
          </div>
        )}
        
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Your payment details are securely stored and used only for processing payments.
            You can update your payment method at any time from your account settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IdentityPaymentStep;
