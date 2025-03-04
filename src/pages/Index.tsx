
import React from 'react';
import BookingWidget from '@/components/booking/BookingWidget';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-4xl w-full mx-auto">
        <div className="text-center mb-10 space-y-2 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Embeddable Booking Widget</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            A lightweight, customizable booking widget that can be embedded in any website.
          </p>
        </div>
        
        <BookingWidget 
          title="Book Your Appointment"
          subtitle="Select a service, date, and time that works for you"
          allowNotes={true}
          onBookingComplete={(data) => console.log('Booking completed:', data)}
        />
      </div>
    </div>
  );
};

export default Index;
