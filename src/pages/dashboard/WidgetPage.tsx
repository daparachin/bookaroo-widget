
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Check, Copy, Eye } from "lucide-react";
import { WidgetConfig } from '@/types/dashboard';
import { toast } from "@/hooks/use-toast";

const WidgetPage: React.FC = () => {
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>({
    propertyIds: ['prop-101', 'prop-102'],
    title: 'Book Your Stay',
    subtitle: 'Select dates and property for your next vacation',
    primaryColor: '#0f766e',
    secondaryColor: '#f59e0b',
    allowSpecialRequests: true,
    borderRadius: 'rounded',
  });

  const [properties, setProperties] = useState([
    { id: 'prop-101', name: 'Beach Villa' },
    { id: 'prop-102', name: 'Mountain Cabin' },
    { id: 'prop-103', name: 'Downtown Apartment' },
    { id: 'prop-104', name: 'Lakeside Cottage' },
  ]);

  const [selectedProperties, setSelectedProperties] = useState(
    properties
      .filter(property => widgetConfig.propertyIds.includes(property.id))
      .map(property => property.name)
      .join(', ')
  );

  const [copied, setCopied] = useState(false);
  const codeBlockRef = useRef<HTMLPreElement>(null);

  const handleConfigChange = (field: keyof WidgetConfig, value: any) => {
    setWidgetConfig({ ...widgetConfig, [field]: value });
  };

  const handleSaveConfig = () => {
    console.log('Saving widget configuration:', widgetConfig);
    // This would save to the backend in a real application
    toast({
      title: "Widget settings saved",
      description: "Your widget configuration has been updated successfully.",
    });
  };

  const handleCopyCode = () => {
    if (codeBlockRef.current) {
      navigator.clipboard.writeText(codeBlockRef.current.textContent || '');
      setCopied(true);
      toast({
        title: "Code copied to clipboard",
        description: "You can now paste the widget code into your website.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Generate the embed code based on current configuration
  const generateEmbedCode = () => {
    const widgetConfigJSON = JSON.stringify(widgetConfig, null, 2);
    
    return `<!-- VacationManager Booking Widget -->
<div id="vacation-manager-booking-widget"></div>
<script src="https://widget.vacationmanager.example/loader.js"></script>
<script>
  VacationManagerWidget.init({
    container: '#vacation-manager-booking-widget',
    config: ${widgetConfigJSON.replace(/\n/g, '\n    ')}
  });
</script>
<!-- End VacationManager Booking Widget -->`;
  };

  const previewUrl = `https://widget-preview.vacationmanager.example/?config=${encodeURIComponent(JSON.stringify(widgetConfig))}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Booking Widget</h1>
        <Button onClick={handleSaveConfig}>Save Configuration</Button>
      </div>
      
      <Tabs defaultValue="configure">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="configure">Configure Widget</TabsTrigger>
          <TabsTrigger value="embed">Get Embed Code</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Widget Settings</CardTitle>
              <CardDescription>
                Customize your booking widget appearance and functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Properties</h3>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="properties">Select properties to include in widget</Label>
                  <div className="relative">
                    <Input 
                      id="properties"
                      value={selectedProperties}
                      readOnly
                      onClick={() => {
                        // This would open a property selector dialog in a real application
                        toast({
                          title: "Property selector",
                          description: "In a complete application, this would open a dialog to select properties.",
                        });
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => {
                        // This would open a property selector dialog in a real application
                        toast({
                          title: "Property selector",
                          description: "In a complete application, this would open a dialog to select properties.",
                        });
                      }}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Text Content</h3>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="widget-title">Widget Title</Label>
                    <Input
                      id="widget-title"
                      value={widgetConfig.title}
                      onChange={(e) => handleConfigChange('title', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="widget-subtitle">Widget Subtitle</Label>
                    <Input
                      id="widget-subtitle"
                      value={widgetConfig.subtitle}
                      onChange={(e) => handleConfigChange('subtitle', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Appearance</h3>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex space-x-2">
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
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex space-x-2">
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
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="border-radius">Border Radius</Label>
                    <Select 
                      value={widgetConfig.borderRadius} 
                      onValueChange={(value) => handleConfigChange('borderRadius', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select border radius" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="rounded-sm">Small</SelectItem>
                        <SelectItem value="rounded">Medium</SelectItem>
                        <SelectItem value="rounded-lg">Large</SelectItem>
                        <SelectItem value="rounded-xl">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Features</h3>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={widgetConfig.allowSpecialRequests} 
                    onCheckedChange={(checked) => handleConfigChange('allowSpecialRequests', checked)}
                    id="special-requests"
                  />
                  <Label htmlFor="special-requests">Allow Special Requests</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="embed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Widget Embed Code</CardTitle>
              <CardDescription>
                Copy this code and paste it into your website where you want the booking widget to appear
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-md bg-muted p-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-4"
                  onClick={handleCopyCode}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <pre
                  ref={codeBlockRef}
                  className="text-sm overflow-x-auto whitespace-pre-wrap break-all"
                >
                  {generateEmbedCode()}
                </pre>
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                <p>
                  The widget will automatically adjust to the width of its container.
                  For best results, place it in a container that is at least 300px wide.
                </p>
              </div>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Integration Instructions</CardTitle>
              <CardDescription>
                Follow these steps to add the booking widget to your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3">
                <li>
                  <p className="inline-block">Copy the code above by clicking the copy button.</p>
                </li>
                <li>
                  <p className="inline-block">Open your website's HTML file or content management system.</p>
                </li>
                <li>
                  <p className="inline-block">Paste the widget code in the location where you want the booking form to appear.</p>
                </li>
                <li>
                  <p className="inline-block">Save your changes and refresh your website to see the widget in action.</p>
                </li>
              </ol>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Need help?</h4>
                <p className="text-sm text-muted-foreground">
                  If you need assistance integrating the widget into your website, please contact our support team 
                  or refer to the detailed documentation.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Widget Preview</CardTitle>
              <CardDescription>
                This is how your booking widget will appear on your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-auto border rounded-md overflow-hidden">
                <div className="bg-muted h-96 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Eye className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Widget preview would be displayed here in a complete application
                    </p>
                    <Button variant="outline" onClick={() => window.open(previewUrl, '_blank')}>
                      Open Preview in New Tab
                    </Button>
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

export default WidgetPage;
