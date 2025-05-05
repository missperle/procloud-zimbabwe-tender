
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";

// Define job categories
const JOB_CATEGORIES = [
  { id: "design", label: "Design" },
  { id: "uiux", label: "UI/UX" },
  { id: "branding", label: "Branding" },
  { id: "webdev", label: "Web Development" },
  { id: "mobiledev", label: "Mobile Development" },
  { id: "marketing", label: "Marketing" },
  { id: "seo", label: "SEO" },
  { id: "contentwriting", label: "Content Writing" },
];

// Validation schema for the phone verification form
const verificationSchema = z.object({
  otp: z.string().length(6, {
    message: "Verification code must be 6 digits.",
  }),
});

const WhatsAppSettings = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappOptIn, setWhatsappOptIn] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const form = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      otp: "",
    },
  });

  // In a real implementation, we'd fetch this data from Firestore
  useEffect(() => {
    // Simulating data fetch from Firestore
    // In production, we'd use something like:
    // const fetchUserPreferences = async () => {
    //   if (currentUser) {
    //     const userDoc = await getDoc(doc(db, "users", currentUser.uid));
    //     if (userDoc.exists()) {
    //       const userData = userDoc.data();
    //       setPhoneNumber(userData.phone || "");
    //       setWhatsappOptIn(userData.whatsappOptIn || false);
    //       setSelectedCategories(userData.preferences || []);
    //       setPhoneVerified(userData.phoneVerified || false);
    //     }
    //   }
    // };
    // fetchUserPreferences();

    // For demo purposes, we'll use mock data
    setPhoneNumber("+263771234567");
    setWhatsappOptIn(true);
    setSelectedCategories(["design", "branding"]);
    setPhoneVerified(true);
  }, [currentUser]);

  const handleSendVerificationCode = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    // In a real implementation, we'd call an API to send the verification code
    // This is just a simulation
    setTimeout(() => {
      toast({
        title: "Verification code sent",
        description: `A verification code has been sent to ${phoneNumber}.`,
      });
      setIsVerifying(false);
      setIsVerificationDialogOpen(true);
    }, 1500);
  };

  const onSubmitVerification = (values: z.infer<typeof verificationSchema>) => {
    // In a real implementation, we'd verify the code with the API
    // This is just a simulation
    console.log("Verifying code:", values.otp);
    
    setTimeout(() => {
      setIsVerificationDialogOpen(false);
      setPhoneVerified(true);
      toast({
        title: "Phone verified",
        description: "Your phone number has been verified successfully.",
      });
    }, 1000);
  };

  const handleSavePreferences = async () => {
    if (!phoneVerified && whatsappOptIn) {
      toast({
        title: "Phone not verified",
        description: "Please verify your phone number to enable WhatsApp notifications.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    // In a real implementation, we'd update Firestore
    // const userRef = doc(db, "users", currentUser.uid);
    // await setDoc(userRef, {
    //   phone: phoneNumber,
    //   whatsappOptIn,
    //   preferences: selectedCategories,
    //   phoneVerified
    // }, { merge: true });

    // Simulate API call delay
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Your WhatsApp notification preferences have been updated.",
      });
    }, 1000);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(currentCategories => {
      if (currentCategories.includes(categoryId)) {
        return currentCategories.filter(id => id !== categoryId);
      } else {
        return [...currentCategories, categoryId];
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5">
        <h3 className="text-lg font-semibold">WhatsApp Job Alerts</h3>
        <p className="text-sm text-muted-foreground">Receive job alerts directly on WhatsApp.</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="flex space-x-2">
            <Input
              id="phone"
              type="tel"
              placeholder="+263 7XX XXX XXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-grow"
              disabled={phoneVerified}
            />
            <Button 
              onClick={handleSendVerificationCode} 
              disabled={isVerifying || phoneVerified}
              variant="outline"
              className="whitespace-nowrap"
            >
              {isVerifying ? "Sending..." : phoneVerified ? "Verified" : "Verify Number"}
            </Button>
          </div>
          {phoneVerified && (
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                <span className="mr-1 text-green-600">✓</span> Verified
              </Badge>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="whatsappOptIn" 
            checked={whatsappOptIn}
            onCheckedChange={(checked) => setWhatsappOptIn(checked === true)}
            disabled={!phoneVerified}
          />
          <Label htmlFor="whatsappOptIn" className="text-base font-medium">
            Receive WhatsApp alerts
          </Label>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="categories">Preferred Job Categories</Label>
          <div className="flex flex-col space-y-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between w-full text-left font-normal">
                  <span>
                    {selectedCategories.length === 0 
                      ? "Select categories" 
                      : `${selectedCategories.length} categories selected`}
                  </span>
                  <span>▼</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                {JOB_CATEGORIES.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  >
                    {category.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCategories.map(categoryId => {
                  const category = JOB_CATEGORIES.find(c => c.id === categoryId);
                  return (
                    <Badge key={categoryId} variant="secondary" className="px-2 py-1">
                      {category?.label}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        <Button onClick={handleSavePreferences} disabled={isSaving} className="mt-4">
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>

      {/* Verification Dialog */}
      <Dialog open={isVerificationDialogOpen} onOpenChange={setIsVerificationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verify Your Phone Number</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitVerification)} className="space-y-4">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter the 6-digit code sent to {phoneNumber}</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      For demo purposes, enter any 6 digits
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsVerificationDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Verify</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WhatsAppSettings;
