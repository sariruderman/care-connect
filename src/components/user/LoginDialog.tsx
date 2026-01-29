import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "phone" | "otp";

const LoginDialog = ({ open, onOpenChange }: LoginDialogProps) => {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const { sendOtp, verifyOtp } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 9) {
      toast({ title: "שגיאה", description: "יש להזין מספר טלפון תקין", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);
    const result = await sendOtp(phone);
    setIsLoading(false);
    
    if (result.success) {
      setStep("otp");
      toast({ title: "קוד נשלח", description: "קוד אימות נשלח למספר הטלפון שלך" });
    } else {
      toast({ title: "שגיאה", description: result.error || "שגיאה בשליחת הקוד", variant: "destructive" });
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit when complete
    if (newCode.every(d => d !== "")) {
      handleOtpSubmit(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (fullCode: string) => {
    setIsLoading(true);
    const result = await verifyOtp(phone, fullCode);
    setIsLoading(false);
    
    if (result.success) {
      toast({ title: "התחברת בהצלחה!", description: "ברוכים הבאים" });
      onOpenChange(false);
      resetForm();
    } else {
      toast({ title: "שגיאה", description: result.error || "קוד שגוי", variant: "destructive" });
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const resetForm = () => {
    setStep("phone");
    setPhone("");
    setCode(["", "", "", "", "", ""]);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) resetForm();
    onOpenChange(open);
  };

  const content = (
    <div className="flex flex-col gap-6 p-4" dir="rtl">
      {step === "phone" ? (
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">מספר טלפון</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="050-0000000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="text-right"
              dir="ltr"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "שלח קוד אימות"}
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <p className="text-center text-muted-foreground">
            הזן את הקוד שנשלח למספר {phone}
          </p>
          <div className="flex justify-center gap-2" dir="ltr">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
                className={cn("w-10 h-12 text-center text-xl font-semibold")}
              />
            ))}
          </div>
          {isLoading && (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          <Button variant="ghost" onClick={() => setStep("phone")} className="w-full" disabled={isLoading}>
            שנה מספר טלפון
          </Button>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-right" dir="rtl">
            <DrawerTitle>התחברות</DrawerTitle>
            <DrawerDescription>התחבר באמצעות מספר הטלפון שלך</DrawerDescription>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle>התחברות</DialogTitle>
          <DialogDescription>התחבר באמצעות מספר הטלפון שלך</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
