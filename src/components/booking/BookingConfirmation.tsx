
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookingConfirmation as BookingConfirmationType } from '@/types/booking';
import { CheckCircle, Calendar, Clock, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface BookingConfirmationProps {
  confirmation: BookingConfirmationType;
  onReset: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  confirmation,
  onReset
}) => {
  useEffect(() => {
    // Create a confetti celebration effect
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // since particles fall down, start a bit higher than random
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
      }));
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
      }));
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="text-center space-y-6 p-6 animate-scale-in">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-muted-foreground">
          Thank you, {confirmation.customerName}. Your appointment has been scheduled.
        </p>
      </div>
      
      <div className="bg-muted/30 rounded-lg p-4 space-y-3 max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <div className="text-start">
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="font-medium">{formatDate(confirmation.date)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <div className="text-start">
            <p className="text-xs text-muted-foreground">Time</p>
            <p className="font-medium">{confirmation.startTime} - {confirmation.endTime}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-muted-foreground" />
          <div className="text-start">
            <p className="text-xs text-muted-foreground">Service</p>
            <p className="font-medium">{confirmation.serviceName} (${confirmation.price})</p>
          </div>
        </div>
      </div>
      
      <div className="pt-2">
        <p className="text-sm text-muted-foreground mb-4">
          A confirmation email has been sent with all the details.
        </p>
        <Button 
          onClick={onReset} 
          variant="outline" 
          className="transition-all duration-300"
        >
          Book Another Appointment
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
