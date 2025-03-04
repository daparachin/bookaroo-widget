
import React, { useState } from 'react';
import { PricingDetails } from '@/types/booking';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PricingSummaryProps {
  pricingDetails: PricingDetails;
}

const PricingSummary: React.FC<PricingSummaryProps> = ({ pricingDetails }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div className="border rounded-lg p-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Price Summary</h4>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowDetails(!showDetails)}
          className="h-8 px-2"
        >
          {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span className="ml-1 text-xs">{showDetails ? 'Hide' : 'Show'} details</span>
        </Button>
      </div>
      
      {showDetails && (
        <div className="mt-3 space-y-2 text-sm border-t pt-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Base price ({pricingDetails.nightsCount} nights)</span>
            <span>${pricingDetails.basePrice.toFixed(2)}</span>
          </div>
          
          {pricingDetails.seasonalAdjustment !== 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Seasonal adjustment</span>
              <span>${pricingDetails.seasonalAdjustment.toFixed(2)}</span>
            </div>
          )}
          
          {pricingDetails.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Extended stay discount</span>
              <span className="text-green-600">-${pricingDetails.discount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cleaning fee</span>
            <span>${pricingDetails.cleaningFee.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service fee</span>
            <span>${pricingDetails.serviceFee.toFixed(2)}</span>
          </div>
        </div>
      )}
      
      <div className="flex justify-between mt-3 pt-3 border-t font-medium">
        <span>Total price</span>
        <span>${pricingDetails.total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default PricingSummary;
