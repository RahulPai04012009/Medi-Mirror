
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
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

export enum AppRoute {
  SPLASH = 'splash',
  AUTH = 'auth',
  PROFILE_SETUP = 'profile_setup',
  HOME = 'home',
  SYMPTOM_CHECKER = 'symptom_checker',
  WOUND_SCANNER = 'wound_scanner',
  DOCTORS = 'doctors',
  RECORDS = 'records',
  EMERGENCY = 'emergency',
  SETTINGS = 'settings',
  CHAT = 'chat',
  MAP = 'map'
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  hospital: string;
  image: string;
  available: boolean;
  rating: number;
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
