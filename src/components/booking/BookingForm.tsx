import React, { useState, useEffect } from 'react';
import { format, differenceInDays, isWithinInterval, addDays } from 'date-fns';
import { BookingWidgetProps, Property, DateRange, PricingDetails, BookingFormData, BookingConfirmation } from '@/types/booking';
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import PropertySelector from './PropertySelector';
import PricingSummary from './PricingSummary';
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronsRight, Info, CalendarDays, CheckSquare, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
        .or('status.eq.booked,status.eq.blocked')
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

  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some(unavailableDate => 
      unavailableDate.getDate() === date.getDate() &&
      unavailableDate.getMonth() === date.getMonth() &&
      unavailableDate.getFullYear() === date.getFullYear()
    );
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
        ) : (
          <div className="space-y-6">
            <PropertySelector 
              properties={properties}
              onSelectProperty={setSelectedProperty} 
              selectedProperty={selectedProperty} 
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" /> Select your dates
                </h3>
                
                {isAvailabilityLoading ? (
                  <Skeleton className="w-full h-[320px] rounded-lg animate-pulse-subtle" />
                ) : (
                  <div className="animate-fade-in">
                    <Calendar
                      mode="range"
                      selected={{
                        from: dateRange.checkIn,
                        to: dateRange.checkOut
                      }}
                      onSelect={handleDateSelect}
                      numberOfMonths={1}
                      className="rounded-md border shadow-md"
                      classNames={{
                        day_selected: "!bg-[--calendar-selected-bg] !text-[--calendar-selected-text] hover:!bg-[--calendar-selected-bg] hover:!text-[--calendar-selected-text] focus:bg-[--calendar-selected-bg] focus:text-[--calendar-selected-text]",
                        day_range_middle: "!bg-[--calendar-range-bg] !text-[--calendar-range-text] hover:!bg-[--calendar-range-bg]/90",
                        day_today: "border border-[--calendar-selected-bg] bg-background text-foreground",
                        day: "transition-all hover:bg-muted focus:bg-muted h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md",
                        caption: "flex justify-center pt-1 relative items-center text-sm font-semibold",
                        caption_label: "text-sm font-medium grow text-center",
                        nav_button: "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-muted rounded-md"
                      }}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today || isDateUnavailable(date);
                      }}
                    />
                  </div>
                )}

                {(dateRange.checkIn || dateRange.checkOut) && (
                  <div className="mt-4 p-3 bg-[--calendar-range-bg]/30 rounded-md text-sm flex items-center justify-between">
                    <div className="flex items-center">
                      {dateRange.checkIn && (
                        <>
                          <CheckSquare className="h-4 w-4 mr-2 text-[--calendar-selected-bg]" />
                          <span>{format(dateRange.checkIn, 'MMM d, yyyy')}</span>
                        </>
                      )}
                      {dateRange.checkIn && dateRange.checkOut && (
                        <ChevronsRight className="inline-block mx-1 h-4 w-4" />
                      )}
                      {dateRange.checkOut && (
                        <span>{format(dateRange.checkOut, 'MMM d, yyyy')}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {dateRange.checkIn && dateRange.checkOut && (
                        <span className="font-medium">{differenceInDays(dateRange.checkOut, dateRange.checkIn)} nights</span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearDateSelection}
                        className="h-6 w-6 p-0 rounded-full"
                        title="Clear date selection"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                {selectedProperty && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium mb-3 text-muted-foreground">Property details</h3>
                    
                    <div className="border rounded-lg overflow-hidden">
                      {selectedProperty.image && (
                        <img 
                          src={selectedProperty.image} 
                          alt={selectedProperty.name} 
                          className="w-full h-40 object-cover"
                        />
                      )}
                      
                      <div className="p-4">
                        <h4 className="font-medium">{selectedProperty.name}</h4>
                        <p className="text-sm text-muted-foreground">{selectedProperty.description}</p>
                        
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Type:</span> {selectedProperty.type}
                          </div>
                          <div>
                            <span className="font-medium">Max guests:</span> {selectedProperty.maxGuests}
                          </div>
                          <div>
                            <span className="font-medium">Bedrooms:</span> {selectedProperty.bedrooms}
                          </div>
                          <div>
                            <span className="font-medium">Bathrooms:</span> {selectedProperty.bathrooms}
                          </div>
                        </div>
                        
                        {selectedProperty.amenities.length > 0 && (
                          <div className="mt-3">
                            <span className="font-medium">Amenities:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedProperty.amenities.map((amenity, i) => (
                                <span key={i} className="text-xs bg-muted px-2 py-1 rounded-full">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {pricingDetails && (
                      <PricingSummary pricingDetails={pricingDetails} />
                    )}
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">Number of guests</label>
                      <div className="flex items-center gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => setGuestCount(prev => Math.max(1, prev - 1))}
                          disabled={guestCount <= 1}
                          className="h-9 w-9 p-0 flex items-center justify-center"
                        >
                          -
                        </Button>
                        <Input 
                          value={guestCount} 
                          onChange={(e) => setGuestCount(Math.min(
                            selectedProperty?.maxGuests || 1,
                            Math.max(1, parseInt(e.target.value) || 1)
                          ))}
                          className="w-16 text-center" 
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => setGuestCount(prev => Math.min(selectedProperty?.maxGuests || 1, prev + 1))}
                          disabled={guestCount >= (selectedProperty?.maxGuests || 1)}
                          className="h-9 w-9 p-0 flex items-center justify-center"
                        >
                          +
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          (Max: {selectedProperty?.maxGuests || 1})
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-medium mb-4 text-muted-foreground">Guest information</h3>
              
              <div className="space-y-3">
                <div>
                  <Input
                    name="customerName"
                    placeholder="Full name *"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <Input
                    name="customerEmail"
                    placeholder="Email address *"
                    type="email"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <Input
                    name="customerPhone"
                    placeholder="Phone number *"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                {allowSpecialRequests && (
                  <div>
                    <Textarea
                      name="specialRequests"
                      placeholder="Special requests (optional)"
                      className="min-h-[80px] resize-none"
                      disabled={isSubmitting}
                    />
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full transition-all duration-300 h-12 text-base font-medium"
                disabled={!selectedProperty || !dateRange.checkIn || !dateRange.checkOut || isSubmitting}
              >
                {isSubmitting ? 'Processing...' : pricingDetails ? `Complete Booking - $${pricingDetails.total.toFixed(2)}` : 'Complete Booking'}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-2">
                By booking, you agree to our <a href="#" className="underline">Terms & Conditions</a>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyBookingWidget;
