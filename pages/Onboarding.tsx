import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

// Functional SVG reconstruction of the provided logo
const AppLogo: React.FC<{ size?: number; className?: string }> = ({ size = 120, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Colorful blobs backdrop */}
    <circle cx="100" cy="100" r="80" fill="#FBBF24" fillOpacity="0.2" />
    <circle cx="130" cy="80" r="60" fill="#F87171" fillOpacity="0.2" />
    <circle cx="70" cy="120" r="65" fill="#2DD4BF" fillOpacity="0.2" />
    <circle cx="120" cy="140" r="55" fill="#FB923C" fillOpacity="0.2" />
    
    {/* Main Blue Circle Container */}
    <circle cx="100" cy="100" r="70" fill="#245A8A" />
    
    {/* Hands area cutout (simplified representation) */}
    <path d="M50 100C50 72.3858 72.3858 50 100 50C127.614 50 150 72.3858 150 100C150 127.614 127.614 150 100 150C72.3858 150 50 127.614 50 100Z" fill="#F7C497" />
    
    {/* Handshake Details (stylized silhouettes) */}
    <path d="M100 70C110 70 140 90 145 120" stroke="#245A8A" strokeWidth="12" strokeLinecap="round" />
    <path d="M70 120C80 145 120 145 130 130" stroke="#245A8A" strokeWidth="10" strokeLinecap="round" />
    <path d="M65 110C75 105 95 105 105 125" stroke="#245A8A" strokeWidth="8" strokeLinecap="round" />
    
    {/* Crown over the handshake */}
    <path d="M90 95L93 103L100 97L107 103L110 95L110 108H90V95Z" fill="black" stroke="black" strokeWidth="1" />
  </svg>
);

export const Splash: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/profile-setup');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden relative">
      {/* Background blobs for depth */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-yellow-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-red-200/30 rounded-full blur-3xl animate-pulse delay-75"></div>

      <div className="relative animate-bounce-slow flex flex-col items-center">
        <div className="logo-shadow p-8 bg-white/50 backdrop-blur-md rounded-[60px] border border-white/20">
          <AppLogo size={160} />
        </div>
      </div>
      
      <div className="mt-12 text-center space-y-2 animate-fade-in">
        <h1 className="text-4xl font-black text-slate-800 tracking-tighter">Medi-Mirror</h1>
        <p className="text-slate-400 font-bold text-sm tracking-[0.3em] uppercase opacity-70">Smarter Care • Safer You</p>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-4">
        <div className="flex gap-2">
           <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
           <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-100"></div>
           <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-200"></div>
        </div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Version 2.0.1</p>
      </div>
    </div>
  );
};

export const ProfileSetup: React.FC<{ onSave: (p: UserProfile) => void }> = ({ onSave }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    email: 'user@medimirror.local',
    phone: '',
    age: 0,
    dob: '',
    height: '',
    weight: '',
    bloodGroup: 'O+',
    allergies: '',
    conditions: '',
    deviceConnected: false,
    emergencyContact: { name: '', phone: '', relation: '' }
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      onSave(formData as UserProfile);
      navigate('/home');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('emergency')) {
      const field = name.replace('emergency', '').toLowerCase();
      setFormData({
        ...formData,
        emergencyContact: { ...formData.emergencyContact!, [field]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="min-h-screen bg-white p-8 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <AppLogo size={40} />
        <div className="flex gap-1.5">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-8 bg-slate-900' : 'w-2 bg-slate-200'}`}></div>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {step === 1 ? 'Hello! Who are you?' : step === 2 ? 'Your Health Vitals' : 'Emergency Point'}
          </h2>
          <p className="text-slate-500 text-sm font-medium">Step {step} of 3</p>
        </div>

        <div className="space-y-5">
          {step === 1 && (
            <div className="animate-fade-in space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="w-full px-5 py-4 rounded-[20px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Birth Date</label>
                  <input name="dob" type="date" value={formData.dob} onChange={handleChange} className="w-full px-5 py-4 rounded-[20px] bg-slate-50 border border-slate-100 outline-none transition-all text-slate-500" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Age</label>
                  <input name="age" type="number" placeholder="25" value={formData.age || ''} onChange={handleChange} className="w-full px-5 py-4 rounded-[20px] bg-slate-50 border border-slate-100 outline-none transition-all" />
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="animate-fade-in space-y-5">
               <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Height (cm)</label>
                  <input name="height" placeholder="175" value={formData.height} onChange={handleChange} className="w-full px-5 py-4 rounded-[20px] bg-slate-50 border border-slate-100 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Weight (kg)</label>
                  <input name="weight" placeholder="70" value={formData.weight} onChange={handleChange} className="w-full px-5 py-4 rounded-[20px] bg-slate-50 border border-slate-100 outline-none" />
                </div>
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Blood Group</label>
                 <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-5 py-4 rounded-[20px] bg-slate-50 border border-slate-100 outline-none">
                   {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g} value={g}>{g}</option>)}
                 </select>
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Allergies</label>
                 <input name="allergies" placeholder="e.g., Peanuts, Penicillin" value={formData.allergies} onChange={handleChange} className="w-full px-5 py-4 rounded-[20px] bg-slate-50 border border-slate-100 outline-none" />
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in space-y-5">
              <div className="p-5 bg-teal-50 rounded-3xl border border-teal-100 flex items-start gap-3">
                <ShieldCheck className="text-teal-600 shrink-0 mt-1" size={20} />
                <p className="text-xs text-teal-800 font-medium leading-relaxed">
                  Your safety is our priority. This contact will only be used in verified emergency situations.
                </p>
              </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Contact Name</label>
                 <input name="emergencyName" placeholder="Jane Doe" value={formData.emergencyContact?.name} onChange={handleChange} className="w-full px-5 py-4 rounded-[20px] bg-slate-50 border border-slate-100 outline-none" />
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Relationship</label>
                 <input name="emergencyRelation" placeholder="e.g., Spouse, Parent" value={formData.emergencyContact?.relation} onChange={handleChange} className="w-full px-5 py-4 rounded-[20px] bg-slate-50 border border-slate-100 outline-none" />
               </div>
            </div>
          )}
        </div>
      </div>

      <button onClick={handleNext} className="w-full bg-slate-900 text-white font-bold py-5 rounded-[24px] shadow-2xl shadow-blue-900/10 flex items-center justify-center gap-3 active:scale-[0.98] transition-all group">
        {step === 3 ? 'Finish Setup' : 'Next Step'} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};