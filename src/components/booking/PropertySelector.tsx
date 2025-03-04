
import React from 'react';
import { Property } from '@/types/booking';
import { cn } from '@/lib/utils';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
      
      <Carousel
        className="w-full"
        opts={{
          align: 'start',
          loop: properties.length > 3,
        }}
      >
        <CarouselContent>
          {properties.map((property) => (
            <CarouselItem key={property.id} className="md:basis-1/2 lg:basis-1/3">
              <div 
                onClick={() => onSelectProperty(property)}
                className={cn(
                  "border rounded-lg overflow-hidden cursor-pointer transition-all h-full",
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
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-end gap-1 mt-2">
          <CarouselPrevious className="static translate-y-0 h-8 w-8" />
          <CarouselNext className="static translate-y-0 h-8 w-8" />
        </div>
      </Carousel>
    </div>
  );
};

export default PropertySelector;
