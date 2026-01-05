// ... (previous imports)
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, Search, Mic, ArrowRight, Loader2, 
  Droplets, Footprints, Heart, CheckCircle2, 
  Sparkles, RefreshCw, X, Clock, Play, Trophy, Quote,
  Music, Wind, Volume2, CloudRain, Moon, Trees, Sun, Plus, GlassWater, User as UserIcon
} from 'lucide-react';
import { UserProfile } from '../types';

// Functional SVG Logo component
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

interface HomeProps {
  user: UserProfile;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

type MeditationPhase = 'idle' | 'emoji' | 'sound_select' | 'tech_select' | 'duration_select' | 'active' | 'congrats' | 'quote' | 'summary';

const SOUND_OPTIONS = [
  { id: 'rain', label: 'Rain Drops', icon: CloudRain, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { id: 'ocean', label: 'Ocean Waves', icon: Wind, url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_7838575c32.mp3' },
  { id: 'forest', label: 'Nature', icon: Trees, url: 'https://cdn.pixabay.com/audio/2021/08/09/audio_8844ec4a29.mp3' },
  { id: 'night', label: 'Crickets', icon: Moon, url: 'https://cdn.pixabay.com/audio/2021/11/24/audio_38210137d1.mp3' },
  { id: 'white', label: 'Calm', icon: Volume2, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'none', label: 'Silence', icon: X, url: '' },
];

const BREATHING_TECHNIQUES = [
  { id: '4-7-8', label: 'Stress Relief (4-7-8)', pattern: { inhale: 4, hold: 7, exhale: 8 } },
  { id: '4-4-4', label: 'Triangle (4-4-4)', pattern: { inhale: 4, hold: 4, exhale: 4 } },
  { id: '4-6', label: 'Deep Calm (4-6)', pattern: { inhale: 4, hold: 0, exhale: 6 } },
  { id: '3-3-4', label: 'Beginner (3-3-4)', pattern: { inhale: 3, hold: 3, exhale: 4 } },
];

// --- Apple-Style Breathing Flower Component ---
const AppleBreathingFlower = ({ state, duration }: { state: 'inhale' | 'hold' | 'exhale', duration: number }) => {
  // 6 overlapping petals for the main flower, plus 6 offset for density
  const petals = [0, 60, 120, 180, 240, 300];
  
  const isExpanded = state === 'inhale' || state === 'hold';
  
  // Animation Parameters
  // When Inhaling: Petals move OUT (translate), Scale UP, Container ROTATES
  // When Exhaling: Petals move IN, Scale DOWN, Container ROTATES BACK
  const scale = isExpanded ? 1.5 : 0.5;
  const translate = isExpanded ? 50 : 0; // px distance from center
  const rotation = isExpanded ? 90 : 0; // degrees

  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      {/* Background Aura */}
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
        style={{
           transform: `rotate(${rotation}deg)`,
           transitionDuration: `${duration}s`
        }}
      >
        {/* Layer 1: Main Teal Petals */}
        {petals.map((deg, i) => (
          <div
            key={`l1-${i}`}
            className="absolute rounded-full mix-blend-screen bg-teal-500/60 blur-[1px] shadow-[0_0_20px_rgba(20,184,166,0.4)]"
            style={{
              width: '100px',
              height: '100px',
              transform: `rotate(${deg}deg) translate(${translate}px) scale(${scale})`,
              transition: `transform ${duration}s ease-in-out`
            }}
          />
        ))}
        
        {/* Layer 2: Offset Blue Petals for Depth (slightly smaller, offset angle) */}
        {petals.map((deg, i) => (
          <div
            key={`l2-${i}`}
            className="absolute rounded-full mix-blend-screen bg-blue-500/50 blur-[1px]"
            style={{
              width: '90px',
              height: '90px',
              // Offset by 30deg to fill gaps, slightly less translation
              transform: `rotate(${deg + 30}deg) translate(${translate * 0.8}px) scale(${scale * 0.8})`,
              transition: `transform ${duration}s ease-in-out`
            }}
          />
        ))}
      </div>

      {/* Center Text Overlay */}
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

// --- Improved Drinking Avatar Component ---
const DrinkingAvatar: React.FC<{ ml: number; onComplete: () => void }> = ({ ml, onComplete }) => {
  const [phase, setPhase] = useState<'idle' | 'lifting' | 'drinking' | 'satisfaction'>('idle');
  
  // Dynamic glass scale based on ML
  const glassScale = Math.min(Math.max(0.8, ml / 250), 1.6); 

  useEffect(() => {
    const liftTimer = setTimeout(() => setPhase('lifting'), 100);
    const drinkTimer = setTimeout(() => setPhase('drinking'), 800);
    const finishTimer = setTimeout(() => setPhase('satisfaction'), 3800);
    const closeTimer = setTimeout(onComplete, 4800);

    return () => {
      clearTimeout(liftTimer);
      clearTimeout(drinkTimer);
      clearTimeout(finishTimer);
      clearTimeout(closeTimer);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative z-50 animate-fade-in">
       <svg width="300" height="300" viewBox="0 0 200 200" className="overflow-visible drop-shadow-2xl">
          {/* BACKGROUND AURA */}
          <circle cx="100" cy="100" r="85" fill="white" fillOpacity="0.05" className="animate-pulse" />

          {/* BODY */}
          <path d="M50,160 Q100,160 150,160 L150,220 L50,220 Z" fill="#1e293b" /> 
          
          {/* NECK */}
          <rect x="90" y="140" width="20" height="25" fill="#fca5a5" />

          {/* HEAD GROUP */}
          <g 
            className="transition-transform duration-700 ease-in-out origin-[100px_140px]"
            style={{ 
              transform: phase === 'drinking' ? 'rotate(-20deg)' : 'rotate(0deg)'
            }}
          >
             {/* Face Shape */}
             <circle cx="100" cy="100" r="45" fill="#fca5a5" />
             {/* Hair */}
             <path d="M55,100 Q55,40 100,40 Q145,40 145,100 L145,90 Q100,20 55,90 Z" fill="#0f172a" />
             {/* Ear */}
             <circle cx="145" cy="100" r="8" fill="#fca5a5" />
             
             {/* Face Features - Shifted for slight side profile */}
             <g transform="translate(10, 0)"> 
                {/* Eyes */}
                {phase === 'satisfaction' ? (
                   <g>
                     <path d="M75,95 Q82,90 89,95" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                     <path d="M105,95 Q112,90 119,95" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                   </g>
                ) : (
                   <g>
                     <circle cx="82" cy="95" r="4" fill="#0f172a" className={phase === 'idle' ? 'animate-blink' : ''} />
                     <circle cx="112" cy="95" r="4" fill="#0f172a" className={phase === 'idle' ? 'animate-blink' : ''} />
                   </g>
                )}

                {/* Mouth */}
                {phase === 'drinking' ? (
                   // Open mouth for drinking
                   <ellipse cx="92" cy="125" rx="6" ry="8" fill="#552e2e" /> 
                ) : phase === 'satisfaction' ? (
                   <path d="M82,125 Q97,135 112,125" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                ) : (
                   <path d="M87,125 L107,125" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                )}
             </g>
          </g>

          {/* ARM GROUP - Calculates reach to mouth */}
          <g 
            className="transition-transform duration-1000 ease-in-out origin-[135px_170px]"
            style={{
              // -135deg rotation brings the hand (at radius ~60px) precisely to the mouth area
              transform: (phase === 'lifting' || phase === 'drinking') ? 'rotate(-135deg)' : 'rotate(0deg)'
            }}
          >
             {/* Upper Arm/Forearm simplified */}
             <rect x="125" y="160" width="20" height="60" rx="10" fill="#1e293b" />
             <circle cx="135" cy="220" r="14" fill="#fca5a5" /> {/* Hand */}

             {/* GLASS GROUP - Attached to hand, rotates independently for "tipping" */}
             <g 
                transform={`translate(135, 220) scale(${glassScale})`}
                className="transition-transform duration-1000 ease-in-out"
                style={{
                  // Additional rotation to tip the glass into mouth during drinking
                  transform: phase === 'drinking' 
                    ? `translate(135px, 220px) scale(${glassScale}) rotate(110deg)` 
                    : `translate(135px, 220px) scale(${glassScale}) rotate(0deg)`
                }}
             >
                 {/* Glass Body */}
                 <path d="M-14,0 L14,0 L11,45 L-11,45 Z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
                 
                 {/* Water Content - Drains downwards */}
                 <path 
                   d="M-13,2 L13,2 L10.5,43 L-10.5,43 Z" 
                   fill="#60a5fa" 
                   style={{
                     transition: 'clip-path 2.5s linear',
                     clipPath: phase === 'drinking' ? 'inset(100% 0 0 0)' : 'inset(0% 0 0 0)'
                   }}
                 />
             </g>
          </g>
       </svg>
       
       <div className="mt-6 text-center space-y-2 z-10">
         <h2 className="text-4xl font-black text-white tracking-tight drop-shadow-md">
           {phase === 'satisfaction' ? 'Ahhh!' : `${ml}ml`}
         </h2>
         <p className="text-blue-200 text-xs font-bold uppercase tracking-widest animate-pulse">
           {phase === 'idle' ? 'Ready...' : phase === 'lifting' ? 'Cheers!' : phase === 'drinking' ? 'Hydrating...' : 'Great Job!'}
         </p>
       </div>

       <style>{`
         @keyframes blink { 0%, 96% { transform: scaleY(1); } 98% { transform: scaleY(0.1); } 100% { transform: scaleY(1); } }
         .animate-blink { animation: blink 4s infinite; transform-origin: center; }
       `}</style>
    </div>
  )
}

const Home: React.FC<HomeProps> = ({ user, isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  
  // Water Logic
  const [waterIntake, setWaterIntake] = useState(0); 
  const [showWaterInput, setShowWaterInput] = useState(false);
  const [waterAmountToAdd, setWaterAmountToAdd] = useState('250');
  const [isDrinkingAnimation, setIsDrinkingAnimation] = useState(false);
  const waterGoal = 2500;

  const [isSyncing, setIsSyncing] = useState(false);
  const [heartRate, setHeartRate] = useState(72);
  const [steps, setSteps] = useState(4555);
  const [isWatchConnected, setIsWatchConnected] = useState(false);

  // Meditation State
  const [medPhase, setMedPhase] = useState<MeditationPhase>('idle');
  const [medDuration, setMedDuration] = useState(5); 
  const [medTimeLeft, setMedTimeLeft] = useState(0); 
  const [selectedSound, setSelectedSound] = useState(SOUND_OPTIONS[2]); 
  const [selectedTechnique, setSelectedTechnique] = useState(BREATHING_TECHNIQUES[0]);
  const [medSummary, setMedSummary] = useState({ avgHr: 0, spo2: 0, minutes: 0 });

  const [breathState, setBreathState] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCounter, setBreathCounter] = useState(0); 

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Daily Reset & Storage Logic
  useEffect(() => {
    const checkDailyReset = () => {
      const today = new Date().toDateString();
      const lastResetDate = localStorage.getItem('medimirror_last_water_reset');
      const savedIntake = localStorage.getItem('medimirror_water_intake');

      if (lastResetDate !== today) {
        localStorage.setItem('medimirror_last_water_reset', today);
        localStorage.setItem('medimirror_water_intake', '0');
        setWaterIntake(0);
      } else if (savedIntake) {
        setWaterIntake(parseInt(savedIntake));
      }
    };

    checkDailyReset();
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setCoords({ lat: 37.7749, lng: -122.4194 })
      );
    }
    const saved = localStorage.getItem('medimirror_watch_connected');
    if (saved === 'true') setIsWatchConnected(true);
  }, []);

  useEffect(() => {
    if (!isWatchConnected) return;
    const interval = setInterval(() => {
      setHeartRate(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 3000);
    return () => clearInterval(interval);
  }, [isWatchConnected]);

  // Audio Logic
  useEffect(() => {
    if (medPhase !== 'active' || !selectedSound.url) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }

    const audio = new Audio(selectedSound.url);
    audio.loop = true;
    audio.volume = 1.0; 
    audioRef.current = audio;

    const playAudio = async () => {
      try {
        await audio.play();
      } catch (error) {
        console.warn("Autoplay blocked or audio failed:", error);
      }
    };

    playAudio();

    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, [medPhase, selectedSound]);

  useEffect(() => {
    let timer: number;
    if (medPhase === 'active' && medTimeLeft > 0) {
      timer = window.setInterval(() => {
        setMedTimeLeft(prev => prev - 1);
        setBreathCounter(prev => {
          const currentCount = prev + 1;
          const { inhale, hold, exhale } = selectedTechnique.pattern;
          if (breathState === 'inhale' && currentCount >= inhale) {
            setBreathState(hold > 0 ? 'hold' : 'exhale');
            return 0;
          } else if (breathState === 'hold' && currentCount >= hold) {
            setBreathState('exhale');
            return 0;
          } else if (breathState === 'exhale' && currentCount >= exhale) {
            setBreathState('inhale');
            return 0;
          }
          return currentCount;
        });
      }, 1000);
    } else if (medPhase === 'active' && medTimeLeft === 0) {
      finishMeditation();
    }
    return () => clearInterval(timer);
  }, [medPhase, medTimeLeft, breathState, selectedTechnique]);

  const startMeditationFlow = () => {
    setMedPhase('emoji');
    setTimeout(() => setMedPhase('sound_select'), 1500);
  };

  const beginSession = () => {
    setMedTimeLeft(medDuration * 60);
    setBreathState('inhale');
    setBreathCounter(0);
    setMedPhase('active');
  };

  const finishMeditation = () => {
    setMedPhase('congrats');
    setMedSummary({
      avgHr: Math.floor(Math.random() * (70 - 60 + 1) + 60),
      spo2: Math.floor(Math.random() * (100 - 98 + 1) + 98),
      minutes: medDuration
    });
    setTimeout(() => {
      setMedPhase('quote');
      setTimeout(() => {
        setMedPhase('summary');
      }, 7000);
    }, 2500);
  };

  const closeMeditation = () => {
    setMedPhase('idle');
    setMedDuration(5);
    setBreathCounter(0);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSteps(prev => prev + Math.floor(Math.random() * 50));
    }, 1500);
  };

  const getPreviewMapUrl = () => {
    if (!coords) return "";
    return `https://maps.google.com/maps?q=hospitals&sll=${coords.lat},${coords.lng}&z=14&output=embed`;
  };

  const confirmAddWater = () => {
    const amount = parseInt(waterAmountToAdd) || 0;
    if (amount <= 0) return;
    
    setShowWaterInput(false);
    setIsDrinkingAnimation(true);
  };

  const handleDrinkingComplete = () => {
    const amount = parseInt(waterAmountToAdd) || 0;
    const newIntake = Math.min(waterIntake + amount, 10000);
    setWaterIntake(newIntake);
    localStorage.setItem('medimirror_water_intake', newIntake.toString());
    setIsDrinkingAnimation(false);
    setWaterAmountToAdd('250');
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  return (
    <div className="p-6 space-y-8 pb-32 transition-colors duration-300">
      {/* Branded Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-50 dark:border-slate-700 transition-colors">
            <AppLogo size={32} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tight leading-none">Medi-Mirror</h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-1.5">HELLO, {user.name.toUpperCase() || 'USER'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {toggleTheme && (
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-95 transition-all"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          <div className="relative group cursor-pointer" onClick={() => navigate('/settings')}>
            <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-700 overflow-hidden border-2 border-white dark:border-slate-800 shadow-md transition-transform active:scale-90">
              <img src="https://picsum.photos/100/100" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white dark:border-slate-900 rounded-full ${isWatchConnected ? 'bg-green-500' : 'bg-slate-300'}`}></div>
          </div>
        </div>
      </div>

      {/* Wellness Tip */}
      <div className="bg-gradient-to-br from-[#2b4291] via-[#203478] to-[#1a2b61] dark:from-[#1a2b61] dark:to-[#0f1a3d] p-7 rounded-[40px] text-white shadow-2xl shadow-blue-900/40 relative overflow-hidden transition-all group">
        <div className="absolute top-[-30%] right-[-10%] w-64 h-64 bg-blue-400/20 rounded-full blur-[80px] group-hover:bg-blue-300/30 transition-all duration-1000"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-40 h-40 bg-indigo-500/10 rounded-full blur-[60px]"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-blue-200/80 font-black text-[10px] uppercase tracking-[0.2em]">
            <Sparkles size={14} className="text-blue-300" /> DAILY WELLNESS TIP
          </div>
          <p className="font-bold text-xl leading-[1.3] max-w-[240px]">
            Try 5 minutes of mindful breathing today to lower your stress levels.
          </p>
          <button 
            onClick={startMeditationFlow}
            className="bg-[#3e59b1] hover:bg-[#4a6cd3] text-white text-[10px] font-black uppercase tracking-widest px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-950/40 active:scale-95 transition-all"
          >
            START SESSION
          </button>
        </div>
      </div>

      {/* Daily Metrics */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Live Vitals</h3>
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 active:scale-90 transition-all disabled:opacity-50"
          >
            <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
            SYNC DATA
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div onClick={() => setShowWaterInput(true)} className="bg-white dark:bg-slate-900/60 p-5 rounded-[32px] border border-slate-50 dark:border-slate-800/50 shadow-sm flex flex-col items-center text-center space-y-3 active:scale-95 transition-all cursor-pointer hover:border-blue-100 dark:hover:border-blue-900/30 group">
            <div className="p-3 bg-[#eef4ff] dark:bg-[#1a2b61]/40 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform">
              <Droplets size={22} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 dark:text-slate-100 leading-none">{waterIntake}ml</p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase mt-1">Water</p>
            </div>
            <Plus size={12} className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="bg-white dark:bg-slate-900/60 p-5 rounded-[32px] border border-slate-50 dark:border-slate-800/50 shadow-sm flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-[#fff7ed] dark:bg-[#432611]/30 text-orange-600 dark:text-orange-400 rounded-2xl">
              <Footprints size={22} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 dark:text-slate-100 leading-none">{steps.toLocaleString()}</p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase mt-1">Steps</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 p-5 rounded-[32px] border border-slate-50 dark:border-slate-800/50 shadow-sm flex flex-col items-center text-center space-y-3">
            <div className={`p-3 rounded-2xl ${isWatchConnected ? 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600'}`}>
              <Heart size={22} fill={isWatchConnected ? "currentColor" : "none"} className={isWatchConnected ? 'animate-heart-beat' : ''} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 dark:text-slate-100 leading-none">{isWatchConnected ? heartRate : '--'}</p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase mt-1">BPM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Health Suite */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Health Suite</h3>
        <div className="grid grid-cols-2 gap-4">
          <div onClick={() => navigate('/check?mode=symptom')} className="bg-white dark:bg-slate-900/80 p-6 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-none active:scale-95 transition-all cursor-pointer group hover:border-blue-400 dark:hover:border-blue-900">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-[20px] flex items-center justify-center mb-5 transition-transform group-hover:scale-110 shadow-inner">
              <Search size={24} />
            </div>
            <h3 className="font-black text-lg text-slate-800 dark:text-white tracking-tight leading-none">Diagnostic</h3>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-2 font-black uppercase tracking-wider">AI SYMPTOM CHECK</p>
          </div>
          <div onClick={() => navigate('/check?mode=wound')} className="bg-white dark:bg-slate-900/80 p-6 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-none active:scale-95 transition-all cursor-pointer group hover:border-teal-400 dark:hover:border-teal-900">
             <div className="w-14 h-14 bg-teal-50 dark:bg-teal-600/10 text-teal-600 dark:text-teal-400 rounded-[20px] flex items-center justify-center mb-5 transition-transform group-hover:scale-110 shadow-inner">
               <Activity size={24} />
             </div>
             <h3 className="font-black text-lg text-slate-800 dark:text-white tracking-tight leading-none">Scanning</h3>
             <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-2 font-black uppercase tracking-wider">VISION ANALYSIS</p>
          </div>
        </div>
      </section>

      {/* Hospital Locator */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Nearby Support</h3>
        <div onClick={() => navigate('/map')} className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-md overflow-hidden active:scale-[0.99] transition-all group">
          <div className="h-40 bg-slate-50 dark:bg-slate-800 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
            {coords ? (
              <iframe width="100%" height="100%" frameBorder="0" style={{ border: 0, pointerEvents: 'none' }} src={getPreviewMapUrl()} title="Nearby Services Preview"></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600"><Loader2 className="animate-spin" size={24} /></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-slate-900 dark:via-transparent"></div>
          </div>
          <div className="p-6 flex justify-between items-center bg-white dark:bg-slate-900 relative z-10 transition-colors">
            <div>
               <h3 className="font-black text-slate-800 dark:text-white text-lg leading-none">Hospital Locator</h3>
               <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">INSTANT DIRECTIONS</p>
            </div>
            <div className="w-11 h-11 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:translate-x-1">
               <ArrowRight size={22} />
            </div>
          </div>
        </div>
      </section>

      {/* Water Intake Modal */}
      {showWaterInput && (
        <div className="fixed inset-0 z-[250] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-8 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[40px] p-8 space-y-8 animate-slide-up shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-[24px] flex items-center justify-center mx-auto shadow-inner">
                <GlassWater size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Hydration Goal</h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Enter amount in ml</p>
            </div>

            <div className="relative">
               <input 
                 type="number"
                 value={waterAmountToAdd}
                 onChange={(e) => setWaterAmountToAdd(e.target.value)}
                 className="w-full text-center text-5xl font-black text-blue-600 bg-transparent focus:outline-none placeholder:text-slate-200 dark:placeholder:text-slate-800"
                 placeholder="250"
                 autoFocus
               />
               <span className="absolute bottom-[-1.5rem] left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em]">Milliliters</span>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-4">
              {['100', '250', '500', '750'].map(amt => (
                <button 
                  key={amt} 
                  onClick={() => setWaterAmountToAdd(amt)}
                  className={`py-3 rounded-xl font-bold text-xs border transition-all ${waterAmountToAdd === amt ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-500'}`}
                >
                  {amt}
                </button>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
               <button onClick={() => setShowWaterInput(false)} className="flex-1 py-5 rounded-[28px] bg-slate-50 dark:bg-slate-800 font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[10px] active:scale-95 transition-all">Cancel</button>
               <button onClick={confirmAddWater} className="flex-1 py-5 rounded-[28px] bg-blue-600 text-white font-black shadow-xl shadow-blue-600/30 uppercase tracking-widest text-[10px] active:scale-95 transition-all">Drink Now</button>
            </div>
          </div>
        </div>
      )}

      {/* Drinking Animation Overlay */}
      {isDrinkingAnimation && (
        <div className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-8 text-white">
          <DrinkingAvatar ml={parseInt(waterAmountToAdd)} onComplete={handleDrinkingComplete} />
        </div>
      )}

      {/* Meditation Overlays */}
      {medPhase !== 'idle' && (
        <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-white animate-fade-in">
          {medPhase === 'emoji' && (
            <div className="animate-bounce-slow flex flex-col items-center gap-6">
              <span className="text-9xl filter drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">🧘</span>
              <h2 className="text-3xl font-black tracking-tight">Time to Breathe</h2>
            </div>
          )}
          {medPhase === 'sound_select' && (
            <div className="w-full max-w-sm space-y-8 animate-slide-up">
              <div className="text-center">
                <h2 className="text-2xl font-black mb-1">Select Ambience</h2>
                <p className="text-slate-400 text-sm font-medium">Choose a background sound</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {SOUND_OPTIONS.map((sound) => (
                  <button 
                    key={sound.id}
                    onClick={() => { setSelectedSound(sound); setMedPhase('tech_select'); }}
                    className={`flex flex-col items-center gap-3 p-5 rounded-3xl bg-slate-900 border transition-all active:scale-95 ${selectedSound.id === sound.id ? 'border-blue-500 bg-slate-800 shadow-xl shadow-blue-500/10' : 'border-slate-800 hover:border-slate-700'}`}
                  >
                    <sound.icon size={26} className={selectedSound.id === sound.id ? 'text-blue-400' : 'text-slate-500'} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{sound.label}</span>
                  </button>
                ))}
              </div>
              <button onClick={closeMeditation} className="w-full py-4 text-slate-500 text-xs font-black uppercase tracking-[0.3em]">CANCEL</button>
            </div>
          )}
          {medPhase === 'tech_select' && (
            <div className="w-full max-w-sm space-y-6 animate-slide-up">
               <div className="text-center">
                <h2 className="text-2xl font-black mb-1">Breathing Ratio</h2>
                <p className="text-slate-400 text-sm font-medium">Select a technique</p>
              </div>
              <div className="flex flex-col gap-3">
                {BREATHING_TECHNIQUES.map((tech) => (
                  <button 
                    key={tech.id}
                    onClick={() => { setSelectedTechnique(tech); setMedPhase('duration_select'); }}
                    className="flex items-center justify-between p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500 transition-all active:scale-95 text-left"
                  >
                    <div>
                      <span className="text-sm font-black block text-slate-100">{tech.label}</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 block">
                        IN {tech.pattern.inhale}s • HOLD {tech.pattern.hold}s • EX {tech.pattern.exhale}s
                      </span>
                    </div>
                    <ArrowRight size={18} className="text-slate-600" />
                  </button>
                ))}
              </div>
              <button onClick={() => setMedPhase('sound_select')} className="w-full py-4 text-slate-500 text-xs font-black uppercase tracking-[0.3em]">BACK</button>
            </div>
          )}
          {medPhase === 'duration_select' && (
            <div className="w-full max-w-sm space-y-10 animate-slide-up">
              <div className="text-center">
                <h2 className="text-3xl font-black mb-2 tracking-tight">Duration</h2>
                <p className="text-slate-400 text-sm font-medium">Session length (Min)</p>
              </div>
              <div className="flex flex-col items-center space-y-8">
                <div className="text-7xl font-black text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)] tabular-nums">{medDuration}</div>
                <input type="range" min="1" max="60" value={medDuration} onChange={(e) => setMedDuration(parseInt(e.target.value))} className="w-full h-2.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                <div className="grid grid-cols-4 gap-3 w-full">
                  {[1, 5, 10, 20].map(v => (
                    <button key={v} onClick={() => setMedDuration(v)} className={`py-4 rounded-2xl font-black text-xs border transition-all ${medDuration === v ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/20' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                      {v}M
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setMedPhase('tech_select')} className="flex-1 py-5 rounded-[28px] bg-slate-900 font-black tracking-widest text-xs hover:bg-slate-800 transition-all uppercase">Back</button>
                <button onClick={beginSession} className="flex-1 py-5 rounded-[28px] bg-blue-600 font-black shadow-2xl shadow-blue-600/40 hover:bg-blue-500 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                  <Play size={18} fill="currentColor" /> Begin
                </button>
              </div>
            </div>
          )}
          {medPhase === 'active' && (
            <div className="flex flex-col items-center justify-between h-full max-h-[600px] py-16 w-full">
              <div className="text-center space-y-2">
                 <h2 className="text-4xl font-black tracking-tighter">{breathState === 'inhale' ? 'Inhale' : breathState === 'hold' ? 'Hold' : 'Exhale'}</h2>
                 <p className="text-blue-400/80 font-black uppercase tracking-[0.2em] text-xs">{selectedTechnique.label}</p>
              </div>
              
              <AppleBreathingFlower 
                state={breathState} 
                duration={breathState === 'inhale' ? selectedTechnique.pattern.inhale : breathState === 'hold' ? 0 : selectedTechnique.pattern.exhale} 
              />

              <div className="w-full flex flex-col items-center gap-8">
                <div className="text-3xl font-black text-slate-500 tabular-nums tracking-widest">{formatTime(medTimeLeft)}</div>
                <button onClick={finishMeditation} className="p-5 bg-white/5 border border-white/10 rounded-3xl text-red-400 hover:bg-white/10 transition-all"><X size={28} /></button>
              </div>
            </div>
          )}
          {medPhase === 'congrats' && (
            <div className="flex flex-col items-center gap-8 animate-scale-up">
              <div className="w-28 h-28 bg-green-500 rounded-[40px] flex items-center justify-center shadow-2xl shadow-green-500/40 rotate-12"><Trophy size={56} className="text-white -rotate-12" /></div>
              <h2 className="text-5xl font-black tracking-tighter text-center">Incredible!</h2>
              <p className="text-green-400 font-black uppercase tracking-[0.3em] text-sm">Session Complete</p>
            </div>
          )}
          {medPhase === 'quote' && (
            <div className="max-w-xs text-center space-y-8 animate-fade-in">
              <Quote size={48} className="text-blue-500 mx-auto opacity-30" />
              <p className="text-3xl font-black leading-tight italic tracking-tight">"Quiet the mind, and the soul will speak."</p>
              <div className="w-16 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
            </div>
          )}
          {medPhase === 'summary' && (
            <div className="w-full max-w-sm space-y-8 animate-slide-up">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black tracking-tight">Physiology Check</h2>
                <p className="text-slate-500 text-sm font-medium">Your body's response to the calm</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-900 p-7 rounded-[40px] border border-white/5 space-y-3">
                    <div className="text-red-400 bg-red-400/10 w-fit p-3 rounded-2xl"><Heart size={20} /></div>
                    <p className="text-3xl font-black">{medSummary.avgHr} <span className="text-[10px] text-slate-600 uppercase">AVG BPM</span></p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">PULSE STABILITY</p>
                 </div>
                 <div className="bg-slate-900 p-7 rounded-[40px] border border-white/5 space-y-3">
                    <div className="text-blue-400 bg-blue-400/10 w-fit p-3 rounded-2xl"><Activity size={20} /></div>
                    <p className="text-3xl font-black">{medSummary.spo2}% <span className="text-[10px] text-slate-600 uppercase">SPO2</span></p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">OXYGEN LEVEL</p>
                 </div>
                 <div className="col-span-2 bg-slate-900 p-7 rounded-[40px] border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">TOTAL MINDFULNESS</p>
                      <p className="text-2xl font-black">{medSummary.minutes} Minutes</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-3xl"><Clock size={28} className="text-slate-500" /></div>
                 </div>
              </div>
              <button onClick={closeMeditation} className="w-full bg-white text-slate-950 py-5 rounded-[28px] font-black shadow-2xl active:scale-95 transition-all uppercase tracking-widest text-sm">BACK TO HUB</button>
            </div>
          )}
        </div>
      )}

      {/* AI FAB */}
      <button 
        onClick={() => navigate('/chat')}
        className="fixed bottom-24 right-6 w-16 h-16 bg-blue-600 text-white rounded-[24px] shadow-2xl flex items-center justify-center animate-bounce-slow active:scale-90 transition-transform z-10 border border-white/10 backdrop-blur-md"
      >
        <div className={`absolute inset-0 rounded-[24px] animate-ping opacity-40 ${isWatchConnected ? 'bg-red-500/20' : 'bg-blue-500/20'}`}></div>
        <Mic size={28} />
      </button>

      <style>{`
        @keyframes heart-beat {
          0% { transform: scale(1); }
          15% { transform: scale(1.1); }
          30% { transform: scale(1); }
          45% { transform: scale(1.05); }
          60% { transform: scale(1); }
        }
        .animate-heart-beat { animation: heart-beat 1.5s infinite ease-in-out; }
        @keyframes scale-up {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-up { animation: scale-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default Home;