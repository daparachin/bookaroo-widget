
export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
  price: number;
}

export interface DayAvailability {
  date: string;
  hasAvailability: boolean;
  slots?: TimeSlot[];
}

// Updated service to represent a property/room
export interface Property {
  id: string;
  name: string;
  description: string;
  type: 'room' | 'apartment' | 'house' | 'villa';
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  basePrice: number;
  image?: string;
  seasonalPricing?: {
    [key: string]: number; // Format: "MM-DD": priceMultiplier
  };
  extendedStayDiscounts?: {
    days: number;
    discountPercentage: number;
  }[];
}

// Represents a date range for a booking
export interface DateRange {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
}

// Pricing details with breakdown
export interface PricingDetails {
  basePrice: number;
  nightsCount: number;
  seasonalAdjustment: number;
  discount: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
}

// Updated form data for property bookings
export interface BookingFormData {
  propertyId: string;
  checkInDate: string; // YYYY-MM-DD format
  checkOutDate: string; // YYYY-MM-DD format
  guestCount: number;
  customerName: string; // Required field
  customerEmail: string; // Required field
  customerPhone: string; // Required field
  specialRequests?: string;
}

export interface BookingWidgetProps {
  title?: string;
  subtitle?: string;
  properties?: Property[];
  primaryColor?: string;
  secondaryColor?: string;
  borderRadius?: string;
  fontFamily?: string;
  allowSpecialRequests?: boolean;
  apiEndpoint?: string;
  onBookingComplete?: (bookingData: any) => void;
}

export interface BookingConfirmation {
  bookingId: string;
  customerName: string;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  totalPrice: number;
}

// Legacy interfaces kept for compatibility
export interface BookingService {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  image?: string;
}
