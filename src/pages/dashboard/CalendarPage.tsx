
import React, { useState, useEffect } from 'react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWeekend, parseISO } from 'date-fns';
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
  Loader2
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [availabilityData, setAvailabilityData] = useState<AvailabilityCalendarEntry[]>([]);
  const [selectedDay, setSelectedDay] = useState<AvailabilityCalendarEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customPrice, setCustomPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) return;
    
    const fetchProperties = async () => {
      try {
        setLoading(true);
        
        const { data: userData, error: userError } = await supabase
          .from('user')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();
          
        if (userError) {
          console.error('Error checking user:', userError);
          
          if (!userData) {
            const { error: insertError } = await supabase
              .from('user')
              .insert({
                id: user.id,
                email: user.email,
                name: user.user_metadata?.name || user.email,
              });
              
            if (insertError) {
              console.error('Error creating user:', insertError);
              toast.error('Failed to initialize user data');
              setLoading(false);
              return;
            }
          }
        }
        
        const { data, error } = await supabase
          .from('property')
          .select('*')
          .eq('ownerId', user.id);
          
        if (error) {
          console.error('Error fetching properties:', error);
          toast.error('Failed to load properties');
          setLoading(false);
          return;
        }
        
        if (data && data.length > 0) {
          const formattedProperties: Property[] = data.map(prop => ({
            id: prop.id,
            name: prop.name,
            description: prop.location,
            // Cast the type to one of the allowed values
            type: (prop.type as 'house' | 'room' | 'apartment' | 'villa') || 'house',
            maxGuests: prop.maxGuests || 4,
            bedrooms: prop.bedrooms || 2,
            bathrooms: prop.bathrooms || 1,
            amenities: [],
            basePrice: prop.pricePerNight
          }));
          
          setProperties(formattedProperties);
          setSelectedPropertyId(formattedProperties[0].id);
        } else {
          setProperties(mockProperties);
          setSelectedPropertyId(mockProperties[0].id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred');
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [user]);
  
  useEffect(() => {
    if (!selectedPropertyId) return;
    
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        
        const startDateStr = format(monthStart, 'yyyy-MM-dd');
        const endDateStr = format(monthEnd, 'yyyy-MM-dd');
        
        const { data, error } = await supabase
          .from('property_availability')
          .select('*')
          .eq('property_id', selectedPropertyId)
          .gte('date', startDateStr)
          .lte('date', endDateStr);
          
        if (error) {
          console.error('Error fetching availability:', error);
          toast.error('Failed to load availability data');
          
          setAvailabilityData(generateMockAvailability(currentDate, selectedPropertyId));
          setLoading(false);
          return;
        }
        
        if (data && data.length > 0) {
          const formattedData = data.map(item => ({
            date: item.date,
            status: item.status as 'available' | 'booked' | 'blocked' | 'pending',
            price: item.price,
            bookingId: item.booking_id
          }));
          
          setAvailabilityData(formattedData);
        } else {
          const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
          const initialAvailability = days.map(day => {
            const property = properties.find(p => p.id === selectedPropertyId);
            const basePrice = property?.basePrice || 100;
            
            const price = isWeekend(day) ? basePrice * 1.2 : basePrice;
            
            return {
              date: format(day, 'yyyy-MM-dd'),
              status: 'available' as 'available' | 'booked' | 'blocked' | 'pending',
              price,
            };
          });
          
          setAvailabilityData(initialAvailability);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred');
        setLoading(false);
      }
    };
    
    fetchAvailability();
  }, [selectedPropertyId, currentDate, properties]);
  
  const handlePropertyChange = (value: string) => {
    setSelectedPropertyId(value);
  };
  
  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };
  
  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
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
  
  const handleUpdateStatus = async (newStatus: AvailabilityCalendarEntry['status']) => {
    if (!selectedDay || !selectedPropertyId) return;
    
    try {
      const existingData = await supabase
        .from('property_availability')
        .select('id')
        .eq('property_id', selectedPropertyId)
        .eq('date', selectedDay.date)
        .maybeSingle();
        
      if (existingData.data) {
        const { error } = await supabase
          .from('property_availability')
          .update({ 
            status: newStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.data.id);
          
        if (error) {
          console.error('Error updating availability:', error);
          toast.error('Failed to update day status');
          return;
        }
      } else {
        const { error } = await supabase
          .from('property_availability')
          .insert({
            property_id: selectedPropertyId,
            date: selectedDay.date,
            status: newStatus,
            price: selectedDay.price
          });
          
        if (error) {
          console.error('Error creating availability:', error);
          toast.error('Failed to update day status');
          return;
        }
      }
      
      setAvailabilityData(prevData => 
        prevData.map(day => 
          day.date === selectedDay.date 
            ? { ...day, status: newStatus } 
            : day
        )
      );
      
      setIsDialogOpen(false);
      
      toast.success(`Day status updated to ${newStatus}`, {
        description: `${format(new Date(selectedDay.date), 'MMMM d, yyyy')}`
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
  };
  
  const handleUpdatePrice = async () => {
    if (!selectedDay || customPrice === null || !selectedPropertyId) return;
    
    try {
      const existingData = await supabase
        .from('property_availability')
        .select('id')
        .eq('property_id', selectedPropertyId)
        .eq('date', selectedDay.date)
        .maybeSingle();
        
      if (existingData.data) {
        const { error } = await supabase
          .from('property_availability')
          .update({ 
            price: customPrice,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.data.id);
          
        if (error) {
          console.error('Error updating price:', error);
          toast.error('Failed to update price');
          return;
        }
      } else {
        const { error } = await supabase
          .from('property_availability')
          .insert({
            property_id: selectedPropertyId,
            date: selectedDay.date,
            status: selectedDay.status,
            price: customPrice
          });
          
        if (error) {
          console.error('Error creating availability with price:', error);
          toast.error('Failed to update price');
          return;
        }
      }
      
      setAvailabilityData(prevData => 
        prevData.map(day => 
          day.date === selectedDay.date 
            ? { ...day, price: customPrice } 
            : day
        )
      );
      
      setIsDialogOpen(false);
      
      toast.success(`Price updated for ${format(new Date(selectedDay.date), 'MMMM d, yyyy')}`, {
        description: `New price: $${customPrice}`
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
  };
  
  const handleBlockRange = async (days: number) => {
    if (!selectedDay || !selectedPropertyId) return;
    
    try {
      const startDate = new Date(selectedDay.date);
      const datesToBlock = Array.from({ length: days }, (_, i) => 
        format(addDays(startDate, i), 'yyyy-MM-dd')
      );
      
      const upsertData = datesToBlock.map(date => ({
        property_id: selectedPropertyId,
        date,
        status: 'blocked',
        price: availabilityData.find(d => d.date === date)?.price || 
               properties.find(p => p.id === selectedPropertyId)?.basePrice || 100
      }));
      
      const { error } = await supabase
        .from('property_availability')
        .upsert(upsertData, { 
          onConflict: 'property_id,date',
          ignoreDuplicates: false
        });
        
      if (error) {
        console.error('Error blocking dates:', error);
        toast.error('Failed to block dates');
        return;
      }
      
      setAvailabilityData(prevData => {
        const updatedData = [...prevData];
        
        datesToBlock.forEach(date => {
          const index = updatedData.findIndex(d => d.date === date);
          if (index !== -1) {
            updatedData[index] = { 
              ...updatedData[index], 
              status: 'blocked' 
            };
          } else {
          }
        });
        
        return updatedData;
      });
      
      setIsDialogOpen(false);
      
      toast.success(`Blocked ${days} days starting from ${format(startDate, 'MMMM d, yyyy')}`);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
  };
  
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

  const generateMockAvailability = (date: Date, propertyId: string): AvailabilityCalendarEntry[] => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const days = eachDayOfInterval({ start, end });
    
    const seed = parseInt(propertyId.replace(/\D/g, '') || '1', 10);
    
    return days.map(day => {
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
      
      const price = isWeekend(day) 
        ? properties.find(p => p.id === propertyId)?.basePrice! * 1.2
        : properties.find(p => p.id === propertyId)?.basePrice;
      
      return {
        date: format(day, 'yyyy-MM-dd'),
        status,
        price,
        bookingId: status === 'booked' || status === 'pending' ? `booking-${dayNum}` : undefined
      };
    });
  };
  
  const calendarDays = [];
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  if (loading && !properties.length) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
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
              {properties.map(property => (
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
            Manage availability, bookings, and pricing for {properties.find(p => p.id === selectedPropertyId)?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-7 bg-muted">
                {weekDays.map(day => (
                  <div key={day} className="py-2 text-center font-medium text-sm">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 min-h-[600px]">
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
                            Booking #{typeof dayData.bookingId === 'string' && dayData.bookingId.includes('-') 
                              ? dayData.bookingId.split('-')[1] 
                              : dayData.bookingId?.substring(0, 8)}
                          </div>
                        )}
                        
                        <div className="mt-auto text-xs font-medium">
                          ${dayData.price}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {Array.from({ length: 6 - monthEnd.getDay() }).map((_, index) => (
                  <div key={`empty-end-${index}`} className="border-t bg-muted/20" />
                ))}
              </div>
            </div>
          )}
          
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
                        (Booking {typeof selectedDay.bookingId === 'string' && selectedDay.bookingId.includes('-')
                          ? selectedDay.bookingId.split('-')[1]
                          : selectedDay.bookingId?.substring(0, 8)})
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
                    ${properties.find(p => p.id === selectedPropertyId)?.basePrice}/night
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
