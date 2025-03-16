/**
 * Type definitions for API data and interactions
 */

import { User } from '@supabase/supabase-js';
import { z } from 'zod';

// Base API response type
export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: string;
  };
}

// Property-related types
export interface PropertyData {
  id: string;
  name: string;
  location: string;
  pricePerNight: number;
  ownerId: string;
  maxGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  seasonalPricing?: Record<string, number>;
  extendedStayDiscounts?: { days: number; discountPercentage: number }[];
  createdAt: string;
}

// Property creation schema
export const propertyCreateSchema = z.object({
  name: z.string().min(3, 'Property name must be at least 3 characters'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  pricePerNight: z.number().positive('Price must be positive'),
  maxGuests: z.number().int().positive().optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  amenities: z.array(z.string()).optional(),
  seasonalPricing: z.record(z.string(), z.number().positive()).optional(),
  extendedStayDiscounts: z.array(
    z.object({
      days: z.number().int().positive(),
      discountPercentage: z.number().min(1).max(100)
    })
  ).optional()
});

export type PropertyCreateData = z.infer<typeof propertyCreateSchema>;

// Property update schema (similar but with optional fields)
export const propertyUpdateSchema = propertyCreateSchema.partial();
export type PropertyUpdateData = z.infer<typeof propertyUpdateSchema>;

// Booking-related types
export interface BookingData {
  id: string;
  userId: string;
  propertyId: string;
  checkIn: string;
  checkOut: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'COMPLETED';
  createdAt: string;
}

// User-related types
export interface UserData {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN' | 'OWNER';
  createdAt: string;
}

// Create user from Supabase Auth user
export const createUserFromAuth = (authUser: User): Partial<UserData> => {
  return {
    id: authUser.id,
    email: authUser.email || '',
    name: authUser.user_metadata?.name || authUser.email || '',
    role: 'USER',
  };
};

// Payment-related types
export interface PaymentData {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

// Availability-related types
export interface AvailabilityData {
  id: string;
  property_id: string;
  date: string;
  status: 'available' | 'booked' | 'unavailable';
  price?: number;
  booking_id?: string;
  updated_at: string;
} 