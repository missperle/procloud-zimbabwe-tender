
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addDays, isBefore, startOfToday } from "date-fns";
import { Calendar as CalendarIcon, Clock, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const availableTimeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
];

const MeetingScheduler = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [meetingType, setMeetingType] = useState<"video" | "phone">("video");
  const [purpose, setPurpose] = useState<string>("brief-discussion");
  const { toast } = useToast();

  const handleScheduleMeeting = () => {
    if (!selectedDate || !selectedTime) return;
    
    toast({
      title: "Meeting Scheduled",
      description: `Your meeting has been scheduled for ${format(selectedDate, "MMMM d, yyyy")} at ${selectedTime}.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Schedule a Meeting
        </CardTitle>
        <CardDescription>
          Book a time to speak with your Proverb Digital representative
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Select Date</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => isBefore(date, startOfToday()) || isBefore(addDays(startOfToday(), 60), date)}
                className="rounded-md border"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Meeting Details</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-500">Select Time</label>
                  <Select 
                    value={selectedTime} 
                    onValueChange={setSelectedTime}
                    disabled={!selectedDate}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-500">Meeting Type</label>
                  <div className="flex gap-2">
                    <Button 
                      type="button"
                      variant={meetingType === "video" ? "default" : "outline"}
                      onClick={() => setMeetingType("video")}
                      className="flex-1"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Video Call
                    </Button>
                    <Button 
                      type="button"
                      variant={meetingType === "phone" ? "default" : "outline"}
                      onClick={() => setMeetingType("phone")}
                      className="flex-1"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Phone Call
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-500">Meeting Purpose</label>
                  <Select 
                    value={purpose} 
                    onValueChange={setPurpose}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brief-discussion">Brief Discussion</SelectItem>
                      <SelectItem value="proposal-review">Proposal Review</SelectItem>
                      <SelectItem value="contract-questions">Contract Questions</SelectItem>
                      <SelectItem value="general-questions">General Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="pt-2">
              <Button 
                className="w-full" 
                disabled={!selectedDate || !selectedTime}
                onClick={handleScheduleMeeting}
              >
                Schedule Meeting
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingScheduler;
