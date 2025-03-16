import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { BookingService, BookingConfirmation } from '@/types/booking';
import { CalendarIcon, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface BookingWidgetProps {
  title: string;
  subtitle: string;
  services: BookingService[];
  primaryColor?: string;
  borderRadius?: string;
  allowNotes?: boolean;
  onBookingComplete?: (confirmation: BookingConfirmation) => void;
}

const BookingWidget: React.FC<BookingWidgetProps> = ({
  title,
  subtitle,
  services,
  primaryColor = '#0f766e',
  borderRadius = '0.75rem',
  allowNotes = false,
  onBookingComplete,
}) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', 
    '2:00 PM', '3:00 PM', '4:00 PM'
  ];
  
  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      const selectedServiceObj = services.find(s => s.id === selectedService);
      
      const confirmation: BookingConfirmation = {
        id: `BK${Math.floor(Math.random() * 10000)}`,
        service: selectedServiceObj!,
        date: date!,
        time: time!,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        notes: notes,
        status: 'confirmed',
        createdAt: new Date(),
        totalPrice: selectedServiceObj?.price || 0
      };
      
      if (onBookingComplete) {
        onBookingComplete(confirmation);
      }
      
      setConfirmation(confirmation);
      setIsComplete(true);
    }
  };
  
  const isStepValid = () => {
    if (step === 1) {
      return !!selectedService;
    } else if (step === 2) {
      return !!date && !!time;
    } else if (step === 3) {
      return !!name && !!email;
    }
    return false;
  };
  
  const getServiceById = (id: string) => {
    return services.find(service => service.id === id);
  };
  
  // Style variables based on props
  const buttonStyle = {
    backgroundColor: primaryColor,
  };
  
  const cardStyle = {
    borderRadius: borderRadius,
  };
  
  if (isComplete && confirmation) {
    return (
      <Card className="w-full p-6 shadow-lg" style={cardStyle}>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <CheckCircle2 className="mb-4 h-16 w-16 text-green-500" />
          <h2 className="mb-2 text-2xl font-bold">{t('booking.bookingConfirmed')}</h2>
          <p className="mb-6 text-gray-600">
            {t('booking.confirmationSent', { email: confirmation.customerEmail })}
          </p>
          <div className="rounded-lg bg-gray-50 p-4 text-left w-full max-w-md">
            <h3 className="font-semibold mb-2">{t('booking.bookingDetails')}</h3>
            <p><span className="font-medium">{t('booking.service')}:</span> {confirmation.service?.name}</p>
            <p><span className="font-medium">{t('booking.date')}:</span> {confirmation.date instanceof Date ? format(confirmation.date, 'PP') : confirmation.date}</p>
            <p><span className="font-medium">{t('booking.time')}:</span> {confirmation.time}</p>
            <p><span className="font-medium">{t('booking.name')}:</span> {confirmation.customerName}</p>
            <p><span className="font-medium">{t('booking.confirmationCode')}:</span> {confirmation.id}</p>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="w-full shadow-lg" style={cardStyle}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl sm:text-2xl" style={{ color: primaryColor }}>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('booking.selectService')}</h3>
            <RadioGroup value={selectedService || ''} onValueChange={setSelectedService}>
              {services.map((service) => (
                <div 
                  key={service.id} 
                  className={`flex cursor-pointer rounded-lg border p-4 mb-3 transition-all ${
                    selectedService === service.id ? 'border-2 border-opacity-100' : 'border-gray-200'
                  }`}
                  style={selectedService === service.id ? { borderColor: primaryColor } : {}}
                  onClick={() => setSelectedService(service.id)}
                >
                  <RadioGroupItem 
                    value={service.id} 
                    id={`service-${service.id}`}
                    className="mt-1"
                  />
                  <div className="ml-3 flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between">
                    <Label htmlFor={`service-${service.id}`} className="cursor-pointer">
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.description}</div>
                      </div>
                    </Label>
                    <div className="mt-2 sm:mt-0 text-right">
                      <div className="font-semibold" style={{ color: primaryColor }}>${service.price}</div>
                      <div className="text-sm text-gray-500">{service.duration} {t('booking.minutes')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">{t('booking.selectDate')}</h3>
              <div className="rounded-md border">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 2))}
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">{t('booking.selectTime')}</h3>
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot}
                    type="button"
                    variant="outline"
                    className={cn(
                      "justify-center text-center font-normal",
                      time === slot && "border-2 border-opacity-100 font-medium"
                    )}
                    style={time === slot ? { borderColor: primaryColor, color: primaryColor } : {}}
                    onClick={() => setTime(slot)}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('booking.contactInformation')}</h3>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="name">{t('booking.fullName')}</Label>
                <Input
                  id="name"
                  placeholder={t('booking.enterName')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="email">{t('booking.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('booking.enterEmail')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">{t('booking.phone')}</Label>
                <Input
                  id="phone"
                  placeholder={t('booking.enterPhone')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              {allowNotes && (
                <div>
                  <Label htmlFor="notes">{t('booking.specialRequests')}</Label>
                  <Textarea
                    id="notes"
                    placeholder={t('booking.enterNotes')}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              {t('common.back')}
            </Button>
          ) : (
            <div></div>
          )}
          <Button 
            onClick={handleContinue} 
            disabled={!isStepValid()}
            style={isStepValid() ? buttonStyle : {}}
          >
            {step < 3 ? t('common.continue') : t('booking.confirmBooking')}
          </Button>
        </div>
        
        <div className="mt-8 flex items-center justify-center">
          <div className="flex space-x-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-2 rounded-full ${
                  s === step ? 'bg-opacity-100' : 'bg-gray-300'
                }`}
                style={s === step ? { backgroundColor: primaryColor } : {}}
              ></div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingWidget;
