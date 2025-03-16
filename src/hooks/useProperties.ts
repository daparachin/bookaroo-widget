import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '@/services/apiService';
import { PropertyCreateData, PropertyUpdateData } from '@/types/api';
import { toast } from 'sonner';

export const QUERY_KEYS = {
  properties: 'properties',
  property: (id: string) => ['property', id],
};

/**
 * Hook for fetching and managing property data
 */
export const useProperties = () => {
  const queryClient = useQueryClient();
  
  // Fetch all properties
  const {
    data: properties = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.properties],
    queryFn: () => propertyService.getProperties(),
  });
  
  // Create a new property
  const createMutation = useMutation({
    mutationFn: (newProperty: PropertyCreateData) => 
      propertyService.createProperty(newProperty),
    onSuccess: (data) => {
      // Update the properties cache
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.properties] });
      toast.success('Property created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  
  // Update an existing property
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PropertyUpdateData }) => 
      propertyService.updateProperty(id, data),
    onSuccess: (data) => {
      // Update the properties cache
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.properties] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.property(data.id) });
      toast.success('Property updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  
  // Delete a property
  const deleteMutation = useMutation({
    mutationFn: (propertyId: string) => 
      propertyService.deleteProperty(propertyId),
    onSuccess: (_data, propertyId) => {
      // Update the properties cache
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.properties] });
      toast.success('Property deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  
  // Fetch a specific property by ID
  const useProperty = (propertyId: string) => {
    return useQuery({
      queryKey: QUERY_KEYS.property(propertyId),
      queryFn: () => propertyService.getProperty(propertyId),
      enabled: Boolean(propertyId),
    });
  };
  
  return {
    properties,
    isLoading,
    error,
    refetch,
    
    createProperty: createMutation.mutate,
    isCreating: createMutation.isPending,
    
    updateProperty: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    
    deleteProperty: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    
    useProperty,
  };
};

export default useProperties; 