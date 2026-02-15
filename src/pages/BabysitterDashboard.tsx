import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { babysitterRequestsApi, bookingsApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import type { RequestCandidate, Request, Booking } from '@/types';
import { RefreshCw, Phone, Clock, CheckCircle, Calendar, MapPin, Baby, Shield, Check, X, Home } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface PendingRequest {
  candidate: RequestCandidate;
  request: Request;
}

const BabysitterDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, babysitterProfile, logout } = useAuth();
  const { toast } = useToast();
  
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PendingRequest | null>(null);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    
    setIsRefreshing(true);
    
    const pendingResult = await babysitterRequestsApi.getPendingRequests(user.id);
    if (pendingResult.success && pendingResult.data) {
      // Map candidates to PendingRequest format
      // The backend should return candidates with their associated request
      const requestsWithDetails = (pendingResult.data as any[]).map((item: any) => ({
        candidate: item,
        request: item.request,
      })).filter((r: any) => r.request);
      setPendingRequests(requestsWithDetails);
    }
    
    const bookingsResult = await bookingsApi.getBabysitterBookings(user.id);
    if (bookingsResult.success && bookingsResult.data) {
      setBookings(bookingsResult.data);
    }
    
    setIsRefreshing(false);
  }, [user]);

  useEffect(() => {
    loadData();
    // Poll for new requests every 10 seconds
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleAccept = async () => {
    if (!selectedRequest) return;
    
    setIsLoading(true);
    
    const result = await babysitterRequestsApi.acceptRequest(selectedRequest.candidate.id);
    
    if (result.success) {
      const hasGuardian = babysitterProfile?.guardian_required_approval;
      toast({
        title: hasGuardian ? 'נשלח לאישור הורה' : 'אישרת את הבקשה!',
        description: hasGuardian 
          ? 'ההורה המלווה שלך יקבל הודעה לאישור'
          : 'המשפחה תקבל הודעה שאת זמינה',
      });
      setShowAcceptDialog(false);
      setSelectedRequest(null);
      loadData();
    } else {
      toast({
        title: 'שגיאה',
        description: result.error || 'לא הצלחנו לשלוח את התשובה',
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
  };

  const handleDecline = async () => {
    if (!selectedRequest) return;
    
    setIsLoading(true);
    
    const result = await babysitterRequestsApi.declineRequest(selectedRequest.candidate.id);
    
    if (result.success) {
      toast({
        title: 'דחית את הבקשה',
      });
      setShowDeclineDialog(false);
      setSelectedRequest(null);
      loadData();
    } else {
      toast({
        title: 'שגיאה',
        description: result.error || 'לא הצלחנו לשלוח את התשובה',
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
  };

  const upcomingBookings = bookings.filter(b => 
    new Date(b.datetime_start) > new Date() && b.status === 'CONFIRMED'
  );
  
  const pastBookings = bookings.filter(b => 
    new Date(b.datetime_end) < new Date() || b.status === 'COMPLETED'
  );

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">
                שלום, {babysitterProfile?.full_name?.split(' ')[0] || 'בייביסיטר'}
              </h1>
              <p className="text-sm text-muted-foreground">ניהול בקשות והזמנות</p>
            </div>
            <div className="flex items-center gap-2">
              {babysitterProfile?.guardian_required_approval && (
                <Badge variant="outline" className="gap-1">
                  <Shield className="h-3 w-3" />
                  ליווי הורי
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={loadData}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <Home className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Pending Requests Alert */}
        {pendingRequests.length > 0 && (
          <Card className="border-primary bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="h-5 w-5 text-primary animate-pulse" />
                יש לך {pendingRequests.length} בקשות חדשות!
              </CardTitle>
              <CardDescription>
                תשובי במהירות - המשפחות מחכות
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{pendingRequests.length}</p>
              <p className="text-xs text-muted-foreground">בקשות ממתינות</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 mx-auto text-teal mb-2" />
              <p className="text-2xl font-bold">{upcomingBookings.length}</p>
              <p className="text-xs text-muted-foreground">הזמנות קרובות</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 mx-auto text-amber-500 mb-2" />
              <p className="text-2xl font-bold">{pastBookings.length}</p>
              <p className="text-xs text-muted-foreground">הזמנות שהושלמו</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="pending" className="flex-1">
              בקשות חדשות ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex-1">
              הזמנות ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              היסטוריה
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-4">
            {pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Phone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">אין בקשות חדשות</h3>
                  <p className="text-muted-foreground">
                    כשמשפחה תחפש בייביסיטר באזור שלך, תקבלי הודעה
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingRequests.map(({ candidate, request }) => (
                <Card key={candidate.id} className="border-primary/30">
                  <CardContent className="p-4 space-y-4">
                    {/* Request Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                          {format(new Date(request.datetime_start), 'EEEE, d בMMMM', { locale: he })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {format(new Date(request.datetime_start), 'HH:mm')} -{' '}
                          {format(new Date(request.datetime_end), 'HH:mm')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{request.area}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Baby className="h-4 w-4" />
                        <span>
                          {request.children_ages.length} ילדים (גילאי {request.children_ages.join(', ')})
                        </span>
                      </div>
                      {request.requirements && (
                        <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                          {request.requirements}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={() => {
                          setSelectedRequest({ candidate, request });
                          setShowDeclineDialog(true);
                        }}
                      >
                        <X className="h-4 w-4 ml-1" />
                        לא מתאים לי
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => {
                          setSelectedRequest({ candidate, request });
                          setShowAcceptDialog(true);
                        }}
                      >
                        <Check className="h-4 w-4 ml-1" />
                        מעוניינת!
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4 mt-4">
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  אין הזמנות קרובות
                </CardContent>
              </Card>
            ) : (
              upcomingBookings.map(booking => (
                <Card key={booking.id} className="border-teal">
                  <CardContent className="p-4 space-y-2">
                    <Badge className="bg-teal text-accent-foreground mb-2">
                      הזמנה מאושרת
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        {format(new Date(booking.datetime_start), 'EEEE, d בMMMM', { locale: he })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(booking.datetime_start), 'HH:mm')} -{' '}
                        {format(new Date(booking.datetime_end), 'HH:mm')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.address}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  אין היסטוריית הזמנות
                </CardContent>
              </Card>
            ) : (
              pastBookings.map(booking => (
                <Card key={booking.id} className="opacity-75">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(booking.datetime_start), 'd בMMMM yyyy', { locale: he })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.address}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Accept Dialog */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>אישור התעניינות</DialogTitle>
            <DialogDescription>
              {babysitterProfile?.guardian_required_approval ? (
                <>
                  לאחר האישור, ההורה המלווה שלך יקבל הודעה לאישור הבקשה.
                  <br />
                  רק אם הוא יאשר, המשפחה תראה שאת זמינה.
                </>
              ) : (
                'לאחר האישור, המשפחה תראה שאת מעוניינת ותוכל לבחור בך.'
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setShowAcceptDialog(false)}
              disabled={isLoading}
            >
              ביטול
            </Button>
            <Button
              onClick={handleAccept}
              disabled={isLoading}
            >
              {isLoading ? 'שולח...' : 'אישור'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline Dialog */}
      <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>דחיית בקשה</DialogTitle>
            <DialogDescription>
              בטוחה שאת רוצה לדחות את הבקשה הזו?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeclineDialog(false)}
              disabled={isLoading}
            >
              ביטול
            </Button>
            <Button
              variant="destructive"
              onClick={handleDecline}
              disabled={isLoading}
            >
              {isLoading ? 'שולח...' : 'דחייה'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BabysitterDashboard;
