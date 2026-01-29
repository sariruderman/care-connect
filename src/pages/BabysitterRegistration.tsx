import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { mockUsersApi, mockCommunityStylesApi } from '@/services/mockApi';
import PhoneInput from '@/components/auth/PhoneInput';
import OtpInput from '@/components/auth/OtpInput';
import type { CommunityStyle, BabysitterRegistrationData, ApprovalMode, Language } from '@/types';
import { SUPPORTED_LANGUAGES } from '@/types';
import { User, MapPin, Calendar, Briefcase, Shield, ArrowRight, Check, Phone, Languages } from 'lucide-react';

type Step = 'phone' | 'otp' | 'profile' | 'guardian';

const CITIES = [
  'תל אביב', 'רמת גן', 'גבעתיים', 'הרצליה', 'רעננה', 'כפר סבא',
  'פתח תקווה', 'בני ברק', 'חולון', 'בת ים', 'ראשון לציון',
  'ירושלים', 'בית שמש', 'מודיעין', 'חיפה', 'נתניה', 'אשדוד', 'באר שבע'
];

const NEIGHBORHOODS_BY_CITY: Record<string, string[]> = {
  'ירושלים': ['רמות', 'גילה', 'הר נוף', 'בית וגן', 'פסגת זאב'],
  'בני ברק': ['פרדס כץ', 'רמת אלחנן', 'שיכון ה', 'שיכון ג'],
  'בית שמש': ['רמת בית שמש א', 'רמת בית שמש ב', 'רמה ג'],
};

const WALKING_RADII = [
  { label: '5 דקות הליכה', value: 5 },
  { label: '10 דקות הליכה', value: 10 },
  { label: '15 דקות הליכה', value: 15 },
  { label: '20 דקות הליכה', value: 20 },
];

const BabysitterRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, setBabysitterProfile } = useAuth();
  
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [communityStyles, setCommunityStyles] = useState<CommunityStyle[]>([]);
  
  // Profile form state
  const [formData, setFormData] = useState<Omit<BabysitterRegistrationData, 'phone'>>({
    full_name: '',
    email: '',
    age: 16,
    city: '',
    neighborhood: '',
    walking_radius_minutes: 5,
    service_areas: [],
    experience_years: 0,
    community_style_id: '',
    bio: '',
    has_guardian: false,
    guardian_phone: '',
    guardian_name: '',
    approval_mode: 'APPROVE_EACH_REQUEST',
    languages: ['hebrew'],
  });

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

  const toggleArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      service_areas: prev.service_areas.includes(area)
        ? prev.service_areas.filter(a => a !== area)
        : [...prev.service_areas, area],
    }));
  };

  const handleProfileContinue = () => {
    if (formData.has_guardian) {
      setStep('guardian');
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const result = await mockUsersApi.registerBabysitter({
      phone,
      ...formData,
    });

    if (result.success && result.data) {
      setBabysitterProfile(result.data.profile);
      navigate('/babysitter/dashboard');
    }

    setIsLoading(false);
  };

  const isProfileValid =
    formData.full_name.length >= 2 &&
    formData.age >= 14 &&
    formData.city &&
    formData.neighborhood &&
    formData.walking_radius_minutes > 0;


  const isGuardianValid = 
    formData.guardian_name!.length >= 2 &&
    /^05\d{8}$/.test(formData.guardian_phone!.replace(/\D/g, ''));

  const steps = formData.has_guardian 
    ? ['phone', 'otp', 'profile', 'guardian'] 
    : ['phone', 'otp', 'profile'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky/30 to-background py-12 px-4" dir="rtl">
      <div className="max-w-lg mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, index) => (
            <React.Fragment key={s}>
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  step === s 
                    ? 'bg-primary text-primary-foreground' 
                    : steps.indexOf(step) > index
                    ? 'bg-teal text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {steps.indexOf(step) > index ? (
                  <Check className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-1 rounded ${
                  steps.indexOf(step) > index ? 'bg-teal' : 'bg-muted'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <Card className="shadow-medium">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {step === 'phone' && 'הרשמה לבייביסיטריות'}
              {step === 'otp' && 'אימות טלפון'}
              {step === 'profile' && 'פרטים אישיים'}
              {step === 'guardian' && 'פרטי הורה מלווה'}
            </CardTitle>
            <CardDescription>
              {step === 'phone' && 'הזיני את מספר הטלפון שלך להתחלה'}
              {step === 'otp' && 'הזיני את הקוד שנשלח אלייך'}
              {step === 'profile' && 'מלאי את הפרטים ליצירת הפרופיל'}
              {step === 'guardian' && 'פרטי ההורה שיאשר עבורך בקשות'}
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
              <div className="space-y-6">
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
                    placeholder="שרה כהן"
                    required
                  />
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    גיל
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min="14"
                    max="30"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 16 }))}
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

                {/* Service Areas */}
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

                {/* <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    אזורי שירות (בחרי לפחות אחד)
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {AREAS.map(area => (
                      <Badge
                        key={area}
                        variant={formData.service_areas.includes(area) ? 'default' : 'outline'}
                        className="cursor-pointer transition-colors"
                        onClick={() => toggleArea(area)}
                      >
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div> */}

                {/* Neighborhood */}
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

                {/* Walking Radius */}
                <div className="space-y-2">
                    <Label>מרחק הליכה מקסימלי</Label>
                    <Select
                      value={formData.walking_radius_minutes.toString()}
                      onValueChange={(value) =>
                        setFormData(prev => ({
                          ...prev,
                          walking_radius_minutes: parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {WALKING_RADII.map(r => (
                          <SelectItem key={r.value} value={r.value.toString()}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      נשלח פניות רק ממשפחות בטווח זה
                    </p>
                  </div>

                {/* Experience */}
                <div className="space-y-2">
                  <Label htmlFor="experience" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    שנות ניסיון
                  </Label>
                  <Select
                    value={formData.experience_years.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, experience_years: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">ללא ניסיון</SelectItem>
                      <SelectItem value="1">שנה אחת</SelectItem>
                      <SelectItem value="2">שנתיים</SelectItem>
                      <SelectItem value="3">3 שנים</SelectItem>
                      <SelectItem value="4">4 שנים ומעלה</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Community Style */}
                <div className="space-y-2">
                  <Label>סגנון קהילתי (אופציונלי)</Label>
                  <Select
                    value={formData.community_style_id || ''}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, community_style_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחרי סגנון" />
                    </SelectTrigger>
                    <SelectContent>
                      {communityStyles.map(style => (
                        <SelectItem key={style.id} value={style.id}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Languages */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    שפות דיבור
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <Badge
                        key={lang.value}
                        variant={formData.languages?.includes(lang.value) ? 'default' : 'outline'}
                        className="cursor-pointer transition-colors"
                        onClick={() => {
                          const current = formData.languages || [];
                          const updated = current.includes(lang.value)
                            ? current.filter(l => l !== lang.value)
                            : [...current, lang.value];
                          setFormData(prev => ({ ...prev, languages: updated }));
                        }}
                      >
                        {lang.label}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    בחרי את השפות שאת דוברת (לחצי לבחירה/ביטול)
                  </p>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">ספרי על עצמך (אופציונלי)</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="למשל: אוהבת ילדים, יצירתית, בוגרת קורס עזרה ראשונה..."
                    rows={3}
                  />
                </div>

                {/* Guardian Toggle */}
                <div className="bg-sky/20 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <Label htmlFor="has_guardian" className="font-medium">
                        אישור הורה מלווה
                      </Label>
                    </div>
                    <Switch
                      id="has_guardian"
                      checked={formData.has_guardian}
                      onCheckedChange={(checked) => setFormData(prev => ({ 
                        ...prev, 
                        has_guardian: checked,
                        guardian_phone: checked ? prev.guardian_phone : '',
                        guardian_name: checked ? prev.guardian_name : '',
                      }))}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    הורה מלווה יקבל הודעה ויאשר כל בקשה לבייביסיטר לפני שתקבלי אותה
                  </p>
                </div>

                <Button
                  onClick={handleProfileContinue}
                  className="w-full"
                  size="lg"
                  disabled={!isProfileValid || isLoading}
                >
                  {formData.has_guardian ? 'המשך לפרטי הורה' : (isLoading ? 'שומר...' : 'סיום הרשמה')}
                </Button>
              </div>
            )}

            {step === 'guardian' && (
              <div className="space-y-6">
                <div className="bg-sky/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="font-medium">מה ההורה המלווה יקבל?</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 mr-7">
                    <li>• שם המשפחה המבקשת</li>
                    <li>• אזור ותאריך הבייביסיטינג</li>
                    <li>• גילאי הילדים</li>
                    <li>• האם יש מבוגר נוסף בבית</li>
                    <li>• סגנון קהילתי</li>
                  </ul>
                  <p className="text-sm text-primary font-medium mt-2 mr-7">
                    ❌ לא יקבל פרטי קשר ישירים
                  </p>
                </div>

                {/* Guardian Name */}
                <div className="space-y-2">
                  <Label htmlFor="guardian_name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    שם ההורה המלווה
                  </Label>
                  <Input
                    id="guardian_name"
                    value={formData.guardian_name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, guardian_name: e.target.value }))}
                    placeholder="למשל: אמא"
                    required
                  />
                </div>

                {/* Guardian Phone */}
                <div className="space-y-2">
                  <Label htmlFor="guardian_phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    טלפון ההורה המלווה
                  </Label>
                  <Input
                    id="guardian_phone"
                    type="tel"
                    value={formData.guardian_phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, guardian_phone: e.target.value.replace(/\D/g, '') }))}
                    placeholder="050-1234567"
                    className="direction-ltr text-right"
                    required
                  />
                </div>

                {/* Approval Mode */}
                <div className="space-y-2">
                  <Label>אופן האישור</Label>
                  <Select
                    value={formData.approval_mode}
                    onValueChange={(value: ApprovalMode) => setFormData(prev => ({ ...prev, approval_mode: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APPROVE_EACH_REQUEST">אישור לכל בקשה</SelectItem>
                      <SelectItem value="APPROVE_NEW_FAMILIES">רק למשפחות חדשות</SelectItem>
                      <SelectItem value="AUTO_APPROVE">אישור אוטומטי (רק התראות)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep('profile')}
                    className="flex-1"
                  >
                    חזרה
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1"
                    disabled={!isGuardianValid || isLoading}
                  >
                    {isLoading ? 'שומר...' : 'סיום הרשמה'}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  ההורה המלווה יקבל SMS לאימות ואישור השתתפות
                </p>
              </div>
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

export default BabysitterRegistration;
