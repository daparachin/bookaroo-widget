import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NotificationPreferences } from "@/types/dashboard";
import { toast } from "sonner";
import LanguageSelector from "@/components/settings/LanguageSelector";

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
    email: true,
    sms: false,
    newBookingAlert: true,
    bookingCancellationAlert: true,
    paymentReceivedAlert: true,
    lowAvailabilityAlert: false,
    reportDelivery: 'weekly'
  });

  const [profile, setProfile] = useState({
    name: 'Jane Smith',
    email: 'jane@vacationrentals.com',
    phone: '+1 (555) 123-4567',
    company: 'Beachside Rentals LLC',
    website: 'www.beachsiderentals.com',
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [apiKeys, setApiKeys] = useState([
    { id: 'key-1', name: 'Website Integration', key: 'vr_live_87a54ef32c11', created: '2023-03-15', lastUsed: '2023-10-25' },
    { id: 'key-2', name: 'Mobile App', key: 'vr_test_3d9f7a12b451', created: '2023-05-21', lastUsed: '2023-10-24' },
  ]);

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
  };

  const handleChangePassword = () => {
    if (security.newPassword !== security.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (security.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    toast.success('Password updated successfully');
    setSecurity({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleNotificationChange = (key: keyof NotificationPreferences, value: any) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    
    toast.success('Notification preferences updated');
  };

  const generateNewApiKey = () => {
    const newKey = {
      id: `key-${apiKeys.length + 1}`,
      name: 'New Integration',
      key: `vr_${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never'
    };
    
    setApiKeys([...apiKeys, newKey]);
    toast.success('New API key generated');
  };

  const revokeApiKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    toast.success('API key revoked successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h2>
      </div>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-lg">
          <TabsTrigger value="account">{t('settings.account')}</TabsTrigger>
          <TabsTrigger value="security">{t('settings.security')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('settings.notifications')}</TabsTrigger>
          <TabsTrigger value="api">{t('settings.api')}</TabsTrigger>
          <TabsTrigger value="language">{t('settings.language')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.accountInfo')}</CardTitle>
              <CardDescription>
                {t('settings.accountDetails')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('settings.fullName')}</Label>
                  <Input 
                    id="name" 
                    value={profile.name} 
                    onChange={e => setProfile({...profile, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t('settings.emailAddress')}</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profile.email} 
                    onChange={e => setProfile({...profile, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('settings.phoneNumber')}</Label>
                  <Input 
                    id="phone" 
                    value={profile.phone} 
                    onChange={e => setProfile({...profile, phone: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">{t('settings.companyName')}</Label>
                  <Input 
                    id="company" 
                    value={profile.company} 
                    onChange={e => setProfile({...profile, company: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="website">{t('settings.website')}</Label>
                  <Input 
                    id="website" 
                    value={profile.website} 
                    onChange={e => setProfile({...profile, website: e.target.value})}
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveProfile}>{t('common.save')}</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.passwordSecurity')}</CardTitle>
              <CardDescription>
                {t('settings.securitySettings')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">{t('settings.currentPassword')}</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    value={security.currentPassword} 
                    onChange={e => setSecurity({...security, currentPassword: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t('settings.newPassword')}</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    value={security.newPassword} 
                    onChange={e => setSecurity({...security, newPassword: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('settings.confirmPassword')}</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={security.confirmPassword} 
                    onChange={e => setSecurity({...security, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
              
              <Button onClick={handleChangePassword}>{t('common.update')}</Button>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="text-lg font-medium mb-4">{t('settings.twoFactorAuthentication')}</h3>
                <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
                  <div>
                    <p className="font-medium">{t('settings.enable2FA')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.enable2FADescription')}
                    </p>
                  </div>
                  <Switch checked={false} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.notificationPreferences')}</CardTitle>
              <CardDescription>
                {t('settings.notificationSettings')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">{t('settings.notificationChannels')}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('settings.emailNotifications')}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('settings.emailNotificationsDescription')}
                        </p>
                      </div>
                      <Switch 
                        checked={notificationPreferences.email} 
                        onCheckedChange={checked => handleNotificationChange('email', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('settings.smsNotifications')}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('settings.smsNotificationsDescription')}
                        </p>
                      </div>
                      <Switch 
                        checked={notificationPreferences.sms} 
                        onCheckedChange={checked => handleNotificationChange('sms', checked)}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-3">{t('settings.events')}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('settings.newBookingAlert')}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('settings.newBookingAlertDescription')}
                        </p>
                      </div>
                      <Switch 
                        checked={notificationPreferences.newBookingAlert} 
                        onCheckedChange={checked => handleNotificationChange('newBookingAlert', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('settings.bookingCancellationAlert')}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('settings.bookingCancellationAlertDescription')}
                        </p>
                      </div>
                      <Switch 
                        checked={notificationPreferences.bookingCancellationAlert} 
                        onCheckedChange={checked => handleNotificationChange('bookingCancellationAlert', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('settings.paymentReceivedAlert')}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('settings.paymentReceivedAlertDescription')}
                        </p>
                      </div>
                      <Switch 
                        checked={notificationPreferences.paymentReceivedAlert} 
                        onCheckedChange={checked => handleNotificationChange('paymentReceivedAlert', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('settings.lowAvailabilityAlert')}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('settings.lowAvailabilityAlertDescription')}
                        </p>
                      </div>
                      <Switch 
                        checked={notificationPreferences.lowAvailabilityAlert} 
                        onCheckedChange={checked => handleNotificationChange('lowAvailabilityAlert', checked)}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-3">{t('settings.reports')}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('settings.bookingSummaryReports')}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('settings.bookingSummaryReportsDescription')}
                        </p>
                      </div>
                      <Select 
                        value={notificationPreferences.reportDelivery} 
                        onValueChange={value => handleNotificationChange('reportDelivery', value)}
                      >
                        <SelectTrigger className="w-[180px]">
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
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.apiAccess')}</CardTitle>
              <CardDescription>
                {t('settings.apiSettings')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{t('settings.apiKeys')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.apiKeyDescription')}
                  </p>
                </div>
                <Button onClick={generateNewApiKey}>{t('common.generate')}</Button>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('settings.name')}</TableHead>
                      <TableHead>{t('settings.apiKey')}</TableHead>
                      <TableHead>{t('settings.created')}</TableHead>
                      <TableHead>{t('settings.lastUsed')}</TableHead>
                      <TableHead>{t('settings.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map(key => (
                      <TableRow key={key.id}>
                        <TableCell className="font-medium">{key.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <code className="bg-muted px-2 py-1 rounded text-xs">
                              {key.key.substring(0, 8)}...
                            </code>
                            <Badge variant="outline">
                              {key.key.startsWith('vr_live') ? 'Live' : 'Test'}
                            </Badge>
                            <Button variant="ghost" size="sm">Copy</Button>
                          </div>
                        </TableCell>
                        <TableCell>{key.created}</TableCell>
                        <TableCell>{key.lastUsed}</TableCell>
                        <TableCell>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => revokeApiKey(key.id)}
                          >
                            {t('common.revoke')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
                <p className="font-medium">{t('settings.apiDocumentation')}</p>
                <p>
                  {t('settings.apiDocumentationDescription')}
                  <a href="#" className="text-primary hover:underline ml-1">{t('settings.apiDocumentationLink')}</a>.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="language" className="space-y-6">
          <LanguageSelector />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
