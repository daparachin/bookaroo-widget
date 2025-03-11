
import React from 'react';
import { ActivityItem } from '@/types/dashboard';
import { formatDistanceToNow, format } from 'date-fns';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { 
  CalendarPlus, 
  CalendarX, 
  Edit, 
  DollarSign,
  Clock
} from 'lucide-react';

interface ActivityDetailsDialogProps {
  activity: ActivityItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ActivityDetailsDialog: React.FC<ActivityDetailsDialogProps> = ({ 
  activity, 
  open, 
  onOpenChange 
}) => {
  if (!activity) return null;
  
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'booking_created':
        return <CalendarPlus className="h-5 w-5 text-green-500" />;
      case 'booking_canceled':
        return <CalendarX className="h-5 w-5 text-red-500" />;
      case 'property_updated':
        return <Edit className="h-5 w-5 text-amber-500" />;
      case 'payout_processed':
        return <DollarSign className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getActivityTitle = (type: ActivityItem['type']) => {
    switch (type) {
      case 'booking_created':
        return 'New Booking';
      case 'booking_canceled':
        return 'Booking Canceled';
      case 'property_updated':
        return 'Property Updated';
      case 'payout_processed':
        return 'Payout Processed';
      default:
        return 'Activity';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            {getActivityIcon(activity.type)}
            <DialogTitle>{getActivityTitle(activity.type)}</DialogTitle>
          </div>
          <DialogDescription>
            Details about this activity
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Description</h4>
            <p>{activity.message}</p>
          </div>
          
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mt-0.5" />
            <div>
              <p>{format(new Date(activity.timestamp), 'PPpp')}</p>
              <p>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</p>
            </div>
          </div>
          
          {activity.propertyId && (
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Property ID</h4>
              <p className="text-sm">{activity.propertyId}</p>
            </div>
          )}
          
          {activity.bookingId && (
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Booking ID</h4>
              <p className="text-sm">{activity.bookingId}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          {activity.bookingId && (
            <Button>View Booking</Button>
          )}
          {activity.propertyId && !activity.bookingId && (
            <Button>View Property</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityDetailsDialog;
