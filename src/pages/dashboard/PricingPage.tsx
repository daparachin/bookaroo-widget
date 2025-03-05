
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Property } from '@/types/booking';
import { toast } from 'sonner';

// Mock data for properties
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
    seasonalPricing: {
      "06-01": 1.3,  // Summer premium
      "07-01": 1.5,  // Peak summer
      "12-15": 1.2,  // Holiday season
    },
    extendedStayDiscounts: [
      { days: 7, discountPercentage: 5 },
      { days: 14, discountPercentage: 10 },
      { days: 30, discountPercentage: 15 },
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
    seasonalPricing: {
      "09-01": 1.2,  // Fall conference season
      "12-15": 1.3,  // Holiday season
    },
    extendedStayDiscounts: [
      { days: 7, discountPercentage: 7 },
      { days: 30, discountPercentage: 20 },
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
    seasonalPricing: {
      "12-01": 1.4,  // Winter ski season
      "01-01": 1.5,  // New Year peak
    },
    extendedStayDiscounts: [
      { days: 7, discountPercentage: 5 },
      { days: 14, discountPercentage: 12 },
    ]
  },
];

const PricingPage: React.FC = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState(mockProperties[0].id);
  const [basePrice, setBasePrice] = useState(mockProperties[0].basePrice);
  const [seasonalPricing, setSeasonalPricing] = useState<Record<string, number>>(
    mockProperties[0].seasonalPricing || {}
  );
  const [extendedStayDiscounts, setExtendedStayDiscounts] = useState(
    mockProperties[0].extendedStayDiscounts || []
  );
  
  const [newSeasonDate, setNewSeasonDate] = useState('');
  const [newSeasonMultiplier, setNewSeasonMultiplier] = useState(1.2);
  const [newDiscountDays, setNewDiscountDays] = useState(7);
  const [newDiscountPercent, setNewDiscountPercent] = useState(5);
  
  const handlePropertyChange = (value: string) => {
    const selectedProperty = mockProperties.find(p => p.id === value);
    if (selectedProperty) {
      setSelectedPropertyId(value);
      setBasePrice(selectedProperty.basePrice);
      setSeasonalPricing(selectedProperty.seasonalPricing || {});
      setExtendedStayDiscounts(selectedProperty.extendedStayDiscounts || []);
    }
  };
  
  const handleBasePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setBasePrice(value);
    }
  };
  
  const handleSaveBasePrice = () => {
    toast.success(`Base price updated to $${basePrice}`);
  };
  
  const handleAddSeasonalPrice = () => {
    if (!newSeasonDate) {
      toast.error('Please select a date');
      return;
    }
    
    const date = newSeasonDate.split('-').slice(1).join('-');
    
    setSeasonalPricing({
      ...seasonalPricing,
      [date]: newSeasonMultiplier
    });
    
    setNewSeasonDate('');
    setNewSeasonMultiplier(1.2);
    toast.success('Seasonal pricing added');
  };
  
  const handleRemoveSeasonalPrice = (date: string) => {
    const updatedPricing = { ...seasonalPricing };
    delete updatedPricing[date];
    setSeasonalPricing(updatedPricing);
    toast.success('Seasonal pricing removed');
  };
  
  const handleAddDiscount = () => {
    if (newDiscountDays <= 0 || newDiscountPercent <= 0) {
      toast.error('Please enter valid values');
      return;
    }
    
    setExtendedStayDiscounts([
      ...extendedStayDiscounts,
      {
        days: newDiscountDays,
        discountPercentage: newDiscountPercent
      }
    ]);
    
    setNewDiscountDays(7);
    setNewDiscountPercent(5);
    toast.success('Extended stay discount added');
  };
  
  const handleRemoveDiscount = (days: number) => {
    setExtendedStayDiscounts(
      extendedStayDiscounts.filter(discount => discount.days !== days)
    );
    toast.success('Discount removed');
  };
  
  const formatSeasonDate = (dateString: string) => {
    const [month, day] = dateString.split('-');
    const months = ["January", "February", "March", "April", "May", "June", 
                     "July", "August", "September", "October", "November", "December"];
    return `${months[parseInt(month) - 1]} ${parseInt(day)}`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Pricing Management</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <Select value={selectedPropertyId} onValueChange={handlePropertyChange}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select property" />
          </SelectTrigger>
          <SelectContent>
            {mockProperties.map(property => (
              <SelectItem key={property.id} value={property.id}>
                {property.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Base Pricing</CardTitle>
            <CardDescription>
              Set the standard nightly rate for this property
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end space-x-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="basePrice">Base Price Per Night</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input
                    id="basePrice"
                    type="number"
                    className="pl-7"
                    value={basePrice}
                    onChange={handleBasePriceChange}
                  />
                </div>
              </div>
              <Button onClick={handleSaveBasePrice}>Update</Button>
            </div>
            
            <div className="text-sm text-muted-foreground mt-4">
              <p>The base price is the standard rate charged for this property on regular days.</p>
              <p className="mt-2">This price will be adjusted by seasonal pricing and discounts when applicable.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Seasonal Pricing</CardTitle>
            <CardDescription>
              Configure price adjustments for specific seasons
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="seasonDate">Season Start Date</Label>
                <Input
                  id="seasonDate"
                  type="date"
                  value={newSeasonDate}
                  onChange={(e) => setNewSeasonDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2 flex-1">
                <Label htmlFor="seasonMultiplier">Price Multiplier</Label>
                <div className="relative">
                  <Input
                    id="seasonMultiplier"
                    type="number"
                    step="0.1"
                    min="1"
                    max="3"
                    value={newSeasonMultiplier}
                    onChange={(e) => setNewSeasonMultiplier(parseFloat(e.target.value))}
                  />
                </div>
              </div>
              
              <Button onClick={handleAddSeasonalPrice}>Add</Button>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Season Start</TableHead>
                    <TableHead>Multiplier</TableHead>
                    <TableHead>Adjusted Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(seasonalPricing).length > 0 ? (
                    Object.entries(seasonalPricing).map(([date, multiplier]) => (
                      <TableRow key={date}>
                        <TableCell>{formatSeasonDate(date)}</TableCell>
                        <TableCell>×{multiplier.toFixed(1)}</TableCell>
                        <TableCell>${(basePrice * multiplier).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRemoveSeasonalPrice(date)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No seasonal pricing set
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Extended Stay Discounts</CardTitle>
            <CardDescription>
              Configure discounts for longer bookings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="discountDays">Minimum Stay (Days)</Label>
                <Input
                  id="discountDays"
                  type="number"
                  min="2"
                  max="90"
                  value={newDiscountDays}
                  onChange={(e) => setNewDiscountDays(parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-2 flex-1">
                <Label htmlFor="discountPercent">Discount (%)</Label>
                <div className="relative">
                  <Input
                    id="discountPercent"
                    type="number"
                    min="1"
                    max="50"
                    value={newDiscountPercent}
                    onChange={(e) => setNewDiscountPercent(parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <Button onClick={handleAddDiscount}>Add Discount</Button>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stay Length</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Sample Calculation (7 nights)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {extendedStayDiscounts.length > 0 ? (
                    extendedStayDiscounts
                      .sort((a, b) => a.days - b.days)
                      .map(discount => (
                        <TableRow key={discount.days}>
                          <TableCell>{discount.days}+ days</TableCell>
                          <TableCell>{discount.discountPercentage}% off</TableCell>
                          <TableCell>
                            ${(basePrice * 7 * (1 - discount.discountPercentage / 100)).toFixed(2)}
                            <span className="text-sm text-muted-foreground ml-2">
                              (save ${(basePrice * 7 * discount.discountPercentage / 100).toFixed(2)})
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleRemoveDiscount(discount.days)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No extended stay discounts set
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Pricing Policies</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Extended stay discounts are applied after seasonal pricing adjustments</li>
                <li>Only the highest applicable discount is applied to a booking</li>
                <li>Weekly cleaning fees may apply for bookings over 7 days</li>
                <li>Special events and holidays may have minimum stay requirements</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PricingPage;
