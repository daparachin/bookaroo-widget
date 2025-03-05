
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PricingDetails } from '@/types/booking';

const PricingPage: React.FC = () => {
  const [basePrice, setBasePrice] = useState(100);
  const [weekendPricing, setWeekendPricing] = useState(true);
  const [weekendRate, setWeekendRate] = useState(150);
  const [seasonalPricing, setSeasonalPricing] = useState(false);

  const [discounts, setDiscounts] = useState([
    { id: 1, type: 'weekly', value: 10, active: true },
    { id: 2, type: 'monthly', value: 20, active: true },
    { id: 3, type: 'lastMinute', value: 15, active: false },
  ]);

  const handleSavePricing = () => {
    // This would save pricing configuration to the backend
    console.log('Saving pricing configuration');
  };

  const handleDiscountChange = (id: number, field: string, value: any) => {
    setDiscounts(discounts.map(discount => 
      discount.id === id ? { ...discount, [field]: value } : discount
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Pricing Management</h1>
        <Button onClick={handleSavePricing}>Save Changes</Button>
      </div>
      
      <Tabs defaultValue="basePricing">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basePricing">Base Pricing</TabsTrigger>
          <TabsTrigger value="seasonalRates">Seasonal Rates</TabsTrigger>
          <TabsTrigger value="discounts">Discounts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basePricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Base Rate Configuration</CardTitle>
              <CardDescription>
                Set your standard nightly rate and weekend pricing options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="basePrice">Base Nightly Rate ($)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={weekendPricing} 
                  onCheckedChange={setWeekendPricing}
                  id="weekend-pricing"
                />
                <Label htmlFor="weekend-pricing">Enable Weekend Pricing</Label>
              </div>
              
              {weekendPricing && (
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="weekendRate">Weekend Rate ($)</Label>
                  <Input
                    id="weekendRate"
                    type="number"
                    value={weekendRate}
                    onChange={(e) => setWeekendRate(Number(e.target.value))}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="seasonalRates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Pricing</CardTitle>
              <CardDescription>
                Configure different rates for high and low seasons
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={seasonalPricing} 
                  onCheckedChange={setSeasonalPricing}
                  id="seasonal-pricing"
                />
                <Label htmlFor="seasonal-pricing">Enable Seasonal Pricing</Label>
              </div>
              
              {seasonalPricing && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Configure your seasonal pricing periods and rates.
                  </p>
                  
                  {/* Placeholder for seasonal pricing configuration UI */}
                  <div className="bg-muted p-4 rounded-md text-center">
                    <p>Seasonal pricing configuration UI would go here</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      This would include date range selectors and price adjustments
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="discounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Discount Rules</CardTitle>
              <CardDescription>
                Set up automatic discounts for longer stays and special offers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {discounts.map((discount) => (
                  <div key={discount.id} className="flex items-center space-x-4 p-4 border rounded-md">
                    <div className="flex-1">
                      <Select
                        value={discount.type}
                        onValueChange={(value) => handleDiscountChange(discount.id, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Discount Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly Stay</SelectItem>
                          <SelectItem value="monthly">Monthly Stay</SelectItem>
                          <SelectItem value="lastMinute">Last Minute</SelectItem>
                          <SelectItem value="earlyBird">Early Bird</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        value={discount.value}
                        onChange={(e) => handleDiscountChange(discount.id, 'value', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <span className="text-sm">%</span>
                    </div>
                    <div>
                      <Switch 
                        checked={discount.active} 
                        onCheckedChange={(checked) => handleDiscountChange(discount.id, 'active', checked)}
                      />
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full mt-4">
                  Add Discount Rule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PricingPage;
