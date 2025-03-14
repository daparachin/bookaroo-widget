
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ActivityItem } from '@/types/dashboard';
import { 
  CalendarPlus, 
  CalendarX, 
  Edit, 
  DollarSign, 
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow, 
} from "@/components/ui/table";
import ActivityDetailsDialog from './ActivityDetailsDialog';

interface RecentActivityListProps {
  activities: ActivityItem[];
}

const RecentActivityList: React.FC<RecentActivityListProps> = ({ activities }) => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleActivityClick = (activity: ActivityItem) => {
    setSelectedActivity(activity);
    setDialogOpen(true);
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'booking_created':
        return <CalendarPlus className="h-4 w-4 text-green-500" />;
      case 'booking_canceled':
        return <CalendarX className="h-4 w-4 text-red-500" />;
      case 'property_updated':
        return <Edit className="h-4 w-4 text-amber-500" />;
      case 'payout_processed':
        return <DollarSign className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Type</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead className="w-[150px]">Time</TableHead>
            <TableHead className="w-[100px] text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow 
              key={activity.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleActivityClick(activity)}
            >
              <TableCell>{getActivityIcon(activity.type)}</TableCell>
              <TableCell>{activity.message}</TableCell>
              <TableCell className="text-muted-foreground">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActivityClick(activity);
                  }}
                >
                  <span className="sr-only">View details</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ActivityDetailsDialog 
        activity={selectedActivity}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};

export default RecentActivityList;
