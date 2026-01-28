import { FileText, Phone, CheckCircle, Heart, ArrowDown } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "פרסמו בקשה",
    description: "הזינו את הפרטים — תאריך, שעות, אזור ודרישות מיוחדות. דרך האתר או בשיחה טלפונית.",
    color: "bg-coral-light text-primary",
  },
  {
    icon: Phone,
    title: "המערכת יוצרת קשר",
    description: "אנחנו מתקשרים לבייביסיטריות מתאימות ומקבלים תגובות — בלי שתצטרכו לעשות כלום.",
    color: "bg-sky-light text-sky",
  },
  {
    icon: CheckCircle,
    title: "בחרו ואשרו",
    description: "קבלו רשימת מועמדות מאושרות, בחרו את המתאימה ביותר וסגרו את ההזמנה.",
    color: "bg-lavender text-lavender-dark",
  },
  {
    icon: Heart,
    title: "צאו לערב משוחרר",
    description: "הכל מסודר. הילדים בידיים טובות, ואתם יכולים ליהנות בשקט.",
    color: "bg-teal/20 text-teal",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="section-padding bg-cream-dark/50">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            איך זה עובד?
          </h2>
          <p className="text-lg text-muted-foreground">
            תהליך פשוט בארבעה שלבים — בלי חיפושים אינסופיים, בלי מודעות, בלי עבודה
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Arrow (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -left-3 transform">
                  <ArrowDown className="w-6 h-6 text-border rotate-[-90deg]" />
                </div>
              )}

              <div className="bg-card rounded-2xl p-6 shadow-soft hover-lift h-full">
                {/* Step Number */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">
                    שלב {index + 1}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Phone Option */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-card rounded-2xl shadow-soft">
            <Phone className="w-6 h-6 text-primary" />
            <div className="text-right">
              <div className="font-semibold text-foreground">מעדיפים טלפון?</div>
              <div className="text-sm text-muted-foreground">חייגו *2580 ותשלימו את כל התהליך בשיחה</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
