
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Property } from '@/types/booking';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [basePrice, setBasePrice] = useState(0);
  const [seasonalPricing, setSeasonalPricing] = useState<Record<string, number>>({});
  const [extendedStayDiscounts, setExtendedStayDiscounts] = useState<{days: number, discountPercentage: number}[]>([]);
  
  const [newSeasonDate, setNewSeasonDate] = useState('');
  const [newSeasonMultiplier, setNewSeasonMultiplier] = useState(1.2);
  const [newDiscountDays, setNewDiscountDays] = useState(7);
  const [newDiscountPercent, setNewDiscountPercent] = useState(5);
  const [savingChanges, setSavingChanges] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('property')
          .select('*')
          .eq('ownerId', user.id);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Transform the data to match our Property type
          const formattedProperties: Property[] = data.map(property => ({
            id: property.id,
            name: property.name,
            description: property.location, // Using location as description for now
            type: 'house', // Default type
            maxGuests: 4, // Default value
            bedrooms: 2, // Default value
            bathrooms: 1, // Default value
            amenities: [], // Default empty array
            basePrice: property.pricePerNight,
            seasonalPricing: property.seasonalPricing || {},
            extendedStayDiscounts: property.extendedStayDiscounts || []
          }));
          
          setProperties(formattedProperties);
          
          if (formattedProperties.length > 0) {
            setSelectedPropertyId(formattedProperties[0].id);
            setBasePrice(formattedProperties[0].basePrice);
            setSeasonalPricing(formattedProperties[0].seasonalPricing || {});
            setExtendedStayDiscounts(formattedProperties[0].extendedStayDiscounts || []);
          }
        }
      } catch (error: any) {
        console.error('Error fetching properties:', error);
        toast.error('Failed to load properties: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [user]);
  
  const handlePropertyChange = (value: string) => {
    const selectedProperty = properties.find(p => p.id === value);
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
  
  const handleSaveBasePrice = async () => {
    if (!user || !selectedPropertyId) return;
    
    setSavingChanges(true);
    try {
      const { error } = await supabase
        .from('property')
        .update({ pricePerNight: basePrice })
        .eq('id', selectedPropertyId)
        .eq('ownerId', user.id);
        
      if (error) throw error;
      
      // Update the local properties state
      setProperties(properties.map(p => 
        p.id === selectedPropertyId 
          ? {...p, basePrice} 
          : p
      ));
      
      toast.success('Base price updated successfully');
    } catch (error: any) {
      console.error('Error updating base price:', error);
      toast.error('Failed to update base price: ' + error.message);
    } finally {
      setSavingChanges(false);
    }
  };
  
  const handleAddSeasonalPrice = async () => {
    if (!user || !selectedPropertyId) return;
    if (!newSeasonDate) {
      toast.error('Please select a date');
      return;
    }
    
    setSavingChanges(true);
    
    try {
      const date = newSeasonDate.split('-').slice(1).join('-');
      const updatedPricing = {
        ...seasonalPricing,
        [date]: newSeasonMultiplier
      };
      
      const { error } = await supabase
        .from('property')
        .update({ seasonalPricing: updatedPricing })
        .eq('id', selectedPropertyId)
        .eq('ownerId', user.id);
        
      if (error) throw error;
      
      // Update local state
      setSeasonalPricing(updatedPricing);
      
      // Update the properties array
      setProperties(properties.map(p => 
        p.id === selectedPropertyId 
          ? {...p, seasonalPricing: updatedPricing} 
          : p
      ));
      
      setNewSeasonDate('');
      setNewSeasonMultiplier(1.2);
      toast.success('Seasonal pricing added');
    } catch (error: any) {
      console.error('Error adding seasonal price:', error);
      toast.error('Failed to add seasonal price: ' + error.message);
    } finally {
      setSavingChanges(false);
    }
  };
  
  const handleRemoveSeasonalPrice = async (date: string) => {
    if (!user || !selectedPropertyId) return;
    
    setSavingChanges(true);
    
    try {
      const updatedPricing = { ...seasonalPricing };
      delete updatedPricing[date];
      
      const { error } = await supabase
        .from('property')
        .update({ seasonalPricing: updatedPricing })
        .eq('id', selectedPropertyId)
        .eq('ownerId', user.id);
        
      if (error) throw error;
      
      // Update local state
      setSeasonalPricing(updatedPricing);
      
      // Update the properties array
      setProperties(properties.map(p => 
        p.id === selectedPropertyId 
          ? {...p, seasonalPricing: updatedPricing} 
          : p
      ));
      
      toast.success('Seasonal pricing removed');
    } catch (error: any) {
      console.error('Error removing seasonal price:', error);
      toast.error('Failed to remove seasonal price: ' + error.message);
    } finally {
      setSavingChanges(false);
    }
  };
  
  const handleAddDiscount = async () => {
    if (!user || !selectedPropertyId) return;
    
    if (newDiscountDays <= 0 || newDiscountPercent <= 0) {
      toast.error('Please enter valid values');
      return;
    }
    
    setSavingChanges(true);
    
    try {
      const updatedDiscounts = [
        ...extendedStayDiscounts,
        {
          days: newDiscountDays,
          discountPercentage: newDiscountPercent
        }
      ];
      
      const { error } = await supabase
        .from('property')
        .update({ extendedStayDiscounts: updatedDiscounts })
        .eq('id', selectedPropertyId)
        .eq('ownerId', user.id);
        
      if (error) throw error;
      
      // Update local state
      setExtendedStayDiscounts(updatedDiscounts);
      
      // Update the properties array
      setProperties(properties.map(p => 
        p.id === selectedPropertyId 
          ? {...p, extendedStayDiscounts: updatedDiscounts} 
          : p
      ));
      
      setNewDiscountDays(7);
      setNewDiscountPercent(5);
      toast.success('Extended stay discount added');
    } catch (error: any) {
      console.error('Error adding discount:', error);
      toast.error('Failed to add discount: ' + error.message);
    } finally {
      setSavingChanges(false);
    }
  };
  
  const handleRemoveDiscount = async (days: number) => {
    if (!user || !selectedPropertyId) return;
    
    setSavingChanges(true);
    
    try {
      const updatedDiscounts = extendedStayDiscounts.filter(discount => discount.days !== days);
      
      const { error } = await supabase
        .from('property')
        .update({ extendedStayDiscounts: updatedDiscounts })
        .eq('id', selectedPropertyId)
        .eq('ownerId', user.id);
        
      if (error) throw error;
      
      // Update local state
      setExtendedStayDiscounts(updatedDiscounts);
      
      // Update the properties array
      setProperties(properties.map(p => 
        p.id === selectedPropertyId 
          ? {...p, extendedStayDiscounts: updatedDiscounts} 
          : p
      ));
      
      toast.success('Discount removed');
    } catch (error: any) {
      console.error('Error removing discount:', error);
      toast.error('Failed to remove discount: ' + error.message);
    } finally {
      setSavingChanges(false);
    }
  };
  
  const formatSeasonDate = (dateString: string) => {
    const [month, day] = dateString.split('-');
    const months = ["January", "February", "March", "April", "May", "June", 
                     "July", "August", "September", "October", "November", "December"];
    return `${months[parseInt(month) - 1]} ${parseInt(day)}`;
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading properties...</span>
      </div>
    );
  }
  
  if (properties.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Pricing Management</h2>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">No properties found</h3>
              <p className="text-muted-foreground mb-4">
                Add a property in the Properties section before setting up pricing.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
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
            {properties.map(property => (
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
              <Button 
                onClick={handleSaveBasePrice} 
                disabled={savingChanges}
              >
                {savingChanges ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Update
              </Button>
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
              
              <Button 
                onClick={handleAddSeasonalPrice}
                disabled={savingChanges}
              >
                {savingChanges ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Add
              </Button>
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
                            disabled={savingChanges}
                          >
                            {savingChanges ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
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
              
              <Button 
                onClick={handleAddDiscount}
                disabled={savingChanges}
              >
                {savingChanges ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Add Discount
              </Button>
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
                              disabled={savingChanges}
                            >
                              {savingChanges ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
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
