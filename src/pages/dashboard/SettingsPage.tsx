
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NotificationPreferences } from '@/types/dashboard';
import { Separator } from '@/components/ui/separator';

const SettingsPage: React.FC = () => {
  const [account, setAccount] = useState({
    name: 'Vacation Rental Owner',
    email: 'owner@example.com',
    phone: '+1 (555) 123-4567',
    timezone: 'America/Los_Angeles',
    currency: 'USD',
  });

  const [notifications, setNotifications] = useState<NotificationPreferences>({
    email: true,
    sms: false,
    newBookingAlert: true,
    bookingCancellationAlert: true,
    paymentReceivedAlert: true,
    lowAvailabilityAlert: false,
    reportDelivery: 'weekly',
  });

  const handleAccountChange = (field: string, value: string) => {
    setAccount({ ...account, [field]: value });
  };

  const handleNotificationChange = (field: keyof NotificationPreferences, value: any) => {
    setNotifications({ ...notifications, [field]: value });
  };

  const handleSaveAccount = () => {
    console.log('Saving account settings:', account);
    // This would save to the backend in a real application
  };

  const handleSaveNotifications = () => {
    console.log('Saving notification settings:', notifications);
    // This would save to the backend in a real application
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      
      <Tabs defaultValue="account">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="connections">API Connections</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={account.name}
                    onChange={(e) => handleAccountChange('name', e.target.value)}
                  />
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={account.email}
                    onChange={(e) => handleAccountChange('email', e.target.value)}
                  />
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={account.phone}
                    onChange={(e) => handleAccountChange('phone', e.target.value)}
                  />
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={account.timezone} 
                    onValueChange={(value) => handleAccountChange('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={account.currency} 
                    onValueChange={(value) => handleAccountChange('currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                      <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                      <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveAccount}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your password and account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline">Change Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how and when you'd like to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Channels</h3>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={notifications.email} 
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    id="email-notifications"
                  />
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={notifications.sms} 
                    onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                    id="sms-notifications"
                  />
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Event Notifications</h3>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={notifications.newBookingAlert} 
                    onCheckedChange={(checked) => handleNotificationChange('newBookingAlert', checked)}
                    id="new-booking-alerts"
                  />
                  <Label htmlFor="new-booking-alerts">New Booking Alerts</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={notifications.bookingCancellationAlert} 
                    onCheckedChange={(checked) => handleNotificationChange('bookingCancellationAlert', checked)}
                    id="cancellation-alerts"
                  />
                  <Label htmlFor="cancellation-alerts">Booking Cancellation Alerts</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={notifications.paymentReceivedAlert} 
                    onCheckedChange={(checked) => handleNotificationChange('paymentReceivedAlert', checked)}
                    id="payment-alerts"
                  />
                  <Label htmlFor="payment-alerts">Payment Received Alerts</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={notifications.lowAvailabilityAlert} 
                    onCheckedChange={(checked) => handleNotificationChange('lowAvailabilityAlert', checked)}
                    id="availability-alerts"
                  />
                  <Label htmlFor="availability-alerts">Low Availability Alerts</Label>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Report Delivery</h3>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="report-delivery">Receive booking reports</Label>
                  <Select 
                    value={notifications.reportDelivery} 
                    onValueChange={(value: any) => handleNotificationChange('reportDelivery', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications}>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="connections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Connections</CardTitle>
              <CardDescription>
                Connect to third-party services and payment providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Payment Processors</h3>
                    <p className="text-sm text-muted-foreground">Connect to payment gateways to process bookings</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                
                <div className="p-4 border rounded-md bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-bold text-primary">S</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Stripe</h4>
                        <p className="text-sm text-muted-foreground">Payment processing</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50">Connected</Badge>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-bold text-primary">P</span>
                      </div>
                      <div>
                        <h4 className="font-medium">PayPal</h4>
                        <p className="text-sm text-muted-foreground">Alternative payment method</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Channel Managers</h3>
                    <p className="text-sm text-muted-foreground">Sync availability with other booking platforms</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                
                <div className="p-4 border rounded-md bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-bold text-primary">A</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Airbnb</h4>
                        <p className="text-sm text-muted-foreground">Sync listings and availability</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-bold text-primary">B</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Booking.com</h4>
                        <p className="text-sm text-muted-foreground">Sync listings and availability</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
