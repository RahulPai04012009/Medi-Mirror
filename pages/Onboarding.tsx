import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, HeartPulse, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

export const Splash: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/auth');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-teal-400 text-white">
      <div className="animate-pulse mb-6">
        <HeartPulse size={80} />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-2">Medi-Mirror</h1>
      <p className="text-blue-50 font-medium text-lg opacity-90">Your health, smarter.</p>
    </div>
  );
};

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth success
    if (isLogin) {
      navigate('/home');
    } else {
      navigate('/profile-setup');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 bg-slate-50">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-slate-500">
          {isLogin ? 'Sign in to access your health data' : 'Start your journey to better health'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          {!isLogin && (
             <div className="relative">
             <User className="absolute left-3 top-3.5 text-slate-400" size={20} />
             <input type="text" placeholder="Full Name" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" required />
           </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
            <input type="email" placeholder="Email Address" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" required />
          </div>
          {!isLogin && (
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 text-slate-400" size={20} />
              <input type="tel" placeholder="Phone Number" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" required />
            </div>
          )}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
            <input type="password" placeholder="Password" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" required />
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mt-6">
          {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight size={20} />
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-semibold hover:underline">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export const ProfileSetup: React.FC<{ onSave: (p: UserProfile) => void }> = ({ onSave }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: 'Rahul',
    email: 'rahul@example.com',
    bloodGroup: 'O+'
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      onSave(formData as UserProfile);
      navigate('/home');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col">
      <div className="w-full bg-slate-200 h-2 rounded-full mb-8 mt-4">
        <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        {step === 1 ? 'Basic Info' : step === 2 ? 'Health Stats' : 'Emergency Contact'}
      </h2>

      <div className="flex-1 space-y-5">
        {step === 1 && (
          <>
            <div className="flex justify-center mb-6">
               <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 border-4 border-white shadow-md">
                 <User size={40} />
               </div>
            </div>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full p-4 rounded-xl border border-slate-200" />
            <input name="dob" type="date" onChange={handleChange} className="w-full p-4 rounded-xl border border-slate-200 text-slate-500" />
            <input name="age" type="number" placeholder="Age" onChange={handleChange} className="w-full p-4 rounded-xl border border-slate-200" />
          </>
        )}
        
        {step === 2 && (
          <>
             <div className="grid grid-cols-2 gap-4">
              <input name="height" placeholder="Height (cm)" onChange={handleChange} className="w-full p-4 rounded-xl border border-slate-200" />
              <input name="weight" placeholder="Weight (kg)" onChange={handleChange} className="w-full p-4 rounded-xl border border-slate-200" />
             </div>
             <select name="bloodGroup" onChange={handleChange} className="w-full p-4 rounded-xl border border-slate-200 bg-white">
               <option>Select Blood Group</option>
               {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g} value={g}>{g}</option>)}
             </select>
             <input name="allergies" placeholder="Allergies (Optional)" onChange={handleChange} className="w-full p-4 rounded-xl border border-slate-200" />
          </>
        )}

        {step === 3 && (
          <>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-4">
              <div className="flex items-center gap-2 text-red-600 font-semibold mb-2">
                <ShieldCheck size={20} /> Important
              </div>
              <p className="text-red-500 text-sm">This contact will be alerted in case of an emergency.</p>
            </div>
             <input name="emergencyName" placeholder="Contact Name" onChange={handleChange} className="w-full p-4 rounded-xl border border-slate-200" />
             <input name="emergencyPhone" placeholder="Contact Phone" onChange={handleChange} className="w-full p-4 rounded-xl border border-slate-200" />
             <input name="emergencyRelation" placeholder="Relationship (e.g. Spouse)" onChange={handleChange} className="w-full p-4 rounded-xl border border-slate-200" />
          </>
        )}
      </div>

      <button onClick={handleNext} className="w-full bg-slate-900 text-white font-semibold py-4 rounded-xl mt-6 shadow-lg">
        {step === 3 ? 'Save Profile' : 'Next Step'}
      </button>
    </div>
  );
};