
import React, { useState } from 'react';
import { Property } from '@/types/booking';
import { PropertyFormData } from '@/types/dashboard';
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash, Eye, MoreHorizontal } from 'lucide-react';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PropertyForm from '@/components/dashboard/PropertyForm';
import { toast } from 'sonner';

// Mock data
const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Luxury Beach House',
    description: 'Beautiful beachfront property with stunning ocean views',
    type: 'house',
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    amenities: ['Pool', 'WiFi', 'Kitchen', 'Air conditioning', 'Beach access'],
    basePrice: 350,
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    seasonalPricing: {
      '06-01': 1.2,
      '07-01': 1.5,
      '08-01': 1.5,
      '12-20': 1.8
    },
    extendedStayDiscounts: [
      { days: 7, discountPercentage: 5 },
      { days: 30, discountPercentage: 15 }
    ]
  },
  {
    id: '2',
    name: 'Downtown Apartment',
    description: 'Modern apartment in the heart of the city',
    type: 'apartment',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ['WiFi', 'Kitchen', 'Air conditioning', 'Gym access'],
    basePrice: 150,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    extendedStayDiscounts: [
      { days: 7, discountPercentage: 10 },
      { days: 30, discountPercentage: 25 }
    ]
  },
  {
    id: '3',
    name: 'Mountain Cabin',
    description: 'Cozy cabin with amazing mountain views',
    type: 'house',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['Fireplace', 'WiFi', 'Kitchen', 'Heating', 'Hiking trails'],
    basePrice: 220,
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2065&q=80',
    seasonalPricing: {
      '12-01': 1.4,
      '01-01': 1.6,
      '02-01': 1.6
    },
    extendedStayDiscounts: [
      { days: 7, discountPercentage: 8 }
    ]
  },
  {
    id: '4',
    name: 'Lakeside Villa',
    description: 'Peaceful villa with private lake access',
    type: 'villa',
    maxGuests: 10,
    bedrooms: 5,
    bathrooms: 4,
    amenities: ['Pool', 'WiFi', 'Kitchen', 'Boat dock', 'BBQ', 'Patio'],
    basePrice: 450,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2074&q=80',
    seasonalPricing: {
      '06-01': 1.3,
      '07-01': 1.4,
      '08-01': 1.4
    },
    extendedStayDiscounts: [
      { days: 7, discountPercentage: 5 },
      { days: 14, discountPercentage: 10 },
      { days: 30, discountPercentage: 20 }
    ]
  }
];

const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProperty, setEditingProperty] = useState<PropertyFormData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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

  const handleDelete = (propertyId: string) => {
    setProperties(properties.filter(p => p.id !== propertyId));
    toast.success('Property deleted successfully');
  };

  const handleSubmit = (formData: PropertyFormData) => {
    if (formData.id) {
      // Update existing property
      setProperties(properties.map(p => 
        p.id === formData.id ? { ...formData as Property } : p
      ));
      toast.success('Property updated successfully');
    } else {
      // Create new property
      const newProperty = {
        ...formData,
        id: `${Date.now()}`
      } as Property;
      
      setProperties([...properties, newProperty]);
      toast.success('Property created successfully');
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
              {filteredProperties.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No properties found. Try a different search or add a new property.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
