
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { 
  FreelancerOnboardingFormData, 
  PriceTier,
  DayAvailability
} from "@/hooks/useFreelancerOnboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";

interface RatesAvailabilityStepProps {
  formData: FreelancerOnboardingFormData;
  updateFormData: (data: Partial<FreelancerOnboardingFormData>) => void;
}

const TIME_ZONES = [
  "GMT-12:00", "GMT-11:00", "GMT-10:00", "GMT-09:00", "GMT-08:00", 
  "GMT-07:00", "GMT-06:00", "GMT-05:00", "GMT-04:00", "GMT-03:00", 
  "GMT-02:00", "GMT-01:00", "GMT+00:00", "GMT+01:00", "GMT+02:00", 
  "GMT+03:00", "GMT+04:00", "GMT+05:00", "GMT+05:30", "GMT+06:00", 
  "GMT+07:00", "GMT+08:00", "GMT+09:00", "GMT+10:00", "GMT+11:00", 
  "GMT+12:00"
];

const RESPONSE_TIMES = [
  "Within a few hours", 
  "Within 24 hours", 
  "Within 48 hours"
];

const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i;
  return `${hour.toString().padStart(2, '0')}:00`;
});

const RatesAvailabilityStep = ({ formData, updateFormData }: RatesAvailabilityStepProps) => {
  const [newTier, setNewTier] = useState<Partial<PriceTier>>({
    id: uuidv4(),
    name: '',
    description: '',
    price: 0
  });
  const [showTierForm, setShowTierForm] = useState(false);

  const handleHourlyRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      updateFormData({ hourlyRate: value });
    }
  };

  const handleToggleDay = (day: keyof typeof formData.weeklyAvailability) => {
    updateFormData({
      weeklyAvailability: {
        ...formData.weeklyAvailability,
        [day]: {
          ...formData.weeklyAvailability[day],
          available: !formData.weeklyAvailability[day].available
        }
      }
    });
  };

  const handleDayTimeChange = (
    day: keyof typeof formData.weeklyAvailability, 
    field: keyof DayAvailability, 
    value: string
  ) => {
    updateFormData({
      weeklyAvailability: {
        ...formData.weeklyAvailability,
        [day]: {
          ...formData.weeklyAvailability[day],
          [field]: value
        }
      }
    });
  };

  const handleAddTier = () => {
    // Validate the new tier
    if (!newTier.name || !newTier.description || typeof newTier.price !== 'number' || newTier.price <= 0) {
      return;
    }

    // Add the new tier
    updateFormData({
      fixedPriceTiers: [...formData.fixedPriceTiers, newTier as PriceTier]
    });

    // Reset the form
    setNewTier({
      id: uuidv4(),
      name: '',
      description: '',
      price: 0
    });
    setShowTierForm(false);
  };

  const handleRemoveTier = (id: string) => {
    updateFormData({
      fixedPriceTiers: formData.fixedPriceTiers.filter(tier => tier.id !== id)
    });
  };

  return (
    <div className="space-y-8">
      {/* Hourly Rate Section */}
      <div>
        <Label className="block mb-2">Your Hourly Rate (Required)</Label>
        <div className="flex items-center">
          <span className="bg-gray-100 px-3 py-2 border border-r-0 border-gray-300 rounded-l-md">
            $
          </span>
          <Input 
            type="number"
            min="1"
            step="0.01"
            className="rounded-l-none"
            value={formData.hourlyRate > 0 ? formData.hourlyRate : ''}
            onChange={handleHourlyRateChange}
            placeholder="e.g., 45"
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Set a rate that reflects your experience and the quality of your work
        </p>
      </div>

      {/* Fixed Price Tiers (Optional) */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <Label>Fixed Price Packages (Optional)</Label>
          {!showTierForm && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setShowTierForm(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Package
            </Button>
          )}
        </div>

        {formData.fixedPriceTiers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {formData.fixedPriceTiers.map((tier) => (
              <Card key={tier.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{tier.name}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleRemoveTier(tier.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-600 mb-2">{tier.description}</p>
                  <div className="text-lg font-bold">${tier.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {showTierForm && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-base">Add Price Package</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Package Name</Label>
                <Input 
                  placeholder="e.g., Basic, Standard, Premium"
                  value={newTier.name}
                  onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe what's included in this package..."
                  rows={3}
                  value={newTier.description}
                  onChange={(e) => setNewTier({ ...newTier, description: e.target.value })}
                />
              </div>
              <div>
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g., 99"
                  value={newTier.price > 0 ? newTier.price : ''}
                  onChange={(e) => setNewTier({ 
                    ...newTier, 
                    price: parseFloat(e.target.value) || 0 
                  })}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowTierForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTier}>
                Add Package
              </Button>
            </CardFooter>
          </Card>
        )}

        <p className="text-sm text-gray-500 mt-1">
          Creating fixed price packages can attract clients looking for specific services
        </p>
      </div>

      {/* Time Zone */}
      <div>
        <Label className="block mb-2">Your Time Zone</Label>
        <Select 
          value={formData.timeZone} 
          onValueChange={(value) => updateFormData({ timeZone: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your time zone" />
          </SelectTrigger>
          <SelectContent>
            {TIME_ZONES.map((zone) => (
              <SelectItem key={zone} value={zone}>
                {zone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Response Time */}
      <div>
        <Label className="block mb-2">Typical Response Time</Label>
        <Select 
          value={formData.responseTime} 
          onValueChange={(value) => updateFormData({ responseTime: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select response time" />
          </SelectTrigger>
          <SelectContent>
            {RESPONSE_TIMES.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Weekly Availability */}
      <div>
        <Label className="block mb-3">Weekly Availability</Label>
        <div className="space-y-3">
          {Object.entries(formData.weeklyAvailability).map(([day, data]) => (
            <div key={day} className="flex items-center gap-3">
              <div className="w-28">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={data.available}
                    onCheckedChange={() => handleToggleDay(day as keyof typeof formData.weeklyAvailability)}
                  />
                  <span className="capitalize">{day}</span>
                </div>
              </div>
              
              {data.available && (
                <div className="flex items-center gap-2">
                  <Select 
                    value={data.startTime || "09:00"} 
                    onValueChange={(value) => handleDayTimeChange(
                      day as keyof typeof formData.weeklyAvailability,
                      'startTime',
                      value
                    )}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((time) => (
                        <SelectItem key={`start-${day}-${time}`} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>to</span>
                  <Select 
                    value={data.endTime || "17:00"}
                    onValueChange={(value) => handleDayTimeChange(
                      day as keyof typeof formData.weeklyAvailability,
                      'endTime',
                      value
                    )}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((time) => (
                        <SelectItem key={`end-${day}-${time}`} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatesAvailabilityStep;
