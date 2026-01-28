// ============================================
// Mock API Implementation for Development
// This simulates backend responses for UI development
// Replace with real API calls in production
// ============================================

import type {
  ApiResponse,
  User,
  ParentProfile,
  BabysitterProfile,
  Guardian,
  CommunityStyle,
  Request,
  RequestCandidate,
  Booking,
  ParentRegistrationData,
  BabysitterRegistrationData,
  CreateRequestData,
} from '@/types';

// Simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data storage (in-memory)
const mockStorage = {
  users: new Map<string, User>(),
  parentProfiles: new Map<string, ParentProfile>(),
  babysitterProfiles: new Map<string, BabysitterProfile>(),
  guardians: new Map<string, Guardian>(),
  requests: new Map<string, Request>(),
  candidates: new Map<string, RequestCandidate>(),
  bookings: new Map<string, Booking>(),
  otpCodes: new Map<string, string>(),
  currentUser: null as User | null,
};

// Generate ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock Community Styles
const mockCommunityStyles: CommunityStyle[] = [
  { id: '1', label: 'דתי', description: 'משפחות דתיות', active: true },
  { id: '2', label: 'חילוני', description: 'משפחות חילוניות', active: true },
  { id: '3', label: 'מסורתי', description: 'משפחות מסורתיות', active: true },
  { id: '4', label: 'חרדי', description: 'משפחות חרדיות', active: true },
  { id: '5', label: 'ללא העדפה', description: 'פתוח לכל הקהילות', active: true },
];

