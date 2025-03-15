
import React, { useState, useEffect } from 'react';
import { format, differenceInDays, addDays } from 'date-fns';
import { BookingWidgetProps, Property, DateRange, PricingDetails, BookingFormData, BookingConfirmation } from '@/types/booking';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import PropertySelector from './PropertySelector';
import { supabase } from '@/integrations/supabase/client';

// Import the new components
import PropertyDateRangePicker from './PropertyDateRangePicker';
import PropertyDetails from './PropertyDetails';
import GuestInformationForm from './GuestInformationForm';
import BookingConfirmationView from './BookingConfirmationView';

const PropertyBookingWidget: React.FC<BookingWidgetProps> = ({
  title = "Book Your Stay",
  subtitle = "Select a property, dates, and complete your booking",
  properties = [],
  primaryColor,
  secondaryColor,
  borderRadius = '1rem',
  fontFamily,
  allowSpecialRequests = true,
  apiEndpoint,
  onBookingComplete
}) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({ checkIn: undefined, checkOut: undefined });
  const [guestCount, setGuestCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingConfirmation | null>(null);
  const [pricingDetails, setPricingDetails] = useState<PricingDetails | null>(null);
  const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);

  useEffect(() => {
    if (selectedProperty) {
      fetchAvailability(selectedProperty.id);
    }
  }, [selectedProperty]);

  useEffect(() => {
    if (selectedProperty && dateRange.checkIn && dateRange.checkOut) {
      calculatePricing();
    } else {
      setPricingDetails(null);
    }
  }, [selectedProperty, dateRange, guestCount]);

  const fetchAvailability = async (propertyId: string) => {
    setIsAvailabilityLoading(true);
    try {
      const today = new Date();
      const endDate = addDays(today, 90);
      
      const { data, error } = await supabase
        .from('property_availability')
        .select('*')
        .eq('property_id', propertyId)
        .or('status.eq.booked,status.eq.blocked,status.eq.pending')
        .gte('date', format(today, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'));
      
      if (error) {
        console.error('Error fetching availability:', error);
        setUnavailableDates([]);
      } else if (data) {
        const blockedDates = data.map(item => new Date(item.date));
        setUnavailableDates(blockedDates);
      }
    } catch (error) {
      console.error('Error in fetchAvailability:', error);
      toast.error('Failed to fetch availability. Please try again.');
    } finally {
      setIsAvailabilityLoading(false);
    }
  };

  const calculatePricing = async () => {
    if (!selectedProperty || !dateRange.checkIn || !dateRange.checkOut) return;

    const nightsCount = differenceInDays(dateRange.checkOut, dateRange.checkIn);
    if (nightsCount <= 0) return;
    
    try {
      const { data, error } = await supabase
        .from('property_availability')
        .select('date, price')
        .eq('property_id', selectedProperty.id)
        .gte('date', format(dateRange.checkIn, 'yyyy-MM-dd'))
        .lt('date', format(dateRange.checkOut, 'yyyy-MM-dd'));
      
      let totalBasePrice = 0;
      
      if (error) {
        console.error('Error fetching custom pricing:', error);
        totalBasePrice = selectedProperty.basePrice * nightsCount;
      } else if (data && data.length > 0) {
        const dateMap = new Map();
        data.forEach(item => {
          dateMap.set(item.date, item.price);
        });
        
        let currentDate = new Date(dateRange.checkIn);
        while (currentDate < dateRange.checkOut) {
          const dateStr = format(currentDate, 'yyyy-MM-dd');
          const customPrice = dateMap.get(dateStr);
          
          if (customPrice) {
            totalBasePrice += customPrice;
          } else {
            totalBasePrice += selectedProperty.basePrice;
          }
          
          currentDate = addDays(currentDate, 1);
        }
      } else {
        totalBasePrice = selectedProperty.basePrice * nightsCount;
      }
      
      let seasonalAdjustment = 0;
      if (selectedProperty.seasonalPricing) {
        const checkInMonth = format(dateRange.checkIn, 'MM-dd');
        const multiplier = selectedProperty.seasonalPricing[checkInMonth] || 1;
        seasonalAdjustment = totalBasePrice * (multiplier - 1);
      }
      
      let discount = 0;
      if (selectedProperty.extendedStayDiscounts && nightsCount > 0) {
        const applicableDiscount = selectedProperty.extendedStayDiscounts
          .filter(d => nightsCount >= d.days)
          .sort((a, b) => b.days - a.days)[0];
          
        if (applicableDiscount) {
          discount = (totalBasePrice + seasonalAdjustment) * (applicableDiscount.discountPercentage / 100);
        }
      }
      
      const cleaningFee = 75;
      const serviceFee = ((totalBasePrice + seasonalAdjustment - discount) * 0.1);
      
      const total = totalBasePrice + seasonalAdjustment - discount + cleaningFee + serviceFee;
      
      setPricingDetails({
        basePrice: totalBasePrice,
        nightsCount,
        seasonalAdjustment,
        discount,
        cleaningFee,
        serviceFee,
        total
      });
    } catch (error) {
      console.error('Error calculating pricing:', error);
      toast.error('Failed to calculate pricing. Please try again.');
    }
  };

  const handleDateSelect = (range: { from?: Date, to?: Date }) => {
    setDateRange({
      checkIn: range.from,
      checkOut: range.to
    });
  };

  const clearDateSelection = () => {
    setDateRange({
      checkIn: undefined,
      checkOut: undefined
    });
    toast.info('Date selection cleared');
  };

  const resetBooking = () => {
    setSelectedProperty(null);
    setDateRange({ checkIn: undefined, checkOut: undefined });
    setGuestCount(1);
    setBookingConfirmation(null);
    setPricingDetails(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!selectedProperty || !dateRange.checkIn || !dateRange.checkOut) {
      toast.error('Please select a property and dates before booking');
      return;
    }
    
    const formData = new FormData(event.currentTarget);
    
    const bookingData: BookingFormData = {
      propertyId: selectedProperty.id,
      checkInDate: format(dateRange.checkIn, 'yyyy-MM-dd'),
      checkOutDate: format(dateRange.checkOut, 'yyyy-MM-dd'),
      guestCount: guestCount,
      customerName: formData.get('customerName') as string,
      customerEmail: formData.get('customerEmail') as string,
      customerPhone: formData.get('customerPhone') as string,
      specialRequests: formData.get('specialRequests') as string,
      basePrice: pricingDetails?.basePrice,
      cleaningFee: pricingDetails?.cleaningFee,
      serviceFee: pricingDetails?.serviceFee,
      discount: pricingDetails?.discount,
      seasonalAdjustment: pricingDetails?.seasonalAdjustment,
      totalPrice: pricingDetails?.total
    };
    
    if (!bookingData.customerName || !bookingData.customerEmail || !bookingData.customerPhone) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        toast.error('You must be logged in to book');
        setIsSubmitting(false);
        return;
      }
      
      const { data: bookingData, error: bookingError } = await supabase
        .from('booking')
        .insert({
          propertyId: selectedProperty.id,
          userId: userData.user.id,
          checkIn: new Date(dateRange.checkIn).toISOString(),
          checkOut: new Date(dateRange.checkOut).toISOString(),
          status: 'PENDING',
          basePrice: pricingDetails?.basePrice || selectedProperty.basePrice * differenceInDays(dateRange.checkOut, dateRange.checkIn),
          cleaningFee: pricingDetails?.cleaningFee || 75,
          serviceFee: pricingDetails?.serviceFee || 0,
          discount: pricingDetails?.discount || 0,
          seasonalAdjustment: pricingDetails?.seasonalAdjustment || 0,
          totalPrice: pricingDetails?.total || selectedProperty.basePrice * differenceInDays(dateRange.checkOut, dateRange.checkIn)
        })
        .select()
        .single();
      
      if (bookingError) {
        console.error('Error creating booking:', bookingError);
        toast.error('Failed to create booking. Please try again.');
        setIsSubmitting(false);
        return;
      }
      
      let currentDate = new Date(dateRange.checkIn);
      const datesInRange: {date: string, price: number}[] = [];
      
      while (currentDate < dateRange.checkOut) {
        let datePrice = selectedProperty.basePrice;
        
        if (selectedProperty.seasonalPricing) {
          const dateKey = format(currentDate, 'MM-dd');
          const multiplier = selectedProperty.seasonalPricing[dateKey] || 1;
          datePrice *= multiplier;
        }
        
        datesInRange.push({
          date: format(currentDate, 'yyyy-MM-dd'),
          price: datePrice
        });
        
        currentDate = addDays(currentDate, 1);
      }
      
      const availabilityEntries = datesInRange.map(({date, price}) => ({
        property_id: selectedProperty.id,
        date: date,
        status: 'booked',
        booking_id: bookingData.id,
        price: price
      }));
      
      const { error: availabilityError } = await supabase
        .from('property_availability')
        .upsert(availabilityEntries, {
          onConflict: 'property_id,date'
        });
      
      if (availabilityError) {
        console.error('Error updating availability:', availabilityError);
      }
      
      const confirmation: BookingConfirmation = {
        bookingId: bookingData.id,
        customerName: formData.get('customerName') as string,
        propertyName: selectedProperty.name,
        checkInDate: format(dateRange.checkIn, 'yyyy-MM-dd'),
        checkOutDate: format(dateRange.checkOut, 'yyyy-MM-dd'),
        guestCount: guestCount,
        totalPrice: pricingDetails?.total || 0
      };
      
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

  // Check if the form is valid for submission
  const isFormValid = !!selectedProperty && !!dateRange.checkIn && !!dateRange.checkOut;

  return (
    <div 
      className={cn(
        "bg-background border shadow-elegant",
        "transition-all duration-300 overflow-hidden",
        "w-full mx-auto my-4"
      )}
      style={{ 
        borderRadius,
        fontFamily,
        ...(primaryColor ? { '--primary': primaryColor } as React.CSSProperties : {}),
        ...(secondaryColor ? { backgroundColor: secondaryColor } as React.CSSProperties : {}),
        '--calendar-selected-bg': primaryColor || '#0EA5E9',
        '--calendar-selected-text': '#FFFFFF',
        '--calendar-range-bg': secondaryColor || '#D3E4FD',
        '--calendar-range-text': '#0F172A',
      } as React.CSSProperties}
    >
      <div className="p-6">
        <div className="text-center mb-6 animate-fade-in">
          <h2 className="text-xl font-bold mb-1">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {bookingConfirmation ? (
          <BookingConfirmationView 
            bookingConfirmation={bookingConfirmation} 
            resetBooking={resetBooking} 
          />
        ) : (
          <div className="space-y-6">
            <PropertySelector 
              properties={properties}
              onSelectProperty={setSelectedProperty} 
              selectedProperty={selectedProperty} 
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PropertyDateRangePicker 
                dateRange={dateRange}
                onDateSelect={handleDateSelect}
                clearDateSelection={clearDateSelection}
                isAvailabilityLoading={isAvailabilityLoading}
                unavailableDates={unavailableDates}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
              />
              
              <div>
                {selectedProperty && (
                  <PropertyDetails 
                    selectedProperty={selectedProperty}
                    pricingDetails={pricingDetails}
                    guestCount={guestCount}
                    setGuestCount={setGuestCount}
                  />
                )}
              </div>
            </div>
            
            <GuestInformationForm 
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              allowSpecialRequests={allowSpecialRequests}
              pricingDetails={pricingDetails}
              isFormValid={isFormValid}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyBookingWidget;
