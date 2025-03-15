
import React from 'react';
import { format } from 'date-fns';
import { BookingConfirmation } from '@/types/booking';
import { Button } from '@/components/ui/button';

interface BookingConfirmationViewProps {
  bookingConfirmation: BookingConfirmation;
  resetBooking: () => void;
}

const BookingConfirmationView: React.FC<BookingConfirmationViewProps> = ({ 
  bookingConfirmation, 
  resetBooking 
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-muted/30 p-6 rounded-lg border text-center">
        <div className="mb-4 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Booking Confirmed!</h3>
        <p className="text-sm text-muted-foreground mb-4">Your reservation has been successfully confirmed.</p>
        
        <div className="space-y-3 text-sm">
          <p><span className="font-medium">Booking ID:</span> {bookingConfirmation.bookingId}</p>
          <p><span className="font-medium">Property:</span> {bookingConfirmation.propertyName}</p>
          <p><span className="font-medium">Check-in:</span> {format(new Date(bookingConfirmation.checkInDate), 'MMMM d, yyyy')}</p>
          <p><span className="font-medium">Check-out:</span> {format(new Date(bookingConfirmation.checkOutDate), 'MMMM d, yyyy')}</p>
          <p><span className="font-medium">Guests:</span> {bookingConfirmation.guestCount}</p>
          <p><span className="font-medium">Total Price:</span> ${bookingConfirmation.totalPrice.toFixed(2)}</p>
        </div>
        
        <div className="mt-6">
          <p className="text-xs text-muted-foreground mb-4">A confirmation email has been sent to your email address.</p>
          <Button onClick={resetBooking} className="w-full">Book Another Property</Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationView;
