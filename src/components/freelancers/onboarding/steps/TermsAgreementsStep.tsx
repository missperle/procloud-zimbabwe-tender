
import { FreelancerOnboardingFormData } from "@/hooks/useFreelancerOnboarding";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, FileText, Scale } from "lucide-react";

interface TermsAgreementsStepProps {
  formData: FreelancerOnboardingFormData;
  updateFormData: (data: Partial<FreelancerOnboardingFormData>) => void;
}

const TermsAgreementsStep = ({ formData, updateFormData }: TermsAgreementsStepProps) => {
  return (
    <div className="space-y-8">
      {/* Terms of Service */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Terms of Service
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48 rounded border p-4">
            <div className="space-y-4">
              <p>
                <strong>Welcome to proCloud!</strong> These Terms of Service ("Terms") govern your access to and use of our 
                platform, including any content, functionality, and services offered on or through our website.
              </p>
              <p>
                <strong>1. Acceptance of Terms</strong><br />
                By registering for an account, you accept and agree to be bound by these Terms.
              </p>
              <p>
                <strong>2. Freelancer Services</strong><br />
                As a freelancer on our platform, you agree to provide services in a professional and competent manner, 
                consistent with industry standards and client expectations.
              </p>
              <p>
                <strong>3. Fees and Payments</strong><br />
                You agree to our service fee structure, which is calculated as a percentage of your earnings from each project.
                Payment processing may take up to 7 business days after a client approves your work.
              </p>
              <p>
                <strong>4. Intellectual Property</strong><br />
                Unless otherwise agreed in writing, the intellectual property rights for work you create for clients 
                through our platform will transfer to the client upon full payment.
              </p>
              <p>
                <strong>5. Non-Circumvention</strong><br />
                You agree not to circumvent the platform by accepting direct work from clients you meet through our service 
                for a period of 24 months without paying the applicable platform fee.
              </p>
              <p>
                <strong>6. Account Termination</strong><br />
                We reserve the right to suspend or terminate your account if you violate these Terms or engage in 
                fraudulent or unprofessional behavior.
              </p>
              <p>
                <strong>7. Changes to Terms</strong><br />
                We may modify these Terms at any time. Continued use of the platform after such changes constitutes 
                acceptance of the new Terms.
              </p>
            </div>
          </ScrollArea>
          
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox 
              id="terms" 
              checked={formData.termsAccepted} 
              onCheckedChange={(checked) => updateFormData({ termsAccepted: checked as boolean })}
            />
            <Label htmlFor="terms" className="text-sm">
              I have read and agree to the Terms of Service
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Policy */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Privacy Policy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48 rounded border p-4">
            <div className="space-y-4">
              <p>
                <strong>Privacy Policy for proCloud</strong>
              </p>
              <p>
                This Privacy Policy describes how we collect, use, and disclose your personal information when you use our 
                freelancing platform.
              </p>
              <p>
                <strong>1. Information We Collect</strong><br />
                We collect information you provide when creating an account, including your name, email, professional 
                information, portfolio samples, and payment details. We may also collect information about your device, 
                location, and usage patterns.
              </p>
              <p>
                <strong>2. How We Use Your Information</strong><br />
                We use your information to:
                <br />• Provide, maintain, and improve our services
                <br />• Process transactions and send related information
                <br />• Match you with appropriate clients and projects
                <br />• Communicate with you about our services
                <br />• Monitor and analyze trends and usage
                <br />• Detect, investigate, and prevent fraudulent or illegal activities
              </p>
              <p>
                <strong>3. Information Sharing</strong><br />
                We may share your information with:
                <br />• Clients who may be interested in your services
                <br />• Service providers who perform services on our behalf
                <br />• Third parties if required by law or to protect our legal rights
              </p>
              <p>
                <strong>4. Your Rights and Choices</strong><br />
                You may access, update, or delete your account information at any time. You may also opt out of certain 
                communications and data collection features.
              </p>
              <p>
                <strong>5. Data Security</strong><br />
                We implement appropriate security measures to protect your personal information from unauthorized access 
                or disclosure.
              </p>
              <p>
                <strong>6. Changes to This Policy</strong><br />
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                policy on our platform.
              </p>
            </div>
          </ScrollArea>
          
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox 
              id="privacy" 
              checked={formData.privacyPolicyAccepted} 
              onCheckedChange={(checked) => updateFormData({ privacyPolicyAccepted: checked as boolean })}
            />
            <Label htmlFor="privacy" className="text-sm">
              I have read and agree to the Privacy Policy
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Tax Declaration */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Scale className="h-5 w-5 mr-2" />
            Tax Declaration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            As an independent freelancer, you are responsible for reporting and paying all applicable taxes on income 
            earned through our platform in accordance with the laws of your jurisdiction.
          </p>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="tax" 
              checked={formData.termsAccepted} 
              onCheckedChange={(checked) => updateFormData({ termsAccepted: checked as boolean })}
            />
            <Label htmlFor="tax" className="text-sm">
              I understand that I am responsible for my own tax obligations
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Warning if not all terms are accepted */}
      {(!formData.termsAccepted || !formData.privacyPolicyAccepted) && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-sm text-red-600 font-medium">
            You must accept both the Terms of Service and Privacy Policy to continue.
          </p>
        </div>
      )}
    </div>
  );
};

export default TermsAgreementsStep;
