import { useState, useEffect } from "react";
import { parentsApi, babysittersApi } from '@/services/api';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Loader2, User } from "lucide-react";
import UserAvatar from "@/components/user/UserAvatar";

const Profile = () => {
  const { user, parentProfile, babysitterProfile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const profile = parentProfile || babysitterProfile;
  const isParent = user?.type === "PARENT";

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    address: "",
    city: "",
    neighborhood: "",
    children_ages: "",
    household_notes: "",
    bio: "",
  });

  useEffect(() => {
    if (parentProfile) {
      setFormData({
        full_name: parentProfile.full_name || "",
        email: user?.email || "",
        address: parentProfile.address || "",
        city: parentProfile.city || "",
        neighborhood: parentProfile.area || "",
        children_ages: parentProfile.children_ages?.join(", ") || "",
        household_notes: parentProfile.household_notes || "",
        bio: "",
      });
    } else if (babysitterProfile) {
      setFormData({
        full_name: babysitterProfile.full_name || "",
        email: user?.email || "",
        address: "",
        city: babysitterProfile.service_areas?.[0] || "",
        neighborhood: "",
        children_ages: "",
        household_notes: "",
        bio: babysitterProfile.bio || "",
      });
    }
  }, [parentProfile, babysitterProfile, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Call real update API when backend supports it
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "הפרופיל עודכן",
      description: "הפרטים נשמרו בהצלחה",
    });
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">הפרופיל שלי</h1>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <UserAvatar name={profile?.full_name} size="lg" className="h-20 w-20 text-2xl" />
            </div>
            <CardTitle>{profile?.full_name || "משתמש"}</CardTitle>
            <CardDescription>
              {isParent ? "הורה" : "בייביסיטר"} • {user?.phone}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  פרטים אישיים
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">שם מלא</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">אימייל</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      dir="ltr"
                    />
                  </div>
                </div>

                {isParent && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="address">כתובת</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="city">עיר</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="neighborhood">שכונה</Label>
                        <Input
                          id="neighborhood"
                          value={formData.neighborhood}
                          onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="children_ages">גילאי ילדים (מופרדים בפסיק)</Label>
                      <Input
                        id="children_ages"
                        value={formData.children_ages}
                        onChange={(e) => setFormData({ ...formData, children_ages: e.target.value })}
                        placeholder="3, 5, 8"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="household_notes">הערות נוספות</Label>
                      <Textarea
                        id="household_notes"
                        value={formData.household_notes}
                        onChange={(e) => setFormData({ ...formData, household_notes: e.target.value })}
                        placeholder="מידע נוסף על הבית, חיות מחמד, וכו'"
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {!isParent && (
                  <div className="space-y-2">
                    <Label htmlFor="bio">אודות</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="ספר/י על עצמך, ניסיון, ותחביבים"
                      rows={4}
                    />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    שומר...
                  </>
                ) : (
                  "שמור שינויים"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
