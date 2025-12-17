import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Activity, Search, MapPin, Mic, ArrowRight, Phone } from 'lucide-react';
import { UserProfile } from '../types';

interface HomeProps {
  user: UserProfile;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hello, {user.name.split(' ')[0]}!</h1>
          <p className="text-slate-500 text-sm">How are you feeling today?</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
           <img src="https://picsum.photos/100/100" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Emergency Shortcut */}
      <button 
        onClick={() => navigate('/emergency')}
        className="w-full bg-red-50 border border-red-100 p-4 rounded-xl flex items-center justify-between text-red-600 active:scale-95 transition-transform"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
             <AlertCircle size={20} />
          </div>
          <span className="font-semibold">Emergency SOS</span>
        </div>
        <ArrowRight size={18} />
      </button>

      {/* Grid Features */}
      <div className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => navigate('/check?mode=symptom')}
          className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-transform cursor-pointer"
        >
          <Search className="mb-3 text-blue-100" size={24} />
          <h3 className="font-semibold text-lg">Symptom Checker</h3>
          <p className="text-blue-100 text-xs mt-1">AI-powered analysis</p>
        </div>

        <div 
          onClick={() => navigate('/check?mode=wound')}
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:scale-95 transition-transform cursor-pointer"
        >
           <Activity className="mb-3 text-teal-500" size={24} />
           <h3 className="font-semibold text-lg text-slate-800">Wound Scanner</h3>
           <p className="text-slate-400 text-xs mt-1">Instant severity check</p>
        </div>
      </div>

      {/* Map Card */}
      <div className="bg-white p-1 rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative">
        <div className="h-32 bg-slate-100 relative">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
          <div className="absolute top-1/2 left-1/3 p-2 bg-red-500 rounded-full border-4 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2">
            <MapPin size={16} className="text-white" />
          </div>
          <div className="absolute top-1/3 left-2/3 p-2 bg-blue-500 rounded-full border-4 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2">
            <MapPin size={16} className="text-white" />
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-1">
             <h3 className="font-semibold text-slate-800">Nearby Services</h3>
             <span className="text-xs text-blue-600 font-medium">View Map</span>
          </div>
          <p className="text-xs text-slate-500">2 Hospitals & 5 Pharmacies near you</p>
        </div>
      </div>

       {/* Doctors */}
       <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">Your Doctors</h3>
          <button onClick={() => navigate('/doctors')} className="text-blue-600 text-sm font-medium">See all</button>
        </div>
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
             <img src="https://picsum.photos/id/1012/60/60" className="w-12 h-12 rounded-full object-cover" alt="Dr" />
             <div className="flex-1">
               <h4 className="font-semibold text-slate-800">Dr. Sarah Wilson</h4>
               <p className="text-xs text-slate-500">Cardiologist • City Hospital</p>
             </div>
             <button className="bg-blue-50 text-blue-600 p-2 rounded-lg">
               <Phone size={18} />
             </button>
          </div>
        </div>
       </div>

      {/* AI Voice FAB */}
      <button 
        onClick={() => navigate('/chat')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-slate-900 text-white rounded-full shadow-xl flex items-center justify-center animate-bounce-slow active:scale-90 transition-transform z-10"
      >
        <Mic size={24} />
      </button>
    </div>
  );
};

export default Home;