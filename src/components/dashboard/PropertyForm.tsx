import React, { useState } from 'react';
import { PropertyFormData } from '@/types/dashboard';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash, Plus } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';

interface PropertyFormProps {
  property: PropertyFormData;
  onSubmit: (formData: PropertyFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const commonAmenities = [
  "WiFi", "Kitchen", "Air conditioning", "Heating", "TV", "Pool", 
  "Hot tub", "Washer", "Dryer", "Free parking", "Gym", "Balcony",
  "Patio", "BBQ grill", "Fireplace", "Sea view", "Mountain view",
  "Garden", "Beach access", "Pet friendly"
];

const PropertyForm: React.FC<PropertyFormProps> = ({ property, onSubmit, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    ...property
  });
  const [newAmenity, setNewAmenity] = useState("");
  const [seasonalDateKey, setSeasonalDateKey] = useState("");
  const [seasonalMultiplier, setSeasonalMultiplier] = useState(1);
  const [discountDays, setDiscountDays] = useState(7);
  const [discountPercentage, setDiscountPercentage] = useState(5);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value, 10) || 0
    });
  };

  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      type: value as 'room' | 'apartment' | 'house' | 'villa'
    });
  };

  const handleAmenityToggle = (amenity: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        amenities: [...(formData.amenities || []), amenity]
      });
    } else {
      setFormData({
        ...formData,
        amenities: (formData.amenities || []).filter(a => a !== amenity)
      });
    }
  };

  const addCustomAmenity = () => {
    if (newAmenity && !(formData.amenities || []).includes(newAmenity)) {
      setFormData({
        ...formData,
        amenities: [...(formData.amenities || []), newAmenity]
      });
      setNewAmenity("");
    }
  };

  const addSeasonalPricing = () => {
    if (seasonalDateKey && seasonalMultiplier > 0) {
      setFormData({
        ...formData,
        seasonalPricing: {
          ...(formData.seasonalPricing || {}),
          [seasonalDateKey]: seasonalMultiplier
        }
      });
      setSeasonalDateKey("");
      setSeasonalMultiplier(1);
    }
  };

  const removeSeasonalPricing = (key: string) => {
    if (!formData.seasonalPricing) return;
    
    const newSeasonalPricing = { ...formData.seasonalPricing };
    delete newSeasonalPricing[key];
    
    setFormData({
      ...formData,
      seasonalPricing: Object.keys(newSeasonalPricing).length ? newSeasonalPricing : undefined
    });
  };

  const addDiscount = () => {
    if (discountDays > 0 && discountPercentage > 0) {
      setFormData({
        ...formData,
        extendedStayDiscounts: [
          ...(formData.extendedStayDiscounts || []),
          { days: discountDays, discountPercentage }
        ]
      });
      setDiscountDays(7);
      setDiscountPercentage(5);
    }
  };

  const removeDiscount = (days: number) => {
    setFormData({
      ...formData,
      extendedStayDiscounts: (formData.extendedStayDiscounts || [])
        .filter(d => d.days !== days)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Property Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              required 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Property Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="room">Room</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="basePrice">Base Price per Night ($)</Label>
            <Input 
              id="basePrice" 
              name="basePrice" 
              type="number" 
              min="0"
              value={formData.basePrice} 
              onChange={handleNumberChange} 
              required 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input 
              id="bedrooms" 
              name="bedrooms" 
              type="number" 
              min="0"
              value={formData.bedrooms} 
              onChange={handleNumberChange} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input 
              id="bathrooms" 
              name="bathrooms" 
              type="number" 
              min="0"
              step="0.5"
              value={formData.bathrooms} 
              onChange={handleNumberChange} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxGuests">Max Guests</Label>
            <Input 
              id="maxGuests" 
              name="maxGuests" 
              type="number" 
              min="1"
              value={formData.maxGuests} 
              onChange={handleNumberChange} 
              required 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input 
            id="image" 
            name="image" 
            type="url" 
            value={formData.image || ''} 
            onChange={handleInputChange} 
            placeholder="https://example.com/image.jpg"
          />
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="amenities">
            <AccordionTrigger>Amenities</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {commonAmenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`amenity-${amenity}`} 
                        checked={(formData.amenities || []).includes(amenity)}
                        onCheckedChange={(checked) => handleAmenityToggle(amenity, checked === true)}
                      />
                      <Label htmlFor={`amenity-${amenity}`} className="text-sm">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Add custom amenity"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" size="sm" onClick={addCustomAmenity}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {(formData.amenities || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(formData.amenities || []).map((amenity) => (
                      <div key={amenity} className="flex items-center bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs">
                        {amenity}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => handleAmenityToggle(amenity, false)}
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="seasonal-pricing">
            <AccordionTrigger>Seasonal Pricing</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Set different pricing multipliers for specific dates or seasons.
                </p>
                
                <div className="flex space-x-2">
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="seasonalDateKey">Date (MM-DD)</Label>
                    <Input
                      id="seasonalDateKey"
                      placeholder="06-15"
                      value={seasonalDateKey}
                      onChange={(e) => setSeasonalDateKey(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="seasonalMultiplier">Price Multiplier</Label>
                    <Input
                      id="seasonalMultiplier"
                      type="number"
                      step="0.1"
                      min="0.1"
                      placeholder="1.5"
                      value={seasonalMultiplier}
                      onChange={(e) => setSeasonalMultiplier(parseFloat(e.target.value) || 1)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="button" onClick={addSeasonalPricing}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {Object.keys(formData.seasonalPricing || {}).length > 0 && (
                  <div className="space-y-2">
                    <Label>Current Seasonal Prices</Label>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-3 p-2 border-b bg-muted/50">
                        <div className="font-medium text-sm">Date</div>
                        <div className="font-medium text-sm">Multiplier</div>
                        <div className="font-medium text-sm text-right">Action</div>
                      </div>
                      {Object.entries(formData.seasonalPricing || {}).map(([date, multiplier]) => (
                        <div key={date} className="grid grid-cols-3 p-2 border-b last:border-0">
                          <div>{date}</div>
                          <div>×{multiplier}</div>
                          <div className="text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSeasonalPricing(date)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="discounts">
            <AccordionTrigger>Extended Stay Discounts</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Offer discounts for longer stays.
                </p>
                
                <div className="flex space-x-2">
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="discountDays">Minimum Days</Label>
                    <Input
                      id="discountDays"
                      type="number"
                      min="1"
                      placeholder="7"
                      value={discountDays}
                      onChange={(e) => setDiscountDays(parseInt(e.target.value) || 7)}
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="discountPercentage">Discount (%)</Label>
                    <Input
                      id="discountPercentage"
                      type="number"
                      min="1"
                      max="100"
                      placeholder="5"
                      value={discountPercentage}
                      onChange={(e) => setDiscountPercentage(parseInt(e.target.value) || 5)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="button" onClick={addDiscount}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {(formData.extendedStayDiscounts || []).length > 0 && (
                  <div className="space-y-2">
                    <Label>Current Discounts</Label>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-3 p-2 border-b bg-muted/50">
                        <div className="font-medium text-sm">Min. Days</div>
                        <div className="font-medium text-sm">Discount</div>
                        <div className="font-medium text-sm text-right">Action</div>
                      </div>
                      {(formData.extendedStayDiscounts || [])
                        .sort((a, b) => a.days - b.days)
                        .map((discount) => (
                          <div key={discount.days} className="grid grid-cols-3 p-2 border-b last:border-0">
                            <div>{discount.days} days</div>
                            <div>{discount.discountPercentage}%</div>
                            <div className="text-right">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDiscount(discount.days)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="mr-2">{property.id ? 'Updating...' : 'Creating...'}</span>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            </>
          ) : (
            property.id ? 'Update Property' : 'Create Property'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default PropertyForm;
