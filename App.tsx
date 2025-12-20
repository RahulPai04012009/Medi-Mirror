
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { Splash, ProfileSetup } from './pages/Onboarding';
import Home from './pages/Home';
import { ToolWrapper, Chat } from './pages/HealthTools';
import { Doctors } from './pages/Doctors';
import { Emergency, SettingsPage } from './pages/RecordsAndEmergency';
import { MapPage } from './pages/MapPage';
import { UserProfile } from './types';

function App() {
  const [user, setUser] = useState<UserProfile | null>(null);

  const handleProfileSave = (profile: UserProfile) => {
    setUser(profile);
    // Persist to local storage for "no-login" persistence
    localStorage.setItem('medimirror_user', JSON.stringify(profile));
  };

  // Initial load check for persisted profile
  React.useEffect(() => {
    const saved = localStorage.getItem('medimirror_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Add missing required property 'deviceConnected'
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

        {/* Protected Routes Wrapper */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/home" element={<Home user={user || defaultUser} />} />
              <Route path="/check" element={<ToolWrapper />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/emergency" element={<Emergency user={user || defaultUser} />} />
              <Route path="/settings" element={<SettingsPage />} />
              {/* Redirect old records path to doctors history */}
              <Route path="/records" element={<Navigate to="/doctors" replace />} />
            </Routes>
          </Layout>
        } />
        
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
