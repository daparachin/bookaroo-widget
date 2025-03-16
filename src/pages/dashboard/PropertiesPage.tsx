import React, { useState } from 'react';
import { PropertyFormData } from '@/types/dashboard';
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash, MoreHorizontal, Loader2, RefreshCw } from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PropertyForm from '@/components/dashboard/PropertyForm';
import useProperties from '@/hooks/useProperties';
import { PropertyCreateData, PropertyData, PropertyUpdateData } from '@/types/api';

const PropertiesPage: React.FC = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProperty, setEditingProperty] = useState<PropertyFormData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Use our custom hook for properties data management
  const { 
    properties,
    isLoading,
    error,
    refetch,
    createProperty,
    isCreating,
    updateProperty,
    isUpdating,
    deleteProperty,
    isDeleting
  } = useProperties();
  
  // Filter properties based on search term
  const filteredProperties = properties.filter((property: PropertyData) => 
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initialize new property form
  const handleCreate = () => {
    setEditingProperty({
      name: '',
      description: '',
      location: '',
      type: 'house',
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 1,
      amenities: [],
      basePrice: 100
    });
    setIsDialogOpen(true);
  };

  // Open edit form for existing property
  const handleEdit = (property: PropertyData) => {
    setEditingProperty({
      id: property.id,
      name: property.name,
      description: property.location,
      location: property.location,
      type: 'house', // Default type since it's not in the API data
      maxGuests: property.maxGuests || 4,
      bedrooms: property.bedrooms || 2,
      bathrooms: property.bathrooms || 1,
      amenities: property.amenities || [],
      basePrice: property.pricePerNight,
      seasonalPricing: property.seasonalPricing,
      extendedStayDiscounts: property.extendedStayDiscounts
    });
    setIsDialogOpen(true);
  };

  // Handle property form submission
  const handleSubmit = async (formData: PropertyFormData) => {
    try {
      // Create or update property based on whether it has an ID
      if (formData.id) {
        // Prepare update data
        const updateData: PropertyUpdateData = {
          name: formData.name,
          location: formData.location || formData.description,
          pricePerNight: formData.basePrice,
          maxGuests: formData.maxGuests,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          amenities: formData.amenities,
          seasonalPricing: formData.seasonalPricing,
          extendedStayDiscounts: formData.extendedStayDiscounts
        };
        
        // Update existing property
        updateProperty({ id: formData.id, data: updateData });
      } else {
        // Prepare create data
        const createData: PropertyCreateData = {
          name: formData.name,
          location: formData.location || formData.description,
          pricePerNight: formData.basePrice,
          maxGuests: formData.maxGuests,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          amenities: formData.amenities,
          seasonalPricing: formData.seasonalPricing,
          extendedStayDiscounts: formData.extendedStayDiscounts
        };
        
        // Create new property
        createProperty(createData);
      }
      
      // Close dialog after successful submission
      setIsDialogOpen(false);
      setEditingProperty(null);
    } catch (error) {
      console.error('Error in form submission:', error);
      // Error is handled by the mutation
    }
  };

  // Handle property deletion
  const handleDelete = (propertyId: string) => {
    deleteProperty(propertyId);
  };

  // Check if any mutation is in progress
  const isSubmitting = isCreating || isUpdating || isDeleting;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Properties</h1>
        <Button onClick={handleCreate} className="flex items-center gap-2" disabled={isSubmitting}>
          <Plus className="h-4 w-4" /> Add Property
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Manage Your Properties</CardTitle>
              <CardDescription>
                View, add, and edit your rental properties.
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => refetch()} 
              disabled={isLoading || isSubmitting}
              title="Refresh properties"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="flex items-center mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search properties..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Failed to load properties</p>
              <Button variant="outline" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchTerm ? 'No properties match your search.' : 'No properties found. Add your first property!'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property: PropertyData) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.name}</TableCell>
                    <TableCell>{property.location}</TableCell>
                    <TableCell>${property.pricePerNight}/night</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={isSubmitting}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(property)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(property.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {properties.length > 0 && (
          <CardFooter className="border-t px-6 py-3">
            <p className="text-sm text-gray-500">
              Showing {filteredProperties.length} of {properties.length} properties
            </p>
          </CardFooter>
        )}
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProperty?.id ? 'Edit Property' : 'Add New Property'}</DialogTitle>
            <DialogDescription>
              {editingProperty?.id ? 'Update your property details.' : 'Add a new property to your portfolio.'}
            </DialogDescription>
          </DialogHeader>
          {editingProperty && (
            <PropertyForm 
              property={editingProperty} 
              onSubmit={handleSubmit} 
              isSubmitting={isSubmitting}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertiesPage;
