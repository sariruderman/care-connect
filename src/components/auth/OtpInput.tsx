import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface OtpInputProps {
  phone: string;
  onVerify: (code: string) => Promise<{ success: boolean; error?: string }>;
  onResend: () => Promise<void>;
  onBack: () => void;
  isLoading?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({
  phone,
  onVerify,
  onResend,
  onBack,
  isLoading = false,
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Resend timer countdown
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (newCode.every(digit => digit !== '') && !verifying) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newCode = pastedData.split('');
      setCode(newCode);
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (fullCode: string) => {
    setVerifying(true);
    setError(null);
    
    const result = await onVerify(fullCode);
    
    if (!result.success) {
      setError(result.error || 'קוד שגוי, נסה שנית');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
    
    setVerifying(false);
  };

  const handleResend = async () => {
    setResendTimer(60);
    setError(null);
    await onResend();
  };

  return (
    <div className="space-y-6 text-center" dir="rtl">
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          אימות מספר טלפון
        </h3>
        <p className="text-muted-foreground">
          שלחנו קוד בן 6 ספרות למספר
        </p>
        <p className="text-foreground font-medium text-lg mt-1 direction-ltr">
          {phone}
        </p>
      </div>

      <div className="flex justify-center gap-2" dir="ltr">
        {code.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={isLoading || verifying}
            className={cn(
              "w-12 h-14 text-center text-2xl font-semibold",
              error && "border-destructive"
            )}
          />
        ))}
      </div>

      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}

      <div className="space-y-3">
        <Button
          onClick={() => handleVerify(code.join(''))}
          disabled={code.some(d => d === '') || isLoading || verifying}
          className="w-full"
          size="lg"
        >
          {verifying ? 'מאמת...' : 'אימות'}
        </Button>

        <div className="flex items-center justify-between text-sm">
          <Button
            variant="ghost"
            onClick={onBack}
            disabled={isLoading || verifying}
            className="text-muted-foreground"
          >
            חזרה
          </Button>

          {resendTimer > 0 ? (
            <span className="text-muted-foreground">
              שליחה מחדש בעוד {resendTimer} שניות
            </span>
          ) : (
            <Button
              variant="ghost"
              onClick={handleResend}
              disabled={isLoading || verifying}
              className="text-primary"
            >
              שלח קוד חדש
            </Button>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        💡 לצורך הדגמה, כל קוד בן 6 ספרות יתקבל
      </p>
    </div>
  );
};

export default OtpInput;