// Mock Babysitters for demo
const mockBabysitters: BabysitterProfile[] = [
  {
    user_id: 'bs1',
    full_name: 'שרה כהן',
    age: 17,
    service_areas: ['תל אביב', 'רמת גן'],
    availability: [
      { day_of_week: 0, start_time: '16:00', end_time: '22:00' },
      { day_of_week: 4, start_time: '16:00', end_time: '23:00' },
      { day_of_week: 5, start_time: '18:00', end_time: '23:30' },
    ],
    experience_years: 2,
    community_style_id: '1',
    guardian_id: 'g1',
    guardian_required_approval: true,
    approval_mode: 'APPROVE_EACH_REQUEST',
    rating: 4.8,
    total_reviews: 15,
    bio: 'אוהבת ילדים, סבלנית ויצירתית',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    user_id: 'bs2',
    full_name: 'מיכל לוי',
    age: 19,
    service_areas: ['תל אביב', 'הרצליה', 'רעננה'],
    availability: [
      { day_of_week: 1, start_time: '17:00', end_time: '22:00' },
      { day_of_week: 3, start_time: '17:00', end_time: '22:00' },
      { day_of_week: 5, start_time: '19:00', end_time: '00:00' },
    ],
    experience_years: 4,
    community_style_id: '2',
    guardian_required_approval: false,
    approval_mode: 'AUTO_APPROVE',
    rating: 4.9,
    total_reviews: 32,
    bio: 'סטודנטית לחינוך, ניסיון רב עם תינוקות',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    user_id: 'bs3',
    full_name: 'נועה אברהם',
    age: 16,
    service_areas: ['ירושלים', 'בית שמש'],
    availability: [
      { day_of_week: 0, start_time: '15:00', end_time: '21:00' },
      { day_of_week: 2, start_time: '15:00', end_time: '21:00' },
    ],
    experience_years: 1,
    community_style_id: '4',
    guardian_id: 'g2',
    guardian_required_approval: true,
    approval_mode: 'APPROVE_EACH_REQUEST',
    rating: 4.5,
    total_reviews: 8,
    bio: 'בוגרת קורס עזרה ראשונה',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Initialize mock babysitters
mockBabysitters.forEach(bs => {
  mockStorage.babysitterProfiles.set(bs.user_id, bs);
  mockStorage.users.set(bs.user_id, {
    id: bs.user_id,
    type: 'BABYSITTER',
    phone: `050${Math.random().toString().slice(2, 9)}`,
    status: 'ACTIVE',
    created_at: bs.created_at,
    updated_at: bs.updated_at,
  });
});

// ============================================
// Mock Auth API
// ============================================
export const mockAuthApi = {
  sendOtp: async (phone: string): Promise<ApiResponse<{ expires_in: number }>> => {
    await delay(500);
    const code = Math.random().toString().slice(2, 8);
    mockStorage.otpCodes.set(phone, code);
    console.log(`[Mock OTP] Phone: ${phone}, Code: ${code}`);
    return { success: true, data: { expires_in: 300 } };
  },

  verifyOtp: async (phone: string, code: string): Promise<ApiResponse<{ token: string; user: User }>> => {
    await delay(500);
    const storedCode = mockStorage.otpCodes.get(phone);
    
    // For demo, accept any 6-digit code or the stored code
    if (code.length === 6 || code === storedCode) {
      let user = Array.from(mockStorage.users.values()).find(u => u.phone === phone);
      
      if (!user) {
        // Create new user
        user = {
          id: generateId(),
          type: 'PARENT', // Default, will be updated during registration
          phone,
          status: 'PENDING',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockStorage.users.set(user.id, user);
      }
      
      mockStorage.currentUser = user;
      return { 
        success: true, 
        data: { 
          token: `mock_token_${user.id}`,
          user 
        } 
      };
    }
    
    return { success: false, error: 'קוד שגוי' };
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    await delay(200);
    if (mockStorage.currentUser) {
      return { success: true, data: mockStorage.currentUser };
    }
    return { success: false, error: 'לא מחובר' };
  },
};

// ============================================
// Mock Users API
// ============================================
export const mockUsersApi = {
  registerParent: async (data: ParentRegistrationData): Promise<ApiResponse<{ user: User; profile: ParentProfile }>> => {
    await delay(800);
    
    let user = Array.from(mockStorage.users.values()).find(u => u.phone === data.phone);
    
    if (!user) {
      user = {
        id: generateId(),
        type: 'PARENT',
        phone: data.phone,
        email: data.email,
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else {
      user.type = 'PARENT';
      user.status = 'ACTIVE';
      user.email = data.email;
    }
    
    mockStorage.users.set(user.id, user);
    
    const profile: ParentProfile = {
      user_id: user.id,
      full_name: data.full_name,
      address: data.address,
      city: data.city,
      area: data.area,
      children_ages: data.children_ages,
      household_notes: data.household_notes,
      community_style_id: data.community_style_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    mockStorage.parentProfiles.set(user.id, profile);
    mockStorage.currentUser = user;
    
    return { success: true, data: { user, profile } };
  },

  registerBabysitter: async (data: BabysitterRegistrationData): Promise<ApiResponse<{ user: User; profile: BabysitterProfile }>> => {
    await delay(800);
    
    let user = Array.from(mockStorage.users.values()).find(u => u.phone === data.phone);
    
    if (!user) {
      user = {
        id: generateId(),
        type: 'BABYSITTER',
        phone: data.phone,
        email: data.email,
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else {
      user.type = 'BABYSITTER';
      user.status = 'ACTIVE';
      user.email = data.email;
    }
    
    mockStorage.users.set(user.id, user);
    
    let guardian_id: string | undefined;
    
    if (data.has_guardian && data.guardian_phone && data.guardian_name) {
      const guardian: Guardian = {
        id: generateId(),
        user_id: user.id,
        full_name: data.guardian_name,
        phone: data.guardian_phone,
        preferred_channel: 'PHONE',
        verified: false,
        created_at: new Date().toISOString(),
      };
      mockStorage.guardians.set(guardian.id, guardian);
      guardian_id = guardian.id;
    }
    
    const profile: BabysitterProfile = {
      user_id: user.id,
      full_name: data.full_name,
      age: data.age,
      service_areas: data.service_areas,
      availability: [],
      experience_years: data.experience_years,
      community_style_id: data.community_style_id,
      guardian_id,
      guardian_required_approval: data.has_guardian,
      approval_mode: data.approval_mode || 'APPROVE_EACH_REQUEST',
      rating: 0,
      total_reviews: 0,
      bio: data.bio,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    mockStorage.babysitterProfiles.set(user.id, profile);
    mockStorage.currentUser = user;
    
    return { success: true, data: { user, profile } };
  },

  getParentProfile: async (userId: string): Promise<ApiResponse<ParentProfile>> => {
    await delay(300);
    const profile = mockStorage.parentProfiles.get(userId);
    if (profile) {
      return { success: true, data: profile };
    }
    return { success: false, error: 'פרופיל לא נמצא' };
  },

  getBabysitterProfile: async (userId: string): Promise<ApiResponse<BabysitterProfile>> => {
    await delay(300);
    const profile = mockStorage.babysitterProfiles.get(userId);
    if (profile) {
      return { success: true, data: profile };
    }
    return { success: false, error: 'פרופיל לא נמצא' };
  },
};

// ============================================
// Mock Community Styles API
// ============================================
export const mockCommunityStylesApi = {
  getAll: async (): Promise<ApiResponse<CommunityStyle[]>> => {
    await delay(200);
    return { success: true, data: mockCommunityStyles };
  },
};

// ============================================
// Mock Requests API
// ============================================
export const mockRequestsApi = {
  create: async (data: CreateRequestData): Promise<ApiResponse<Request>> => {
    await delay(600);
    
    if (!mockStorage.currentUser) {
      return { success: false, error: 'לא מחובר' };
    }
    
    const request: Request = {
      id: generateId(),
      parent_id: mockStorage.currentUser.id,
      ...data,
      status: 'NEW',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    mockStorage.requests.set(request.id, request);
    
    // Simulate matching - find candidates
    setTimeout(() => {
      request.status = 'MATCHING';
      mockStorage.requests.set(request.id, request);
      
      // Match babysitters by area
      const matchedBabysitters = mockBabysitters.filter(bs => 
        bs.service_areas.some(area => 
          area.includes(data.area) || data.area.includes(area)
        )
      );
      
      matchedBabysitters.forEach(bs => {
        const candidate: RequestCandidate = {
          id: generateId(),
          request_id: request.id,
          babysitter_id: bs.user_id,
          call_status: 'PENDING',
          call_attempts: 0,
          response: 'PENDING',
          created_at: new Date().toISOString(),
        };
        mockStorage.candidates.set(candidate.id, candidate);
      });
      
      request.status = 'PENDING_RESPONSES';
      mockStorage.requests.set(request.id, request);
    }, 2000);
    
    return { success: true, data: request };
  },

  getById: async (id: string): Promise<ApiResponse<Request>> => {
    await delay(300);
    const request = mockStorage.requests.get(id);
    if (request) {
      return { success: true, data: request };
    }
    return { success: false, error: 'בקשה לא נמצאה' };
  },

  getParentRequests: async (parentId: string): Promise<ApiResponse<Request[]>> => {
    await delay(400);
    const requests = Array.from(mockStorage.requests.values())
      .filter(r => r.parent_id === parentId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return { success: true, data: requests };
  },

  getCandidates: async (requestId: string): Promise<ApiResponse<(RequestCandidate & { babysitter: BabysitterProfile })[]>> => {
    await delay(400);
    const candidates = Array.from(mockStorage.candidates.values())
      .filter(c => c.request_id === requestId)
      .map(c => ({
        ...c,
        babysitter: mockStorage.babysitterProfiles.get(c.babysitter_id) || mockBabysitters.find(bs => bs.user_id === c.babysitter_id)!,
      }));
    return { success: true, data: candidates };
  },

  selectBabysitter: async (requestId: string, babysitterId: string): Promise<ApiResponse<Booking>> => {
    await delay(600);
    
    const request = mockStorage.requests.get(requestId);
    if (!request) {
      return { success: false, error: 'בקשה לא נמצאה' };
    }
    
    const booking: Booking = {
      id: generateId(),
      request_id: requestId,
      parent_id: request.parent_id,
      babysitter_id: babysitterId,
      datetime_start: request.datetime_start,
      datetime_end: request.datetime_end,
      address: request.address || '',
      status: 'CONFIRMED',
      payment_status: 'PENDING',
      confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    
    mockStorage.bookings.set(booking.id, booking);
    request.status = 'CONFIRMED';
    mockStorage.requests.set(requestId, request);
    
    return { success: true, data: booking };
  },
};

// ============================================
// Mock Babysitter Requests API
// ============================================
export const mockBabysitterRequestsApi = {
  acceptRequest: async (candidateId: string): Promise<ApiResponse<RequestCandidate>> => {
    await delay(500);
    const candidate = mockStorage.candidates.get(candidateId);
    if (!candidate) {
      return { success: false, error: 'מועמדות לא נמצאה' };
    }
    
    const babysitter = mockStorage.babysitterProfiles.get(candidate.babysitter_id);
    
    if (babysitter?.guardian_required_approval) {
      candidate.response = 'GUARDIAN_PENDING';
    } else {
      candidate.response = 'INTERESTED';
    }
    candidate.babysitter_responded_at = new Date().toISOString();
    mockStorage.candidates.set(candidateId, candidate);
    
    return { success: true, data: candidate };
  },

  declineRequest: async (candidateId: string): Promise<ApiResponse<RequestCandidate>> => {
    await delay(500);
    const candidate = mockStorage.candidates.get(candidateId);
    if (!candidate) {
      return { success: false, error: 'מועמדות לא נמצאה' };
    }
    
    candidate.response = 'DECLINED';
    candidate.babysitter_responded_at = new Date().toISOString();
    mockStorage.candidates.set(candidateId, candidate);
    
    return { success: true, data: candidate };
  },
};

// ============================================
// Mock Guardian API
// ============================================
export const mockGuardianApi = {
  approveRequest: async (guardianId: string, candidateId: string): Promise<ApiResponse<RequestCandidate>> => {
    await delay(500);
    const candidate = mockStorage.candidates.get(candidateId);
    if (!candidate) {
      return { success: false, error: 'מועמדות לא נמצאה' };
    }
    
    candidate.response = 'GUARDIAN_APPROVED';
    candidate.guardian_responded_at = new Date().toISOString();
    mockStorage.candidates.set(candidateId, candidate);
    
    return { success: true, data: candidate };
  },

  declineRequest: async (guardianId: string, candidateId: string): Promise<ApiResponse<RequestCandidate>> => {
    await delay(500);
    const candidate = mockStorage.candidates.get(candidateId);
    if (!candidate) {
      return { success: false, error: 'מועמדות לא נמצאה' };
    }
    
    candidate.response = 'GUARDIAN_DECLINED';
    candidate.guardian_responded_at = new Date().toISOString();
    mockStorage.candidates.set(candidateId, candidate);
    
    return { success: true, data: candidate };
  },
};

// ============================================
// Mock Bookings API
// ============================================
export const mockBookingsApi = {
  getParentBookings: async (parentId: string): Promise<ApiResponse<Booking[]>> => {
    await delay(400);
    const bookings = Array.from(mockStorage.bookings.values())
      .filter(b => b.parent_id === parentId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return { success: true, data: bookings };
  },

  getBabysitterBookings: async (babysitterId: string): Promise<ApiResponse<Booking[]>> => {
    await delay(400);
    const bookings = Array.from(mockStorage.bookings.values())
      .filter(b => b.babysitter_id === babysitterId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return { success: true, data: bookings };
  },
};

// Export mock storage for debugging
export { mockStorage };
