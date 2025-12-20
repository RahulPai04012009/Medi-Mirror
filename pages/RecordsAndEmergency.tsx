import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Phone, Share2, Shield, Bell, RefreshCcw, ChevronRight, 
  User, Watch, Bluetooth, Smartphone, X, CheckCircle 
} from 'lucide-react';
import { UserProfile } from '../types';

// --- Emergency ---
export const Emergency: React.FC<{ user: UserProfile }> = ({ user }) => {
  return (
    <div className="p-6 bg-red-50 min-h-screen">
      <h2 className="text-2xl font-bold text-red-700 mb-6 flex items-center gap-2">
        <span className="animate-pulse">🚨</span> Emergency Mode
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button className="bg-red-600 text-white p-6 rounded-2xl shadow-red-300 shadow-lg flex flex-col items-center gap-2 active:scale-95 transition-transform">
           <Phone size={32} />
           <span className="font-bold text-lg">Call 911</span>
        </button>
        <button className="bg-white text-slate-800 p-6 rounded-2xl shadow-sm border border-red-100 flex flex-col items-center gap-2 active:scale-95 transition-transform">
           <Phone size={32} className="text-red-500" />
           <span className="font-bold text-lg">Contact {user.emergencyContact.relation || 'Contact'}</span>
           <span className="text-xs text-slate-400 truncate w-full">{user.emergencyContact.name}</span>
        </button>
      </div>

      <button className="w-full bg-slate-900 text-white py-4 rounded-xl flex items-center justify-center gap-3 mb-8 shadow-lg">
        <Share2 size={20} /> Share Live Location
      </button>

      <div className="bg-white p-6 rounded-2xl border-l-4 border-red-500 shadow-md">
        <h3 className="font-bold text-slate-800 mb-4 uppercase tracking-wider text-sm">Paramedic Info</h3>
        <div className="grid grid-cols-2 gap-y-4 text-sm">
          <div>
            <p className="text-slate-400">Name</p>
            <p className="font-semibold">{user.name}</p>
          </div>
          <div>
            <p className="text-slate-400">Blood Group</p>
            <p className="font-semibold text-red-600 bg-red-50 inline-block px-2 rounded">{user.bloodGroup}</p>
          </div>
          <div className="col-span-2">
            <p className="text-slate-400">Allergies</p>
            <p className="font-semibold text-slate-800">{user.allergies || 'None'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-slate-400">Conditions</p>
            <p className="font-semibold text-slate-800">{user.conditions || 'None'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Settings ---
export const SettingsPage: React.FC = () => {
  const [showPairing, setShowPairing] = useState(false);
  const [pairingStep, setPairingStep] = useState(1);
  const isWatchConnected = localStorage.getItem('medimirror_watch_connected') === 'true';

  const handleReset = () => {
    if (window.confirm("This will clear all your data. Are you sure?")) {
      localStorage.clear();
      window.location.href = '/'; 
    }
  };

  const startPairing = () => {
    setShowPairing(true);
    setPairingStep(1);
    setTimeout(() => setPairingStep(2), 2000);
    setTimeout(() => setPairingStep(3), 4500);
  };

  const completePairing = () => {
    localStorage.setItem('medimirror_watch_connected', 'true');
    setShowPairing(false);
    window.location.reload();
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <h2 className="text-2xl font-bold text-slate-800">Settings</h2>

      {/* Profile & Accounts */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
         {[
           { icon: User, label: 'Edit Profile' },
           { icon: Shield, label: 'Privacy & Security' },
           { icon: Bell, label: 'Notifications' },
         ].map((item, i) => (
           <div key={i} className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <item.icon size={20} />
                </div>
                <span className="font-medium text-slate-700">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
           </div>
         ))}
      </div>

      {/* Devices & Wearables */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Wearables & Sync</h3>
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${isWatchConnected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                <Watch size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Apple Watch</p>
                <p className="text-xs text-slate-400">{isWatchConnected ? 'Connected via HealthKit' : 'Not Linked'}</p>
              </div>
           </div>
           <button 
            onClick={isWatchConnected ? () => { localStorage.setItem('medimirror_watch_connected', 'false'); window.location.reload(); } : startPairing}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
              isWatchConnected ? 'text-red-500 bg-red-50' : 'text-blue-600 bg-blue-50'
            }`}
           >
             {isWatchConnected ? 'Disconnect' : 'Connect'}
           </button>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white shadow-lg">
        <h4 className="font-bold mb-1 text-sm flex items-center gap-2">
           Premium Health Reports <CheckCircle size={14} className="text-blue-200" />
        </h4>
        <p className="text-xs text-blue-100 mb-4 leading-relaxed opacity-90">Get AI-generated summaries of your wearable data to share with your cardiologist.</p>
        <button className="text-xs bg-white text-blue-600 px-4 py-2.5 rounded-xl font-black shadow-md">Get Early Access</button>
      </div>

      <button 
        onClick={handleReset}
        className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-red-500 font-medium py-4 transition-colors"
      >
        <RefreshCcw size={18} /> Reset All Data
      </button>

      {/* Pairing Simulation Modal */}
      {showPairing && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[200] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-sm rounded-[40px] p-8 flex flex-col items-center text-center animate-slide-up">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <Watch size={48} className={pairingStep === 2 ? 'animate-bounce' : ''} />
                </div>
                {pairingStep === 2 && (
                  <div className="absolute -top-2 -right-2">
                    <Bluetooth size={24} className="text-blue-500 animate-pulse" />
                  </div>
                )}
              </div>

              <h3 className="text-xl font-black text-slate-800 mb-2">
                {pairingStep === 1 ? 'Searching Devices' : 
                 pairingStep === 2 ? 'Pairing Watch' : 'Sync Successful'}
              </h3>
              <p className="text-sm text-slate-400 mb-10 px-4">
                {pairingStep === 1 ? 'Keep your Apple Watch close to your iPhone...' : 
                 pairingStep === 2 ? 'Establishing secure Bluetooth connection...' : 
                 'Medi-Mirror is now connected to your Apple Health data.'}
              </p>

              {pairingStep === 3 ? (
                <button 
                  onClick={completePairing}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-200"
                >
                  Continue to Dashboard
                </button>
              ) : (
                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              )}
           </div>
        </div>
      )}

      <p className="text-center text-[10px] text-slate-300 mt-10 uppercase tracking-widest font-bold">Medi-Mirror v1.1.0 • Wearable Ready</p>
    </div>
  );
};
