
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { Splash, ProfileSetup } from './pages/Onboarding';
import Home from './pages/Home';
import { ToolWrapper, Chat } from './pages/HealthTools';
import { Doctors } from './pages/Doctors';
import { Emergency, SettingsPage } from './pages/RecordsAndEmergency';
import { MapPage } from './pages/MapPage';
import { Records } from './pages/Records';
import { ActivityHub } from './pages/ActivityHub';
import { BodyMeasurements } from './pages/BodyMeasurements'; // Imported
import { UserProfile } from './types';

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
    if (saved) setUser(JSON.parse(saved));
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
            </Routes>
          </Layout>
        } />
        
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
