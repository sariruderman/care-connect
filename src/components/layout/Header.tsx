import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Heart } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container-wide px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-coral-dark flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow duration-300">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">שמרטפית</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              איך זה עובד
            </a>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              יתרונות
            </a>
            <a href="#safety" className="text-muted-foreground hover:text-foreground transition-colors">
              בטיחות
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              מחירים
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" className="gap-2">
              <Phone className="w-4 h-4" />
              *2580
            </Button>
            <Button variant="outline" size="sm">
              התחברות
            </Button>
            <Button size="sm">
              הרשמה
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-up">
            <nav className="flex flex-col gap-4">
              <a href="#how-it-works" className="text-foreground py-2">איך זה עובד</a>
              <a href="#features" className="text-foreground py-2">יתרונות</a>
              <a href="#safety" className="text-foreground py-2">בטיחות</a>
              <a href="#pricing" className="text-foreground py-2">מחירים</a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                <Button variant="ghost" className="justify-start gap-2">
                  <Phone className="w-4 h-4" />
                  חייגו *2580
                </Button>
                <Button variant="outline">התחברות</Button>
                <Button>הרשמה חינם</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
