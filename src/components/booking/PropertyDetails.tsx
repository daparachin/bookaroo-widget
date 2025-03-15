
import React from 'react';
import { Property, PricingDetails } from '@/types/booking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PricingSummary from './PricingSummary';

interface PropertyDetailsProps {
  selectedProperty: Property;
  pricingDetails: PricingDetails | null;
  guestCount: number;
  setGuestCount: (count: number) => void;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  selectedProperty,
  pricingDetails,
  guestCount,
  setGuestCount
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium mb-3 text-muted-foreground">Property details</h3>
      
      <div className="border rounded-lg overflow-hidden">
        {selectedProperty.image && (
          <img 
            src={selectedProperty.image} 
            alt={selectedProperty.name} 
            className="w-full h-40 object-cover"
          />
        )}
        
        <div className="p-4">
          <h4 className="font-medium">{selectedProperty.name}</h4>
          <p className="text-sm text-muted-foreground">{selectedProperty.description}</p>
          
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Type:</span> {selectedProperty.type}
            </div>
            <div>
              <span className="font-medium">Max guests:</span> {selectedProperty.maxGuests}
            </div>
            <div>
              <span className="font-medium">Bedrooms:</span> {selectedProperty.bedrooms}
            </div>
            <div>
              <span className="font-medium">Bathrooms:</span> {selectedProperty.bathrooms}
            </div>
          </div>
          
          {selectedProperty.amenities.length > 0 && (
            <div className="mt-3">
              <span className="font-medium">Amenities:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedProperty.amenities.map((amenity, i) => (
                  <span key={i} className="text-xs bg-muted px-2 py-1 rounded-full">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {pricingDetails && (
        <PricingSummary pricingDetails={pricingDetails} />
      )}
      
      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">Number of guests</label>
        <div className="flex items-center gap-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
            disabled={guestCount <= 1}
            className="h-9 w-9 p-0 flex items-center justify-center"
          >
            -
          </Button>
          <Input 
            value={guestCount} 
            onChange={(e) => setGuestCount(Math.min(
              selectedProperty?.maxGuests || 1,
              Math.max(1, parseInt(e.target.value) || 1)
            ))}
            className="w-16 text-center" 
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => setGuestCount(Math.min(selectedProperty?.maxGuests || 1, guestCount + 1))}
            disabled={guestCount >= (selectedProperty?.maxGuests || 1)}
            className="h-9 w-9 p-0 flex items-center justify-center"
          >
            +
          </Button>
          <span className="text-sm text-muted-foreground">
            (Max: {selectedProperty?.maxGuests || 1})
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
