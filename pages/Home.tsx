
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, Search, Mic, ArrowRight, Loader2, 
  Droplets, Footprints, Heart, CheckCircle2, 
  Sparkles, RefreshCw, X, Clock, Play, Trophy, Quote,
  Music, Wind, Volume2, CloudRain, Moon, Trees, Sun, Plus, 
  GlassWater, User as UserIcon, Flame, Bell
} from 'lucide-react';
import { UserProfile } from '../types';

// --- Assets & Icons ---

const AppLogo: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="100" cy="100" r="70" fill="#245A8A" />
    <path d="M50 100C50 72.3858 72.3858 50 100 50C127.614 50 150 72.3858 150 100C150 127.614 127.614 150 100 150C72.3858 150 50 127.614 50 100Z" fill="#F7C497" />
    <path d="M100 70C110 70 140 90 145 120" stroke="#245A8A" strokeWidth="12" strokeLinecap="round" />
    <path d="M70 120C80 145 120 145 130 130" stroke="#245A8A" strokeWidth="10" strokeLinecap="round" />
    <path d="M65 110C75 105 95 105 105 125" stroke="#245A8A" strokeWidth="8" strokeLinecap="round" />
    <path d="M90 95L93 103L100 97L107 103L110 95L110 108H90V95Z" fill="black" stroke="black" strokeWidth="1" />
  </svg>
);

// --- New Metric Components ---

const StepsCard = ({ steps, goal }: { steps: number, goal: number }) => {
  const percentage = Math.min((steps / goal) * 100, 100);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden flex flex-col justify-between h-48 group active:scale-[0.98] transition-all cursor-pointer">
       <div className="flex justify-between items-start">
         <div className="p-2.5 bg-orange-50 dark:bg-orange-900/20 rounded-full text-orange-500">
            <Flame size={20} fill="currentColor" />
         </div>
         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Activity</span>
       </div>
       
       <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none text-orange-500">
          <Flame size={120} />
       </div>

       <div className="flex flex-col items-center justify-center relative z-10 mt-2">
          {/* SVG Ring */}
          <div className="relative w-24 h-24">
             {/* Track */}
             <svg className="w-full h-full transform -rotate-90">
               <circle
                 cx="48" cy="48" r={radius}
                 stroke="currentColor"
                 strokeWidth="8"
                 fill="transparent"
                 className="text-slate-100 dark:text-slate-800"
               />
               {/* Progress */}
               <circle
                 cx="48" cy="48" r={radius}
                 stroke="url(#orangeGradient)"
                 strokeWidth="8"
                 fill="transparent"
                 strokeDasharray={circumference}
                 strokeDashoffset={strokeDashoffset}
                 strokeLinecap="round"
                 className="transition-all duration-1000 ease-out"
               />
               <defs>
                 <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                   <stop offset="0%" stopColor="#f97316" />
                   <stop offset="100%" stopColor="#fbbf24" />
                 </linearGradient>
               </defs>
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-900 dark:text-white">{steps.toLocaleString()}</span>
                <span className="text-[9px] font-bold text-slate-400">STEPS</span>
             </div>
          </div>
       </div>
       
       <div className="text-center">
         <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">Goal: {goal.toLocaleString()}</p>
       </div>
    </div>
  );
};

