import { Shield, UserCheck, PhoneCall, Eye, AlertTriangle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const safetyFeatures = [
  {
    icon: UserCheck,
    title: "אימות זהות",
    description: "כל בייביסיטר עוברת תהליך אימות מספר טלפון ופרטים בסיסיים.",
  },
  {
    icon: PhoneCall,
    title: "מיסוך שיחות",
    description: "השיחות מתבצעות דרך המערכת — מספרים אישיים לא נחשפים עד לסגירה.",
  },
  {
    icon: Eye,
    title: "פיקוח הורי",
    description: "הורים של בייביסיטריות צעירות יכולים לאשר כל יציאה ולקבל עדכונים.",
  },
  {
    icon: AlertTriangle,
    title: "כפתור חירום",
    description: "דיווח מיידי במקרה של בעיה — אנחנו זמינים לסייע.",
  },
  {
    icon: Lock,
    title: "הקלטות מאובטחות",
    description: "שיחות טלפוניות מוקלטות ונשמרות לצורכי בקרה ובטיחות.",
  },
];

const SafetySection = () => {
  return (
    <section id="safety" className="section-padding bg-gradient-to-br from-secondary/50 to-lavender/30">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal/20 rounded-full text-teal text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              <span>בטיחות מעל הכל</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              מערכת שבניתם להיות
              <br />
              <span className="text-teal">בטוחה ומפוקחת</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              אנחנו לא לוח מודעות. יצרנו מערכת תיווך אקטיבית עם שכבות הגנה מרובות 
              — כי הילדים שלכם הם הדבר הכי חשוב.
            </p>

            <div className="space-y-4">
              {safetyFeatures.map((feature, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-card shadow-soft flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="teal" size="lg" className="mt-8">
              קראו עוד על הבטיחות שלנו
            </Button>
          </div>

          {/* Visual */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-teal/10 rounded-3xl blur-3xl" />
            <div className="relative bg-card rounded-3xl shadow-medium p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal to-sky mx-auto flex items-center justify-center mb-4">
                  <Shield className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">מערכת אישור הורה מלווה</h3>
                <p className="text-muted-foreground mt-2">שקיפות מלאה לכל הצדדים</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                  <div className="w-3 h-3 rounded-full bg-teal" />
                  <span className="text-sm">שרה (17) קיבלה בקשה מבית כהן</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm">האמא של שרה קיבלה שיחת אישור</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-teal/20 rounded-xl border border-teal/30">
                  <div className="w-3 h-3 rounded-full bg-teal animate-pulse" />
                  <span className="text-sm font-medium text-teal">✓ אושר — שרה יכולה לצאת לעבודה</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SafetySection;
