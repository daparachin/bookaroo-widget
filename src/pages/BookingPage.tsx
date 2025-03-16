import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookingService, BookingConfirmation, Property } from '@/types/booking';
import { Button } from '@/components/ui/button';
import PropertyBookingWidget from '@/components/booking/PropertyBookingWidget';
import BookingWidget from '@/components/booking/BookingWidget';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowLeft, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Mock data for demonstration
const mockServices: BookingService[] = [
  {
    id: '1',
    name: 'Standard Cleaning',
    description: 'Basic cleaning service for your property',
    duration: 120,
    price: 80,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: '2',
    name: 'Deep Cleaning',
    description: 'Thorough cleaning of all areas including hard to reach places',
    duration: 240,
    price: 150,
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=2024'
  },
  {
    id: '3',
    name: 'Move-in/Move-out Cleaning',
    description: 'Complete cleaning service for new or departing tenants',
    duration: 300,
    price: 200,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070'
  }
];

const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Luxury Beach House',
    description: 'Beautiful beachfront property with stunning ocean views',
    location: 'Malibu, CA',
    type: 'house',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=2070',
    basePrice: 350,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    amenities: ['Pool', 'WiFi', 'Kitchen', 'Air conditioning', 'Beach access'],
  },
  {
    id: '2',
    name: 'Downtown Apartment',
    description: 'Modern apartment in the heart of the city',
    location: 'New York, NY',
    type: 'apartment',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=2070',
    basePrice: 150,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ['WiFi', 'Kitchen', 'Air conditioning', 'Gym access'],
  }
];

interface BookingPageProps {
  mode?: 'service' | 'property';
  primaryColor?: string;
  logo?: string;
}

const BookingPage: React.FC<BookingPageProps> = ({ 
  mode = 'service', 
  primaryColor = '#0f766e',
  logo
}) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const [bookingComplete, setBookingComplete] = useState(false);
  
  const handleBookingComplete = (confirmation: BookingConfirmation) => {
    console.log('Booking completed:', confirmation);
    setBookingComplete(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 px-3 md:px-6">
      <div className="container mx-auto max-w-5xl">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-4 md:mb-8 gap-3">
          <Link to="/" className="self-start sm:self-auto">
            <Button variant="ghost" className="flex items-center gap-1 px-2 h-8 sm:h-10 sm:px-4 sm:gap-2 text-sm sm:text-base">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="sm:block">{isMobile ? t('booking.back') : t('booking.backToHomepage')}</span>
            </Button>
          </Link>
          
          {logo ? (
            <div className="flex-1 flex justify-center">
              <img 
                src={logo} 
                alt="Company Logo" 
                className="h-8 sm:h-12 object-contain" 
              />
            </div>
          ) : (
            <div className="flex-1 flex justify-center">
              <h1 className="text-lg sm:text-2xl font-bold text-center" style={{ color: primaryColor }}>
                {t('booking.bookingPageTitle')}
              </h1>
            </div>
          )}
          
          <div className="hidden sm:block w-[100px]"></div> {/* Spacer for balance on desktop only */}
        </header>
        
        <main className="mb-8 md:mb-12">
          {mode === 'service' ? (
            <div className="max-w-xl mx-auto">
              <BookingWidget 
                title={t('booking.bookServiceTitle')}
                subtitle={t('booking.bookServiceSubtitle')}
                services={mockServices}
                primaryColor={primaryColor}
                borderRadius="0.75rem"
                allowNotes={true}
                onBookingComplete={handleBookingComplete}
              />
            </div>
          ) : (
            <PropertyBookingWidget
              title={t('booking.bookStayTitle')}
              subtitle={t('booking.bookStaySubtitle')}
              properties={mockProperties}
              primaryColor={primaryColor}
              borderRadius="0.75rem"
              allowSpecialRequests={true}
              onBookingComplete={handleBookingComplete}
            />
          )}
        </main>
        
        <footer className="text-center text-gray-500 text-xs sm:text-sm py-4">
          <p>{t('booking.footerCopyright', { year: new Date().getFullYear() })}</p>
          <div className="flex justify-center gap-2 sm:gap-4 mt-1 sm:mt-2">
            <a href="#" className="hover:text-gray-700">{t('booking.terms')}</a>
            <a href="#" className="hover:text-gray-700">{t('booking.privacy')}</a>
            <a href="#" className="hover:text-gray-700">{t('booking.contact')}</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BookingPage;
