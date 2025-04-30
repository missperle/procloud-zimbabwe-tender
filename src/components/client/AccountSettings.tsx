
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send an API request to update the profile
    console.log("Profile form submitted");
    // Show success message
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send an API request to update security settings
    console.log("Security form submitted");
    // Show success message
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Account Settings</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Company Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-6">
                  <div className="relative group">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="https://randomuser.me/api/portraits/men/22.jpg" alt="Company Logo" />
                      <AvatarFallback>PD</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      accept="image/*"
                      aria-label="Upload logo"
                    />
                  </div>
                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <h3 className="font-medium">Company Logo</h3>
                    <p className="text-sm text-gray-500">
                      Upload a company logo or brand mark. 
                      Recommended size: 400x400px.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" defaultValue="Proverb Digital LLC" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <select
                      id="industry"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      defaultValue="technology"
                    >
                      <option value="technology">Technology</option>
                      <option value="marketing">Marketing & Advertising</option>
                      <option value="retail">Retail</option>
                      <option value="finance">Finance</option>
                      <option value="education">Education</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input id="contactEmail" type="email" defaultValue="info@proverbdigital.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+263 771 234 567" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <textarea
                    id="address"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    defaultValue="123 Business Ave, Harare, Zimbabwe"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="about">About Your Company</Label>
                  <textarea
                    id="about"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[120px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    defaultValue="Proverb Digital is a creative agency specializing in digital marketing, web development, and brand identity solutions for small to medium enterprises."
                  />
                </div>

                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSecuritySubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-4 border-t">
                  <Switch
                    id="twoFactor"
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                  />
                  <div>
                    <Label htmlFor="twoFactor" className="text-base font-medium">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account by requiring a verification code in addition to your password.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-medium">Active Sessions</h4>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium">Chrome on Windows</p>
                        <p className="text-gray-500">Last active: Just now</p>
                      </div>
                      <Button variant="outline" size="sm">
                        This Device
                      </Button>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium">Safari on iPhone</p>
                        <p className="text-gray-500">Last active: 2 hours ago</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-red-600">
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Button type="submit">Update Security Settings</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountSettings;
