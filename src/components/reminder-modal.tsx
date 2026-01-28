import { Mail, Phone, MessageSquare, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

interface ReminderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: {
    id: string;
    customer: {
      name: string;
      email: string;
      phone: string;
    };
    total: number;
    dueDate: string;
  };
}

export function ReminderModal({ open, onOpenChange, invoice }: ReminderModalProps) {
  const [method, setMethod] = useState<'email' | 'whatsapp' | 'phone'>('email');
  const [message, setMessage] = useState(
    `Dear ${invoice.customer.name},\n\nThis is a friendly reminder that invoice ${invoice.id} for $${invoice.total.toLocaleString()} is due on ${invoice.dueDate}.\n\nPlease process the payment at your earliest convenience.\n\nThank you for your business!`
  );

  const handleSend = () => {
    alert(`Reminder sent via ${method}!`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Payment Reminder</DialogTitle>
          <DialogDescription>
            Send a payment reminder to {invoice.customer.name} for invoice {invoice.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Method Selection */}
          <div className="space-y-3">
            <Label>Reminder Method</Label>
            <RadioGroup value={method} onValueChange={(v) => setMethod(v as any)} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card
                className={`cursor-pointer transition-all ${method === 'email' ? 'ring-2 ring-primary bg-accent' : 'hover:bg-gray-50'
                  }`}
                onClick={() => setMethod('email')}
              >
                <div className="p-4 flex items-center gap-3">
                  <RadioGroupItem value="email" id="email" className="flex-shrink-0" />
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${method === 'email' ? 'bg-primary' : 'bg-gray-100'
                      }`}>
                      <Mail className={`w-5 h-5 ${method === 'email' ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-xs text-gray-500 truncate">{invoice.customer.email}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card
                className={`cursor-pointer transition-all ${method === 'whatsapp' ? 'ring-2 ring-primary bg-accent' : 'hover:bg-gray-50'
                  }`}
                onClick={() => setMethod('whatsapp')}
              >
                <div className="p-4 flex items-center gap-3">
                  <RadioGroupItem value="whatsapp" id="whatsapp" className="flex-shrink-0" />
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${method === 'whatsapp' ? 'bg-primary' : 'bg-gray-100'
                      }`}>
                      <MessageSquare className={`w-5 h-5 ${method === 'whatsapp' ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">WhatsApp</p>
                      <p className="text-xs text-gray-500">{invoice.customer.phone}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card
                className={`cursor-pointer transition-all ${method === 'phone' ? 'ring-2 ring-primary bg-accent' : 'hover:bg-gray-50'
                  }`}
                onClick={() => setMethod('phone')}
              >
                <div className="p-4 flex items-center gap-3">
                  <RadioGroupItem value="phone" id="phone" className="flex-shrink-0" />
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${method === 'phone' ? 'bg-primary' : 'bg-gray-100'
                      }`}>
                      <Phone className={`w-5 h-5 ${method === 'phone' ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Phone Call</p>
                      <p className="text-xs text-gray-500">{invoice.customer.phone}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </RadioGroup>
          </div>

          {/* Message Preview */}
          <div className="space-y-3">
            <Label htmlFor="message">Message Preview</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[200px] bg-white border-gray-200 rounded-lg"
              placeholder="Enter your reminder message..."
            />
            <p className="text-xs text-gray-500">
              Customize the message before sending
            </p>
          </div>

          {/* Invoice Summary */}
          <Card className="bg-gray-50 border-0">
            <div className="p-4 space-y-2">
              <h4 className="font-medium text-gray-900 text-sm">Invoice Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Invoice ID</p>
                  <p className="font-medium text-gray-900">{invoice.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Amount</p>
                  <p className="font-medium text-gray-900">${invoice.total.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Due Date</p>
                  <p className="font-medium text-gray-900">{invoice.dueDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Customer</p>
                  <p className="font-medium text-gray-900">{invoice.customer.name}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-white gap-2"
              onClick={handleSend}
            >
              {method === 'email' && <Mail className="w-4 h-4" />}
              {method === 'whatsapp' && <MessageSquare className="w-4 h-4" />}
              {method === 'phone' && <Phone className="w-4 h-4" />}
              Send {method === 'email' ? 'Email' : method === 'whatsapp' ? 'WhatsApp' : 'Phone'} Reminder
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
