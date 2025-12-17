import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { Splash, Auth, ProfileSetup } from './pages/Onboarding';
import Home from './pages/Home';
import { ToolWrapper, Chat } from './pages/HealthTools';
import { Doctors } from './pages/Doctors';
import { Records, Emergency, SettingsPage } from './pages/RecordsAndEmergency';
import { UserProfile } from './types';

function App() {
  // Simple state simulation for user session
  const [user, setUser] = useState<UserProfile | null>(null);

  const handleProfileSave = (profile: UserProfile) => {
    setUser(profile);
  };

  // Mock user for dev if needed, or null to force onboarding
  // In a real app, check localStorage or Auth context
  const mockUser: UserProfile = {
    name: "Rahul Sharma",
    email: "rahul@test.com",
    phone: "555-0123",
    age: 28,
    dob: "1995-05-15",
    height: "175",
    weight: "70",
    bloodGroup: "B+",
    allergies: "Peanuts",
    conditions: "None",
    emergencyContact: {
      name: "Priya Sharma",
      phone: "555-0999",
      relation: "Sister"
    }
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/splash" replace />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/auth" element={<Auth />} />
        
        <Route path="/profile-setup" element={
          <ProfileSetup onSave={handleProfileSave} />
        } />

        {/* Protected Routes Wrapper */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/home" element={<Home user={user || mockUser} />} />
              <Route path="/check" element={<ToolWrapper />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/records" element={<Records />} />
              <Route path="/emergency" element={<Emergency user={user || mockUser} />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Layout>
        } />
        
        {/* Chat Standalone (no bottom nav) */}
        <Route path="/chat" element={<Chat />} />

      </Routes>
    </HashRouter>
  );
}

export default App;