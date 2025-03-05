
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Home, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardMetrics, ActivityItem, RevenueChartData, OccupancyChartData } from '@/types/dashboard';
import RecentActivityList from '@/components/dashboard/RecentActivityList';

// Mock data
const mockMetrics: DashboardMetrics = {
  totalBookings: 124,
  occupancyRate: 68,
  totalRevenue: 28450,
  pendingBookings: 7
};

const mockRevenueData: RevenueChartData = {
  daily: Array.from({ length: 30 }, (_, i) => ({
    date: `${i + 1}`,
    value: Math.floor(Math.random() * 1500) + 500
  })),
  monthly: Array.from({ length: 12 }, (_, i) => ({
    date: new Date(0, i).toLocaleString('default', { month: 'short' }),
    value: Math.floor(Math.random() * 15000) + 5000
  }))
};

const mockOccupancyData: OccupancyChartData = {
  monthly: Array.from({ length: 12 }, (_, i) => ({
    date: new Date(0, i).toLocaleString('default', { month: 'short' }),
    value: Math.floor(Math.random() * 100)
  }))
};

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'booking_created',
    message: 'New booking for Beach House from John Smith',
    timestamp: '2023-10-01T14:32:00Z',
    propertyId: 'prop1',
    bookingId: 'book1'
  },
  {
    id: '2',
    type: 'booking_canceled',
    message: 'Booking #1234 for Mountain Cabin was canceled',
    timestamp: '2023-09-30T09:15:00Z',
    propertyId: 'prop2',
    bookingId: 'book2'
  },
  {
    id: '3',
    type: 'property_updated',
    message: 'Updated images for Lakeside Cottage',
    timestamp: '2023-09-29T16:45:00Z',
    propertyId: 'prop3'
  },
  {
    id: '4',
    type: 'payout_processed',
    message: 'Payout of $1,245 processed',
    timestamp: '2023-09-28T11:20:00Z'
  },
  {
    id: '5',
    type: 'booking_created',
    message: 'New booking for City Apartment from Lisa Johnson',
    timestamp: '2023-09-27T18:05:00Z',
    propertyId: 'prop4',
    bookingId: 'book3'
  }
];

const Dashboard: React.FC = () => {
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
                  <h3 className="text-2xl font-bold">${mockMetrics.totalRevenue.toLocaleString()}</h3>
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
                  <h3 className="text-2xl font-bold">{mockMetrics.totalBookings}</h3>
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
                  <h3 className="text-2xl font-bold">{mockMetrics.occupancyRate}%</h3>
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
                  <h3 className="text-2xl font-bold">{mockMetrics.pendingBookings}</h3>
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
                    data={mockRevenueData.daily}
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
                    data={mockRevenueData.monthly}
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
                data={mockOccupancyData.monthly}
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
          <RecentActivityList activities={mockActivities} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
