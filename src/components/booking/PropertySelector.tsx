
import React from 'react';
import { Property } from '@/types/booking';
import { cn } from '@/lib/utils';

interface PropertySelectorProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
}

const PropertySelector: React.FC<PropertySelectorProps> = ({ 
  properties, 
  selectedProperty, 
  onSelectProperty 
}) => {
  if (properties.length === 0) {
    return (
      <div className="text-center py-4 animate-fade-in">
        <p className="text-muted-foreground">No properties available for booking.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-sm font-medium mb-3 text-muted-foreground">Select a property</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => (
          <div 
            key={property.id}
            onClick={() => onSelectProperty(property)}
            className={cn(
              "border rounded-lg overflow-hidden cursor-pointer transition-all",
              "hover:shadow-md hover:border-primary/50",
              selectedProperty?.id === property.id ? "ring-2 ring-primary ring-offset-2" : ""
            )}
          >
            {property.image ? (
              <div className="h-32 overflow-hidden">
                <img 
                  src={property.image} 
                  alt={property.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105" 
                />
              </div>
            ) : (
              <div className="h-32 bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
            
            <div className="p-3">
              <h4 className="font-medium mb-1">{property.name}</h4>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {property.type}, {property.bedrooms} BR
                </span>
                <span className="font-medium">
                  ${property.basePrice}/night
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertySelector;
