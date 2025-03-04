
import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DayAvailability } from '@/types/booking';
import { bookingService } from '@/services/bookingService';
import { Skeleton } from "@/components/ui/skeleton";

interface CalendarViewProps {
  onSelectDate: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onSelectDate, selectedDate }) => {
  const [monthAvailability, setMonthAvailability] = useState<DayAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchAvailabilityForMonth = async (date: Date) => {
    setIsLoading(true);
    try {
      const availability = await bookingService.getMonthAvailability(
        date.getFullYear(),
        date.getMonth()
      );
      setMonthAvailability(availability);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailabilityForMonth(new Date());
  }, []);

  const handleMonthChange = (date: Date) => {
    fetchAvailabilityForMonth(date);
  };

  const isDayWithAvailability = (day: Date): boolean => {
    const dateString = day.toISOString().split('T')[0];
    const dayData = monthAvailability.find(d => d.date === dateString);
    return dayData?.hasAvailability || false;
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium mb-3 text-muted-foreground">Select a date</h3>
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="w-full h-[320px] rounded-lg animate-pulse-subtle" />
        </div>
      ) : (
        <div className="animate-fade-in">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            onMonthChange={handleMonthChange}
            className="rounded-md border shadow-elegant"
            classNames={{
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              day_disabled: "text-muted-foreground opacity-50",
              day: "transition-transform hover:scale-105 hover:font-medium",
              day_range_middle: "rounded-md",
              caption: "font-medium",
              nav_button: "hover:bg-muted hover:text-muted-foreground rounded-md transition-transform hover:scale-105"
            }}
            modifiers={{
              available: (date) => isDayWithAvailability(date),
            }}
            modifiersClassNames={{
              available: "border-primary border-[1.5px] text-primary font-medium",
            }}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today || !isDayWithAvailability(date);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CalendarView;
