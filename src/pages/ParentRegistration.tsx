import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { mockUsersApi, mockCommunityStylesApi } from '@/services/mockApi';
import PhoneInput from '@/components/auth/PhoneInput';
import OtpInput from '@/components/auth/OtpInput';
import type { CommunityStyle, ParentRegistrationData } from '@/types';
import { User, MapPin, Baby, Home, ArrowRight, Check } from 'lucide-react';

type Step = 'phone' | 'otp' | 'profile';

const CITIES = [
  'תל אביב', 'רמת גן', 'גבעתיים', 'הרצליה', 'רעננה', 'כפר סבא',
  'פתח תקווה', 'בני ברק', 'חולון', 'בת ים', 'ראשון לציון',
  'ירושלים', 'בית שמש', 'מודיעין', 'חיפה', 'נתניה', 'אשדוד', 'באר שבע'
];

const NEIGHBORHOODS_BY_CITY: Record<string, string[]> = {
  ירושלים: ['רמות', 'הר נוף', 'בית וגן', 'גילה', 'פסגת זאב'],
  'בני ברק': ['רמת אלחנן', 'פרדס כץ', 'שיכון ג', 'שיכון ה'],
  'בית שמש': ['רמה א', 'רמה ב', 'רמה ג'],
  'פתח תקווה': ['כפר גנים', 'אם המושבות', 'מרכז העיר'],
  'תל אביב': ['רמת אביב', 'יד אליהו', 'נווה צדק'],
};

const ParentRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, setParentProfile, user } = useAuth();
  
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [communityStyles, setCommunityStyles] = useState<CommunityStyle[]>([]);
  
  // Profile form state
  const [formData, setFormData] = useState<Omit<ParentRegistrationData, 'phone'>>({
    full_name: '',
    email: '',
    address: '',
    city: '',
    neighborhood: '',
    children_ages: [],
    household_notes: '',
    community_style_id: '',
  });
  const [childAge, setChildAge] = useState('');

  useEffect(() => {
    // Load community styles
    mockCommunityStylesApi.getAll().then(result => {
      if (result.success && result.data) {
        setCommunityStyles(result.data);
      }
    });
  }, []);

  const handlePhoneSubmit = async (phoneNumber: string) => {
    setIsLoading(true);
    setPhone(phoneNumber);
    
    const result = await sendOtp(phoneNumber);
    
    if (result.success) {
      setStep('otp');
    }
    
    setIsLoading(false);
  };

  const handleOtpVerify = async (code: string) => {
    const result = await verifyOtp(phone, code);
    
    if (result.success) {
      setStep('profile');
    }
    
    return result;
  };

  const handleResendOtp = async () => {
    await sendOtp(phone);
  };

  const addChildAge = () => {
    const age = parseInt(childAge);
    if (!isNaN(age) && age >= 0 && age <= 18) {
      setFormData(prev => ({
        ...prev,
        children_ages: [...prev.children_ages, age].sort((a, b) => a - b),
      }));
      setChildAge('');
    }
  };

  const removeChildAge = (index: number) => {
    setFormData(prev => ({
      ...prev,
      children_ages: prev.children_ages.filter((_, i) => i !== index),
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await mockUsersApi.registerParent({
      phone,
      ...formData,
    });

    if (result.success && result.data) {
      setParentProfile(result.data.profile);
      navigate('/parent/dashboard');
    }

    setIsLoading(false);
  };

  const isProfileValid = 
    formData.full_name.length >= 2 &&
    formData.address.length >= 3 &&
    formData.city.length >= 2 &&
    formData.neighborhood.length >= 2 &&
    formData.children_ages.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-coral-light/30 to-background py-12 px-4" dir="rtl">
      <div className="max-w-lg mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['phone', 'otp', 'profile'].map((s, index) => (
            <React.Fragment key={s}>
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  step === s 
                    ? 'bg-primary text-primary-foreground' 
                    : ['otp', 'profile'].indexOf(step) > ['phone', 'otp', 'profile'].indexOf(s)
                    ? 'bg-teal text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {['otp', 'profile'].indexOf(step) > ['phone', 'otp', 'profile'].indexOf(s) ? (
                  <Check className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 2 && (
                <div className={`w-12 h-1 rounded ${
                  ['otp', 'profile'].indexOf(step) > index ? 'bg-teal' : 'bg-muted'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <Card className="shadow-medium">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {step === 'phone' && 'הרשמה להורים'}
              {step === 'otp' && 'אימות טלפון'}
              {step === 'profile' && 'פרטים אישיים'}
            </CardTitle>
            <CardDescription>
              {step === 'phone' && 'הזינו את מספר הטלפון שלכם להתחלה'}
              {step === 'otp' && 'הזינו את הקוד שנשלח אליכם'}
              {step === 'profile' && 'מלאו את הפרטים ליצירת הפרופיל'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {step === 'phone' && (
              <PhoneInput onSubmit={handlePhoneSubmit} isLoading={isLoading} />
            )}

            {step === 'otp' && (
              <OtpInput
                phone={phone}
                onVerify={handleOtpVerify}
                onResend={handleResendOtp}
                onBack={() => setStep('phone')}
                isLoading={isLoading}
              />
            )}

            {step === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    שם מלא
                  </Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="ישראל ישראלי"
                    required
                  />
                </div>

                {/* Email (optional) */}
                <div className="space-y-2">
                  <Label htmlFor="email">דוא"ל (אופציונלי)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="example@email.com"
                    className="direction-ltr text-right"
                  />
                </div>

                {/* Address & City */}
                 <div>
                               <div className="space-y-2">
                                 <Label className="flex items-center gap-2">
                                   <MapPin className="h-4 w-4" />
                                   עיר מגורים
                                 </Label>
                                 <Select
                                   value={formData.city}
                                   onValueChange={(value) =>
                                     setFormData(prev => ({
                                       ...prev,
                                       city: value,
                                       neighborhood: '',
                                     }))
                                   }
                                 >
                                   <SelectTrigger>
                                     <SelectValue placeholder="בחרי עיר" />
                                   </SelectTrigger>
                                   <SelectContent>
                                     {CITIES.map(city => (
                                       <SelectItem key={city} value={city}>{city}</SelectItem>
                                     ))}
                                   </SelectContent>
                                 </Select>
                               </div>

                                {formData.city && (
                                  <div className="space-y-2">
                                    <Label>שכונת מגורים</Label>
                                    <Select
                                      value={formData.neighborhood}
                                      onValueChange={(value) =>
                                        setFormData(prev => ({ ...prev, neighborhood: value }))
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="בחרי שכונה" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {(NEIGHBORHOODS_BY_CITY[formData.city] || []).map(n => (
                                          <SelectItem key={n} value={n}>{n}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                       <div className="space-y-2">
                    <Label htmlFor="address">כתובת</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="רחוב הרצל 1"
                      required
                    />
                  </div>
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
                  {formData.children_ages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.children_ages.map((age, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeChildAge(index)}
                        >
                          {age} שנים ✕
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Community Style */}
                <div className="space-y-2">
                  <Label>סגנון קהילתי (אופציונלי)</Label>
                  <Select
                    value={formData.community_style_id || ''}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, community_style_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחרו סגנון" />
                    </SelectTrigger>
                    <SelectContent>
                      {communityStyles.map(style => (
                        <SelectItem key={style.id} value={style.id}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    משמש להתאמה עם בייביסיטריות מאותה קהילה
                  </p>
                </div>

                {/* Household Notes */}
                <div className="space-y-2">
                  <Label htmlFor="household_notes" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    הערות על הבית (אופציונלי)
                  </Label>
                  <Textarea
                    id="household_notes"
                    value={formData.household_notes || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, household_notes: e.target.value }))}
                    placeholder="למשל: יש מבוגר נוסף בבית, חיות מחמד..."
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={!isProfileValid || isLoading}
                >
                  {isLoading ? 'שומר...' : 'סיום הרשמה'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowRight className="ml-2 h-4 w-4" />
            חזרה לדף הבית
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ParentRegistration;
