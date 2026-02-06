import { Mail, MessageSquare, Smartphone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { useSendReminder } from '@/hooks/useAdmin';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
  orgId: string;
}

export function ReminderModal({
  open,
  onOpenChange,
  invoice,
  orgId,
}: ReminderModalProps) {
  const [method, setMethod] = useState<'email' | 'whatsapp' | 'sms'>('email');

  const [message, setMessage] = useState(
    `Dear ${invoice.customer.name},\n\nThis is a friendly reminder that invoice ${invoice.id} for $${invoice.total.toLocaleString()} is due on ${invoice.dueDate}.\n\nPlease process the payment at your earliest convenience.\n\nThank you for your business!`
  );

  const sendReminder = useSendReminder();

  const handleSend = async () => {
    try {
      const result = await sendReminder.mutateAsync({
        orgId,
        invoiceId: invoice.id,
        data: { channel: method }
      });

      toast.success(result?.message || 'Reminder sent successfully!');
      onOpenChange(false);
    } catch (err: any) {
      console.error("Failed to send reminder:", err);
      toast.error(err.response?.data?.message || 'Failed to send reminder. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-[95vw]
          sm:max-w-2xl
          max-h-[90vh]
          overflow-y-auto
        "
      >
        <DialogHeader>
          <DialogTitle>Send Payment Reminder</DialogTitle>
          <DialogDescription>
            Send a payment reminder to {invoice.customer.name} for invoice{' '}
            {invoice.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* ================= METHOD SELECTION ================= */}
          <div className="space-y-3">
            <Label>Reminder Method</Label>

            <RadioGroup
              value={method}
              onValueChange={(v) => setMethod(v as any)}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {/* ================= EMAIL ================= */}
              <Card
                onClick={() => setMethod('email')}
                className={`cursor-pointer transition-all
                  ${method === 'email'
                    ? 'ring-2 ring-primary bg-accent'
                    : 'hover:bg-gray-50'
                  }
                `}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem
                      value="email"
                      id="email"
                      className="mt-1 flex-shrink-0"
                    />

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                        ${method === 'email'
                            ? 'bg-primary'
                            : 'bg-gray-100'
                          }`}
                      >
                        <Mail
                          className={`w-5 h-5 ${method === 'email'
                            ? 'text-white'
                            : 'text-gray-600'
                            }`}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 leading-tight">
                          Email
                        </p>
                        <p className="text-xs text-gray-500 break-all sm:truncate">
                          {invoice.customer.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* ================= WHATSAPP ================= */}
              <Card
                onClick={() => setMethod('whatsapp')}
                className={`cursor-pointer transition-all
                  ${method === 'whatsapp'
                    ? 'ring-2 ring-primary bg-accent'
                    : 'hover:bg-gray-50'
                  }
                `}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem
                      value="whatsapp"
                      id="whatsapp"
                      className="mt-1 flex-shrink-0"
                    />

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                        ${method === 'whatsapp'
                            ? 'bg-primary'
                            : 'bg-gray-100'
                          }`}
                      >
                        <MessageSquare
                          className={`w-5 h-5 ${method === 'whatsapp'
                            ? 'text-white'
                            : 'text-gray-600'
                            }`}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 leading-tight">
                          WhatsApp
                        </p>
                        <p className="text-xs text-gray-500 break-all sm:truncate">
                          {invoice.customer.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* ================= SMS ================= */}
              <Card
                onClick={() => setMethod('sms')}
                className={`cursor-pointer transition-all
                  ${method === 'sms'
                    ? 'ring-2 ring-primary bg-accent'
                    : 'hover:bg-gray-50'
                  }
                `}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem
                      value="sms"
                      id="sms"
                      className="mt-1 flex-shrink-0"
                    />

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                        ${method === 'sms'
                            ? 'bg-primary'
                            : 'bg-gray-100'
                          }`}
                      >
                        <Smartphone
                          className={`w-5 h-5 ${method === 'sms'
                            ? 'text-white'
                            : 'text-gray-600'
                            }`}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 leading-tight">
                          SMS
                        </p>
                        <p className="text-xs text-gray-500 break-all sm:truncate">
                          {invoice.customer.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </RadioGroup>
          </div>

          {/* ================= MESSAGE ================= */}
          {/* <div className="space-y-3">
            <Label>Message Preview</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[160px] sm:min-h-[200px]"
            />
            <p className="text-xs text-gray-500">
              Customize the message before sending
            </p>
          </div> */}

          {/* ================= INVOICE SUMMARY ================= */}
          <Card className="bg-gray-50 border-0">
            <div className="p-4 space-y-2">
              <h4 className="font-medium text-sm">Invoice Summary</h4>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Invoice ID</p>
                  <p className="font-medium">{invoice.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Amount</p>
                  <p className="font-medium">
                    ${invoice.total.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Due Date</p>
                  <p className="font-medium">{invoice.dueDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Customer</p>
                  <p className="font-medium">{invoice.customer.name}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* ================= ACTIONS ================= */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button
              onClick={handleSend}
              className="gap-2"
              disabled={sendReminder.isPending}
            >
              {sendReminder.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {method === 'email' && <Mail className="w-4 h-4" />}
                  {method === 'whatsapp' && <MessageSquare className="w-4 h-4" />}
                  {method === 'sms' && <Smartphone className="w-4 h-4" />}
                </>
              )}
              {sendReminder.isPending ? "Sending..." : "Send Reminder"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
