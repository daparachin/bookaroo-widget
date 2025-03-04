
import React, { useState } from 'react';
import { BookingWidgetProps, BookingService, TimeSlot, BookingFormData, BookingConfirmation as BookingConfirmationType } from '@/types/booking';
import { bookingService } from '@/services/bookingService';
import { cn } from '@/lib/utils';
import ServiceSelector from './ServiceSelector';
import CalendarView from './CalendarView';
import TimeSlotSelector from './TimeSlotSelector';
import BookingForm from './BookingForm';
import BookingConfirmation from './BookingConfirmation';
import { toast } from 'sonner';

const BookingWidget: React.FC<BookingWidgetProps> = ({
  title = 'Book an Appointment',
  subtitle = 'Select a service and preferred time',
  services,
  primaryColor,
  borderRadius = '1rem',
  allowNotes = true,
  apiEndpoint,
  onBookingComplete
}) => {
  const [selectedService, setSelectedService] = useState<BookingService | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingConfirmationType | null>(null);

  const resetBooking = () => {
    setSelectedService(null);
    setSelectedDate(undefined);
    setSelectedTimeSlot(null);
    setBookingConfirmation(null);
  };

  const handleSubmit = async (formData: BookingFormData) => {
    setIsSubmitting(true);
    try {
      const confirmation = await bookingService.createBooking(formData);
      setBookingConfirmation(confirmation);
      if (onBookingComplete) {
        onBookingComplete(confirmation);
      }
      toast.success('Booking confirmed successfully!');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to confirm booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className={cn(
        "bg-background border shadow-elegant",
        "transition-all duration-300 overflow-hidden",
        "max-w-lg w-full mx-auto my-4"
      )}
      style={{ 
        borderRadius,
        ...(primaryColor ? { '--primary': primaryColor } as React.CSSProperties : {})
      }}
    >
      <div className="p-6">
        <div className="text-center mb-6 animate-fade-in">
          <h2 className="text-xl font-bold mb-1">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {bookingConfirmation ? (
          <BookingConfirmation 
            confirmation={bookingConfirmation} 
            onReset={resetBooking} 
          />
        ) : (
          <div className="space-y-6">
            <ServiceSelector 
              onSelectService={setSelectedService} 
              selectedService={selectedService} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CalendarView 
                onSelectDate={setSelectedDate} 
                selectedDate={selectedDate} 
              />
              
              <div>
                <TimeSlotSelector 
                  selectedDate={selectedDate} 
                  onSelectTimeSlot={setSelectedTimeSlot} 
                  selectedTimeSlot={selectedTimeSlot} 
                />
              </div>
            </div>
            
            <BookingForm 
              selectedService={selectedService}
              selectedDate={selectedDate}
              selectedTimeSlot={selectedTimeSlot}
              allowNotes={allowNotes}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingWidget;
