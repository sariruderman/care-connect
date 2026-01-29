import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { User, CalendarDays, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import UserAvatar from "./UserAvatar";
import LoginDialog from "./LoginDialog";

const UserMenu = () => {
  const { user, parentProfile, babysitterProfile, isAuthenticated, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const profileName = parentProfile?.full_name || babysitterProfile?.full_name;

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    toast({ title: "התנתקת בהצלחה", description: "להתראות!" });
    navigate("/");
  };

  const handleNavigate = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  const getDashboardPath = () => {
    return user?.type === "BABYSITTER" ? "/babysitter/dashboard" : "/parent/dashboard";
  };

  // Guest State
  if (!isAuthenticated) {
    return (
      <>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLoginOpen(true)}
            className="rounded-full"
            aria-label="התחברות"
          >
            <UserCircle className="h-6 w-6" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setLoginOpen(true)}>
            התחברות
          </Button>
          <Button size="sm" onClick={() => navigate("/register")}>
            הרשמה
          </Button>
        </div>
        <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      </>
    );
  }

  // Logged In State
  const menuItems = (
    <>
      <div className="px-3 py-2 text-sm font-medium text-foreground" dir="rtl">
        שלום, {profileName || "משתמש"}
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => handleNavigate("/profile")} className="cursor-pointer gap-2" dir="rtl">
        <User className="h-4 w-4" />
        הפרופיל שלי
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => handleNavigate(getDashboardPath())} className="cursor-pointer gap-2" dir="rtl">
        <CalendarDays className="h-4 w-4" />
        ההזמנות שלי
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-2 text-destructive focus:text-destructive" dir="rtl">
        <LogOut className="h-4 w-4" />
        יציאה
      </DropdownMenuItem>
    </>
  );

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setMenuOpen(true)}
          className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="תפריט משתמש"
        >
          <UserAvatar name={profileName} size="md" />
        </button>
        <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
          <DrawerContent>
            <DrawerHeader className="text-right" dir="rtl">
              <DrawerTitle>תפריט משתמש</DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col gap-2 p-4" dir="rtl">
              <div className="px-1 py-2 text-sm font-medium text-foreground">
                שלום, {profileName || "משתמש"}
              </div>
              <Button variant="ghost" onClick={() => handleNavigate("/profile")} className="justify-start gap-2">
                <User className="h-4 w-4" />
                הפרופיל שלי
              </Button>
              <Button variant="ghost" onClick={() => handleNavigate(getDashboardPath())} className="justify-start gap-2">
                <CalendarDays className="h-4 w-4" />
                ההזמנות שלי
              </Button>
              <div className="my-2 border-t" />
              <Button variant="ghost" onClick={handleLogout} className="justify-start gap-2 text-destructive hover:text-destructive">
                <LogOut className="h-4 w-4" />
                יציאה
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="תפריט משתמש"
        >
          <UserAvatar name={profileName} size="md" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {menuItems}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
