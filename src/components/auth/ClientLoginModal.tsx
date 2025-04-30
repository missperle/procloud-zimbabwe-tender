
import { useState } from 'react';
import { DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from 'lucide-react';

const ClientLoginModal = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Client login attempt', { email });
    // Client authentication logic would go here
  };

  return (
    <div className="w-full">
      <DialogHeader className="bg-indigo-ink/20 p-6 rounded-t-lg">
        <DialogTitle className="text-2xl font-semibold text-indigo-ink">Client Login</DialogTitle>
        <DialogDescription>
          Sign in to access your client dashboard and projects.
        </DialogDescription>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="client-email">Email</Label>
          <Input
            id="client-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="client-password">Password</Label>
            <a href="#" className="text-xs text-indigo-ink hover:underline">
              Forgot password?
            </a>
          </div>
          <Input
            id="client-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-indigo-ink text-white hover:bg-indigo-dark"
        >
          Sign in as Client
        </Button>
        
        <div className="mt-4 text-center text-sm">
          <span className="text-procloud-gray-500">Don't have an account? </span>
          <a href="/signup" className="text-indigo-ink hover:underline">
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
};

export default ClientLoginModal;
