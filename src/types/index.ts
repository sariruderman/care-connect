// ============================================
// Data Models - Compatible with PostgreSQL/MySQL
// These types define the API contract between Frontend and Backend
// ============================================

// User Types
export type UserType = 'PARENT' | 'BABYSITTER' | 'GUARDIAN' | 'ADMIN';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DELETED';

export interface User {
  id: string;
  type: UserType;
  phone: string;
  email?: string;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

// Community Style - Admin managed categorization
export interface CommunityStyle {
  id: string;
  label: string;
  description?: string;
  active: boolean;
}

// Parent Profile
export interface ParentProfile {
  user_id: string;
  full_name: string;
  address: string;
  city: string;
  area: string;
  children_ages: number[];
  household_notes?: string; // Additional adults, pets, etc.
  community_style_id?: string;
  created_at: string;
  updated_at: string;
}

// Guardian (Parent Supervisor)
export interface Guardian {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  preferred_channel: 'PHONE' | 'WEB' | 'BOTH';
  verified: boolean;
  created_at: string;
}

// Babysitter Profile
export type ApprovalMode = 'AUTO_APPROVE' | 'APPROVE_EACH_REQUEST' | 'APPROVE_NEW_FAMILIES';

export interface BabysitterProfile {
  user_id: string;
  full_name: string;
  age: number;
  service_areas: string[];
  availability: AvailabilitySlot[];
  experience_years: number;
  community_style_id?: string;
  guardian_id?: string;
  guardian_required_approval: boolean;
  approval_mode: ApprovalMode;
  rating: number;
  total_reviews: number;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface AvailabilitySlot {
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string; // HH:mm
  end_time: string; // HH:mm
}

// Request (Job posting by parent)
export type RequestStatus = 
  | 'NEW' 
  | 'MATCHING' 
  | 'PENDING_RESPONSES' 
  | 'PENDING_SELECTION' 
  | 'PENDING_PAYMENT' 
  | 'CONFIRMED' 
  | 'COMPLETED' 
  | 'CANCELLED';

export interface Request {
  id: string;
  parent_id: string;
  datetime_start: string;
  datetime_end: string;
  area: string;
  address?: string;
  children_ages: number[];
  requirements?: string;
  min_babysitter_age?: number;
  max_babysitter_age?: number;
  community_style_id?: string;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
}

// Request Candidate - Matched babysitters for a request
export type CandidateCallStatus = 
  | 'PENDING' 
  | 'CALLING' 
  | 'COMPLETED' 
  | 'NO_ANSWER' 
  | 'FAILED';

export type CandidateResponse = 
  | 'PENDING' 
  | 'INTERESTED' 
  | 'DECLINED' 
  | 'GUARDIAN_PENDING' 
  | 'GUARDIAN_APPROVED' 
  | 'GUARDIAN_DECLINED';

export interface RequestCandidate {
  id: string;
  request_id: string;
  babysitter_id: string;
  call_status: CandidateCallStatus;
  call_attempts: number;
  response: CandidateResponse;
  babysitter_responded_at?: string;
  guardian_responded_at?: string;
  created_at: string;
}

// Booking - Final confirmed booking
export type BookingStatus = 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';

export interface Booking {
  id: string;
  request_id: string;
  parent_id: string;
  babysitter_id: string;
  datetime_start: string;
  datetime_end: string;
  address: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_amount?: number;
  confirmed_at: string;
  started_at?: string;
  completed_at?: string;
  parent_rating?: number;
  parent_review?: string;
  babysitter_rating?: number;
  created_at: string;
}

// Phone Verification
export interface PhoneVerification {
  phone: string;
  code: string;
  expires_at: string;
  verified: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// IVR/Telephony Webhook Events
export type TelephonyEventType = 
  | 'CALL_INITIATED' 
  | 'CALL_ANSWERED' 
  | 'CALL_COMPLETED' 
  | 'DTMF_RECEIVED' 
  | 'CALL_FAILED'
  | 'RECORDING_READY';

export interface TelephonyWebhookEvent {
  event_type: TelephonyEventType;
  call_id: string;
  phone: string;
  timestamp: string;
  dtmf_input?: string;
  recording_url?: string;
  duration_seconds?: number;
  metadata?: Record<string, unknown>;
}

// Registration DTOs
export interface ParentRegistrationData {
  phone: string;
  full_name: string;
  email?: string;
  address: string;
  city: string;
  neighborhood: string;
  children_ages: number[];
  household_notes?: string;
  community_style_id?: string;
}

export interface BabysitterRegistrationData {
  phone: string;
  full_name: string;
  email?: string;
  age: number;
  service_areas: string[];
  experience_years: number;
  community_style_id?: string;
  bio?: string;
  has_guardian: boolean;
  guardian_phone?: string;
  guardian_name?: string;
  approval_mode?: ApprovalMode;
  city: string;
  neighborhood: string;
  walking_radius_minutes: number;
}

export interface CreateRequestData {
  datetime_start: string;
  datetime_end: string;
  area: string;
  address?: string;
  children_ages: number[];
  requirements?: string;
  min_babysitter_age?: number;
  max_babysitter_age?: number;
  community_style_id?: string;
}
