import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  PropertyData,
  PropertyCreateData,
  PropertyUpdateData,
  UserData,
  createUserFromAuth,
  propertyCreateSchema,
  propertyUpdateSchema
} from '@/types/api';

// Generic error handler for API calls
const handleApiError = (error: any, customMessage?: string): never => {
  // Log the error for monitoring
  console.error('API Error:', error);
  
  // Determine error message to display to user
  let errorMessage = customMessage || 'An error occurred. Please try again.';
  
  // Parse error from Supabase or other API sources
  if (error?.message) {
    // Avoid exposing sensitive details in user-facing error messages
    if (error.message.includes('permission denied')) {
      errorMessage = 'You do not have permission to perform this action.';
    } else if (error.message.includes('not found')) {
      errorMessage = 'The requested resource was not found.';
    } else if (error.message.includes('duplicate key')) {
      errorMessage = 'This item already exists.';
    }
  }
  
  // Optionally display error as toast
  toast.error(errorMessage);
  
  // Re-throw a sanitized error for the component to handle
  throw new Error(errorMessage);
};

// Property-related API functions
export const propertyService = {
  async getProperties(): Promise<PropertyData[]> {
    try {
      const { data, error } = await supabase
        .from('property')
        .select('*');
      
      if (error) throw error;
      return data as PropertyData[] || [];
    } catch (error) {
      return handleApiError(error, 'Failed to load properties');
    }
  },
  
  async getProperty(propertyId: string): Promise<PropertyData | null> {
    try {
      const { data, error } = await supabase
        .from('property')
        .select('*')
        .eq('id', propertyId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw error;
      }
      
      return data as PropertyData;
    } catch (error) {
      return handleApiError(error, 'Failed to retrieve property details');
    }
  },
  
  async createProperty(propertyData: PropertyCreateData): Promise<PropertyData> {
    try {
      // Validate input data
      const validatedData = propertyCreateSchema.parse(propertyData);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Authentication required');
      }
      
      // Check if the user exists in the user table
      await this.ensureUserExists(user);
      
      // Create the property
      const { data, error } = await supabase
        .from('property')
        .insert({
          ...validatedData,
          ownerId: user.id
        })
        .select();
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('Failed to create property');
      }
      
      return data[0] as PropertyData;
    } catch (error) {
      if (error.name === 'ZodError') {
        // Handle validation errors
        const fieldErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        return handleApiError(error, `Validation error: ${fieldErrors}`);
      }
      return handleApiError(error, 'Failed to create property');
    }
  },
  
  async updateProperty(propertyId: string, propertyData: PropertyUpdateData): Promise<PropertyData> {
    try {
      // Validate input data
      const validatedData = propertyUpdateSchema.parse(propertyData);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Authentication required');
      }
      
      // Verify ownership before update
      await this.verifyPropertyOwnership(propertyId, user.id);
      
      // Update the property
      const { data, error } = await supabase
        .from('property')
        .update(validatedData)
        .eq('id', propertyId)
        .select();
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('Failed to update property');
      }
      
      return data[0] as PropertyData;
    } catch (error) {
      if (error.name === 'ZodError') {
        // Handle validation errors
        const fieldErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        return handleApiError(error, `Validation error: ${fieldErrors}`);
      }
      return handleApiError(error, 'Failed to update property');
    }
  },
  
  async deleteProperty(propertyId: string): Promise<boolean> {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Authentication required');
      }
      
      // Verify ownership before delete
      await this.verifyPropertyOwnership(propertyId, user.id);
      
      // Delete the property
      const { error } = await supabase
        .from('property')
        .delete()
        .eq('id', propertyId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      return handleApiError(error, 'Failed to delete property');
    }
  },
  
  // Helper function to verify property ownership
  async verifyPropertyOwnership(propertyId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('property')
      .select('ownerId')
      .eq('id', propertyId)
      .single();
    
    if (error) throw error;
    
    if (!data || data.ownerId !== userId) {
      throw new Error('You do not have permission to modify this property');
    }
    
    return true;
  },
  
  // Helper function to ensure user exists in the user table
  async ensureUserExists(user: any): Promise<UserData> {
    try {
      const { data: existingUser, error: userCheckError } = await supabase
        .from('user')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (existingUser) {
        return existingUser as UserData;
      }
      
      if (userCheckError && userCheckError.code !== 'PGRST116') {
        throw userCheckError;
      }
      
      // Create new user
      const newUser = createUserFromAuth(user);
      
      const { data: createdUser, error: createUserError } = await supabase
        .from('user')
        .insert(newUser)
        .select()
        .single();
      
      if (createUserError) {
        throw createUserError;
      }
      
      return createdUser as UserData;
    } catch (error) {
      return handleApiError(error, 'Failed to verify user account');
    }
  }
};

// Export other service modules as needed
export const bookingService = {
  // Implement booking-related API functions
};

// Add more service modules as needed 