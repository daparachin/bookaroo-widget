
// If this file doesn't exist yet, we'll create it with the necessary types

export interface DateRange {
  checkIn?: Date;
  checkOut?: Date;
}

export interface PricingDetails {
  basePrice: number;
  nightsCount: number;
  cleaningFee: number;
  serviceFee: number;
  discount: number;
  seasonalAdjustment: number;
  total: number;
}

export interface Property {
  id: string;
  name: string;
  description?: string;
  location: string;
  type?: string;
  image?: string;
  basePrice: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  seasonalPricing?: { [key: string]: number }; // MM-DD format as key, price multiplier as value
  extendedStayDiscounts?: { days: number; discountPercentage: number }[];
}

export interface BookingService {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  image?: string;
}

export interface DayAvailability {
  date: string;
  hasAvailability: boolean;
  slots?: {
    id: string;
    startTime: string;
    endTime: string;
    available: boolean;
    price?: number;
  }[];
}

export interface BookingFormData {
  propertyId?: string;
  serviceId?: string;
  date?: string;
  startTime?: string;
  timeSlotId?: string; // Added this field
  checkInDate?: string;
  checkOutDate?: string;
  guestCount?: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  specialRequests?: string;
  // Pricing details
  basePrice?: number;
  cleaningFee?: number;
  serviceFee?: number;
  discount?: number;
  seasonalAdjustment?: number;
  totalPrice?: number;
}

export interface BookingConfirmation {
  bookingId: string;
  customerName: string;
  propertyName?: string;
  serviceName?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestCount?: number;
  price?: number;
  totalPrice: number;
}

export interface BookingWidgetProps {
  title?: string;
  subtitle?: string;
  properties?: Property[];
  services?: BookingService[];
  primaryColor?: string;
  secondaryColor?: string;
  borderRadius?: string;
  fontFamily?: string;
  allowSpecialRequests?: boolean;
  allowNotes?: boolean;
  apiEndpoint?: string;
  onBookingComplete?: (confirmation: BookingConfirmation) => void;
}

// Add TimeSlot type to fix the errors
export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
  price?: number;
}
