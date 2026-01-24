
export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  age: number;
  dob: string;
  height: string;
  weight: string;
  bloodGroup: string;
  allergies: string;
  conditions: string;
  deviceConnected: boolean;
  deviceName?: string;
  role: 'patient' | 'doctor';
  doctorProfile?: {
    specialty: string;
    qualifications: string;
    licenseNumber: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
  };
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  settings?: {
    contextAware: boolean;
    cloudSync: boolean;
    notifications: boolean;
  };
}

export enum AppRoute {
  SPLASH = 'splash',
  AUTH = 'auth',
  PROFILE_SETUP = 'profile_setup',
  HOME = 'home',
  SYMPTOM_CHECKER = 'symptom_checker',
  WOUND_SCANNER = 'wound_scanner',
  MIRROR_CHECK = 'mirror_check',
  DOCTORS = 'doctors',
  RECORDS = 'records',
  EMERGENCY = 'emergency',
  SETTINGS = 'settings',
  CHAT = 'chat',
  MAP = 'map'
}

export interface Review {
  id: string;
  patientName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface ClinicFacilities {
  wheelchair: boolean;
  parking: boolean;
  wifi: boolean;
  emergency: boolean;
  pharmacy: boolean;
  lab: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  degrees: string[]; 
  experience?: number; 
  languages: string[];
  licenseNumber?: string;
  gender?: 'Male' | 'Female' | 'Other';
  
  hospital: string;
  address: string;
  coordinates: { lat: number; lng: number };
  distance?: number;
  facilities: ClinicFacilities;
  workingHours?: string;
  consultationFee?: number;

  image: string;
  available?: boolean;
  
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

export interface Visit {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  hospital: string;
  doctorImage: string;
  type: 'Video' | 'In-Person';
  reportId?: string;
}

export interface SymptomAnalysis {
  conditions: Array<{ name: string; probability: string; severity: 'low' | 'medium' | 'high' }>;
  explanation: string;
  treatment: string;
  suggestedMedicines: string[];
  specialistType: string;
  recommendation: string;
  seeDoctor: boolean;
}

export interface WoundAnalysis {
  conditionName: string;
  description: string;
  severity: string;
  specialistType: string;
  rednessLevel: string;
  infectionProbability: string;
  healingStage: string;
  urgentCareNeeded: boolean;
  advice: string;
}

export interface MoodAnalysis {
  fatigueLevel: 'Low' | 'Medium' | 'High';
  stressLevel: 'Low' | 'Medium' | 'High';
  mood: string;
  wellnessScore: number; // 1-10
  insight: string;
  physicalSigns: string[]; // e.g. "Dark circles", "Pale skin"
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface Place {
  name: string;
  uri: string;
  address?: string;
  reason?: string; 
  distance?: number;
  coords?: {
    lat: number;
    lng: number;
  };
}
