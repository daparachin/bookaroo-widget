import React, { useState } from 'react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWeekend } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Property } from '@/types/booking';
import { AvailabilityCalendarEntry } from '@/types/dashboard';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Lock, 
  Unlock,
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Mock data - properties
const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Luxury Beach House',
    description: 'Beautiful beachfront property with stunning ocean views',
    type: 'house',
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    amenities: ['Pool', 'WiFi', 'Kitchen', 'Air conditioning', 'Beach access'],
    basePrice: 350,
  },
  {
    id: '2',
    name: 'Downtown Apartment',
    description: 'Modern apartment in the heart of the city',
    type: 'apartment',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ['WiFi', 'Kitchen', 'Air conditioning', 'Gym access'],
    basePrice: 150,
  },
  {
    id: '3',
    name: 'Mountain Cabin',
    description: 'Cozy cabin with amazing mountain views',
    type: 'house',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['Fireplace', 'WiFi', 'Kitchen', 'Heating', 'Hiking trails'],
    basePrice: 220,
  },
];

// Generate mock availability data
const generateMockAvailability = (date: Date, propertyId: string): AvailabilityCalendarEntry[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days = eachDayOfInterval({ start, end });
  
  // Use a deterministic algorithm based on the day and property id
  const seed = parseInt(propertyId.replace(/\D/g, '') || '1', 10);
  
  return days.map(day => {
    // Use a deterministic algorithm based on the day and property id
    const dayNum = day.getDate();
    const rand = (seed * dayNum) % 100;
    
    let status: 'available' | 'booked' | 'blocked' | 'pending' = 'available';
    
    if (rand < 20) {
      status = 'booked';
    } else if (rand < 30) {
      status = 'blocked';
    } else if (rand < 35) {
      status = 'pending';
    }
    
    // Higher prices on weekends
    const price = isWeekend(day) 
      ? mockProperties.find(p => p.id === propertyId)?.basePrice! * 1.2
      : mockProperties.find(p => p.id === propertyId)?.basePrice;
    
    return {
      date: format(day, 'yyyy-MM-dd'),
      status,
      price,
      bookingId: status === 'booked' || status === 'pending' ? `booking-${dayNum}` : undefined
    };
  });
};

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPropertyId, setSelectedPropertyId] = useState(mockProperties[0].id);
  const [availabilityData, setAvailabilityData] = useState<AvailabilityCalendarEntry[]>(
    generateMockAvailability(currentDate, selectedPropertyId)
  );
  const [selectedDay, setSelectedDay] = useState<AvailabilityCalendarEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customPrice, setCustomPrice] = useState<number | null>(null);
  
  const handlePropertyChange = (value: string) => {
    setSelectedPropertyId(value);
    setAvailabilityData(generateMockAvailability(currentDate, value));
  };
  
  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
    setAvailabilityData(generateMockAvailability(newDate, selectedPropertyId));
  };
  
  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
    setAvailabilityData(generateMockAvailability(newDate, selectedPropertyId));
  };
  
  const handleDayClick = (day: AvailabilityCalendarEntry) => {
    setSelectedDay(day);
    setCustomPrice(day.price || null);
    setIsDialogOpen(true);
  };
  
  const getDayClass = (day: AvailabilityCalendarEntry) => {
    const baseClass = 'h-full min-h-[80px] p-1 border-t flex flex-col relative cursor-pointer hover:bg-muted/50';
    
    switch (day.status) {
      case 'booked':
        return `${baseClass} bg-red-50`;
      case 'blocked':
        return `${baseClass} bg-gray-100`;
      case 'pending':
        return `${baseClass} bg-yellow-50`;
      default:
        return baseClass;
    }
  };

  const getStatusBadgeClass = (status: AvailabilityCalendarEntry['status']) => {
    switch (status) {
      case 'booked':
        return 'bg-red-100 text-red-700';
      case 'blocked':
        return 'bg-gray-100 text-gray-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-green-100 text-green-700';
    }
  };
  
  const handleUpdateStatus = (newStatus: AvailabilityCalendarEntry['status']) => {
    if (!selectedDay) return;
    
    // Update the availability data
    const updatedData = availabilityData.map(day => 
      day.date === selectedDay.date 
        ? { ...day, status: newStatus } 
        : day
    );
    
    setAvailabilityData(updatedData);
    setIsDialogOpen(false);
    
    toast.success(`Day status updated to ${newStatus}`, {
      description: `${format(new Date(selectedDay.date), 'MMMM d, yyyy')}`
    });
  };
  
  const handleUpdatePrice = () => {
    if (!selectedDay || customPrice === null) return;
    
    // Update the availability data
    const updatedData = availabilityData.map(day => 
      day.date === selectedDay.date 
        ? { ...day, price: customPrice } 
        : day
    );
    
    setAvailabilityData(updatedData);
    setIsDialogOpen(false);
    
    toast.success(`Price updated for ${format(new Date(selectedDay.date), 'MMMM d, yyyy')}`, {
      description: `New price: $${customPrice}`
    });
  };
  
  const handleBlockRange = (days: number) => {
    if (!selectedDay) return;
    
    const startDate = new Date(selectedDay.date);
    const dates = Array.from({ length: days }, (_, i) => 
      format(addDays(startDate, i), 'yyyy-MM-dd')
    );
    
    // Update the availability data
    const updatedData = availabilityData.map(day => 
      dates.includes(day.date) && day.status !== 'booked'
        ? { ...day, status: 'blocked' } 
        : day
    );
    
    setAvailabilityData(updatedData);
    setIsDialogOpen(false);
    
    toast.success(`Blocked ${days} days starting from ${format(startDate, 'MMMM d, yyyy')}`);
  };
  
  // Create the calendar grid
  const calendarDays = [];
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Add week day headers
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Calendar & Availability</h2>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
        <div className="flex items-center space-x-2">
          <Select value={selectedPropertyId} onValueChange={handlePropertyChange}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              {mockProperties.map(property => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="px-4 py-2 font-medium">
            {format(currentDate, 'MMMM yyyy')}
          </div>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Availability Calendar</CardTitle>
          <CardDescription>
            Manage availability, bookings, and pricing for {mockProperties.find(p => p.id === selectedPropertyId)?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-7 bg-muted">
              {weekDays.map(day => (
                <div key={day} className="py-2 text-center font-medium text-sm">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 min-h-[600px]">
              {/* Handle empty cells for days of the week before the start of the month */}
              {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                <div key={`empty-start-${index}`} className="border-t bg-muted/20" />
              ))}
              
              {daysInMonth.map(day => {
                const dateString = format(day, 'yyyy-MM-dd');
                const dayData = availabilityData.find(d => d.date === dateString) || {
                  date: dateString,
                  status: 'available'
                };
                
                return (
                  <div 
                    key={dateString} 
                    className={getDayClass(dayData)}
                    onClick={() => handleDayClick(dayData)}
                  >
                    <div className="text-right mb-1">
                      <span className="text-sm font-medium">
                        {format(day, 'd')}
                      </span>
                    </div>
                    
                    <div className="flex flex-col justify-between flex-grow">
                      <div>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full inline-block ${getStatusBadgeClass(dayData.status)}`}>
                          {dayData.status.charAt(0).toUpperCase() + dayData.status.slice(1)}
                        </span>
                      </div>
                      
                      {dayData.bookingId && (
                        <div className="text-xs mt-1 text-muted-foreground">
                          Booking #{dayData.bookingId.split('-')[1]}
                        </div>
                      )}
                      
                      <div className="mt-auto text-xs font-medium">
                        ${dayData.price}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Handle empty cells for days of the week after the end of the month */}
              {Array.from({ length: 6 - monthEnd.getDay() }).map((_, index) => (
                <div key={`empty-end-${index}`} className="border-t bg-muted/20" />
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center mt-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-50 border rounded mr-1"></div>
              <span>Booked</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-50 border rounded mr-1"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-100 border rounded mr-1"></div>
              <span>Blocked</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white border rounded mr-1"></div>
              <span>Available</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialog for day details */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDay && format(new Date(selectedDay.date), 'MMMM d, yyyy')}
            </DialogTitle>
            <DialogDescription>
              Manage availability and pricing for this date
            </DialogDescription>
          </DialogHeader>
          
          {selectedDay && (
            <Tabs defaultValue="status">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="status">Availability</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="status" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Current Status</Label>
                  <div className={`px-3 py-2 rounded-md ${getStatusBadgeClass(selectedDay.status)}`}>
                    {selectedDay.status.charAt(0).toUpperCase() + selectedDay.status.slice(1)}
                    {selectedDay.bookingId && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        (Booking {selectedDay.bookingId.split('-')[1]})
                      </span>
                    )}
                  </div>
                </div>
                
                {selectedDay.status !== 'booked' && selectedDay.status !== 'pending' && (
                  <div className="space-y-2">
                    <Label>Change Status</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant={selectedDay.status === 'available' ? 'default' : 'outline'} 
                        className="justify-start"
                        onClick={() => handleUpdateStatus('available')}
                      >
                        <Unlock className="h-4 w-4 mr-2" />
                        Available
                      </Button>
                      <Button 
                        variant={selectedDay.status === 'blocked' ? 'default' : 'outline'} 
                        className="justify-start"
                        onClick={() => handleUpdateStatus('blocked')}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Blocked
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label>Block Multiple Days</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" onClick={() => handleBlockRange(2)}>Block 2 Days</Button>
                    <Button variant="outline" onClick={() => handleBlockRange(7)}>Block 7 Days</Button>
                    <Button variant="outline" onClick={() => handleBlockRange(14)}>Block 14 Days</Button>
                  </div>
                </div>
                
                {(selectedDay.status === 'booked' || selectedDay.status === 'pending') && (
                  <div className="rounded-md bg-muted p-3 text-sm">
                    <p className="text-muted-foreground">
                      This day has an active booking and cannot be modified directly.
                      To make changes, please go to the Bookings section.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="pricing" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Base Price</Label>
                  <div className="px-3 py-2 rounded-md bg-muted text-foreground">
                    ${mockProperties.find(p => p.id === selectedPropertyId)?.basePrice}/night
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Custom Price for this Date</Label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input
                        type="number"
                        min="0"
                        className="pl-6"
                        value={customPrice || ''}
                        onChange={(e) => setCustomPrice(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <Button onClick={handleUpdatePrice}>Update</Button>
                  </div>
                </div>
                
                <div className="rounded-md bg-muted p-3 text-sm">
                  <p className="text-muted-foreground">
                    Tip: Setting custom prices for weekends, holidays, or high seasons can help
                    maximize your revenue.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;
