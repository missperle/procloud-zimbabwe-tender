
import { FreelancerOnboardingFormData } from "@/hooks/useFreelancerOnboarding";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  Bell, 
  BadgeCheck, 
  Shield, 
  Users
} from "lucide-react";

interface OptionalSettingsStepProps {
  formData: FreelancerOnboardingFormData;
  updateFormData: (data: Partial<FreelancerOnboardingFormData>) => void;
}

const OptionalSettingsStep = ({ formData, updateFormData }: OptionalSettingsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-green-700 mb-1">You're almost done!</h3>
        <p className="text-sm text-green-600">
          These optional settings can enhance your experience, but you can always adjust them later from your profile settings.
        </p>
      </div>

      {/* Project Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Project Alerts
          </CardTitle>
          <CardDescription>
            Get notified about new projects that match your skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="project-alerts" className="flex-1">
              Subscribe to project notifications
            </Label>
            <Switch
              id="project-alerts"
              checked={formData.subscribedToAlerts}
              onCheckedChange={(checked) => updateFormData({ subscribedToAlerts: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Increase your account security with an additional verification step
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="two-factor" className="flex-1">
              Enable two-factor authentication
            </Label>
            <Switch
              id="two-factor"
              checked={formData.twoFactorEnabled}
              onCheckedChange={(checked) => updateFormData({ twoFactorEnabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Premium Badge Program */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <BadgeCheck className="h-4 w-4 mr-2" />
            Premium Badge Program
          </CardTitle>
          <CardDescription>
            Stand out with a verified professional badge (requires additional verification)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 p-3 rounded-md mb-3">
            <p className="text-xs text-amber-700">
              The Premium Badge program requires identity verification and a skills assessment. 
              This helps clients identify top professionals in each field.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="premium-badge" className="flex-1">
              Apply for Premium Badge
            </Label>
            <Switch
              id="premium-badge"
              checked={false}
              disabled={true}
              // This would typically trigger a separate application process
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            You can apply for this after completing your profile
          </p>
        </CardContent>
      </Card>

      {/* Community Channels */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Freelancer Community
          </CardTitle>
          <CardDescription>
            Connect with other freelancers to share tips and collaborate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="community" className="flex-1">
              Join the freelancer community
            </Label>
            <Switch
              id="community"
              checked={false}
              disabled={true}
              // This would typically redirect to a community sign-up
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            You can join the community after completing your profile
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptionalSettingsStep;
