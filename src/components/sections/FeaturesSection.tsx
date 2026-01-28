import { Shield, Phone, Users, Clock, MapPin, Star, Lock, Bell } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "אישור הורה מלווה",
    description: "בייביסיטריות צעירות יכולות לקבל אישור מהוריהן לכל יציאה — שכבת בטחון נוספת לכולם.",
  },
  {
    icon: Phone,
    title: "עובד גם בטלפון",
    description: "לא צריך אפליקציה או אינטרנט. כל התהליך זמין גם בשיחה טלפונית פשוטה.",
  },
  {
    icon: Users,
    title: "התאמה חכמה",
    description: "המערכת מוצאת בייביסיטריות לפי אזור, זמינות, ניסיון והתאמה לסגנון המשפחה.",
  },
  {
    icon: Clock,
    title: "חיסכון בזמן",
    description: "בלי לחפש בקבוצות ווטסאפ. אנחנו עושים את העבודה ומביאים לכם רק מועמדות רלוונטיות.",
  },
  {
    icon: MapPin,
    title: "התאמה גיאוגרפית",
    description: "רק בייביסיטריות מהאזור שלכם, שיכולות להגיע בקלות וללא תקלות.",
  },
  {
    icon: Star,
    title: "דירוגים וביקורות",
    description: "ראו מה משפחות אחרות אומרות וקבלו החלטה מבוססת.",
  },
  {
    icon: Lock,
    title: "פרטיות מלאה",
    description: "פרטי קשר נחשפים רק אחרי סגירה. בלי ספאם, בלי פניות לא רצויות.",
  },
  {
    icon: Bell,
    title: "התראות בזמן אמת",
    description: "קבלו עדכון מיידי כשבייביסיטר מאשרת או כשהעבודה מתחילה ונגמרת.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="section-padding">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            למה לבחור בנו?
          </h2>
          <p className="text-lg text-muted-foreground">
            בנינו מערכת שחושבת על הכל — בטיחות, נוחות ושקט נפשי
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-6 shadow-soft hover-lift border border-transparent hover:border-primary/20"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral-light to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
