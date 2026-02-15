import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { communityStylesApi } from '@/services/api';
import type { CommunityStyle, CreateRequestData } from '@/types';
import { Calendar as CalendarIcon, Clock, MapPin, Baby, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

const AREAS = [
  'תל אביב', 'רמת גן', 'גבעתיים', 'הרצליה', 'רעננה', 'כפר סבא',
  'פתח תקווה', 'בני ברק', 'חולון', 'בת ים', 'ראשון לציון',
  'ירושלים', 'בית שמש', 'מודיעין', 'חיפה', 'נתניה', 'אשדוד', 'באר שבע'
];

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'
];

interface CreateRequestFormProps {
  defaultChildrenAges?: number[];
  defaultArea?: string;
  onSubmit: (data: CreateRequestData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const CreateRequestForm: React.FC<CreateRequestFormProps> = ({
  defaultChildrenAges = [],
  defaultArea = '',
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [communityStyles, setCommunityStyles] = useState<CommunityStyle[]>([]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [area, setArea] = useState(defaultArea);
  const [address, setAddress] = useState('');
  const [childrenAges, setChildrenAges] = useState<number[]>(defaultChildrenAges);
  const [childAge, setChildAge] = useState('');
  const [requirements, setRequirements] = useState('');
  const [minAge, setMinAge] = useState<number | undefined>(undefined);
  const [maxAge, setMaxAge] = useState<number | undefined>(undefined);
  const [communityStyleId, setCommunityStyleId] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    communityStylesApi.getAll().then(result => {
      if (result.success && result.data) {
        setCommunityStyles(result.data);
      }
    });
  }, []);

  const addChildAge = () => {
    const age = parseInt(childAge);
    if (!isNaN(age) && age >= 0 && age <= 18) {
      setChildrenAges(prev => [...prev, age].sort((a, b) => a - b));
      setChildAge('');
    }
  };

  const removeChildAge = (index: number) => {
    setChildrenAges(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !startTime || !endTime || !area || childrenAges.length === 0) {
      return;
    }

    const startDate = new Date(date);
    const [startHour, startMin] = startTime.split(':').map(Number);
    startDate.setHours(startHour, startMin, 0, 0);

    const endDate = new Date(date);
    const [endHour, endMin] = endTime.split(':').map(Number);
    endDate.setHours(endHour, endMin, 0, 0);

    await onSubmit({
      datetime_start: startDate.toISOString(),
      datetime_end: endDate.toISOString(),
      area,
      address: address || undefined,
      children_ages: childrenAges,
      requirements: requirements || undefined,
      min_babysitter_age: minAge,
      max_babysitter_age: maxAge,
      community_style_id: communityStyleId || undefined,
    });
  };

  const isValid = date && startTime && endTime && area && childrenAges.length > 0;

  return (
    <Card className="shadow-medium" dir="rtl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          בקשה חדשה לבייביסיטר
        </CardTitle>
        <CardDescription>
          מלאו את הפרטים והמערכת תמצא בייביסיטריות מתאימות
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              תאריך
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-right"
                >
                  {date ? format(date, 'EEEE, d בMMMM yyyy', { locale: he }) : 'בחרו תאריך'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                שעת התחלה
              </Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger>
                  <SelectValue placeholder="בחרו שעה" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>שעת סיום</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger>
                  <SelectValue placeholder="בחרו שעה" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.filter(t => t > startTime).map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Area */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              אזור
            </Label>
            <Select value={area} onValueChange={setArea}>
              <SelectTrigger>
                <SelectValue placeholder="בחרו אזור" />
              </SelectTrigger>
              <SelectContent>
                {AREAS.map(a => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Address (optional) */}
          <div className="space-y-2">
            <Label>כתובת מלאה (אופציונלי)</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="רחוב, מספר בית"
            />
          </div>

          {/* Children Ages */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Baby className="h-4 w-4" />
              גילאי הילדים
            </Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="0"
                max="18"
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                placeholder="גיל"
                className="w-24"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addChildAge())}
              />
              <Button type="button" variant="outline" onClick={addChildAge}>
                הוסף
              </Button>
            </div>
            {childrenAges.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {childrenAges.map((age, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeChildAge(index)}
                  >
                    {age} {age === 1 ? 'שנה' : 'שנים'} ✕
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label>דרישות מיוחדות (אופציונלי)</Label>
            <Textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="למשל: ניסיון עם תינוקות, עזרה ראשונה..."
              rows={2}
            />
          </div>

          {/* Advanced Filters */}
          <div className="border rounded-lg p-4 space-y-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                סינון מתקדם
              </span>
              <span>{showFilters ? '−' : '+'}</span>
            </Button>

            {showFilters && (
              <div className="space-y-4 pt-2">
                {/* Babysitter Age Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>גיל מינימום לבייביסיטר</Label>
                    <Input
                      type="number"
                      min="14"
                      max="30"
                      value={minAge || ''}
                      onChange={(e) => setMinAge(e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="14"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>גיל מקסימום לבייביסיטר</Label>
                    <Input
                      type="number"
                      min="14"
                      max="30"
                      value={maxAge || ''}
                      onChange={(e) => setMaxAge(e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="30"
                    />
                  </div>
                </div>

                {/* Community Style */}
                <div className="space-y-2">
                  <Label>סגנון קהילתי</Label>
                  <Select value={communityStyleId} onValueChange={setCommunityStyleId}>
                    <SelectTrigger>
                      <SelectValue placeholder="ללא העדפה" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">ללא העדפה</SelectItem>
                      {communityStyles.map(style => (
                        <SelectItem key={style.id} value={style.id}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={isLoading}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!isValid || isLoading}
            >
              {isLoading ? 'שולח בקשה...' : 'שלח בקשה'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateRequestForm;
