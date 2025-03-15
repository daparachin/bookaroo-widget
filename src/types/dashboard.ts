import { Property, BookingConfirmation, PricingDetails } from './booking';

// Dashboard metrics
export interface DashboardMetrics {
  totalBookings: number;
  occupancyRate: number;
  totalRevenue: number;
  pendingBookings: number;
}

// Chart data structures
export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface RevenueChartData {
  daily: ChartDataPoint[];
  monthly: ChartDataPoint[];
}

export interface OccupancyChartData {
  monthly: ChartDataPoint[];
}

// Recent activity item
export interface ActivityItem {
  id: string;
  type: 'booking_created' | 'booking_canceled' | 'property_updated' | 'payout_processed';
  message: string;
  timestamp: string;
  propertyId?: string;
  bookingId?: string;
}

// Property creation and editing
export interface PropertyFormData extends Omit<Property, 'id'> {
  id?: string;
  // Make sure location is also included (inherited from Property)
}

// Calendar availability type
export interface AvailabilityCalendarEntry {
  date: string;
  status: 'available' | 'booked' | 'blocked' | 'pending';
  bookingId?: string;
  price?: number;
}

// Booking entry with expanded information for admin
export interface AdminBooking extends BookingConfirmation {
  id: string; // Primary identifier
  propertyId: string;
  guestName: string; // Customer name alias for UI consistency
  guestEmail: string; // Customer email for UI consistency
  guestPhone?: string;
  status: 'pending' | 'confirmed' | 'canceled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Add pricing details
  basePrice?: number;
  cleaningFee?: number;
  serviceFee?: number;
  discount?: number;
  seasonalAdjustment?: number;
}

// User notification preferences
export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  newBookingAlert: boolean;
  bookingCancellationAlert: boolean;
  paymentReceivedAlert: boolean;
  lowAvailabilityAlert: boolean;
  reportDelivery: 'daily' | 'weekly' | 'monthly' | 'never';
}

// Widget embedding config
export interface WidgetConfig {
  propertyIds: string[];
  title: string;
  subtitle: string;
  primaryColor: string;
  secondaryColor: string;
  allowSpecialRequests: boolean;
  borderRadius: string;
  fontFamily?: string;
  apiKey?: string;
}
