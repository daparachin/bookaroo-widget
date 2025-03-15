
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PricingDetails } from '@/types/booking';

interface GuestInformationFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isSubmitting: boolean;
  allowSpecialRequests: boolean;
  pricingDetails: PricingDetails | null;
  isFormValid: boolean;
}

const GuestInformationForm: React.FC<GuestInformationFormProps> = ({
  onSubmit,
  isSubmitting,
  allowSpecialRequests,
  pricingDetails,
  isFormValid
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 animate-fade-in">
      <h3 className="text-sm font-medium mb-4 text-muted-foreground">Guest information</h3>
      
      <div className="space-y-3">
        <div>
          <Input
            name="customerName"
            placeholder="Full name *"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <Input
            name="customerEmail"
            placeholder="Email address *"
            type="email"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <Input
            name="customerPhone"
            placeholder="Phone number *"
            required
            disabled={isSubmitting}
          />
        </div>
        
        {allowSpecialRequests && (
          <div>
            <Textarea
              name="specialRequests"
              placeholder="Special requests (optional)"
              className="min-h-[80px] resize-none"
              disabled={isSubmitting}
            />
          </div>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full transition-all duration-300 h-12 text-base font-medium"
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting ? 'Processing...' : pricingDetails ? `Complete Booking - $${pricingDetails.total.toFixed(2)}` : 'Complete Booking'}
      </Button>
      
      <p className="text-xs text-center text-muted-foreground mt-2">
        By booking, you agree to our <a href="#" className="underline">Terms & Conditions</a>
      </p>
    </form>
  );
};

export default GuestInformationForm;
