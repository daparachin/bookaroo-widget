
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { TimeSlot, DayAvailability } from '@/types/booking';
import { bookingService } from '@/services/bookingService';
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";

interface TimeSlotSelectorProps {
  selectedDate: Date | undefined;
  onSelectTimeSlot: (slot: TimeSlot | null) => void;
  selectedTimeSlot: TimeSlot | null;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  selectedDate,
  onSelectTimeSlot,
  selectedTimeSlot
}) => {
  const [dayAvailability, setDayAvailability] = useState<DayAvailability | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedDate) {
      setDayAvailability(null);
      onSelectTimeSlot(null);
      return;
    }

    const fetchDayAvailability = async () => {
      setIsLoading(true);
      try {
        const dateString = selectedDate.toISOString().split('T')[0];
        const availability = await bookingService.getDayAvailability(dateString);
        setDayAvailability(availability);
        // Reset selected time slot when date changes
        onSelectTimeSlot(null);
      } catch (error) {
        console.error('Error fetching day availability:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDayAvailability();
  }, [selectedDate, onSelectTimeSlot]);

  if (!selectedDate) {
    return (
      <div className="mt-6 p-4 rounded-lg border bg-muted/30 text-center">
        <p className="text-muted-foreground text-sm">Please select a date first</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-6 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Available times</h3>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-12 rounded-md animate-pulse-subtle" />
          ))}
        </div>
      </div>
    );
  }

  const availableSlots = dayAvailability?.slots?.filter(slot => slot.available) || [];

  if (availableSlots.length === 0) {
    return (
      <div className="mt-6 p-4 rounded-lg border bg-muted/30 text-center">
        <p className="text-muted-foreground text-sm">No available time slots for this date</p>
      </div>
    );
  }

  return (
    <div className="mt-6 animate-fade-in">
      <h3 className="text-sm font-medium mb-3 text-muted-foreground">
        Select a time
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {availableSlots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => onSelectTimeSlot(slot)}
            className={cn(
              "p-3 rounded-md text-sm font-medium border transition-all duration-200",
              "hover:shadow-md hover:border-primary hover:scale-[1.02] active:scale-[0.98]",
              selectedTimeSlot?.id === slot.id
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-card text-card-foreground"
            )}
          >
            <div className="flex items-center justify-center">
              <Clock className="w-3 h-3 mr-1.5 opacity-70" />
              <span>{slot.startTime}</span>
            </div>
            {slot.price > 35 && (
              <div className="mt-1 text-xs font-normal opacity-80">
                ${slot.price}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotSelector;
