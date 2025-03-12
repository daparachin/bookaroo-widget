
import React, { useState, useEffect } from 'react';
import { Property } from '@/types/booking';
import { PropertyFormData } from '@/types/dashboard';
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash, Eye, MoreHorizontal, Loader2 } from 'lucide-react';
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
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProperty, setEditingProperty] = useState<PropertyFormData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch properties from Supabase
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('property')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transform data to match the Property type
          const formattedProperties: Property[] = data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.location, // Using location as description for now
            type: 'house', // Default value since it's not in the database yet
            maxGuests: 4, // Default value
            bedrooms: 2, // Default value
            bathrooms: 1, // Default value
            amenities: [],
            basePrice: item.pricePerNight,
            seasonalPricing: item.seasonalPricing || {},
            extendedStayDiscounts: item.extendedStayDiscounts || []
          }));
          
          setProperties(formattedProperties);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast.error('Failed to load properties');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, []);
  
  const filteredProperties = properties.filter(property => 
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingProperty({
      name: '',
      description: '',
      type: 'house',
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 1,
      amenities: [],
      basePrice: 100
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setIsDialogOpen(true);
  };

  const handleDelete = async (propertyId: string) => {
    try {
      const { error } = await supabase
        .from('property')
        .delete()
        .eq('id', propertyId);
      
      if (error) {
        throw error;
      }
      
      setProperties(properties.filter(p => p.id !== propertyId));
      toast.success('Property deleted successfully');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    }
  };

  const handleSubmit = async (formData: PropertyFormData) => {
    try {
      // Get the user's ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to save a property');
        return;
      }
      
      // Check if the user exists in the user table
      const { data: existingUser, error: userCheckError } = await supabase
        .from('user')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      
      // If user doesn't exist in user table, create them
      if (!existingUser && !userCheckError) {
        const { error: createUserError } = await supabase
          .from('user')
          .insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email,
            role: 'OWNER'
          });
        
        if (createUserError) {
          console.error('Error creating user:', createUserError);
          toast.error('Failed to create user profile');
          return;
        }
      } else if (userCheckError) {
        console.error('Error checking user:', userCheckError);
        toast.error('Failed to verify user account');
        return;
      }
      
      if (formData.id) {
        // Update existing property
        const { error } = await supabase
          .from('property')
          .update({
            name: formData.name,
            location: formData.description, // Using description as location for now
            pricePerNight: formData.basePrice,
            seasonalPricing: formData.seasonalPricing || {},
            extendedStayDiscounts: formData.extendedStayDiscounts || []
          })
          .eq('id', formData.id);
        
        if (error) {
          throw error;
        }
        
        // Update local state
        setProperties(properties.map(p => 
          p.id === formData.id ? { ...p, ...formData as Property } : p
        ));
        
        toast.success('Property updated successfully');
      } else {
        // Create new property
        const { data, error } = await supabase
          .from('property')
          .insert({
            name: formData.name,
            location: formData.description, // Using description as location for now
            pricePerNight: formData.basePrice,
            ownerId: user.id,
            seasonalPricing: formData.seasonalPricing || {},
            extendedStayDiscounts: formData.extendedStayDiscounts || []
          })
          .select();
        
        if (error) {
          throw error;
        }
        
        if (data && data[0]) {
          // Create a new Property object with the returned data
          const newProperty: Property = {
            id: data[0].id,
            name: data[0].name,
            description: data[0].location,
            type: 'house', // Default value
            maxGuests: formData.maxGuests,
            bedrooms: formData.bedrooms,
            bathrooms: formData.bathrooms,
            amenities: formData.amenities,
            basePrice: data[0].pricePerNight,
            seasonalPricing: data[0].seasonalPricing,
            extendedStayDiscounts: data[0].extendedStayDiscounts
          };
          
          setProperties([...properties, newProperty]);
          toast.success('Property created successfully');
        }
      }
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Failed to save property');
    }
    
    setIsDialogOpen(false);
    setEditingProperty(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Properties</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Property
        </Button>
      </div>
      
      <div className="flex items-center mb-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search properties..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>All Properties</CardTitle>
          <CardDescription>Manage your rental properties</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading properties...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Bedrooms</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {property.image && (
                          <div className="h-10 w-10 mr-3 rounded overflow-hidden">
                            <img 
                              src={property.image} 
                              alt={property.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div>{property.name}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                            {property.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{property.type}</span>
                    </TableCell>
                    <TableCell>{property.bedrooms}</TableCell>
                    <TableCell>${property.basePrice}/night</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(property)} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(property.id)} className="cursor-pointer text-destructive focus:text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProperties.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No properties found. Try a different search or add a new property.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProperty?.id ? 'Edit Property' : 'Add New Property'}
            </DialogTitle>
            <DialogDescription>
              {editingProperty?.id 
                ? 'Update your property information below.'
                : 'Fill in the details below to create a new property listing.'}
            </DialogDescription>
          </DialogHeader>
          
          {editingProperty && (
            <PropertyForm 
              property={editingProperty} 
              onSubmit={handleSubmit} 
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertiesPage;
