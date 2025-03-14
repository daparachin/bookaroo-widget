import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Home, Calendar, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardMetrics, ActivityItem, RevenueChartData, OccupancyChartData } from '@/types/dashboard';
import RecentActivityList from '@/components/dashboard/RecentActivityList';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, parseISO } from 'date-fns';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  // State for data
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalBookings: 0,
    occupancyRate: 0,
    totalRevenue: 0,
    pendingBookings: 0
  });
  const [revenueData, setRevenueData] = useState<RevenueChartData>({
    daily: [],
    monthly: []
  });
  const [occupancyData, setOccupancyData] = useState<OccupancyChartData>({
    monthly: []
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch all bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('booking')
        .select('id, checkIn, checkOut, status, totalPrice, created_at, propertyId');

      if (bookingsError) throw bookingsError;

      // Fetch all properties
      const { data: properties, error: propertiesError } = await supabase
        .from('property')
        .select('id, name');

      if (propertiesError) throw propertiesError;

      // Calculate metrics
      const totalBookings = bookings ? bookings.length : 0;
      const pendingBookings = bookings ? bookings.filter(b => b.status === 'PENDING').length : 0;
      const totalRevenue = bookings ? bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0) : 0;

      // Calculate occupancy rate
      const today = new Date();
      const thirtyDaysAgo = subDays(today, 30);
      const daysInRange = eachDayOfInterval({ start: thirtyDaysAgo, end: today });
      const occupiedDays = bookings ? bookings.filter(booking => {
        const checkIn = parseISO(booking.checkIn);
        const checkOut = parseISO(booking.checkOut);
        return isWithinInterval(today, { start: checkIn, end: checkOut });
      }).length : 0;
      const occupancyRate = Math.round((occupiedDays / (daysInRange.length * properties.length)) * 100);

      setMetrics({
        totalBookings,
        occupancyRate,
        totalRevenue,
        pendingBookings
      });

      // Calculate revenue data
      const dailyRevenue = bookings ? bookings.reduce((acc, booking) => {
        const date = format(parseISO(booking.created_at), 'dd');
        acc[date] = (acc[date] || 0) + (booking.totalPrice || 0);
        return acc;
      }, {} as Record<string, number>) : {};

      const monthlyRevenue = bookings ? bookings.reduce((acc, booking) => {
        const month = format(parseISO(booking.created_at), 'MMM');
        acc[month] = (acc[month] || 0) + (booking.totalPrice || 0);
        return acc;
      }, {} as Record<string, number>) : {};

      setRevenueData({
        daily: Object.entries(dailyRevenue).map(([date, value]) => ({ date, value })),
        monthly: Object.entries(monthlyRevenue).map(([date, value]) => ({ date, value }))
      });

      // Calculate occupancy data
      const monthlyOccupancy = properties.map(property => {
        const propertyBookings = bookings.filter(b => b.propertyId === property.id);
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);
        const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
        const occupiedDays = propertyBookings.filter(booking => {
          const checkIn = parseISO(booking.checkIn);
          const checkOut = parseISO(booking.checkOut);
          return isWithinInterval(today, { start: checkIn, end: checkOut });
        }).length;
        return {
          date: format(monthStart, 'MMM'),
          value: Math.round((occupiedDays / daysInMonth.length) * 100)
        };
      });

      setOccupancyData({
        monthly: monthlyOccupancy
      });

      // Create activity items from recent bookings and property updates
      const recentBookings = bookings
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map(booking => {
          const property = properties.find(p => p.id === booking.propertyId);
          return {
            id: booking.id,
            type: booking.status === 'CANCELED' ? 'booking_canceled' : 'booking_created',
            message: `${booking.status === 'CANCELED' ? 'Canceled booking' : 'New booking'} for ${property?.name || 'Unknown Property'}`,
            timestamp: booking.created_at,
            propertyId: booking.propertyId,
            bookingId: booking.id
          };
        });

      setActivities(recentBookings);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <h3 className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</h3>
                </div>
              </div>
              <div className="flex items-center text-green-500">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">12%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bookings</p>
                  <h3 className="text-2xl font-bold">{metrics.totalBookings}</h3>
                </div>
              </div>
              <div className="flex items-center text-green-500">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">8%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Occupancy</p>
                  <h3 className="text-2xl font-bold">{metrics.occupancyRate}%</h3>
                </div>
              </div>
              <div className="flex items-center text-red-500">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">3%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <h3 className="text-2xl font-bold">{metrics.pendingBookings}</h3>
                </div>
              </div>
              <div className="flex items-center text-green-500">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Revenue trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="monthly" className="space-y-4">
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
              <TabsContent value="daily" className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData.daily}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Area type="monotone" dataKey="value" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="monthly" className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData.monthly}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Area type="monotone" dataKey="value" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Occupancy Rate</CardTitle>
            <CardDescription>Monthly occupancy percentage</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={occupancyData.monthly}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Occupancy']} />
                <Bar dataKey="value" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivityList activities={activities} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
