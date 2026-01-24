
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, ShieldCheck, ArrowRight, ArrowLeft, Stethoscope, 
  FileText, Upload, AlertTriangle, CheckCircle, 
  Lock, Loader2
} from 'lucide-react';
import { UserProfile } from '../types';
import { validateDoctorCredentials } from '../services/geminiService';

// Functional SVG reconstruction of the provided logo
const AppLogo: React.FC<{ size?: number; className?: string }> = ({ size = 120, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="100" cy="100" r="80" fill="#FBBF24" fillOpacity="0.2" />
    <circle cx="130" cy="80" r="60" fill="#F87171" fillOpacity="0.2" />
    <circle cx="70" cy="120" r="65" fill="#2DD4BF" fillOpacity="0.2" />
    <circle cx="120" cy="140" r="55" fill="#FB923C" fillOpacity="0.2" />
    <circle cx="100" cy="100" r="70" fill="#245A8A" />
    <path d="M50 100C50 72.3858 72.3858 50 100 50C127.614 50 150 72.3858 150 100C150 127.614 127.614 150 100 150C72.3858 150 50 127.614 50 100Z" fill="#F7C497" />
    <path d="M100 70C110 70 140 90 145 120" stroke="#245A8A" strokeWidth="12" strokeLinecap="round" />
    <path d="M70 120C80 145 120 145 130 130" stroke="#245A8A" strokeWidth="10" strokeLinecap="round" />
    <path d="M65 110C75 105 95 105 105 125" stroke="#245A8A" strokeWidth="8" strokeLinecap="round" />
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 overflow-hidden relative transition-colors duration-300">
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-yellow-200/30 dark:bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-red-200/30 dark:bg-red-500/10 rounded-full blur-3xl animate-pulse delay-75"></div>

      <div className="relative animate-bounce-slow flex flex-col items-center">
        <div className="logo-shadow p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-[60px] border border-white/20 dark:border-white/5">
          <AppLogo size={160} />
        </div>
      </div>
      
      <div className="mt-12 text-center space-y-2 animate-fade-in">
        <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter transition-colors">Medi-Mirror</h1>
        <p className="text-slate-400 dark:text-slate-500 font-bold text-sm tracking-[0.3em] uppercase opacity-70">Smarter Care • Safer You</p>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-4">
        <div className="flex gap-2">
           <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
           <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-100"></div>
           <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-200"></div>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest">Version 2.0.1</p>
      </div>
    </div>
  );
};

