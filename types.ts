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
  CHAT = 'chat'
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

export interface SymptomAnalysis {
  conditions: Array<{ name: string; probability: string; severity: 'low' | 'medium' | 'high' }>;
  recommendation: string;
  seeDoctor: boolean;
}

export interface WoundAnalysis {
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