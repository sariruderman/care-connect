import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { mockRequestsApi, mockBookingsApi } from '@/services/mockApi';
import { useAuth } from '@/contexts/AuthContext';
import CreateRequestForm from '@/components/booking/CreateRequestForm';
import RequestCard from '@/components/booking/RequestCard';
import CandidateCard from '@/components/booking/CandidateCard';
import type { Request, RequestCandidate, BabysitterProfile, Booking, CreateRequestData } from '@/types';
import { Plus, RefreshCw, Phone, Clock, CheckCircle, Calendar, Home } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

type ViewMode = 'list' | 'create' | 'details';

const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, parentProfile, logout } = useAuth();
  const { toast } = useToast();
  
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [requests, setRequests] = useState<Request[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [candidates, setCandidates] = useState<(RequestCandidate & { babysitter: BabysitterProfile })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedBabysitter, setSelectedBabysitter] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    
    setIsRefreshing(true);
    
    const [requestsResult, bookingsResult] = await Promise.all([
      mockRequestsApi.getParentRequests(user.id),
      mockBookingsApi.getParentBookings(user.id),
    ]);
    
    if (requestsResult.success && requestsResult.data) {
      setRequests(requestsResult.data);
    }
    
    if (bookingsResult.success && bookingsResult.data) {
      setBookings(bookingsResult.data);
    }
    
    setIsRefreshing(false);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadCandidates = async (requestId: string) => {
    const result = await mockRequestsApi.getCandidates(requestId);
    if (result.success && result.data) {
      setCandidates(result.data);
    }
  };

  const handleViewRequest = async (request: Request) => {
    setSelectedRequest(request);
    await loadCandidates(request.id);
    setViewMode('details');
  };

  const handleCreateRequest = async (data: CreateRequestData) => {
    setIsLoading(true);
    
    const result = await mockRequestsApi.create(data);
    
    if (result.success && result.data) {
      toast({
        title: 'בקשה נשלחה בהצלחה!',
        description: 'המערכת מחפשת בייביסיטריות מתאימות...',
      });
      setViewMode('list');
      loadData();
    } else {
      toast({
        title: 'שגיאה',
        description: result.error || 'לא הצלחנו לשלוח את הבקשה',
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
  };

  const handleSelectBabysitter = (babysitterId: string) => {
    setSelectedBabysitter(babysitterId);
    setShowConfirmDialog(true);
  };

  const handleConfirmSelection = async () => {
    if (!selectedRequest || !selectedBabysitter) return;
    
    setIsLoading(true);
    
    const result = await mockRequestsApi.selectBabysitter(selectedRequest.id, selectedBabysitter);
    
    if (result.success) {
      toast({
        title: 'בייביסיטר נבחרה!',
        description: 'נשלחה הודעת אישור והפרטים יישלחו אליכם',
      });
      setShowConfirmDialog(false);
      setViewMode('list');
      loadData();
    } else {
      toast({
        title: 'שגיאה',
        description: result.error || 'לא הצלחנו לאשר את הבחירה',
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
  };

  const activeRequests = requests.filter(r => 
    !['COMPLETED', 'CANCELLED'].includes(r.status)
  );
  
  const completedRequests = requests.filter(r => 
    ['COMPLETED', 'CANCELLED'].includes(r.status)
  );

  const availableCandidates = candidates.filter(c => 
    c.response === 'INTERESTED' || c.response === 'GUARDIAN_APPROVED'
  );

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">שלום, {parentProfile?.full_name?.split(' ')[0] || 'הורה'}</h1>
              <p className="text-sm text-muted-foreground">ניהול בקשות לבייביסיטר</p>
            </div>
            <div className="flex items-center gap-2">
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

      <main className="container mx-auto px-4 py-6">
        {viewMode === 'list' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="flex gap-4">
              <Button onClick={() => setViewMode('create')} className="flex-1 h-auto py-4">
                <Plus className="h-5 w-5 ml-2" />
                בקשה חדשה
              </Button>
              <Button variant="outline" className="flex-1 h-auto py-4" disabled>
                <Phone className="h-5 w-5 ml-2" />
                הזמנה בטלפון
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 mx-auto text-amber-500 mb-2" />
                  <p className="text-2xl font-bold">{activeRequests.length}</p>
                  <p className="text-xs text-muted-foreground">בקשות פעילות</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-6 w-6 mx-auto text-teal mb-2" />
                  <p className="text-2xl font-bold">{bookings.length}</p>
                  <p className="text-xs text-muted-foreground">הזמנות מאושרות</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-6 w-6 mx-auto text-primary mb-2" />
                  <p className="text-2xl font-bold">{completedRequests.length}</p>
                  <p className="text-xs text-muted-foreground">הושלמו</p>
                </CardContent>
              </Card>
            </div>

            {/* Requests Tabs */}
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="active" className="flex-1">
                  פעילות ({activeRequests.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex-1">
                  היסטוריה ({completedRequests.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="space-y-4 mt-4">
                {activeRequests.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">אין בקשות פעילות</h3>
                      <p className="text-muted-foreground mb-4">
                        צרו בקשה חדשה למציאת בייביסיטר
                      </p>
                      <Button onClick={() => setViewMode('create')}>
                        <Plus className="h-4 w-4 ml-2" />
                        בקשה חדשה
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  activeRequests.map(request => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onView={() => handleViewRequest(request)}
                    />
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-4 mt-4">
                {completedRequests.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      אין היסטוריית בקשות
                    </CardContent>
                  </Card>
                ) : (
                  completedRequests.map(request => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onView={() => handleViewRequest(request)}
                      showActions={false}
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {viewMode === 'create' && (
          <CreateRequestForm
            defaultChildrenAges={parentProfile?.children_ages}
            defaultArea={parentProfile?.area}
            onSubmit={handleCreateRequest}
            onCancel={() => setViewMode('list')}
            isLoading={isLoading}
          />
        )}

        {viewMode === 'details' && selectedRequest && (
          <div className="space-y-6">
            <Button
              variant="ghost"
              onClick={() => setViewMode('list')}
              className="mb-4"
            >
              ← חזרה לרשימה
            </Button>

            {/* Request Summary */}
            <Card>
              <CardHeader>
                <CardTitle>פרטי הבקשה</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <strong>תאריך:</strong>{' '}
                  {format(new Date(selectedRequest.datetime_start), 'EEEE, d בMMMM yyyy', { locale: he })}
                </p>
                <p>
                  <strong>שעות:</strong>{' '}
                  {format(new Date(selectedRequest.datetime_start), 'HH:mm')} -{' '}
                  {format(new Date(selectedRequest.datetime_end), 'HH:mm')}
                </p>
                <p>
                  <strong>אזור:</strong> {selectedRequest.area}
                </p>
                <p>
                  <strong>ילדים:</strong> גילאי {selectedRequest.children_ages.join(', ')}
                </p>
              </CardContent>
            </Card>

            {/* Candidates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>מועמדות ({candidates.length})</span>
                  {availableCandidates.length > 0 && (
                    <Badge variant="secondary" className="bg-teal text-accent-foreground">
                      {availableCandidates.length} זמינות
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {selectedRequest.status === 'MATCHING' && 'המערכת מחפשת מועמדות מתאימות...'}
                  {selectedRequest.status === 'PENDING_RESPONSES' && 'ממתינים לתשובות מהמועמדות'}
                  {selectedRequest.status === 'PENDING_SELECTION' && 'בחרו בייביסיטר מהרשימה'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidates.length === 0 ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 mx-auto text-muted-foreground animate-spin mb-4" />
                    <p className="text-muted-foreground">מחפשים מועמדות מתאימות...</p>
                  </div>
                ) : (
                  candidates.map(candidate => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onSelect={() => handleSelectBabysitter(candidate.babysitter_id)}
                      isSelectable={selectedRequest.status !== 'CONFIRMED'}
                      isLoading={isLoading}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>אישור בחירה</DialogTitle>
            <DialogDescription>
              לאחר האישור, תקבלו את פרטי הקשר של הבייביסיטר ותישלח אליה הודעת אישור.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1"
              disabled={isLoading}
            >
              ביטול
            </Button>
            <Button
              onClick={handleConfirmSelection}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'מאשר...' : 'אישור ותשלום'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParentDashboard;
