
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AdminBooking } from '@/types/dashboard';

const BookingsPage: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock bookings data
  const [bookings, setBookings] = useState<AdminBooking[]>([
    {
      id: 'bk-1001',
      bookingId: 'bk-1001', // For compatibility with BookingConfirmation
      propertyId: 'prop-101',
      propertyName: 'Beach Villa',
      guestName: 'John Smith',
      customerName: 'John Smith', // For compatibility with BookingConfirmation
      guestEmail: 'john@example.com',
      guestPhone: '+1 555-123-4567',
      checkInDate: '2023-07-15',
      checkOutDate: '2023-07-20',
      guestCount: 2,
      totalPrice: 850,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: '2023-06-10T14:30:00Z',
      updatedAt: '2023-06-10T14:30:00Z',
    },
    {
      id: 'bk-1002',
      bookingId: 'bk-1002',
      propertyId: 'prop-102',
      propertyName: 'Mountain Cabin',
      guestName: 'Jane Doe',
      customerName: 'Jane Doe',
      guestEmail: 'jane@example.com',
      guestPhone: '+1 555-987-6543',
      checkInDate: '2023-08-01',
      checkOutDate: '2023-08-05',
      guestCount: 3,
      totalPrice: 620,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: '2023-07-15T09:45:00Z',
      updatedAt: '2023-07-15T09:45:00Z',
    },
    {
      id: 'bk-1003',
      bookingId: 'bk-1003',
      propertyId: 'prop-103',
      propertyName: 'Downtown Apartment',
      guestName: 'Michael Johnson',
      customerName: 'Michael Johnson',
      guestEmail: 'michael@example.com',
      guestPhone: '+1 555-456-7890',
      checkInDate: '2023-07-25',
      checkOutDate: '2023-07-28',
      guestCount: 1,
      totalPrice: 375,
      status: 'completed',
      paymentStatus: 'paid',
      createdAt: '2023-06-25T11:20:00Z',
      updatedAt: '2023-07-29T10:15:00Z',
    },
    {
      id: 'bk-1004',
      bookingId: 'bk-1004',
      propertyId: 'prop-101',
      propertyName: 'Beach Villa',
      guestName: 'Sarah Williams',
      customerName: 'Sarah Williams',
      guestEmail: 'sarah@example.com',
      guestPhone: '+1 555-789-0123',
      checkInDate: '2023-09-10',
      checkOutDate: '2023-09-17',
      guestCount: 4,
      totalPrice: 1200,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: '2023-08-01T16:50:00Z',
      updatedAt: '2023-08-01T16:50:00Z',
    },
    {
      id: 'bk-1005',
      bookingId: 'bk-1005',
      propertyId: 'prop-104',
      propertyName: 'Lakeside Cottage',
      guestName: 'Robert Brown',
      customerName: 'Robert Brown',
      guestEmail: 'robert@example.com',
      guestPhone: '+1 555-234-5678',
      checkInDate: '2023-08-15',
      checkOutDate: '2023-08-20',
      guestCount: 2,
      totalPrice: 750,
      status: 'canceled',
      paymentStatus: 'refunded',
      createdAt: '2023-07-10T13:25:00Z',
      updatedAt: '2023-07-12T09:30:00Z',
      notes: 'Guest canceled due to emergency',
    },
  ]);

  const handleStatusChange = (bookingId: string, status: 'pending' | 'confirmed' | 'canceled' | 'completed') => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status } : booking
    ));
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
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'refunded': return 'destructive';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Booking Management</h1>
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
                  <TableCell className="font-medium">{booking.id}</TableCell>
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
                  <TableCell>${booking.totalPrice}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsPage;
