
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Send, Phone, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'client' | 'admin';
  senderName: string;
  avatar?: string;
  timestamp: Date;
}

const mockMessages: Message[] = [
  {
    id: "1",
    text: "Hello! I'm Sarah from Proverb Digital. I've been assigned to manage your brief. Let me know if you have any questions or need assistance.",
    sender: 'admin',
    senderName: 'Sarah',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    timestamp: new Date('2025-05-03T10:24:00')
  },
  {
    id: "2",
    text: "Hi Sarah, thanks for reaching out. I have a few questions about the proposal process.",
    sender: 'client',
    senderName: 'You',
    timestamp: new Date('2025-05-03T10:30:00')
  },
  {
    id: "3",
    text: "Of course! I'm happy to help. What would you like to know about the proposal process?",
    sender: 'admin',
    senderName: 'Sarah',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    timestamp: new Date('2025-05-03T10:35:00')
  }
];

const AdminChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'client',
      senderName: 'You',
      timestamp: new Date()
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // Auto-scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scheduleCall = () => {
    toast({
      title: "Call Scheduling Initiated",
      description: "A request for a call has been sent to Proverb Digital. They will contact you shortly to confirm a time.",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isNewDay = (current: Date, previous?: Date) => {
    if (!previous) return true;
    return current.toDateString() !== previous.toDateString();
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Proverb Digital Support</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={scheduleCall}
              className="text-blue-600"
            >
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={scheduleCall}
              className="text-green-600"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Schedule
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto mb-4 px-4">
        <div className="space-y-4">
          {messages.map((message, index) => {
            const previousMessage = index > 0 ? messages[index - 1] : undefined;
            const showDateDivider = isNewDay(message.timestamp, previousMessage?.timestamp);
            
            return (
              <React.Fragment key={message.id}>
                {showDateDivider && (
                  <div className="flex justify-center my-4">
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                      {message.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                <div className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[80%] ${message.sender === 'client' ? 'flex-row-reverse' : ''}`}>
                    {message.sender === 'admin' && (
                      <Avatar className="h-8 w-8">
                        {message.avatar && <AvatarImage src={message.avatar} />}
                        <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div>
                      <div className={`flex items-center ${message.sender === 'client' ? 'justify-end' : ''} mb-1`}>
                        <span className="text-xs text-gray-500 mx-1">{formatTime(message.timestamp)}</span>
                        <span className="text-xs font-medium">{message.senderName}</span>
                      </div>
                      
                      <div 
                        className={`rounded-lg p-3 ${
                          message.sender === 'client' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <div className="p-4 pt-0">
        <Separator className="mb-4" />
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-grow"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AdminChat;
