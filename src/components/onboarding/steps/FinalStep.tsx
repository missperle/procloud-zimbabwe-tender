
import { CheckCircle } from 'lucide-react';

const FinalStep = () => {
  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      
      <h2 className="mt-6 text-2xl font-bold text-gray-900">Almost There!</h2>
      
      <div className="mt-4 text-gray-600">
        <p className="mb-4">
          Thank you for completing your onboarding information. Our team will review your documents shortly.
        </p>
        <p className="mb-4">
          You'll receive an email notification when your account has been verified. This usually takes 1-2 business days.
        </p>
        <p>
          In the meantime, you can explore the platform and prepare your first project brief.
        </p>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-md text-left">
        <h3 className="text-md font-medium text-blue-800">What happens next?</h3>
        <ol className="mt-2 list-decimal list-inside text-blue-700 space-y-1">
          <li>Our verification team reviews your submitted documents</li>
          <li>Your account is verified and activated</li>
          <li>You can start posting projects and hiring freelancers</li>
          <li>Your subscription billing begins after verification</li>
        </ol>
      </div>
    </div>
  );
};

export default FinalStep;
