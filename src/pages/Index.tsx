
import React from 'react';
import PropertyBookingWidget from '@/components/booking/PropertyBookingWidget';
import { Property } from '@/types/booking';

// Sample property data - in a real app this would come from an API
const sampleProperties: Property[] = [
  {
    id: 'prop-1',
    name: 'Ocean View Villa',
    description: 'Stunning villa with panoramic ocean views and private pool',
    type: 'villa',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    basePrice: 299,
    amenities: ['Wi-Fi', 'Kitchen', 'Pool', 'Air conditioning', 'Parking'],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
    seasonalPricing: {
      '06-01': 1.25, // Summer premium
      '12-20': 1.5, // Holiday premium
    },
    extendedStayDiscounts: [
      { days: 7, discountPercentage: 5 },
      { days: 14, discountPercentage: 10 },
      { days: 30, discountPercentage: 15 },
    ]
  },
  {
    id: 'prop-2',
    name: 'Mountain Cabin',
    description: 'Cozy cabin in the mountains with fireplace and hiking trails nearby',
    type: 'house',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    basePrice: 159,
    amenities: ['Wi-Fi', 'Kitchen', 'Fireplace', 'Heating', 'BBQ'],
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2065&auto=format&fit=crop',
    extendedStayDiscounts: [
      { days: 7, discountPercentage: 8 },
      { days: 14, discountPercentage: 12 },
    ]
  },
  {
    id: 'prop-3',
    name: 'Downtown Loft',
    description: 'Modern loft in the heart of downtown with city views',
    type: 'apartment',
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    basePrice: 129,
    amenities: ['Wi-Fi', 'Kitchen', 'Gym', 'Elevator', 'Washer/Dryer'],
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop',
    seasonalPricing: {
      '12-20': 1.3, // Holiday premium
    }
  },
  {
    id: 'prop-4',
    name: 'Beachfront Cottage',
    description: 'Charming cottage steps away from the beach with stunning sunset views',
    type: 'house',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    basePrice: 189,
    amenities: ['Wi-Fi', 'Kitchen', 'Beach access', 'Patio', 'BBQ'],
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop',
    seasonalPricing: {
      '06-01': 1.35, // Summer premium
    }
  },
  {
    id: 'prop-5',
    name: 'Luxury Penthouse',
    description: 'Upscale penthouse with skyline views, private terrace, and premium amenities',
    type: 'apartment',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    basePrice: 399,
    amenities: ['Wi-Fi', 'Full kitchen', 'Hot tub', 'Gym access', 'Concierge'],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
    extendedStayDiscounts: [
      { days: 7, discountPercentage: 10 },
      { days: 14, discountPercentage: 15 },
    ]
  },
  {
    id: 'prop-6',
    name: 'Rustic Farm Stay',
    description: 'Authentic farm experience with modern comforts and beautiful countryside views',
    type: 'house',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 1,
    basePrice: 145,
    amenities: ['Wi-Fi', 'Kitchen', 'Fireplace', 'Farm animals', 'Garden'],
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2070&auto=format&fit=crop',
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-4xl w-full mx-auto">
        <div className="text-center mb-10 space-y-2 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Vacation Rental Booking</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Find and book the perfect vacation property for your next getaway.
          </p>
        </div>
        
        <PropertyBookingWidget 
          title="Book Your Stay"
          subtitle="Select a property, dates, and enjoy your vacation"
          properties={sampleProperties}
          allowSpecialRequests={true}
          onBookingComplete={(data) => console.log('Booking completed:', data)}
        />
      </div>
      
      <div className="mt-12 max-w-4xl w-full mx-auto">
        <h2 className="text-xl font-semibold mb-4">How to Embed This Widget</h2>
        <div className="bg-muted p-4 rounded-lg text-sm">
          <p className="mb-3">Add the following code to your website to embed this booking widget:</p>
          <pre className="bg-background p-3 rounded border overflow-x-auto">
            {`<div id="vacation-booking-widget"></div>
<script src="https://example.com/booking-widget.js"></script>
<script>
  new BookingWidget({
    container: '#vacation-booking-widget',
    title: 'Book Your Stay',
    properties: [/* Your properties data */],
    primaryColor: '#0ea5e9',
    onBookingComplete: function(data) {
      console.log('Booking completed:', data);
    }
  });
</script>`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Index;
