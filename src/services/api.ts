// ============================================
// API Service Layer - Backend Integration
// Connects to NestJS backend at /api prefix
// ============================================

import type {
  ApiResponse,
  PaginatedResponse,
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

// Configuration
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  TIMEOUT: 30000,
};

// HTTP Client with error handling
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `HTTP ${response.status}`,
        };
      }

      // Backend may return { success, data } or raw data
      if (data.success !== undefined) {
        return data;
      }

      return { success: true, data };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  patch<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const client = new ApiClient(API_CONFIG.BASE_URL);

// ============================================
// Auth API - matches backend/src/auth/auth.controller.ts
// POST /auth/send-otp
// POST /auth/verify-otp
// ============================================
export const authApi = {
  sendOtp: (phone: string) =>
    client.post<{ expires_in: number }>('/auth/send-otp', { phone }),

  verifyOtp: (phone: string, code: string) =>
    client.post<{ token: string; user: User }>('/auth/verify-otp', { phone, code }),

  getCurrentUser: () => client.get<User>('/auth/me'),

  logout: () => {
    client.setToken(null);
    return Promise.resolve({ success: true as const });
  },

  setToken: (token: string) => client.setToken(token),
};

// ============================================
// Parents API - matches backend/src/parents/parents.controller.ts
// POST /parents/register
// GET /parents
// GET /parents/:id
// GET /parents/user/:userId
// PATCH /parents/:id
// DELETE /parents/:id
// ============================================
export const parentsApi = {
  register: (data: ParentRegistrationData) =>
    client.post<{ user: User; profile: ParentProfile }>('/parents/register', {
      phone: data.phone,
      fullName: data.full_name,
      email: data.email,
      address: data.address,
      city: data.city,
      neighborhood: data.neighborhood,
      childrenAges: data.children_ages,
      householdNotes: data.household_notes,
      communityStyleId: data.community_style_id,
      languages: data.languages,
    }),

  getAll: () => client.get<ParentProfile[]>('/parents'),

  getById: (id: string) => client.get<ParentProfile>(`/parents/${id}`),

  getByUserId: (userId: string) => client.get<ParentProfile>(`/parents/user/${userId}`),

  update: (id: string, data: Partial<ParentProfile>) =>
    client.patch<ParentProfile>(`/parents/${id}`, data),

  remove: (id: string) => client.delete(`/parents/${id}`),
};

// ============================================
// Babysitters API - matches backend/src/babysitters/babysitters.controller.ts
// POST /babysitters/register
// GET /babysitters
// GET /babysitters/:id
// GET /babysitters/user/:userId
// PATCH /babysitters/:id
// DELETE /babysitters/:id
// ============================================
export const babysittersApi = {
  register: (data: BabysitterRegistrationData) =>
    client.post<{ user: User; profile: BabysitterProfile }>('/babysitters/register', {
      phone: data.phone,
      fullName: data.full_name,
      email: data.email,
      age: data.age,
      city: data.city,
      neighborhood: data.neighborhood,
      walkingRadiusMinutes: data.walking_radius_minutes,
      serviceAreas: data.service_areas,
      experienceYears: data.experience_years,
      communityStyleId: data.community_style_id,
      bio: data.bio,
      hasGuardian: data.has_guardian,
      guardianPhone: data.guardian_phone,
      guardianName: data.guardian_name,
      approvalMode: data.approval_mode,
      languages: data.languages,
    }),

  getAll: () => client.get<BabysitterProfile[]>('/babysitters'),

  getById: (id: string) => client.get<BabysitterProfile>(`/babysitters/${id}`),

  getByUserId: (userId: string) => client.get<BabysitterProfile>(`/babysitters/user/${userId}`),

  update: (id: string, data: Partial<BabysitterProfile>) =>
    client.patch<BabysitterProfile>(`/babysitters/${id}`, data),

  remove: (id: string) => client.delete(`/babysitters/${id}`),
};