const WaterCard = ({ intake, goal, onAdd }: { intake: number, goal: number, onAdd: () => void }) => {
  const percentage = Math.min((intake / goal) * 100, 100);
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-1 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden h-48 group transition-all">
       <div className="w-full h-full relative rounded-[28px] overflow-hidden bg-blue-50 dark:bg-blue-950/30">
          {/* Liquid Fill */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-cyan-400 transition-all duration-700 ease-in-out"
            style={{ height: `${percentage}%` }}
          >
             <div className="w-full h-2 bg-white/30 absolute top-0 animate-pulse"></div>
             {/* Bubbles */}
             <div className="absolute bottom-2 left-1/4 w-1 h-1 bg-white/40 rounded-full animate-bounce delay-75"></div>
             <div className="absolute bottom-4 right-1/3 w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-150"></div>
          </div>

          <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
             <div className="flex justify-between items-start">
                <div className="p-2 bg-white/40 dark:bg-white/10 backdrop-blur-md rounded-full text-blue-600 dark:text-blue-300 shadow-sm">
                   <Droplets size={18} fill="currentColor" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mix-blend-multiply dark:mix-blend-screen">Hydration</span>
             </div>

             <div className="text-center mb-1">
                <div className="flex items-baseline justify-center gap-0.5">
                   <span className="text-2xl font-black text-slate-900 dark:text-white drop-shadow-sm">{intake}</span>
                   <span className="text-xs font-bold text-slate-500 dark:text-slate-300">ml</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${percentage}%`}}></div>
                </div>
             </div>

             <button 
               onClick={onAdd}
               className="w-full py-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl text-blue-600 dark:text-blue-400 font-black text-xs shadow-sm flex items-center justify-center gap-1 active:scale-95 transition-all hover:bg-white dark:hover:bg-slate-800"
             >
               <Plus size={14} /> Add 250ml
             </button>
          </div>
       </div>
    </div>
  );
};

const HeartRateCard = () => {
   const [bpm, setBpm] = useState(72);
   
   // Simulate fluctuating heart rate
   useEffect(() => {
     const interval = setInterval(() => {
       setBpm(prev => {
         const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
         return Math.max(60, Math.min(100, prev + change));
       });
     }, 2000);
     return () => clearInterval(interval);
   }, []);

   return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden h-48 group hover:shadow-lg transition-all cursor-pointer">
       <div className="flex justify-between items-start relative z-10">
         <div className="p-2.5 bg-red-50 dark:bg-red-900/20 rounded-full text-red-500">
            <Activity size={20} />
         </div>
         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Vitals</span>
       </div>

       {/* ECG Animation Background Container */}
       <div className="absolute top-1/2 left-0 w-[200%] -translate-y-1/2 h-20 opacity-20 dark:opacity-30 pointer-events-none flex">
           {/* We use two identical SVGs and translate them to create infinite scroll effect */}
           <div className="w-1/2 h-full animate-ecg-scroll flex-shrink-0">
               <svg viewBox="0 0 500 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <path 
                    d="M0,50 L50,50 L60,20 L70,80 L80,50 L150,50 L160,20 L170,80 L180,50 L250,50 L260,20 L270,80 L280,50 L350,50 L360,20 L370,80 L380,50 L500,50"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
               </svg>
           </div>
           <div className="w-1/2 h-full animate-ecg-scroll flex-shrink-0">
               <svg viewBox="0 0 500 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <path 
                    d="M0,50 L50,50 L60,20 L70,80 L80,50 L150,50 L160,20 L170,80 L180,50 L250,50 L260,20 L270,80 L280,50 L350,50 L360,20 L370,80 L380,50 L500,50"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
               </svg>
           </div>
       </div>
       
       <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-4">
          <div className="flex items-baseline gap-1">
             <span className="text-4xl font-black text-slate-900 dark:text-white animate-pulse-fast transition-all duration-300">{bpm}</span>
             <span className="text-sm font-bold text-red-500">BPM</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 bg-white/80 dark:bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-slate-100 dark:border-slate-800">
             Resting Rate
          </span>
       </div>

       {/* CSS for ECG Animation */}
       <style>{`
         @keyframes ecg-scroll {
           0% { transform: translateX(0); }
           100% { transform: translateX(-100%); }
         }
         .animate-ecg-scroll {
           animation: ecg-scroll 4s linear infinite;
         }
         .animate-pulse-fast {
           animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
         }
       `}</style>
    </div>
   );
};

// --- Existing Components (Preserved & Fixed) ---

const AppleBreathingFlower = ({ state, duration }: { state: 'inhale' | 'hold' | 'exhale', duration: number }) => {
  const petals = [0, 60, 120, 180, 240, 300];
  const isExpanded = state === 'inhale' || state === 'hold';
  const scale = isExpanded ? 1.5 : 0.5;
  const translate = isExpanded ? 50 : 0;
  const rotation = isExpanded ? 90 : 0;

  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      <div 
         className="absolute inset-0 bg-teal-400/10 rounded-full blur-3xl transition-all ease-in-out"
         style={{ 
           transform: isExpanded ? 'scale(1.2)' : 'scale(0.4)', 
           opacity: isExpanded ? 0.5 : 0,
           transitionDuration: `${duration}s` 
         }} 
      />
      <div 
        className="relative flex items-center justify-center w-full h-full transition-transform ease-in-out"
        style={{ transform: `rotate(${rotation}deg)`, transitionDuration: `${duration}s` }}
      >
        {petals.map((deg, i) => (
          <div
            key={`l1-${i}`}
            className="absolute rounded-full mix-blend-screen bg-teal-500/60 blur-[1px] shadow-[0_0_20px_rgba(20,184,166,0.4)]"
            style={{
              width: '100px', height: '100px',
              transform: `rotate(${deg}deg) translate(${translate}px) scale(${scale})`,
              transition: `transform ${duration}s ease-in-out`
            }}
          />
        ))}
        {petals.map((deg, i) => (
          <div
            key={`l2-${i}`}
            className="absolute rounded-full mix-blend-screen bg-blue-500/50 blur-[1px]"
            style={{
              width: '90px', height: '90px',
              transform: `rotate(${deg + 30}deg) translate(${translate * 0.8}px) scale(${scale * 0.8})`,
              transition: `transform ${duration}s ease-in-out`
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div className={`transition-opacity duration-300 flex flex-col items-center ${state === 'hold' ? 'opacity-100' : 'opacity-90'}`}>
           <span className="text-white font-black text-2xl tracking-[0.2em] drop-shadow-xl shadow-black">
              {state === 'inhale' ? 'INHALE' : state === 'hold' ? 'HOLD' : 'EXHALE'}
           </span>
        </div>
      </div>
    </div>
  );
};

// --- Home Component ---

interface HomeProps {
  user: UserProfile;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

type MeditationPhase = 'idle' | 'active' | 'done';

const Home: React.FC<HomeProps> = ({ user, isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const [waterIntake, setWaterIntake] = useState(1250);
  const [steps, setSteps] = useState(6842);
  const [meditationPhase, setMeditationPhase] = useState<MeditationPhase>('idle');
  const [breathState, setBreathState] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(60);

  // Breathing Loop
  useEffect(() => {
    if (meditationPhase !== 'active') return;
    
    let timer: ReturnType<typeof setTimeout>;
    const breathe = () => {
      setBreathState('inhale');
      timer = setTimeout(() => {
        setBreathState('hold');
        setTimeout(() => {
          setBreathState('exhale');
        }, 2000); // Hold for 2s
      }, 4000); // Inhale for 4s
    };

    breathe(); // Initial start
    const loop = setInterval(breathe, 10000); // Loop every 10s (4+2+4)
    
    // Countdown
    const countdown = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setMeditationPhase('done');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(loop);
      clearInterval(countdown);
    };
  }, [meditationPhase]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white pb-32 transition-colors">
      
      {/* Header Section */}
      <div className="px-6 pt-8 pb-4 flex justify-between items-start">
        <div className="flex items-center gap-3">
           <div onClick={toggleTheme} className="cursor-pointer">
             <AppLogo size={48} />
           </div>
           <div>
             <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
               Good Morning,
             </h1>
             <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
               {user.name.split(' ')[0] || 'Friend'}
             </p>
           </div>
        </div>
        <div className="flex gap-2">
           <button onClick={() => navigate('/notifications')} className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
             <Bell size={18} />
           </button>
           <button onClick={() => navigate('/profile-setup')} className="w-10 h-10 bg-slate-900 dark:bg-white rounded-full flex items-center justify-center shadow-md text-white dark:text-slate-900">
             <UserIcon size={18} />
           </button>
        </div>
      </div>

      <div className="px-6 space-y-8 mt-2 animate-slide-up">
        
        {/* Featured Tool (Check Symptoms) */}
        <div className="relative overflow-hidden bg-slate-900 dark:bg-blue-600 rounded-[32px] p-6 shadow-2xl shadow-blue-900/10 dark:shadow-blue-900/20 group cursor-pointer" onClick={() => navigate('/check')}>
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Activity size={120} />
           </div>
           <div className="relative z-10">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 text-white">
                 <Search size={20} />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mb-1">Check Symptoms</h2>
              <p className="text-slate-400 dark:text-blue-100 text-sm font-medium mb-4">Not feeling well? Let our AI help you understand why.</p>
              <div className="inline-flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider">
                 Start Analysis <ArrowRight size={14} />
              </div>
           </div>
        </div>

        {/* Daily Metrics Section - REFACTORED */}
        <div>
          <div className="flex justify-between items-end mb-4 px-1">
             <h3 className="text-lg font-black text-slate-900 dark:text-white">Daily Metrics</h3>
             <button onClick={() => navigate('/records')} className="text-xs font-bold text-blue-500 dark:text-blue-400 hover:opacity-80 transition-opacity">
               See History
             </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
             <div className="row-span-2">
                <StepsCard steps={steps} goal={10000} />
             </div>
             <WaterCard intake={waterIntake} goal={2500} onAdd={() => setWaterIntake(p => p + 250)} />
             <HeartRateCard />
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-3">
           <button onClick={() => navigate('/check?mode=wound')} className="bg-purple-50 dark:bg-purple-900/10 p-5 rounded-[28px] border border-purple-100 dark:border-purple-900/30 flex flex-col items-center gap-2 text-center group hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-purple-500 shadow-sm group-hover:scale-110 transition-transform">
                 <Search size={22} />
              </div>
              <div>
                 <p className="font-bold text-slate-900 dark:text-white text-sm">Scan Wound</p>
                 <p className="text-[10px] text-slate-500 font-medium">Instant Analysis</p>
              </div>
           </button>
           <button onClick={() => navigate('/doctors')} className="bg-teal-50 dark:bg-teal-900/10 p-5 rounded-[28px] border border-teal-100 dark:border-teal-900/30 flex flex-col items-center gap-2 text-center group hover:bg-teal-100 dark:hover:bg-teal-900/20 transition-colors">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-teal-500 shadow-sm group-hover:scale-110 transition-transform">
                 <UserIcon size={22} />
              </div>
              <div>
                 <p className="font-bold text-slate-900 dark:text-white text-sm">Find Doctor</p>
                 <p className="text-[10px] text-slate-500 font-medium">Book Appointment</p>
              </div>
           </button>
        </div>

        {/* Mindfulness / Breathing Card */}
        <div className="relative bg-slate-900 dark:bg-zinc-900 rounded-[32px] overflow-hidden min-h-[300px] flex flex-col items-center justify-center text-center p-6 border border-slate-800">
           {meditationPhase === 'idle' && (
             <div className="relative z-10 space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2 text-teal-400">
                   <Wind size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Breathe & Relax</h3>
                  <p className="text-slate-400 text-sm font-medium mt-1">Take a moment to center yourself.</p>
                </div>
                <button 
                  onClick={() => setMeditationPhase('active')}
                  className="bg-teal-500 hover:bg-teal-400 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-teal-500/20"
                >
                   Start 1 Min
                </button>
             </div>
           )}

           {meditationPhase === 'active' && (
             <div className="absolute inset-0 bg-black flex flex-col items-center justify-center animate-fade-in">
                <AppleBreathingFlower state={breathState} duration={4} />
                <div className="absolute bottom-8 font-black text-slate-500 tracking-widest text-xs">
                   {timeLeft} SECONDS REMAINING
                </div>
                <button 
                  onClick={() => { setMeditationPhase('idle'); setTimeLeft(60); }}
                  className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white/50 hover:bg-white/20 transition-colors"
                >
                  <X size={18} />
                </button>
             </div>
           )}

           {meditationPhase === 'done' && (
              <div className="relative z-10 space-y-4 animate-fade-in">
                 <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500">
                    <CheckCircle2 size={32} />
                 </div>
                 <h3 className="text-xl font-black text-white">Mindfulness Complete</h3>
                 <button 
                   onClick={() => { setMeditationPhase('idle'); setTimeLeft(60); }}
                   className="text-slate-400 font-bold text-sm hover:text-white transition-colors"
                 >
                    Done
                 </button>
              </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default Home;
