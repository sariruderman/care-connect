import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { RequestCandidate, BabysitterProfile } from '@/types';
import { Star, MapPin, Calendar, Shield, Check, X, Clock } from 'lucide-react';

interface CandidateCardProps {
  candidate: RequestCandidate & { babysitter: BabysitterProfile };
  onSelect: () => void;
  isSelectable?: boolean;
  isLoading?: boolean;
}

const getResponseLabel = (response: RequestCandidate['response']): { label: string; color: string } => {
  switch (response) {
    case 'PENDING':
      return { label: 'ממתין לתשובה', color: 'bg-muted text-muted-foreground' };
    case 'INTERESTED':
      return { label: 'מעוניינת', color: 'bg-teal text-accent-foreground' };
    case 'DECLINED':
      return { label: 'דחתה', color: 'bg-destructive/20 text-destructive' };
    case 'GUARDIAN_PENDING':
      return { label: 'ממתין לאישור הורה', color: 'bg-amber-100 text-amber-700' };
    case 'GUARDIAN_APPROVED':
      return { label: 'אושר ע"י הורה', color: 'bg-teal text-accent-foreground' };
    case 'GUARDIAN_DECLINED':
      return { label: 'נדחה ע"י הורה', color: 'bg-destructive/20 text-destructive' };
    default:
      return { label: 'לא ידוע', color: 'bg-muted text-muted-foreground' };
  }
};

const getCallStatusLabel = (status: RequestCandidate['call_status']): string => {
  switch (status) {
    case 'PENDING':
      return 'טרם התקשרנו';
    case 'CALLING':
      return 'בשיחה...';
    case 'COMPLETED':
      return 'שיחה הושלמה';
    case 'NO_ANSWER':
      return 'לא ענתה';
    case 'FAILED':
      return 'שיחה נכשלה';
    default:
      return '';
  }
};

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onSelect,
  isSelectable = false,
  isLoading = false,
}) => {
  const { babysitter } = candidate;
  const responseStatus = getResponseLabel(candidate.response);
  const isAvailable = candidate.response === 'INTERESTED' || candidate.response === 'GUARDIAN_APPROVED';

  return (
    <Card 
      className={`transition-all ${isAvailable ? 'border-teal shadow-medium' : 'opacity-75'}`} 
      dir="rtl"
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Profile Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-lg">{babysitter.full_name}</h4>
              <Badge variant="secondary">{babysitter.age} שנים</Badge>
              {babysitter.guardian_required_approval && (
                <Badge variant="outline" className="gap-1">
                  <Shield className="h-3 w-3" />
                  ליווי הורי
                </Badge>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-medium">{babysitter.rating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground">
                ({babysitter.total_reviews} ביקורות)
              </span>
            </div>

            {/* Areas */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {(babysitter.service_areas || []).slice(0, 3).join(', ')}
              {(babysitter.service_areas || []).length > 3 && ` +${(babysitter.service_areas || []).length - 3}`}
            </div>

            {/* Experience */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {babysitter.experience_years} שנות ניסיון
            </div>

            {/* Bio */}
            {babysitter.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {babysitter.bio}
              </p>
            )}
          </div>

          {/* Status & Actions */}
          <div className="flex flex-col items-end gap-2">
            <Badge className={responseStatus.color}>
              {responseStatus.label}
            </Badge>

            {candidate.call_status !== 'COMPLETED' && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {getCallStatusLabel(candidate.call_status)}
              </span>
            )}

            {isSelectable && isAvailable && (
              <Button
                onClick={onSelect}
                disabled={isLoading}
                size="sm"
                className="mt-2"
              >
                <Check className="h-4 w-4 ml-1" />
                בחר
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;
