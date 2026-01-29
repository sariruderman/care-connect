import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Baby, ArrowRight } from "lucide-react";

const RegisterSelectRole: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky/30 to-background px-4"
      dir="rtl"
    >
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">איך תרצי להצטרף?</h1>
          <p className="text-muted-foreground text-lg">
            בחרי את סוג החשבון המתאים לך
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Parent */}
          <Card className="hover:shadow-large transition-shadow cursor-pointer">
            <CardHeader className="text-center space-y-3">
              <div className="mx-auto w-14 h-14 rounded-full bg-coral-light flex items-center justify-center">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-2xl">אני הורה</CardTitle>
              <CardDescription>
                מחפשת בייביסיטר לילדים שלך,  
                בצורה בטוחה, מסודרת ומפוקחת
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button
                className="w-full"
                size="lg"
                onClick={() => navigate("/register/parent")}
              >
                המשך כהורה
                <ArrowRight className="mr-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Babysitter */}
          <Card className="hover:shadow-large transition-shadow cursor-pointer">
            <CardHeader className="text-center space-y-3">
              <div className="mx-auto w-14 h-14 rounded-full bg-sky/40 flex items-center justify-center">
                <Baby className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-2xl">אני בייביסיטרית</CardTitle>
              <CardDescription>
                רוצה לקבל פניות עבודה,  
                עם אפשרות לאישור הורה וליווי
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button
                className="w-full"
                size="lg"
                variant="outline"
                onClick={() => navigate("/register/babysitter")}
              >
                המשך כבייביסיטרית
                <ArrowRight className="mr-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Back */}
        <div className="text-center">
          <Button variant="ghost" onClick={() => navigate("/")}>
            חזרה לדף הבית
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterSelectRole;
