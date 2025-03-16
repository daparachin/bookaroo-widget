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
        <p className="text-muted-foreground text-sm">No properties available for booking.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 animate-fade-in property-selector">
      <h3 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 text-muted-foreground">Select a property</h3>
      
      <Carousel
        className="w-full"
        opts={{
          align: 'start',
          loop: properties.length > 1,
        }}
      >
        <CarouselContent className="-ml-2 sm:-ml-4">
          {properties.map((property) => (
            <CarouselItem key={property.id} className="pl-2 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
              <div 
                onClick={() => onSelectProperty(property)}
                className={cn(
                  "border rounded-lg overflow-hidden cursor-pointer transition-all h-full property-card",
                  "hover:shadow-md hover:border-primary/50",
                  selectedProperty?.id === property.id ? "ring-2 ring-primary ring-offset-1 sm:ring-offset-2" : ""
                )}
              >
                {property.image ? (
                  <div className="h-24 sm:h-32 overflow-hidden">
                    <img 
                      src={property.image} 
                      alt={property.name} 
                      className="w-full h-full object-cover transition-transform hover:scale-105" 
                    />
                  </div>
                ) : (
                  <div className="h-24 sm:h-32 bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-xs sm:text-sm">No image</span>
                  </div>
                )}
                
                <div className="p-2 sm:p-3">
                  <h4 className="font-medium mb-1 text-sm sm:text-base">{property.name}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {property.type}, {property.bedrooms} BR
                    </span>
                    <span className="font-medium text-xs sm:text-sm">
                      ${property.basePrice}/night
                    </span>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-end gap-1 mt-2">
          <CarouselPrevious className="static translate-y-0 h-6 w-6 sm:h-8 sm:w-8" />
          <CarouselNext className="static translate-y-0 h-6 w-6 sm:h-8 sm:w-8" />
        </div>
      </Carousel>
    </div>
  );
};

export default PropertySelector;
