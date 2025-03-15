
import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { DateRange } from '@/types/booking';
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronsRight, CheckSquare, X, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';

interface PropertyDateRangePickerProps {
  dateRange: DateRange;
  onDateSelect: (range: { from?: Date, to?: Date }) => void;
  clearDateSelection: () => void;
  isAvailabilityLoading: boolean;
  unavailableDates: Date[];
  primaryColor?: string;
  secondaryColor?: string;
}

const PropertyDateRangePicker: React.FC<PropertyDateRangePickerProps> = ({
  dateRange,
  onDateSelect,
  clearDateSelection,
  isAvailabilityLoading,
  unavailableDates,
  primaryColor,
  secondaryColor
}) => {
  
  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some(unavailableDate => 
      unavailableDate.getDate() === date.getDate() &&
      unavailableDate.getMonth() === date.getMonth() &&
      unavailableDate.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-3 text-muted-foreground flex items-center gap-2">
        <CalendarDays className="h-4 w-4" /> Select your dates
      </h3>
      
      {isAvailabilityLoading ? (
        <Skeleton className="w-full h-[320px] rounded-lg animate-pulse-subtle" />
      ) : (
        <div className="animate-fade-in">
          <Calendar
            mode="range"
            selected={{
              from: dateRange.checkIn,
              to: dateRange.checkOut
            }}
            onSelect={onDateSelect}
            numberOfMonths={1}
            className="rounded-md border shadow-md"
            classNames={{
              day_selected: "!bg-[--calendar-selected-bg] !text-[--calendar-selected-text] hover:!bg-[--calendar-selected-bg] hover:!text-[--calendar-selected-text] focus:bg-[--calendar-selected-bg] focus:text-[--calendar-selected-text]",
              day_range_middle: "!bg-[--calendar-range-bg] !text-[--calendar-range-text] hover:!bg-[--calendar-range-bg]/90",
              day_today: "border border-[--calendar-selected-bg] bg-background text-foreground",
              day: "transition-all hover:bg-muted focus:bg-muted h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md",
              caption: "flex justify-center pt-1 relative items-center text-sm font-semibold",
              caption_label: "text-sm font-medium grow text-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-muted rounded-md"
            }}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today || isDateUnavailable(date);
            }}
          />
        </div>
      )}

      {(dateRange.checkIn || dateRange.checkOut) && (
        <div className="mt-4 p-3 bg-[--calendar-range-bg]/30 rounded-md text-sm flex items-center justify-between">
          <div className="flex items-center">
            {dateRange.checkIn && (
              <>
                <CheckSquare className="h-4 w-4 mr-2 text-[--calendar-selected-bg]" />
                <span>{format(dateRange.checkIn, 'MMM d, yyyy')}</span>
              </>
            )}
            {dateRange.checkIn && dateRange.checkOut && (
              <ChevronsRight className="inline-block mx-1 h-4 w-4" />
            )}
            {dateRange.checkOut && (
              <span>{format(dateRange.checkOut, 'MMM d, yyyy')}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {dateRange.checkIn && dateRange.checkOut && (
              <span className="font-medium">{differenceInDays(dateRange.checkOut, dateRange.checkIn)} nights</span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearDateSelection}
              className="h-6 w-6 p-0 rounded-full"
              title="Clear date selection"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDateRangePicker;
