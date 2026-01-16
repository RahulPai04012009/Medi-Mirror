
import React, { useState, useEffect } from 'react';
import { 
  Phone, Share2, Shield, Bell, RefreshCcw, ChevronRight, 
  User, Watch, Bluetooth, Smartphone, X, CheckCircle, ArrowLeft, Save,
  Cloud, Brain, ToggleLeft, ToggleRight
} from 'lucide-react';
import { UserProfile } from '../types';

// --- Emergency ---
export const Emergency: React.FC<{ user: UserProfile }> = ({ user }) => {
  return (
    <div className="p-6 bg-red-50 dark:bg-red-950 min-h-screen transition-colors">
      <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-6 flex items-center gap-2">
        <span className="animate-pulse">🚨</span> Emergency Mode
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button className="bg-red-600 text-white p-6 rounded-2xl shadow-red-300 dark:shadow-none shadow-lg flex flex-col items-center gap-2 active:scale-95 transition-transform">
           <Phone size={32} />
           <span className="font-bold text-lg">Call 911</span>
        </button>
        <button className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white p-6 rounded-2xl shadow-sm border border-red-100 dark:border-red-900 flex flex-col items-center gap-2 active:scale-95 transition-transform">
           <Phone size={32} className="text-red-500" />
           <span className="font-bold text-lg">Contact {user.emergencyContact.relation || 'Contact'}</span>
           <span className="text-xs text-slate-400 dark:text-slate-500 truncate w-full">{user.emergencyContact.name}</span>
        </button>
      </div>

      <button className="w-full bg-slate-900 dark:bg-slate-800 text-white py-4 rounded-xl flex items-center justify-center gap-3 mb-8 shadow-lg">
        <Share2 size={20} /> Share Live Location
      </button>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-l-4 border-red-500 shadow-md transition-colors">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider text-sm">Paramedic Info</h3>
        <div className="grid grid-cols-2 gap-y-4 text-sm">
          <div>
            <p className="text-slate-400 dark:text-slate-500">Name</p>
            <p className="font-semibold dark:text-slate-200">{user.name}</p>
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500">Blood Group</p>
            <p className="font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 inline-block px-2 rounded">{user.bloodGroup}</p>
          </div>
          <div className="col-span-2">
            <p className="text-slate-400 dark:text-slate-500">Allergies</p>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{user.allergies || 'None'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-slate-400 dark:text-slate-500">Conditions</p>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{user.conditions || 'None'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Edit Profile Overlay ---
const EditProfileModal: React.FC<{ user: UserProfile, onSave: (u: UserProfile) => void, onClose: () => void }> = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState<UserProfile>({ ...user });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('emergency')) {
      const field = name.replace('emergency', '').toLowerCase();
      setFormData(prev => ({
        ...prev,
        emergencyContact: { ...prev.emergencyContact, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-950 z-[100] overflow-y-auto transition-colors">
      <div className="max-w-md mx-auto min-h-full flex flex-col p-6 space-y-8">
        <div className="flex items-center justify-between sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-4 z-10 transition-colors">
          <button onClick={onClose} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-500 dark:text-slate-400">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Edit Profile</h2>
          <button onClick={handleSubmit} className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
            <Save size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 pb-32">
          {/* General Info */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Identity</h3>
            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 space-y-5 transition-colors">
              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-900 dark:text-white font-bold outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-blue-500 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Birth Date</label>
                  <input name="dob" type="date" value={formData.dob} onChange={handleChange} className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-900 dark:text-white font-bold outline-none ring-1 ring-slate-200 dark:ring-slate-700" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Age</label>
                  <input name="age" type="number" value={formData.age} onChange={handleChange} className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-900 dark:text-white font-bold outline-none ring-1 ring-slate-200 dark:ring-slate-700" />
                </div>
              </div>
            </div>
          </section>

          {/* Vitals */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Biometrics</h3>
            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 space-y-5 transition-colors">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Height (cm)</label>
                  <input name="height" value={formData.height} onChange={handleChange} className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-900 dark:text-white font-bold outline-none ring-1 ring-slate-200 dark:ring-slate-700" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Weight (kg)</label>
                  <input name="weight" value={formData.weight} onChange={handleChange} className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-900 dark:text-white font-bold outline-none ring-1 ring-slate-200 dark:ring-slate-700" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Blood Group</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-900 dark:text-white font-bold outline-none ring-1 ring-slate-200 dark:ring-slate-700">
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Medical Record */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Medical Record</h3>
            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 space-y-5 transition-colors">
              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Allergies</label>
                <textarea name="allergies" value={formData.allergies} onChange={handleChange} rows={2} className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-900 dark:text-white font-bold outline-none ring-1 ring-slate-200 dark:ring-slate-700 resize-none" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Existing Conditions</label>
                <textarea name="conditions" value={formData.conditions} onChange={handleChange} rows={2} className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-900 dark:text-white font-bold outline-none ring-1 ring-slate-200 dark:ring-slate-700 resize-none" />
              </div>
            </div>
          </section>

          {/* Emergency Contact */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Emergency Point</h3>
            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 space-y-5 transition-colors">
              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Contact Name</label>
                <input name="emergencyName" value={formData.emergencyContact.name} onChange={handleChange} className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-900 dark:text-white font-bold outline-none ring-1 ring-slate-200 dark:ring-slate-700" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Relationship</label>
                   <input name="emergencyRelation" value={formData.emergencyContact.relation} onChange={handleChange} className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-900 dark:text-white font-bold outline-none ring-1 ring-slate-200 dark:ring-slate-700" />
                 </div>
                 <div>
                   <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Phone</label>
                   <input name="emergencyPhone" value={formData.emergencyContact.phone} onChange={handleChange} className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl p-4 text-slate-900 dark:text-white font-bold outline-none ring-1 ring-slate-200 dark:ring-slate-700" />
                 </div>
              </div>
            </div>
          </section>
        </form>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-950 dark:via-slate-950 transition-colors">
          <button 
            onClick={handleSubmit} 
            className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Settings ---
export const SettingsPage: React.FC<{ user: UserProfile, onUpdateUser: (u: UserProfile) => void }> = ({ user, onUpdateUser }) => {
  const [showPairing, setShowPairing] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [pairingStep, setPairingStep] = useState(1);
  const isWatchConnected = localStorage.getItem('medimirror_watch_connected') === 'true';

  // New Toggle States
  const [contextAware, setContextAware] = useState(localStorage.getItem('medimirror_context') === 'true');
  const [cloudSync, setCloudSync] = useState(localStorage.getItem('medimirror_sync') === 'true');

  const toggleContext = () => {
     const newVal = !contextAware;
     setContextAware(newVal);
     localStorage.setItem('medimirror_context', String(newVal));
  };

  const toggleSync = () => {
     const newVal = !cloudSync;
     setCloudSync(newVal);
     localStorage.setItem('medimirror_sync', String(newVal));
  };

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
    <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h2>

      {/* Profile & Accounts */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
         <div 
           onClick={() => setShowEditProfile(true)}
           className="flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
         >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                <User size={20} />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-200">Edit Profile</span>
            </div>
            <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
         </div>
         
         {/* Context Awareness Toggle */}
         <div onClick={toggleContext} className="flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                   <Brain size={20} />
                </div>
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-200">Context Aware AI</p>
                  <p className="text-[10px] text-slate-400">Use health history for better diagnosis</p>
                </div>
             </div>
             {contextAware ? <ToggleRight size={28} className="text-purple-600" /> : <ToggleLeft size={28} className="text-slate-300" />}
         </div>

         {/* Cloud Sync Toggle */}
         <div onClick={toggleSync} className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
             <div className="flex items-center gap-4">
                <div className="p-2 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-lg">
                   <Cloud size={20} />
                </div>
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-200">Cloud Sync (Sim)</p>
                  <p className="text-[10px] text-slate-400">{cloudSync ? `Synced: ${new Date().toLocaleTimeString()}` : 'Data is stored locally'}</p>
                </div>
             </div>
             {cloudSync ? <ToggleRight size={28} className="text-teal-600" /> : <ToggleLeft size={28} className="text-slate-300" />}
         </div>
      </div>

      {/* Devices & Wearables */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm transition-colors">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Wearables & Sync</h3>
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${isWatchConnected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
                <Watch size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white text-sm">Apple Watch</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{isWatchConnected ? 'Connected via HealthKit' : 'Not Linked'}</p>
              </div>
           </div>
           <button 
            onClick={isWatchConnected ? () => { localStorage.setItem('medimirror_watch_connected', 'false'); window.location.reload(); } : startPairing}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
              isWatchConnected ? 'text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400' : 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
            }`}
           >
             {isWatchConnected ? 'Disconnect' : 'Connect'}
           </button>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 rounded-2xl text-white shadow-lg">
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
           <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[40px] p-8 flex flex-col items-center text-center animate-slide-up transition-colors">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Watch size={48} className={pairingStep === 2 ? 'animate-bounce' : ''} />
                </div>
                {pairingStep === 2 && (
                  <div className="absolute -top-2 -right-2">
                    <Bluetooth size={24} className="text-blue-500 animate-pulse" />
                  </div>
                )}
              </div>

              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">
                {pairingStep === 1 ? 'Searching Devices' : 
                 pairingStep === 2 ? 'Pairing Watch' : 'Sync Successful'}
              </h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 mb-10 px-4">
                {pairingStep === 1 ? 'Keep your Apple Watch close to your iPhone...' : 
                 pairingStep === 2 ? 'Establishing secure Bluetooth connection...' : 
                 'Medi-Mirror is now connected to your Apple Health data.'}
              </p>

              {pairingStep === 3 ? (
                <button 
                  onClick={completePairing}
                  className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 dark:shadow-none"
                >
                  Continue to Dashboard
                </button>
              ) : (
                <div className="w-12 h-12 border-4 border-blue-100 dark:border-slate-800 border-t-blue-600 rounded-full animate-spin"></div>
              )}
           </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal 
          user={user} 
          onSave={onUpdateUser} 
          onClose={() => setShowEditProfile(false)} 
        />
      )}

      <p className="text-center text-[10px] text-slate-300 dark:text-slate-700 mt-10 uppercase tracking-widest font-bold">Medi-Mirror v1.1.0 • Wearable Ready</p>
    </div>
  );
};
