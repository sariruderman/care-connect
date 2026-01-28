import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "הזמנה בודדת",
    price: "39",
    period: "להזמנה",
    description: "מתאים למי שצריך בייביסיטר מדי פעם",
    features: [
      "בקשה אחת",
      "עד 5 מועמדות",
      "תמיכה טלפונית",
      "אישור הורה מלווה",
    ],
    popular: false,
    buttonVariant: "outline" as const,
  },
  {
    name: "חבילה משפחתית",
    price: "99",
    period: "לחודש",
    description: "הכי פופולרי — למשפחות עם ילדים קטנים",
    features: [
      "עד 5 הזמנות בחודש",
      "מועמדות ללא הגבלה",
      "עדיפות בהתאמה",
      "דירוג מועדף",
      "תמיכה מורחבת",
      "אישור הורה מלווה",
    ],
    popular: true,
    buttonVariant: "hero" as const,
  },
  {
    name: "מנוי שנתי",
    price: "79",
    period: "לחודש",
    description: "הכי משתלם — חסכון של 20%",
    features: [
      "הזמנות ללא הגבלה",
      "בייביסיטרית קבועה מועדפת",
      "עדיפות מקסימלית",
      "תמיכת VIP",
      "גיבוי אוטומטי",
      "אישור הורה מלווה",
    ],
    popular: false,
    buttonVariant: "default" as const,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="section-padding">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            תוכניות ומחירים
          </h2>
          <p className="text-lg text-muted-foreground">
            בחרו את התוכנית שמתאימה לצרכים שלכם — בלי התחייבות ארוכת טווח
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-card rounded-2xl p-8 shadow-soft hover-lift ${
                plan.popular ? "ring-2 ring-primary shadow-glow" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 right-8 px-4 py-1 bg-gradient-to-l from-primary to-coral-dark text-primary-foreground text-sm font-semibold rounded-full">
                  הכי פופולרי
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-foreground">₪{plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-teal" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button variant={plan.buttonVariant} size="lg" className="w-full">
                {plan.popular ? "התחילו עכשיו" : "בחרו תוכנית"}
              </Button>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          לבייביסיטריות — ההרשמה והשימוש <span className="font-semibold text-foreground">חינם לגמרי</span>
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
