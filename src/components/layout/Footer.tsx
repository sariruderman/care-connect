import { Heart, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground py-16">
      <div className="container-wide px-4 md:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">שמרטפית</span>
            </a>
            <p className="text-primary-foreground/70 text-sm mb-4">
              הפלטפורמה המובילה בישראל למציאת בייביסיטר מאומתת ואמינה.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-primary" />
              <span>*2580</span>
            </div>
          </div>

          {/* Links - For Parents */}
          <div>
            <h3 className="font-semibold mb-4">להורים</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">איך זה עובד</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">מחירים</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">שאלות נפוצות</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">צור קשר</a></li>
            </ul>
          </div>

          {/* Links - For Babysitters */}
          <div>
            <h3 className="font-semibold mb-4">לבייביסיטריות</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">הצטרפי אלינו</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">יתרונות</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">טיפים להצלחה</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">בטיחות</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">צור קשר</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>*2580</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@shamartafit.co.il</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>תל אביב, ישראל</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            © 2024 שמרטפית. כל הזכויות שמורות.
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/50">
            <a href="#" className="hover:text-primary-foreground transition-colors">תנאי שימוש</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">מדיניות פרטיות</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">נגישות</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
