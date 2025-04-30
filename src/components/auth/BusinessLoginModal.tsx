
import { useState } from 'react';
import { DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from 'lucide-react';

const BusinessLoginModal = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyId, setCompanyId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Business login attempt', { email, companyId });
    // Business authentication logic would go here
  };

  return (
    <div className="w-full">
      <DialogHeader className="bg-amber-burst/20 p-6 rounded-t-lg">
        <DialogTitle className="text-2xl font-semibold">Business Login</DialogTitle>
        <DialogDescription>
          Sign in to access your business account and manage projects.
        </DialogDescription>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="business-email">Business Email</Label>
          <Input
            id="business-email"
            type="email"
            placeholder="your@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="business-password">Password</Label>
            <a href="#" className="text-xs text-amber-burst hover:underline">
              Forgot password?
            </a>
          </div>
          <Input
            id="business-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company-id">Company ID (Optional)</Label>
          <Input
            id="company-id"
            type="text"
            placeholder="Enter your company ID"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-amber-burst text-black hover:bg-amber-burst/90"
        >
          Sign in as Business
        </Button>
        
        <div className="mt-4 text-center text-sm">
          <span className="text-procloud-gray-500">Don't have a business account? </span>
          <a href="/signup/business" className="text-amber-burst hover:underline">
            Register your business
          </a>
        </div>
      </form>
    </div>
  );
};

export default BusinessLoginModal;
