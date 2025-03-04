
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

export interface BookingService {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  image?: string;
}

export interface BookingFormData {
  serviceId: string;
  date: string;
  timeSlotId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}

export interface BookingWidgetProps {
  title?: string;
  subtitle?: string;
  services?: BookingService[];
  primaryColor?: string;
  borderRadius?: string;
  allowNotes?: boolean;
  apiEndpoint?: string;
  onBookingComplete?: (bookingData: any) => void;
}

export interface BookingConfirmation {
  bookingId: string;
  customerName: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
}
