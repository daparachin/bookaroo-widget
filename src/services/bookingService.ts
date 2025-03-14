
import { BookingFormData, BookingConfirmation, DayAvailability, BookingService } from "@/types/booking";

// Mock data for development - would be replaced with actual API calls
const MOCK_SERVICES: BookingService[] = [
  {
    id: "haircut",
    name: "Haircut",
    description: "A professional haircut by our expert stylists.",
    duration: 30,
    price: 35,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "coloring",
    name: "Hair Coloring",
    description: "Full hair coloring service with premium products.",
    duration: 90,
    price: 120,
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "styling",
    name: "Hair Styling",
    description: "Professional styling for any occasion.",
    duration: 45,
    price: 55,
    image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
  }
];

// Generate mock availability for the next 30 days
const generateMockAvailability = (date: Date): DayAvailability => {
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const hasAvailability = !isWeekend && Math.random() > 0.2;
  
  const slots = hasAvailability 
    ? Array.from({ length: 8 }, (_, i) => {
        const hour = 9 + i;
        const startTime = `${hour}:00`;
        const endTime = `${hour + 1}:00`;
        return {
          id: `slot-${date.toISOString().split('T')[0]}-${hour}`,
          startTime,
          endTime,
          available: Math.random() > 0.3,
          price: Math.random() > 0.7 ? 45 : 35 // Some slots with premium pricing
        };
      })
    : [];
  
  return {
    date: date.toISOString().split('T')[0],
    hasAvailability,
    slots: hasAvailability ? slots : undefined
  };
};

export const bookingService = {
  getServices: async (): Promise<BookingService[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_SERVICES), 500);
    });
  },
  
  getMonthAvailability: async (year: number, month: number): Promise<DayAvailability[]> => {
    // Create an array of dates for the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
    
    // Generate availability for each day
    const availability = dates.map(generateMockAvailability);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(availability), 700);
    });
  },
  
  getDayAvailability: async (date: string): Promise<DayAvailability> => {
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const availability = generateMockAvailability(dateObj);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(availability), 500);
    });
  },
  
  createBooking: async (bookingData: BookingFormData): Promise<BookingConfirmation> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockService = MOCK_SERVICES.find(s => s.id === bookingData.serviceId);
        const basePrice = bookingData.basePrice || mockService?.price || 0;
        const serviceFee = bookingData.serviceFee || (basePrice * 0.1);
        const cleaningFee = bookingData.cleaningFee || 75;
        const discount = bookingData.discount || 0;
        const seasonalAdjustment = bookingData.seasonalAdjustment || 0;
        const totalPrice = (basePrice + serviceFee + cleaningFee + seasonalAdjustment) - discount;
        
        const confirmation: BookingConfirmation = {
          bookingId: `booking-${Date.now()}`,
          customerName: bookingData.customerName,
          propertyName: "Sample Property", // Default property name
          checkInDate: bookingData.date || bookingData.checkInDate || "",
          checkOutDate: bookingData.checkOutDate || "",
          guestCount: bookingData.guestCount || 1,
          totalPrice: totalPrice,
          // Legacy fields
          serviceName: mockService?.name,
          date: bookingData.date,
          startTime: "10:00", // Mock data
          endTime: "11:00",   // Mock data
          price: mockService?.price
        };
        resolve(confirmation);
      }, 1000);
    });
  }
};
