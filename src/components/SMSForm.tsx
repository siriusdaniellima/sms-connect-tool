import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Send, MessageSquare } from "lucide-react";

interface Customer {
  id: string;
  name: string;
}

export const SMSForm = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [toNumber, setToNumber] = useState("");
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [showTicketTooltip, setShowTicketTooltip] = useState(false);
  const [showPhoneTooltip, setShowPhoneTooltip] = useState(false);

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // TODO: Replace with your actual API endpoint
        // const response = await fetch('YOUR_API_ENDPOINT');
        // const data = await response.json();
        
        // Mock data for now
        const mockCustomers: Customer[] = [
          { id: "1", name: "John Smith" },
          { id: "2", name: "Sarah Johnson" },
          { id: "3", name: "Michael Brown" },
          { id: "4", name: "Emily Davis" },
          { id: "5", name: "David Wilson" },
        ];
        
        setCustomers(mockCustomers);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const isFormValid = selectedCustomer && messageText.trim().length > 0 && (ticketId.trim().length > 0 || toNumber.trim().length > 1);

  const handleSend = async () => {
    if (!isFormValid) return;

    setSending(true);
    try {
      // TODO: Replace with your actual SMS sending endpoint
      // const response = await fetch('YOUR_SMS_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     customerId: selectedCustomer,
      //     ticketId,
      //     message: messageText
      //   })
      // });

      // Mock successful send
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("SMS sent successfully!");
      
      // Reset form
      setSelectedCustomer("");
      setTicketId("");
      setToNumber("");
      setMessageText("");
    } catch (error) {
      console.error("Error sending SMS:", error);
      toast.error("Failed to send SMS");
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg border-border/50">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <CardTitle className="text-2xl font-semibold">Send SMS Message</CardTitle>
        </div>
        <CardDescription>
          Send a text message to your customers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="customer" className="text-sm font-medium">
            Customer Name / From Number <span className="text-destructive">*</span>
          </Label>
          <Select 
            value={selectedCustomer} 
            onValueChange={setSelectedCustomer}
            disabled={loading}
          >
            <SelectTrigger 
              id="customer"
              className="transition-all focus:ring-2 focus:ring-primary/20"
            >
              <SelectValue placeholder={loading ? "Loading customers..." : "Select a customer"} />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ticketId" className="text-sm font-medium">
            Ticket ID <span className="text-muted-foreground text-xs">(one required)</span>
          </Label>
          <TooltipProvider>
            <Tooltip open={showTicketTooltip}>
              <TooltipTrigger asChild>
                <Input
                  id="ticketId"
                  type="text"
                  placeholder="Enter ticket ID"
                  value={ticketId}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers
                    if (value === '' || /^\d+$/.test(value)) {
                      setTicketId(value);
                      setShowTicketTooltip(false);
                    } else {
                      setShowTicketTooltip(true);
                      setTimeout(() => setShowTicketTooltip(false), 2000);
                    }
                  }}
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Only numbers are accepted</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-2">
          <Label htmlFor="toNumber" className="text-sm font-medium">
            To Number <span className="text-muted-foreground text-xs">(one required)</span>
          </Label>
          <TooltipProvider>
            <Tooltip open={showPhoneTooltip}>
              <TooltipTrigger asChild>
                <Input
                  id="toNumber"
                  type="text"
                  placeholder="+1234567890"
                  value={toNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    const hadInvalidChar = /[^\d+]/.test(value);
                    
                    // Always ensure the value starts with + and only contains numbers after
                    if (value === '' || value === '+') {
                      setToNumber('+');
                      setShowPhoneTooltip(false);
                    } else if (!value.startsWith('+')) {
                      // If user tries to type without +, add it
                      const numbers = value.replace(/\D/g, '');
                      setToNumber('+' + numbers);
                      if (hadInvalidChar) {
                        setShowPhoneTooltip(true);
                        setTimeout(() => setShowPhoneTooltip(false), 2000);
                      }
                    } else {
                      // Only allow + followed by numbers
                      const numbers = value.slice(1).replace(/\D/g, '');
                      setToNumber('+' + numbers);
                      if (hadInvalidChar) {
                        setShowPhoneTooltip(true);
                        setTimeout(() => setShowPhoneTooltip(false), 2000);
                      } else {
                        setShowPhoneTooltip(false);
                      }
                    }
                  }}
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Only numbers are accepted</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-medium">
            Message <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="message"
            placeholder="Type your message here..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            rows={6}
            className="resize-none transition-all focus:ring-2 focus:ring-primary/20"
          />
          <p className="text-xs text-muted-foreground">
            {messageText.length} characters
          </p>
        </div>

        <Button
          onClick={handleSend}
          disabled={!isFormValid || sending}
          className="w-full transition-all hover:shadow-md"
          size="lg"
        >
          <Send className="mr-2 h-4 w-4" />
          {sending ? "Sending..." : "Send SMS"}
        </Button>
      </CardContent>
    </Card>
  );
};
