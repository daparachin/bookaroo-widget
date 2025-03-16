import React, { useState, useEffect } from 'react';
import { BookingService } from '@/types/booking';
import { bookingService } from '@/services/bookingService';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from '@/lib/utils';

interface ServiceSelectorProps {
  onSelectService: (service: BookingService | null) => void;
  selectedService: BookingService | null;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ 
  onSelectService, 
  selectedService 
}) => {
  const [services, setServices] = useState<BookingService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const data = await bookingService.getServices();
        setServices(data);
        if (data.length > 0 && !selectedService) {
          onSelectService(data[0]);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [onSelectService, selectedService]);

  if (isLoading) {
    return (
      <div className="space-y-2 sm:space-y-3">
        <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Select a service</h3>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-16 sm:h-20 rounded-lg animate-pulse-subtle" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in service-selector">
      <h3 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 text-muted-foreground">Select a service</h3>
      <div className="space-y-2">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => onSelectService(service)}
            className={cn(
              "p-3 sm:p-4 rounded-lg border cursor-pointer group service-card",
              "hover:shadow-elegant hover:border-primary/40 transition-all duration-300",
              selectedService?.id === service.id
                ? "bg-primary/5 border-primary/40 shadow-elegant"
                : "bg-card"
            )}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              {service.image && (
                <div className="rounded-md overflow-hidden w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 transition-transform group-hover:scale-105">
                  <img 
                    src={service.image} 
                    alt={service.name} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              
              <div className="flex-1">
                <h4 className="font-medium mb-0.5 sm:mb-1 text-sm sm:text-base group-hover:text-primary transition-colors">
                  {service.name}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2 line-clamp-2">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium">${service.price}</span>
                  <span className="text-xs text-muted-foreground">
                    {service.duration} min
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelector;
