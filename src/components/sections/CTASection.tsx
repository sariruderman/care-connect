import { Button } from "@/components/ui/button";
import { Phone, ArrowLeft, Heart } from "lucide-react";

const CTASection = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-primary via-coral-dark to-primary">
      <div className="container-narrow text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/20 mb-6">
          <Heart className="w-8 h-8 text-primary-foreground" />
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
          מוכנים למצוא את הבייביסיטר
          <br />
          המושלמת למשפחה?
        </h2>

        <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-10">
          הצטרפו לאלפי משפחות שכבר מצאו שקט נפשי — ותוכלו סוף סוף לצאת לערב בלי דאגות
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="heroOutline" size="xl" className="group">
            הרשמו עכשיו — חינם
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Button>
          <Button variant="heroOutline" size="xl" className="gap-2">
            <Phone className="w-5 h-5" />
            *2580
          </Button>
        </div>

        <p className="text-sm text-primary-foreground/60 mt-6">
          ללא התחייבות • ביטול בכל עת • תמיכה 24/7
        </p>
      </div>
    </section>
  );
};

export default CTASection;
