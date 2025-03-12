
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AdminBooking } from '@/types/dashboard';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BookingsPage: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    fetchBookings();
  }, [user]);
  
  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setLoading(false);
        return;
      }
      
      // Check if user has admin role
      const { data: userData, error: userError } = await supabase
        .from('user')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      
      if (userError) {
        console.error('Error fetching user role:', userError);
        toast.error('Failed to verify user permissions');
        setLoading(false);
        return;
      }
      
      let query = supabase
        .from('booking')
        .select(`
          id,
          property:propertyId (id, name),
          user:userId (id, name, email),
          checkIn,
          checkOut,
          status,
          created_at
        `);
      
      // If not admin, only show bookings for properties owned by the user
      if (!userData || userData.role !== 'ADMIN') {
        query = query.eq('property.ownerId', user.id);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
        setLoading(false);
        return;
      }
      
      // Get payment information for each booking
      const bookingsWithPayments = await Promise.all(
        (data || []).map(async (booking: any) => {
          const { data: paymentData, error: paymentError } = await supabase
            .from('payment')
            .select('amount, status')
            .eq('bookingId', booking.id)
            .maybeSingle();
            
          if (paymentError) {
            console.error('Error fetching payment for booking:', paymentError);
          }
          
          return {
            id: booking.id,
            bookingId: booking.id,
            propertyId: booking.property?.id || '',
            propertyName: booking.property?.name || 'Unknown Property',
            guestName: booking.user?.name || 'Unknown Guest',
            customerName: booking.user?.name || 'Unknown Guest', 
            guestEmail: booking.user?.email || '',
            guestPhone: '',
            checkInDate: booking.checkIn,
            checkOutDate: booking.checkOut,
            guestCount: 0, // Not stored in DB yet
            totalPrice: paymentData?.amount || 0,
            status: booking.status.toLowerCase(),
            paymentStatus: paymentData?.status?.toLowerCase() || 'pending',
            createdAt: booking.created_at,
            updatedAt: booking.created_at,
          };
        })
      );
      
      setBookings(bookingsWithPayments);
      setLoading(false);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, status: 'pending' | 'confirmed' | 'canceled' | 'completed') => {
    try {
      const { error } = await supabase
        .from('booking')
        .update({ status: status.toUpperCase() })
        .eq('id', bookingId);
        
      if (error) {
        console.error('Error updating booking status:', error);
        toast.error('Failed to update booking status');
        return;
      }
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status } : booking
      ));
      
      toast.success(`Booking ${status} successfully`);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    // Apply status filter
    if (filter !== 'all' && booking.status !== filter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        booking.id.toLowerCase().includes(query) ||
        booking.guestName.toLowerCase().includes(query) ||
        booking.guestEmail.toLowerCase().includes(query) ||
        booking.propertyName.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'canceled': return 'destructive';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': 
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'refunded': 
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Booking Management</h1>
        <Button onClick={fetchBookings}>Refresh</Button>
      </div>
      
      <div className="flex space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bookings</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
          <CardDescription>
            Manage your property bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id.substring(0, 8)}</TableCell>
                    <TableCell>{booking.propertyName}</TableCell>
                    <TableCell>
                      <div>{booking.guestName}</div>
                      <div className="text-sm text-muted-foreground">{booking.guestEmail}</div>
                    </TableCell>
                    <TableCell>
                      <div>{new Date(booking.checkInDate).toLocaleDateString()}</div>
                      <div className="text-sm text-muted-foreground">
                        to {new Date(booking.checkOutDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>${booking.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(booking.status) as any}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPaymentStatusBadgeVariant(booking.paymentStatus) as any}>
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">View</Button>
                        {booking.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredBookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No bookings found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsPage;
