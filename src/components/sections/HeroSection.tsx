import { Button } from "@/components/ui/button";
import { Phone, ArrowLeft, Shield, Clock, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-bl from-coral-light/50 via-background to-sky-light/30" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
      
      <div className="container-wide px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-right">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-secondary-foreground text-sm font-medium mb-6 animate-fade-up">
              <Shield className="w-4 h-4" />
              <span>פלטפורמה מאובטחת ומפוקחת</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              מצאו את הבייביסיטר
              <br />
              <span className="gradient-text">המושלמת למשפחה</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              המערכת החכמה שמחברת בין משפחות לבייביסיטריות מאומתות.
              פשוט, בטוח ומותאם אישית — דרך האתר או בטלפון.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Button variant="hero" size="xl" className="group">
                התחילו עכשיו
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl" className="gap-2">
                <Phone className="w-5 h-5" />
                חייגו *2580
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">5,000+</div>
                <div className="text-sm text-muted-foreground">בייביסיטריות מאומתות</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">15,000+</div>
                <div className="text-sm text-muted-foreground">משפחות מרוצות</div>
              </div>
              <div className="text-3xl font-bold text-foreground flex items-baseline gap-1">
                4.9
                <span className="text-primary text-xl">★</span>
                <span className="text-sm font-normal text-muted-foreground mr-1">דירוג</span>
              </div>
            </div>
          </div>

          {/* Illustration / Cards */}
          <div className="relative hidden lg:block">
            <div className="relative z-10">
              {/* Main Card */}
              <div className="bg-card rounded-2xl shadow-medium p-6 max-w-md mx-auto animate-scale-in">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-light to-secondary flex items-center justify-center">
                    <Users className="w-7 h-7 text-sky" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">בקשה חדשה</h3>
                    <p className="text-sm text-muted-foreground">משפחת כהן, רמת גן</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">תאריך</span>
                    <span className="font-medium">יום שישי, 14:00-22:00</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">ילדים</span>
                    <span className="font-medium">2 (גיל 3, 6)</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">אזור</span>
                    <span className="font-medium">מרכז רמת גן</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="flex-1">מעוניינת</Button>
                  <Button size="sm" variant="outline" className="flex-1">לא הפעם</Button>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-6 -right-6 bg-card rounded-xl shadow-soft p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-teal" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">אישור הורה מלווה</div>
                    <div className="text-xs text-teal">✓ מאושר</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-card rounded-xl shadow-soft p-4 animate-float" style={{ animationDelay: "2s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">3 מועמדות זמינות</div>
                    <div className="text-xs text-muted-foreground">בחרו את המתאימה</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
