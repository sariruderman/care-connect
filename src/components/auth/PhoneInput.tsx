import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone } from 'lucide-react';

interface PhoneInputProps {
  onSubmit: (phone: string) => Promise<void>;
  isLoading?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ onSubmit, isLoading = false }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const formatPhone = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format Israeli phone number
    if (digits.startsWith('972')) {
      return digits.slice(0, 12);
    }
    if (digits.startsWith('0')) {
      return digits.slice(0, 10);
    }
    return digits.slice(0, 10);
  };

  const validatePhone = (value: string): boolean => {
    const digits = value.replace(/\D/g, '');
    // Israeli mobile format: 05X-XXXXXXX
    const israeliMobileRegex = /^05\d{8}$/;
    return israeliMobileRegex.test(digits);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhone(phone)) {
      setError('נא להזין מספר טלפון נייד תקין (05X-XXXXXXX)');
      return;
    }

    await onSubmit(phone);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          מספר טלפון נייד
        </label>
        <div className="relative">
          <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="tel"
            value={phone}
            onChange={handleChange}
            placeholder="050-1234567"
            className="pr-10 text-lg direction-ltr text-right"
            disabled={isLoading}
          />
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!phone || isLoading}
      >
        {isLoading ? 'שולח קוד...' : 'שלח קוד אימות'}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        נשלח אליך קוד SMS לאימות המספר
      </p>
    </form>
  );
};

export default PhoneInput;