// ============================================
// Guardians API - matches backend/src/guardians/guardians.controller.ts
// ============================================
export const guardianApi = {
  create: (data: { userId: string; babysitterId?: string; fullName: string; phone: string }) =>
    client.post<Guardian>('/guardians', data),

  getAll: () => client.get<Guardian[]>('/guardians'),

  getById: (id: string) => client.get<Guardian>(`/guardians/${id}`),

  update: (id: string, data: Partial<Guardian>) =>
    client.patch<Guardian>(`/guardians/${id}`, data),

  remove: (id: string) => client.delete(`/guardians/${id}`),
};

// ============================================
// Community Styles API - matches backend/src/community-styles/community-styles.controller.ts
// GET /community-styles
// GET /community-styles/:id
// ============================================
export const communityStylesApi = {
  getAll: () => client.get<CommunityStyle[]>('/community-styles'),

  getById: (id: string) => client.get<CommunityStyle>(`/community-styles/${id}`),
};

// ============================================
// Cities API - matches backend/src/city/city.controller.ts
// GET /cities
// GET /cities/:id
// ============================================
export const citiesApi = {
  getAll: () => client.get<{ id: string; name: string }[]>('/cities'),

  getById: (id: string) => client.get<{ id: string; name: string }>(`/cities/${id}`),
};

// ============================================
// Jobs/Requests API - matches backend/src/jobs/jobs.controller.ts
// POST /jobs
// GET /jobs
// GET /jobs/:id
// PATCH /jobs/:id
// DELETE /jobs/:id
// ============================================
export const requestsApi = {
  create: (data: CreateRequestData) =>
    client.post<Request>('/jobs', data),

  getById: (id: string) => client.get<Request>(`/jobs/${id}`),

  getAll: () => client.get<Request[]>('/jobs'),

  getParentRequests: (parentId: string) =>
    client.get<Request[]>(`/jobs?parentId=${parentId}`),

  getCandidates: (requestId: string) =>
    client.get<(RequestCandidate & { babysitter: BabysitterProfile })[]>(`/jobs/${requestId}/candidates`),

  selectBabysitter: (requestId: string, babysitterId: string) =>
    client.post<Booking>(`/jobs/${requestId}/select`, { babysitter_id: babysitterId }),

  cancel: (requestId: string) =>
    client.post<Request>(`/jobs/${requestId}/cancel`, {}),
};

// ============================================
// Babysitter Requests API
// ============================================
export const babysitterRequestsApi = {
  getPendingRequests: (babysitterId: string) =>
    client.get<RequestCandidate[]>(`/babysitters/${babysitterId}/pending-requests`),

  acceptRequest: (candidateId: string) =>
    client.post<RequestCandidate>(`/babysitters/requests/${candidateId}/accept`, {}),

  declineRequest: (candidateId: string) =>
    client.post<RequestCandidate>(`/babysitters/requests/${candidateId}/decline`, {}),
};

// ============================================
// Bookings API - matches backend/src/bookings/bookings.controller.ts
// ============================================
export const bookingsApi = {
  getById: (id: string) => client.get<Booking>(`/bookings/${id}`),

  getParentBookings: (parentId: string) =>
    client.get<Booking[]>(`/bookings?parentId=${parentId}`),

  getBabysitterBookings: (babysitterId: string) =>
    client.get<Booking[]>(`/bookings?babysitterId=${babysitterId}`),

  startBooking: (bookingId: string) =>
    client.post<Booking>(`/bookings/${bookingId}/start`, {}),

  completeBooking: (bookingId: string) =>
    client.post<Booking>(`/bookings/${bookingId}/complete`, {}),

  cancelBooking: (bookingId: string, reason: string) =>
    client.post<Booking>(`/bookings/${bookingId}/cancel`, { reason }),
};

// ============================================
// Telephony API
// ============================================
export const telephonyApi = {
  getCallStatus: (candidateId: string) =>
    client.get<{ status: string; attempts: number }>(`/telephony/call-status/${candidateId}`),

  retryCall: (candidateId: string) =>
    client.post<{ success: boolean }>(`/telephony/retry/${candidateId}`, {}),
};

// Export client for custom requests
export { client as apiClient };
