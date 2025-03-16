import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useTranslation } from 'react-i18next';

import {
  Activity,
  CreditCard,
  DollarSign,
  Download,
  Hotel,
  Users,
} from 'lucide-react';

// Mock data
const mockBookings = [
  {
    id: '1',
    guest: 'John Smith',
    property: 'Beach House Villa',
    checkin: '2023-07-15',
    checkout: '2023-07-20',
    status: 'confirmed',
    total: 1250.00,
  },
  {
    id: '2',
    guest: 'Sarah Johnson',
    property: 'Mountain Cabin',
    checkin: '2023-07-22',
    checkout: '2023-07-29',
    status: 'pending',
    total: 1800.00,
  },
  {
    id: '3',
    guest: 'Robert Williams',
    property: 'Downtown Apartment',
    checkin: '2023-08-01',
    checkout: '2023-08-05',
    status: 'confirmed',
    total: 740.00,
  },
  {
    id: '4',
    guest: 'Emily Davis',
    property: 'Lakefront Cottage',
    checkin: '2023-08-10',
    checkout: '2023-08-15',
    status: 'cancelled',
    total: 975.00,
  },
];

const mockEvents = [
  {
    id: '1',
    title: 'Beach House Cleaning',
    date: '2023-07-14',
    type: 'maintenance',
  },
  {
    id: '2',
    title: 'New Property Inspection',
    date: '2023-07-25',
    type: 'inspection',
  },
  {
    id: '3',
    title: 'Downtown Apartment Repair',
    date: '2023-08-02',
    type: 'maintenance',
  },
];

const Dashboard = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h2>
          <div className="flex items-center space-x-2">
            <div></div>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{t('common.overview')}</TabsTrigger>
            <TabsTrigger value="analytics">{t('common.analytics')}</TabsTrigger>
            <TabsTrigger value="reports">{t('common.reports')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('dashboard.totalRevenue')}
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% {t('common.fromLastMonth')}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('dashboard.bookings')}
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12.5%</div>
                  <p className="text-xs text-muted-foreground">
                    +19% {t('common.fromLastMonth')}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('dashboard.properties')}
                  </CardTitle>
                  <Hotel className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                    +2 {t('common.newThisMonth')}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t('dashboard.activeUsers')}
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">573</div>
                  <p className="text-xs text-muted-foreground">
                    +201 {t('common.sinceLastWeek')}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-1 md:col-span-2 lg:col-span-4">
                <CardHeader>
                  <CardTitle>{t('dashboard.recentBookings')}</CardTitle>
                  <CardDescription>
                    {t('dashboard.totalBookingsDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 text-xs font-medium text-muted-foreground">
                      <div>{t('common.guest')}</div>
                      <div>{t('common.property')}</div>
                      <div>{t('common.dates')}</div>
                      <div className="text-right">{t('common.status')}</div>
                    </div>
                    {mockBookings.map((booking) => (
                      <div key={booking.id} className="grid grid-cols-4 text-sm">
                        <div>{booking.guest}</div>
                        <div>{booking.property}</div>
                        <div>{booking.checkin} - {booking.checkout}</div>
                        <div className="text-right">
                          <span className={`inline-block rounded-md px-2 py-1 text-xs font-medium ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : booking.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.status === 'confirmed' 
                              ? t('common.confirmed') 
                              : booking.status === 'pending' 
                                ? t('common.pending') 
                                : t('common.cancelled')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-center">
                    <button className="text-sm text-blue-600 hover:underline">
                      {t('dashboard.viewAll')}
                    </button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>{t('dashboard.upcomingEvents')}</CardTitle>
                  <CardDescription>
                    {t('dashboard.upcomingEventsDescription')}
                  </CardDescription>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockEvents.map((event) => (
                      <div key={event.id} className="flex items-center gap-4">
                        <div className={`rounded-full p-2 ${
                          event.type === 'maintenance' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-amber-100 text-amber-600'
                        }`}>
                          <Activity className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-center">
                    <button className="text-sm text-blue-600 hover:underline">
                      {t('dashboard.viewAll')}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard; 