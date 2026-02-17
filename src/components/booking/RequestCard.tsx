import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Request } from '@/types';
import { Calendar, Clock, MapPin, Baby, Eye, X } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

interface RequestCardProps {
  request: Request;
  onView: () => void;
  onCancel?: () => void;
  showActions?: boolean;
}

const getStatusLabel = (status: Request['status']): { label: string; color: string } => {
  switch (status) {
    case 'NEW':
      return { label: 'חדשה', color: 'bg-sky text-sky-foreground' };
    case 'MATCHING':
      return { label: 'מחפשים מועמדות', color: 'bg-amber-100 text-amber-700' };
    case 'PENDING_RESPONSES':
      return { label: 'ממתין לתשובות', color: 'bg-amber-100 text-amber-700' };
    case 'PENDING_SELECTION':
      return { label: 'בחרו בייביסיטר', color: 'bg-teal text-accent-foreground' };
    case 'PENDING_PAYMENT':
      return { label: 'ממתין לתשלום', color: 'bg-primary/20 text-primary' };
    case 'CONFIRMED':
      return { label: 'מאושר', color: 'bg-teal text-accent-foreground' };
    case 'COMPLETED':
      return { label: 'הושלם', color: 'bg-muted text-muted-foreground' };
    case 'CANCELLED':
      return { label: 'בוטל', color: 'bg-destructive/20 text-destructive' };
    default:
      return { label: 'לא ידוע', color: 'bg-muted' };
  }
};

const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onView,
  onCancel,
  showActions = true,
}) => {
  const startDate = new Date(request.datetimeStart || request.datetime_start);
  const endDate = new Date(request.datetimeEnd || request.datetime_end);
  const childrenAges = request.childrenAges || request.children_ages || [];
  
  // Validate dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return null; // Skip rendering invalid dates
  }
  
  const statusInfo = getStatusLabel(request.status);
  const isPast = endDate < new Date();
  const canCancel = !['CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(request.status);

  return (
    <Card className={`transition-all hover:shadow-medium ${isPast ? 'opacity-60' : ''}`} dir="rtl">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Request Info */}
          <div className="flex-1 space-y-2">
            {/* Date & Time */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-medium">
                {format(startDate, 'EEEE, d בMMMM', { locale: he })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
              </span>
            </div>

            {/* Area */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{request.area}</span>
            </div>

            {/* Children */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Baby className="h-4 w-4" />
              <span>
                {childrenAges.length} ילדים (גילאי {childrenAges.join(', ')})
              </span>
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex flex-col items-end gap-2">
            <Badge className={statusInfo.color}>
              {statusInfo.label}
            </Badge>

            {showActions && (
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onView}
                >
                  <Eye className="h-4 w-4 ml-1" />
                  פרטים
                </Button>

                {canCancel && onCancel && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestCard;