export const ProfileSetup: React.FC<{ onSave: (p: UserProfile) => void }> = ({ onSave }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'patient' | 'doctor' | null>(null);
  const [step, setStep] = useState(1);
  const [validating, setValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadedLicense, setUploadedLicense] = useState<boolean>(false);

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
    phone: '',
    age: 0,
    dob: '',
    height: '',
    weight: '',
    bloodGroup: 'O+',
    allergies: '',
    conditions: '',
    deviceConnected: false,
    role: 'patient',
    doctorProfile: {
      specialty: '',
      qualifications: '',
      licenseNumber: '',
      verificationStatus: 'pending'
    },
    emergencyContact: { name: '', phone: '', relation: '' }
  });

  const handleRoleSelect = (selectedRole: 'patient' | 'doctor') => {
    setRole(selectedRole);
    setFormData(prev => ({ ...prev, role: selectedRole }));
    setStep(1); // Start form flow
  };

  const handleNext = async () => {
    // DOCTOR FLOW SPECIFIC VALIDATION
    if (role === 'doctor') {
      if (step === 2) {
        // AI GATEKEEPER CHECK
        setValidating(true);
        setValidationError(null);
        try {
          const check = await validateDoctorCredentials(
            formData.doctorProfile?.specialty || "", 
            formData.doctorProfile?.qualifications || ""
          );
          
          if (!check.valid) {
            setValidationError(check.reason || "Invalid medical credentials detected.");
            setValidating(false);
            return; // BLOCK PROGRESS
          }
        } catch (e) {
          console.error(e);
        }
        setValidating(false);
      }
      
      if (step === 3 && !uploadedLicense) {
        setValidationError("Please upload your license document to proceed.");
        return;
      }
    }

    if (step < 3) {
      setStep(step + 1);
      setValidationError(null);
    } else {
      onSave(formData as UserProfile);
      
      if (role === 'doctor') {
        // Doctors don't go to home immediately, they see a pending screen (simulated here by a distinct view or just routing to a pending page)
        // For this demo, we'll route to home but the UI would ideally block features. 
        // We will just show the pending alert in the profile later.
        navigate('/home'); 
      } else {
        navigate('/home');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('emergency')) {
      const field = name.replace('emergency', '').toLowerCase();
      setFormData(prev => ({
        ...prev,
        emergencyContact: { ...prev.emergencyContact!, [field]: value }
      }));
    } else if (['specialty', 'qualifications', 'licenseNumber'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        doctorProfile: { ...prev.doctorProfile!, [name]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // --- ROLE SELECTION SCREEN ---
  if (!role) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 p-8 flex flex-col justify-center transition-colors duration-300">
        <div className="text-center mb-10 space-y-2">
          <AppLogo size={80} className="mx-auto mb-4" />
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Welcome</h2>
          <p className="text-slate-500 font-medium">How will you use Medi-Mirror?</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => handleRoleSelect('patient')}
            className="w-full bg-slate-50 dark:bg-slate-900 p-6 rounded-[32px] border-2 border-transparent hover:border-blue-500 transition-all group flex items-center gap-4 text-left"
          >
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <User size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">I am a Patient</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Track health, check symptoms, find care.</p>
            </div>
          </button>

          <button 
            onClick={() => handleRoleSelect('doctor')}
            className="w-full bg-slate-50 dark:bg-slate-900 p-6 rounded-[32px] border-2 border-transparent hover:border-teal-500 transition-all group flex items-center gap-4 text-left"
          >
            <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
              <Stethoscope size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">I am a Doctor</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Manage profile, verify credentials.</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // --- DOCTOR ONBOARDING FLOW ---
  if (role === 'doctor') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 p-8 flex flex-col transition-colors duration-300">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => setRole(null)} className="text-slate-400 hover:text-slate-600"><ArrowLeft size={24}/></button>
          <div className="flex gap-1.5">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-8 bg-teal-600' : 'w-2 bg-slate-200 dark:bg-slate-800'}`}></div>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {step === 1 ? 'Provider Identity' : step === 2 ? 'Professional Profile' : 'License Verification'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Doctor Onboarding • Step {step} of 3</p>
          </div>

          <div className="space-y-5">
            {step === 1 && (
              <div className="animate-fade-in space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Legal Name (as on License)</label>
                  <input name="name" value={formData.name} onChange={handleChange} placeholder="Dr. Jane Doe" className="w-full px-5 py-4 rounded-[20px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 transition-all font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Professional Email</label>
                  <input name="email" value={formData.email} onChange={handleChange} placeholder="dr.jane@clinic.com" className="w-full px-5 py-4 rounded-[20px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 transition-all" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in space-y-5">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex gap-3 border border-blue-100 dark:border-blue-900/50">
                   <ShieldCheck className="text-blue-600 shrink-0" size={20} />
                   <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                     Our AI will analyze your credentials. Please ensure they are accurate to avoid account blocking.
                   </p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Specialty</label>
                  <input name="specialty" value={formData.doctorProfile?.specialty} onChange={handleChange} placeholder="e.g. Cardiology" className="w-full px-5 py-4 rounded-[20px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Qualifications</label>
                  <input name="qualifications" value={formData.doctorProfile?.qualifications} onChange={handleChange} placeholder="e.g. MD, PhD, FACS" className="w-full px-5 py-4 rounded-[20px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20" />
                </div>
                {validationError && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 rounded-2xl flex gap-3 text-red-600 dark:text-red-400 animate-shake">
                    <AlertTriangle size={20} />
                    <span className="text-xs font-bold">{validationError}</span>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Medical License Number</label>
                  <input name="licenseNumber" value={formData.doctorProfile?.licenseNumber} onChange={handleChange} placeholder="License ID" className="w-full px-5 py-4 rounded-[20px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20" />
                </div>
                
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer" onClick={() => { setUploadedLicense(true); setValidationError(null); }}>
                   {uploadedLicense ? (
                     <div className="space-y-2">
                       <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                         <CheckCircle size={32} />
                       </div>
                       <p className="text-sm font-bold text-slate-900 dark:text-white">License Uploaded</p>
                       <p className="text-xs text-slate-400">verification_doc.pdf</p>
                     </div>
                   ) : (
                     <div className="space-y-2">
                       <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                         <Upload size={24} />
                       </div>
                       <p className="text-sm font-bold text-slate-900 dark:text-white">Upload Medical License</p>
                       <p className="text-xs text-slate-400">PDF or JPG (Max 5MB)</p>
                     </div>
                   )}
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-2xl flex gap-3">
                   <Lock className="text-orange-500 shrink-0" size={20} />
                   <div className="space-y-1">
                     <p className="text-xs font-bold text-orange-800 dark:text-orange-300">Pending Verification</p>
                     <p className="text-[10px] text-orange-700/70 dark:text-orange-400/70">
                       Your profile will NOT be public until admin approval (24-72h).
                     </p>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={handleNext} 
          disabled={validating}
          className="w-full bg-slate-900 dark:bg-teal-600 text-white font-bold py-5 rounded-[24px] shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {validating ? (
            <>Validating <Loader2 className="animate-spin" size={20} /></>
          ) : (
            <>
              {step === 3 ? 'Submit for Review' : 'Next Step'} <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    );
  }

  // --- PATIENT ONBOARDING FLOW (Existing Logic) ---
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-8 flex flex-col transition-colors duration-300">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => setRole(null)} className="text-slate-400 hover:text-slate-600"><ArrowLeft size={24}/></button>
        <div className="flex gap-1.5">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-8 bg-slate-900 dark:bg-white' : 'w-2 bg-slate-200 dark:bg-slate-800'}`}></div>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
            {step === 1 ? 'Hello! Who are you?' : step === 2 ? 'Your Health Vitals' : 'Emergency Point'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Patient Setup • Step {step} of 3</p>
        </div>

        <div className="space-y-5">
          {step === 1 && (
            <div className="animate-fade-in space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="w-full px-5 py-4 rounded-[20px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Birth Date</label>
                  <input name="dob" type="date" value={formData.dob} onChange={handleChange} className="w-full px-5 py-4 rounded-[20px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-300 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Age</label>
                  <input name="age" type="number" placeholder="25" value={formData.age || ''} onChange={handleChange} className="w-full px-5 py-4 rounded-[20px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white outline-none transition-all" />
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="animate-fade-in space-y-5">
               <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Height (cm)</label>
                  <input name="height" placeholder="175" value={formData.height} onChange={handleChange} className="w-full px-5 py-4 rounded-[20px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Weight (kg)</label>
                  <input name="weight" placeholder="70" value={formData.weight} onChange={handleChange} className="w-full px-5 py-4 rounded-[20px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white outline-none" />
                </div>
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Blood Group</label>
                 <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-5 py-4 rounded-[20px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white outline-none">
                   {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g} value={g}>{g}</option>)}
                 </select>
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Allergies</label>
                 <input name="allergies" placeholder="e.g., Peanuts, Penicillin" value={formData.allergies} onChange={handleChange} className="w-full px-5 py-4 rounded-[20px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white outline-none" />
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in space-y-5">
              <div className="p-5 bg-teal-50 dark:bg-teal-900/20 rounded-3xl border border-teal-100 dark:border-teal-900/50 flex items-start gap-3">
                <ShieldCheck className="text-teal-600 dark:text-teal-400 shrink-0 mt-1" size={20} />
                <p className="text-xs text-teal-800 dark:text-teal-300 font-medium leading-relaxed">
                  Your safety is our priority. This contact will only be used in verified emergency situations.
                </p>
              </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Contact Name</label>
                 <input name="emergencyName" placeholder="Jane Doe" value={formData.emergencyContact?.name} onChange={handleChange} className="w-full px-5 py-4 rounded-[20px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white outline-none" />
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Relationship</label>
                 <input name="emergencyRelation" placeholder="e.g., Spouse, Parent" value={formData.emergencyContact?.relation} onChange={handleChange} className="w-full px-5 py-4 rounded-[20px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white outline-none" />
               </div>
            </div>
          )}
        </div>
      </div>

      <button onClick={handleNext} className="w-full bg-slate-900 dark:bg-blue-600 text-white font-bold py-5 rounded-[24px] shadow-2xl shadow-blue-900/10 dark:shadow-blue-600/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all group">
        {step === 3 ? 'Finish Setup' : 'Next Step'} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
    