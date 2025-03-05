
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Property } from '@/types/booking';
import { WidgetConfig } from '@/types/dashboard';
import { toast } from 'sonner';

// Mock properties data
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

const WidgetPage: React.FC = () => {
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>({
    propertyIds: ['1'],
    title: 'Book Your Stay',
    subtitle: 'Select dates and check availability',
    primaryColor: '#0f766e',
    secondaryColor: '#f8fafc',
    allowSpecialRequests: true,
    borderRadius: '8px',
  });
  
  const [selectedTab, setSelectedTab] = useState('configuration');
  const codeRef = useRef<HTMLTextAreaElement>(null);
  
  const handlePropertyToggle = (propertyId: string) => {
    setWidgetConfig(prev => {
      const propertyIds = prev.propertyIds.includes(propertyId)
        ? prev.propertyIds.filter(id => id !== propertyId)
        : [...prev.propertyIds, propertyId];
      
      return { ...prev, propertyIds };
    });
  };
  
  const handleConfigChange = (key: keyof WidgetConfig, value: any) => {
    setWidgetConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleCopyCode = () => {
    if (codeRef.current) {
      codeRef.current.select();
      document.execCommand('copy');
      toast.success('Code copied to clipboard');
    }
  };
  
  // Generate the embed code based on current configuration
  const generateEmbedCode = () => {
    return `<!-- Vacation Rental Booking Widget -->
<div id="booking-widget-container"></div>

<script>
  (function() {
    const config = {
      propertyIds: ${JSON.stringify(widgetConfig.propertyIds)},
      title: "${widgetConfig.title}",
      subtitle: "${widgetConfig.subtitle}",
      primaryColor: "${widgetConfig.primaryColor}",
      secondaryColor: "${widgetConfig.secondaryColor}",
      allowSpecialRequests: ${widgetConfig.allowSpecialRequests},
      borderRadius: "${widgetConfig.borderRadius}",
      apiKey: "YOUR_API_KEY" // Replace with your actual API key
    };
    
    const script = document.createElement('script');
    script.src = 'https://bookings.example.com/widget.js';
    script.onload = function() {
      window.RentalBookingWidget.initialize('booking-widget-container', config);
    };
    document.head.appendChild(script);
    
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'https://bookings.example.com/widget.css';
    document.head.appendChild(style);
  })();
</script>
<!-- End Vacation Rental Booking Widget -->`;
  };
  
  // Preview of what the widget might look like
  const renderWidgetPreview = () => {
    return (
      <div 
        className="border rounded-lg p-6 max-w-md mx-auto"
        style={{ 
          backgroundColor: widgetConfig.secondaryColor,
          borderRadius: widgetConfig.borderRadius,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="text-center mb-6">
          <h3 
            className="text-xl font-bold mb-1"
            style={{ color: widgetConfig.primaryColor }}
          >
            {widgetConfig.title}
          </h3>
          <p className="text-sm text-muted-foreground">{widgetConfig.subtitle}</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="preview-property">Select Property</Label>
            <Select defaultValue={widgetConfig.propertyIds[0]}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a property" />
              </SelectTrigger>
              <SelectContent>
                {mockProperties
                  .filter(p => widgetConfig.propertyIds.includes(p.id))
                  .map(property => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preview-checkin">Check-in Date</Label>
              <Input id="preview-checkin" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preview-checkout">Check-out Date</Label>
              <Input id="preview-checkout" type="date" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="preview-guests">Number of Guests</Label>
            <Select defaultValue="2">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => (
                  <SelectItem key={i} value={(i + 1).toString()}>
                    {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {widgetConfig.allowSpecialRequests && (
            <div className="space-y-2">
              <Label htmlFor="preview-requests">Special Requests</Label>
              <Input id="preview-requests" placeholder="Any special requests?" />
            </div>
          )}
          
          <Button 
            className="w-full"
            style={{ 
              backgroundColor: widgetConfig.primaryColor,
              borderColor: widgetConfig.primaryColor 
            }}
          >
            Check Availability
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Booking Widget</h2>
      </div>
      
      <Tabs 
        defaultValue="configuration" 
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Widget Settings</CardTitle>
              <CardDescription>
                Configure how your booking widget will look and function
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="widget-title">Widget Title</Label>
                  <Input 
                    id="widget-title" 
                    value={widgetConfig.title}
                    onChange={(e) => handleConfigChange('title', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="widget-subtitle">Widget Subtitle</Label>
                  <Input 
                    id="widget-subtitle" 
                    value={widgetConfig.subtitle}
                    onChange={(e) => handleConfigChange('subtitle', e.target.value)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Appearance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="primary-color" 
                        type="color"
                        value={widgetConfig.primaryColor}
                        onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input 
                        value={widgetConfig.primaryColor}
                        onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                        maxLength={7}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Background Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="secondary-color" 
                        type="color"
                        value={widgetConfig.secondaryColor}
                        onChange={(e) => handleConfigChange('secondaryColor', e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input 
                        value={widgetConfig.secondaryColor}
                        onChange={(e) => handleConfigChange('secondaryColor', e.target.value)}
                        maxLength={7}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="border-radius">Border Radius</Label>
                    <Select 
                      value={widgetConfig.borderRadius}
                      onValueChange={(value) => handleConfigChange('borderRadius', value)}
                    >
                      <SelectTrigger id="border-radius">
                        <SelectValue placeholder="Select border radius" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0px">Sharp (0px)</SelectItem>
                        <SelectItem value="4px">Slight (4px)</SelectItem>
                        <SelectItem value="8px">Rounded (8px)</SelectItem>
                        <SelectItem value="12px">Very Rounded (12px)</SelectItem>
                        <SelectItem value="16px">Pill (16px)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Properties</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select which properties should be available in this widget
                </p>
                
                <div className="space-y-3">
                  {mockProperties.map(property => (
                    <div className="flex items-center justify-between" key={property.id}>
                      <div>
                        <p className="font-medium">{property.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {property.type.charAt(0).toUpperCase() + property.type.slice(1)} • {property.bedrooms} BR • ${property.basePrice}/night
                        </p>
                      </div>
                      <Switch 
                        checked={widgetConfig.propertyIds.includes(property.id)}
                        onCheckedChange={() => handlePropertyToggle(property.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Special Requests</p>
                      <p className="text-sm text-muted-foreground">
                        Allow guests to add special requests to their bookings
                      </p>
                    </div>
                    <Switch 
                      checked={widgetConfig.allowSpecialRequests}
                      onCheckedChange={(checked) => handleConfigChange('allowSpecialRequests', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Widget Preview</CardTitle>
              <CardDescription>
                This is how your booking widget will appear on your website
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              {renderWidgetPreview()}
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setSelectedTab('configuration')}>
              Edit Configuration
            </Button>
            <Button onClick={() => setSelectedTab('integration')}>
              Get Integration Code
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Code</CardTitle>
              <CardDescription>
                Copy and paste this code into your website to embed the booking widget
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <textarea
                  ref={codeRef}
                  className="w-full h-64 bg-muted font-mono text-sm p-2 border-0 resize-none focus:ring-0 focus:outline-none"
                  readOnly
                  value={generateEmbedCode()}
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleCopyCode}>
                  Copy to Clipboard
                </Button>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg mt-4">
                <h4 className="font-medium mb-2">Integration Instructions</h4>
                <div className="space-y-3 text-sm">
                  <p>
                    1. Copy the code above by clicking the "Copy to Clipboard" button.
                  </p>
                  <p>
                    2. Paste the code into the HTML of your website where you want the booking widget to appear.
                  </p>
                  <p>
                    3. Replace <code className="bg-muted px-1 py-0.5 rounded">YOUR_API_KEY</code> with your actual API key from the API settings page.
                  </p>
                  <p>
                    4. The widget will automatically load and display when visitors view your page.
                  </p>
                  <p>
                    <strong>Note:</strong> This code creates a container with ID <code className="bg-muted px-1 py-0.5 rounded">booking-widget-container</code>. Make sure this ID is unique on your page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WidgetPage;
