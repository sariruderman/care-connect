// ============================================
// API Service Layer - Decoupled Backend Integration
// Replace BASE_URL with your actual backend URL
// All business logic resides in the backend
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

// Configuration - Replace with environment variable in production
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
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
          error: data.error || `HTTP ${response.status}`,
        };
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

  post<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
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
// Auth API
// ============================================
export const authApi = {
  // Send OTP to phone number
  sendOtp: (phone: string) =>
    client.post<{ expires_in: number }>('/auth/send-otp', { phone }),

  // Verify OTP and get token
  verifyOtp: (phone: string, code: string) =>
    client.post<{ token: string; user: User }>('/auth/verify-otp', { phone, code }),

  // Get current user
  getCurrentUser: () => client.get<User>('/auth/me'),

  // Logout
  logout: () => {
    client.setToken(null);
    return Promise.resolve({ success: true });
  },

  // Set token (after login)
  setToken: (token: string) => client.setToken(token),
};

// ============================================
// Users API
// ============================================
export const usersApi = {
  // Register parent
  registerParent: (data: ParentRegistrationData) =>
    client.post<{ user: User; profile: ParentProfile }>('/users/register/parent', data),

  // Register babysitter
  registerBabysitter: (data: BabysitterRegistrationData) =>
    client.post<{ user: User; profile: BabysitterProfile }>('/users/register/babysitter', data),

  // Get parent profile
  getParentProfile: (userId: string) =>
    client.get<ParentProfile>(`/users/parent/${userId}`),

  // Get babysitter profile
  getBabysitterProfile: (userId: string) =>
    client.get<BabysitterProfile>(`/users/babysitter/${userId}`),

  // Update parent profile
  updateParentProfile: (userId: string, data: Partial<ParentProfile>) =>
    client.put<ParentProfile>(`/users/parent/${userId}`, data),

  // Update babysitter profile
  updateBabysitterProfile: (userId: string, data: Partial<BabysitterProfile>) =>
    client.put<BabysitterProfile>(`/users/babysitter/${userId}`, data),
};

// ============================================
// Guardian API
// ============================================
export const guardianApi = {
  // Link guardian to babysitter
  linkGuardian: (babysitterId: string, guardianPhone: string, guardianName: string) =>
    client.post<Guardian>('/guardians/link', {
      babysitter_id: babysitterId,
      phone: guardianPhone,
      name: guardianName,
    }),

  // Verify guardian (called after guardian confirms via phone/OTP)
  verifyGuardian: (guardianId: string, code: string) =>
    client.post<Guardian>(`/guardians/${guardianId}/verify`, { code }),

  // Get guardian for babysitter
  getGuardian: (babysitterId: string) =>
    client.get<Guardian>(`/guardians/babysitter/${babysitterId}`),

  // Guardian approves a request
  approveRequest: (guardianId: string, candidateId: string) =>
    client.post<RequestCandidate>(`/guardians/${guardianId}/approve/${candidateId}`, {}),

  // Guardian declines a request
  declineRequest: (guardianId: string, candidateId: string) =>
    client.post<RequestCandidate>(`/guardians/${guardianId}/decline/${candidateId}`, {}),
};

// ============================================
// Community Styles API
// ============================================
export const communityStylesApi = {
  // Get all active community styles
  getAll: () => client.get<CommunityStyle[]>('/community-styles'),

  // Get single community style
  getById: (id: string) => client.get<CommunityStyle>(`/community-styles/${id}`),
};

// ============================================
// Requests API (Job postings)
// ============================================
export const requestsApi = {
  // Create new request
  create: (data: CreateRequestData) =>
    client.post<Request>('/requests', data),

  // Get request by ID
  getById: (id: string) => client.get<Request>(`/requests/${id}`),

  // Get requests for parent
  getParentRequests: (parentId: string, page = 1, perPage = 10) =>
    client.get<PaginatedResponse<Request>>(
      `/requests/parent/${parentId}?page=${page}&per_page=${perPage}`
    ),

  // Get candidates for request (parent view)
  getCandidates: (requestId: string) =>
    client.get<RequestCandidate[]>(`/requests/${requestId}/candidates`),

  // Select babysitter (parent chooses)
  selectBabysitter: (requestId: string, babysitterId: string) =>
    client.post<Booking>(`/requests/${requestId}/select`, { babysitter_id: babysitterId }),

  // Cancel request
  cancel: (requestId: string) =>
    client.post<Request>(`/requests/${requestId}/cancel`, {}),
};

// ============================================
// Babysitter Requests API
// ============================================
export const babysitterRequestsApi = {
  // Get pending requests for babysitter
  getPendingRequests: (babysitterId: string) =>
    client.get<RequestCandidate[]>(`/babysitter/${babysitterId}/pending-requests`),

  // Babysitter accepts request
  acceptRequest: (candidateId: string) =>
    client.post<RequestCandidate>(`/babysitter/requests/${candidateId}/accept`, {}),

  // Babysitter declines request
  declineRequest: (candidateId: string) =>
    client.post<RequestCandidate>(`/babysitter/requests/${candidateId}/decline`, {}),

  // Get babysitter's upcoming bookings
  getUpcomingBookings: (babysitterId: string) =>
    client.get<Booking[]>(`/babysitter/${babysitterId}/bookings/upcoming`),
};

// ============================================
// Bookings API
// ============================================
export const bookingsApi = {
  // Get booking by ID
  getById: (id: string) => client.get<Booking>(`/bookings/${id}`),

  // Get parent's bookings
  getParentBookings: (parentId: string, page = 1, perPage = 10) =>
    client.get<PaginatedResponse<Booking>>(
      `/bookings/parent/${parentId}?page=${page}&per_page=${perPage}`
    ),

  // Get babysitter's bookings
  getBabysitterBookings: (babysitterId: string, page = 1, perPage = 10) =>
    client.get<PaginatedResponse<Booking>>(
      `/bookings/babysitter/${babysitterId}?page=${page}&per_page=${perPage}`
    ),

  // Start booking (babysitter arrived)
  startBooking: (bookingId: string) =>
    client.post<Booking>(`/bookings/${bookingId}/start`, {}),

  // Complete booking
  completeBooking: (bookingId: string) =>
    client.post<Booking>(`/bookings/${bookingId}/complete`, {}),

  // Cancel booking
  cancelBooking: (bookingId: string, reason: string) =>
    client.post<Booking>(`/bookings/${bookingId}/cancel`, { reason }),

  // Add rating (parent rates babysitter)
  addParentRating: (bookingId: string, rating: number, review?: string) =>
    client.post<Booking>(`/bookings/${bookingId}/rate`, { rating, review }),
};

// ============================================
// Matching API
// ============================================
export const matchingApi = {
  // Trigger matching for a request
  findCandidates: (requestId: string) =>
    client.post<{ candidates_count: number }>(`/matching/find/${requestId}`, {}),

  // Get matching preferences
  getPreferences: () => client.get<{ areas: string[]; age_range: { min: number; max: number } }>('/matching/preferences'),
};

// ============================================
// Telephony Webhook Endpoints (Backend receives these)
// Frontend can check status
// ============================================
export const telephonyApi = {
  // Get call status for a candidate
  getCallStatus: (candidateId: string) =>
    client.get<{ status: string; attempts: number }>(`/telephony/call-status/${candidateId}`),

  // Retry call to candidate
  retryCall: (candidateId: string) =>
    client.post<{ success: boolean }>(`/telephony/retry/${candidateId}`, {}),
};

// Export client for custom requests
export { client as apiClient };
