
import React, { useState, useEffect, ErrorInfo, Component, ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import { Splash, ProfileSetup } from './pages/Onboarding';
import Home from './pages/Home';
import { ToolWrapper, Chat } from './pages/HealthTools';
import { Doctors } from './pages/Doctors';
import { Emergency, SettingsPage } from './pages/RecordsAndEmergency';
import { MapPage } from './pages/MapPage';
import { Records } from './pages/Records';
import { ActivityHub } from './pages/ActivityHub';
import { BodyMeasurements } from './pages/BodyMeasurements';
import { 
  MobilityPage, 
  RespiratoryPage, 
  SleepPage, 
  VitalsPage, 
  MentalWellbeingPage, 
  OtherDataPage 
} from './pages/HealthCategories';
import { UserProfile } from './types';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// --- Error Boundary to prevent White Screen of Death ---
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle size={40} className="text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Something went wrong</h1>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm font-mono bg-slate-100 dark:bg-slate-900 p-2 rounded">
            {this.state.error?.message || "Unknown error"}
          </p>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-transform"
          >
            <RefreshCw size={18} /> Reset App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('medimirror_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('medimirror_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('medimirror_theme', 'light');
    }
  }, [isDarkMode]);

  const handleProfileSave = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('medimirror_user', JSON.stringify(profile));
  };

  useEffect(() => {
    const saved = localStorage.getItem('medimirror_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  const defaultUser: UserProfile = {
    name: "New User",
    email: "user@medimirror.local",
    phone: "",
    age: 0,
    dob: "",
    height: "",
    weight: "",
    bloodGroup: "O+",
    allergies: "",
    conditions: "",
    deviceConnected: false,
    emergencyContact: {
      name: "Emergency Contact",
      phone: "",
      relation: "Family"
    }
  };

  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/splash" replace />} />
          <Route path="/splash" element={<Splash />} />
          
          <Route path="/profile-setup" element={
            <ProfileSetup onSave={handleProfileSave} />
          } />

          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/home" element={
                  <Home 
                    user={user || defaultUser} 
                    isDarkMode={isDarkMode} 
                    toggleTheme={toggleTheme} 
                  />
                } />
                <Route path="/check" element={<ToolWrapper />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/emergency" element={<Emergency user={user || defaultUser} />} />
                <Route path="/settings" element={
                  <SettingsPage 
                    user={user || defaultUser} 
                    onUpdateUser={handleProfileSave} 
                  />
                } />
                <Route path="/records" element={<Records />} /> 
                <Route path="/activity" element={<ActivityHub />} /> 
                <Route path="/body-measurements" element={<BodyMeasurements />} />
                
                <Route path="/mobility" element={<MobilityPage />} />
                <Route path="/respiratory" element={<RespiratoryPage />} />
                <Route path="/sleep" element={<SleepPage />} />
                <Route path="/vitals" element={<VitalsPage />} />
                <Route path="/mental" element={<MentalWellbeingPage />} />
                <Route path="/other" element={<OtherDataPage />} />
              </Routes>
            </Layout>
          } />
          
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
}

export default App;
