
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { BookingFormData, BookingService, TimeSlot } from '@/types/booking';
import { cn } from '@/lib/utils';

interface BookingFormProps {
  selectedService: BookingService | null;
  selectedDate: Date | undefined;
  selectedTimeSlot: TimeSlot | null;
  allowNotes?: boolean;
  onSubmit: (data: BookingFormData) => void;
  isSubmitting: boolean;
}

const formSchema = z.object({
  customerName: z.string().min(2, { message: 'Name is required' }),
  customerEmail: z.string().email({ message: 'Valid email is required' }),
  customerPhone: z.string().min(5, { message: 'Phone number is required' }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const BookingForm: React.FC<BookingFormProps> = ({
  selectedService,
  selectedDate,
  selectedTimeSlot,
  allowNotes = true,
  onSubmit,
  isSubmitting
}) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmitForm = (data: FormValues) => {
    if (!selectedService || !selectedDate || !selectedTimeSlot) {
      return;
    }

    const bookingData: BookingFormData = {
      propertyId: selectedService.id, // Use service ID as propertyId for legacy compatibility
      checkInDate: selectedDate.toISOString().split('T')[0],
      checkOutDate: selectedDate.toISOString().split('T')[0], // Same day for service bookings
      guestCount: 1, // Default to 1 guest for service bookings
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      specialRequests: data.notes,
      // Legacy fields for compatibility
      serviceId: selectedService.id,
      date: selectedDate.toISOString().split('T')[0],
      timeSlotId: selectedTimeSlot.id,
      notes: data.notes,
    };

    onSubmit(bookingData);
  };

  const isFormDisabled = !selectedService || !selectedDate || !selectedTimeSlot;

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 animate-fade-in">
      <h3 className="text-sm font-medium mb-4 text-muted-foreground">Your information</h3>
      
      <div className="space-y-3">
        <div>
          <Input
            {...register('customerName')}
            placeholder="Your name"
            className={cn(
              "transition-all duration-300",
              errors.customerName ? "border-destructive focus-visible:ring-destructive/30" : ""
            )}
            disabled={isFormDisabled || isSubmitting}
          />
          {errors.customerName && (
            <p className="text-destructive text-xs mt-1">{errors.customerName.message}</p>
          )}
        </div>
        
        <div>
          <Input
            {...register('customerEmail')}
            placeholder="Email address"
            type="email"
            className={cn(
              "transition-all duration-300",
              errors.customerEmail ? "border-destructive focus-visible:ring-destructive/30" : ""
            )}
            disabled={isFormDisabled || isSubmitting}
          />
          {errors.customerEmail && (
            <p className="text-destructive text-xs mt-1">{errors.customerEmail.message}</p>
          )}
        </div>
        
        <div>
          <Input
            {...register('customerPhone')}
            placeholder="Phone number"
            className={cn(
              "transition-all duration-300",
              errors.customerPhone ? "border-destructive focus-visible:ring-destructive/30" : ""
            )}
            disabled={isFormDisabled || isSubmitting}
          />
          {errors.customerPhone && (
            <p className="text-destructive text-xs mt-1">{errors.customerPhone.message}</p>
          )}
        </div>
        
        {allowNotes && (
          <div>
            <Textarea
              {...register('notes')}
              placeholder="Any special requests or notes?"
              className="min-h-[80px] resize-none"
              disabled={isFormDisabled || isSubmitting}
            />
          </div>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full transition-all duration-300 h-12 text-base font-medium"
        disabled={isFormDisabled || isSubmitting}
      >
        {isSubmitting ? 'Confirming booking...' : 'Confirm Booking'}
      </Button>
    </form>
  );
};

export default BookingForm;
