
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, Search, Mic, ArrowRight, Loader2, 
  Droplets, Footprints, Heart, CheckCircle2, 
  Sparkles, RefreshCw, X, Clock, Play, Trophy, Quote,
  Music, Wind, Volume2, CloudRain, Moon, Trees
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
}

type MeditationPhase = 'idle' | 'emoji' | 'sound_select' | 'tech_select' | 'duration_select' | 'active' | 'congrats' | 'quote' | 'summary';

// Updated with reliable Google Actions hosted sounds (CORS friendly)
const SOUND_OPTIONS = [
  { id: 'rain', label: 'Rain Drops', icon: CloudRain, url: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg' },
  { id: 'ocean', label: 'Ocean Waves', icon: Wind, url: 'https://actions.google.com/sounds/v1/water/waves_crashing.ogg' },
  { id: 'forest', label: 'Forest', icon: Trees, url: 'https://actions.google.com/sounds/v1/animals/birds_buzzing.ogg' },
  { id: 'night', label: 'Crickets', icon: Moon, url: 'https://actions.google.com/sounds/v1/nature/crickets_chirping.ogg' },
  { id: 'white', label: 'White Noise', icon: Volume2, url: 'https://actions.google.com/sounds/v1/ambiences/industrial_hum.ogg' },
  { id: 'none', label: 'Silence', icon: X, url: '' },
];

const BREATHING_TECHNIQUES = [
  { id: '4-7-8', label: 'Stress Relief (4-7-8)', pattern: { inhale: 4, hold: 7, exhale: 8 } },
  { id: '4-4-4', label: 'Triangle (4-4-4)', pattern: { inhale: 4, hold: 4, exhale: 4 } },
  { id: '4-6', label: 'Deep Calm (4-6)', pattern: { inhale: 4, hold: 0, exhale: 6 } },
  { id: '3-3-4', label: 'Beginner (3-3-4)', pattern: { inhale: 3, hold: 3, exhale: 4 } },
];

const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [waterIntake, setWaterIntake] = useState(1200); 
  const [isSyncing, setIsSyncing] = useState(false);
  const [heartRate, setHeartRate] = useState(72);
  const [steps, setSteps] = useState(4520);
  const [isWatchConnected, setIsWatchConnected] = useState(false);
  const waterGoal = 2500;

  // Meditation State
  const [medPhase, setMedPhase] = useState<MeditationPhase>('idle');
  const [medDuration, setMedDuration] = useState(5); // Minutes
  const [medTimeLeft, setMedTimeLeft] = useState(0); // Seconds
  const [selectedSound, setSelectedSound] = useState(SOUND_OPTIONS[0]);
  const [selectedTechnique, setSelectedTechnique] = useState(BREATHING_TECHNIQUES[0]);
  const [medSummary, setMedSummary] = useState({ avgHr: 0, spo2: 0, minutes: 0 });

  // Breathing Engine State
  const [breathState, setBreathState] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCounter, setBreathCounter] = useState(0); // Counts seconds within current breath state

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
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

  // Audio Control Logic
  useEffect(() => {
    // If not active or no sound URL, ensure audio is stopped
    if (medPhase !== 'active' || !selectedSound.url) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    // Initialize Audio
    const audio = new Audio(selectedSound.url);
    audio.loop = true;
    audio.volume = 0.7; // 70% volume by default
    audioRef.current = audio;

    // Play with error handling (Autoplay policy)
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error("Audio playback error:", error);
      });
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [medPhase, selectedSound]);

  // Main Meditation Timer & Breathing Loop
  useEffect(() => {
    let timer: number;
    if (medPhase === 'active' && medTimeLeft > 0) {
      timer = window.setInterval(() => {
        // 1. Session Timer
        setMedTimeLeft(prev => prev - 1);

        // 2. Breathing Logic
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
    setTimeout(() => setMedPhase('sound_select'), 2000);
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

  const addWater = () => setWaterIntake(prev => Math.min(prev + 250, waterGoal));

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  return (
    <div className="p-6 space-y-8 pb-32">
      {/* Branded Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-2xl shadow-sm border border-slate-50">
            <AppLogo size={32} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">Medi-Mirror</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Hello, {user.name.split(' ')[0]}</p>
          </div>
        </div>
        <div className="relative group cursor-pointer" onClick={() => navigate('/settings')}>
          <div className="w-10 h-10 rounded-2xl bg-slate-200 overflow-hidden border-2 border-white shadow-md transition-transform active:scale-90">
            <img src="https://picsum.photos/100/100" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${isWatchConnected ? 'bg-green-500' : 'bg-slate-300'}`}></div>
        </div>
      </div>

      {/* Wellness Tip */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-5 rounded-[32px] text-white shadow-xl shadow-blue-200 relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-blue-100 font-bold text-[10px] uppercase tracking-widest">
            <Sparkles size={14} /> Daily Wellness Tip
          </div>
          <p className="font-bold text-lg leading-tight">
            Try 5 minutes of mindful breathing today to lower your stress levels.
          </p>
          <button 
            onClick={startMeditationFlow}
            className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-white/20 hover:bg-white/30 transition-all"
          >
            Start Session
          </button>
        </div>
      </div>

      {/* Daily Metrics */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Live Vitals</h3>
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 active:scale-90 transition-all disabled:opacity-50"
          >
            <RefreshCw size={10} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Sync Data'}
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div onClick={addWater} className="bg-white p-4 rounded-[28px] border border-slate-50 shadow-sm flex flex-col items-center text-center space-y-2 active:scale-95 transition-all cursor-pointer hover:border-blue-100">
            <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl">
              <Droplets size={22} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800">{waterIntake}ml</p>
              <p className="text-[9px] text-slate-400 font-black uppercase">Water</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-[28px] border border-slate-50 shadow-sm flex flex-col items-center text-center space-y-2">
            <div className="p-2.5 bg-orange-50 text-orange-500 rounded-xl">
              <Footprints size={22} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800">{steps.toLocaleString()}</p>
              <p className="text-[9px] text-slate-400 font-black uppercase">Steps</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-[28px] border border-slate-50 shadow-sm flex flex-col items-center text-center space-y-2 overflow-hidden relative">
            <div className={`p-2.5 rounded-xl ${isWatchConnected ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-300'}`}>
              <Heart size={22} fill={isWatchConnected ? "currentColor" : "none"} className={isWatchConnected ? 'animate-heart-beat' : ''} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800">{isWatchConnected ? heartRate : '--'}</p>
              <p className="text-[9px] text-slate-400 font-black uppercase">BPM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Health Suite</h3>
        <div className="grid grid-cols-2 gap-4">
          <div 
            onClick={() => navigate('/check?mode=symptom')}
            className="bg-white p-5 rounded-[32px] border border-slate-50 shadow-sm active:scale-95 transition-all cursor-pointer group hover:border-blue-200"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-6">
              <Search size={24} />
            </div>
            <h3 className="font-black text-lg text-slate-800 tracking-tight leading-none">Diagnostic</h3>
            <p className="text-slate-400 text-[10px] mt-2 font-bold uppercase tracking-wider">AI Symptom Check</p>
          </div>

          <div 
            onClick={() => navigate('/check?mode=wound')}
            className="bg-white p-5 rounded-[32px] border border-slate-50 shadow-sm active:scale-95 transition-all cursor-pointer group hover:border-teal-200"
          >
             <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:-rotate-6">
               <Activity size={24} />
             </div>
             <h3 className="font-black text-lg text-slate-800 tracking-tight leading-none">Scanning</h3>
             <p className="text-slate-400 text-[10px] mt-2 font-bold uppercase tracking-wider">Vision Analysis</p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Nearby Support</h3>
        <div 
          onClick={() => navigate('/map')}
          className="bg-white rounded-[32px] border border-slate-100 shadow-md overflow-hidden active:scale-[0.99] transition-all group"
        >
          <div className="h-40 bg-slate-50 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
            {coords ? (
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0, pointerEvents: 'none' }}
                src={getPreviewMapUrl()}
                title="Nearby Services Preview"
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <Loader2 className="animate-spin" size={24} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          </div>
          <div className="p-5 flex justify-between items-center bg-white relative z-10">
            <div>
               <h3 className="font-black text-slate-800 text-lg">Hospital Locator</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Instant directions</p>
            </div>
            <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:translate-x-1">
               <ArrowRight size={20} />
            </div>
          </div>
        </div>
      </section>

      {/* Meditation Overlays */}
      {medPhase !== 'idle' && (
        <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-white animate-fade-in">
          
          {/* Phase: Emoji Intro */}
          {medPhase === 'emoji' && (
            <div className="animate-bounce-slow flex flex-col items-center gap-6">
              <span className="text-9xl">🧘</span>
              <h2 className="text-3xl font-black tracking-tight">Time to Breathe</h2>
            </div>
          )}

          {/* Phase: Sound Selection */}
          {medPhase === 'sound_select' && (
            <div className="w-full max-w-sm space-y-6 animate-slide-up">
              <div className="text-center">
                <h2 className="text-2xl font-black mb-1">Select Ambience</h2>
                <p className="text-slate-400 text-sm font-medium">Choose a background sound</p>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {SOUND_OPTIONS.map((sound) => (
                  <button 
                    key={sound.id}
                    onClick={() => { setSelectedSound(sound); setMedPhase('tech_select'); }}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-blue-500 transition-all active:scale-95"
                  >
                    <sound.icon size={24} className="text-blue-400" />
                    <span className="text-[10px] font-bold uppercase">{sound.label}</span>
                  </button>
                ))}
              </div>
              <button onClick={closeMeditation} className="w-full py-4 text-slate-500 text-xs font-bold uppercase tracking-widest">Cancel</button>
            </div>
          )}

          {/* Phase: Technique Selection */}
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
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-teal-500 transition-all active:scale-95 text-left"
                  >
                    <div>
                      <span className="text-sm font-bold block">{tech.label}</span>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                        In {tech.pattern.inhale}s • Hold {tech.pattern.hold}s • Ex {tech.pattern.exhale}s
                      </span>
                    </div>
                    <ArrowRight size={16} className="text-slate-500" />
                  </button>
                ))}
              </div>
              <button onClick={() => setMedPhase('sound_select')} className="w-full py-4 text-slate-500 text-xs font-bold uppercase tracking-widest">Back</button>
            </div>
          )}

          {/* Phase: Duration Configuration */}
          {medPhase === 'duration_select' && (
            <div className="w-full max-w-sm space-y-8 animate-slide-up">
              <div className="text-center">
                <h2 className="text-3xl font-black mb-2">Duration</h2>
                <p className="text-slate-400 text-sm font-medium">Session length (Max 8hr)</p>
              </div>
              
              <div className="flex flex-col items-center space-y-6">
                <div className="text-6xl font-black text-blue-400">
                  {medDuration} <span className="text-xl text-slate-500 uppercase">min</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="480" 
                  value={medDuration} 
                  onChange={(e) => setMedDuration(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="grid grid-cols-4 gap-2 w-full">
                  {[5, 10, 20, 30].map(v => (
                    <button 
                      key={v}
                      onClick={() => setMedDuration(v)}
                      className={`py-3 rounded-2xl font-bold text-xs border ${medDuration === v ? 'bg-blue-600 border-blue-600' : 'bg-slate-800 border-slate-700'}`}
                    >
                      {v}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setMedPhase('tech_select')} className="flex-1 py-5 rounded-[24px] bg-slate-800 font-bold hover:bg-slate-700 transition-all">Back</button>
                <button onClick={beginSession} className="flex-1 py-5 rounded-[24px] bg-blue-600 font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
                  <Play size={18} fill="currentColor" /> Begin
                </button>
              </div>
            </div>
          )}

          {/* Phase: Active Timer & Breathing Visual */}
          {medPhase === 'active' && (
            <div className="flex flex-col items-center justify-between h-full max-h-[600px] py-12 w-full">
              <div className="text-center">
                 <h2 className="text-3xl font-black tracking-tight mb-2">
                    {breathState === 'inhale' ? 'Inhale' : breathState === 'hold' ? 'Hold' : 'Exhale'}
                 </h2>
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                   {selectedTechnique.label}
                 </p>
              </div>

              <div className="relative flex items-center justify-center">
                 {/* Dynamic Breathing Circle */}
                 {/* We dynamically set transition duration based on the phase time */}
                 <div 
                   className={`w-32 h-32 rounded-full bg-blue-500/30 blur-xl absolute transition-all ease-in-out`}
                   style={{ 
                     transform: breathState === 'inhale' ? 'scale(2.5)' : breathState === 'hold' ? 'scale(2.5)' : 'scale(1)',
                     transitionDuration: `${breathState === 'inhale' ? selectedTechnique.pattern.inhale : breathState === 'hold' ? 0 : selectedTechnique.pattern.exhale}s`
                   }}
                 ></div>
                 <div 
                   className={`w-40 h-40 rounded-full border-4 border-blue-400/30 flex items-center justify-center relative z-10 bg-slate-900 transition-all ease-in-out`}
                   style={{ 
                     transform: breathState === 'inhale' ? 'scale(1.5)' : breathState === 'hold' ? 'scale(1.5)' : 'scale(1)',
                     transitionDuration: `${breathState === 'inhale' ? selectedTechnique.pattern.inhale : breathState === 'hold' ? 0 : selectedTechnique.pattern.exhale}s`
                   }}
                 >
                    <div className="text-white font-bold text-lg opacity-80">
                      {breathState === 'hold' ? 'HOLD' : 'BREATHE'}
                    </div>
                 </div>
              </div>

              <div className="w-full flex flex-col items-center gap-6">
                <div className="text-2xl font-black text-slate-500 tabular-nums">
                  {formatTime(medTimeLeft)}
                </div>
                
                <button onClick={finishMeditation} className="p-4 bg-white/10 rounded-2xl text-red-400 hover:bg-white/20 transition-all">
                  <X size={24} />
                </button>
              </div>
            </div>
          )}

          {/* Phase: Congrats */}
          {medPhase === 'congrats' && (
            <div className="flex flex-col items-center gap-6 animate-scale-up">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30">
                <Trophy size={48} className="text-white" />
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-center">Congratulations!</h2>
              <p className="text-green-400 font-bold uppercase tracking-widest text-sm">Session Complete</p>
            </div>
          )}

          {/* Phase: Quote */}
          {medPhase === 'quote' && (
            <div className="max-w-xs text-center space-y-6 animate-fade-in">
              <Quote size={40} className="text-blue-500 mx-auto opacity-50" />
              <p className="text-2xl font-bold leading-relaxed italic">
                "Quiet the mind, and the soul will speak."
              </p>
              <div className="w-12 h-1 bg-blue-500 mx-auto rounded-full"></div>
            </div>
          )}

          {/* Phase: Summary */}
          {medPhase === 'summary' && (
            <div className="w-full max-w-sm space-y-8 animate-slide-up">
              <div className="text-center space-y-1">
                <h2 className="text-3xl font-black tracking-tight">Session Summary</h2>
                <p className="text-slate-400 text-sm font-medium">Your physiological response</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-800 p-6 rounded-[32px] border border-white/5 space-y-2">
                    <div className="text-red-400 bg-red-400/10 w-fit p-2 rounded-xl"><Heart size={20} /></div>
                    <p className="text-2xl font-black">{medSummary.avgHr} <span className="text-[10px] text-slate-500 uppercase">Avg BPM</span></p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Resting Pulse</p>
                 </div>
                 <div className="bg-slate-800 p-6 rounded-[32px] border border-white/5 space-y-2">
                    <div className="text-blue-400 bg-blue-400/10 w-fit p-2 rounded-xl"><Activity size={20} /></div>
                    <p className="text-2xl font-black">{medSummary.spo2}% <span className="text-[10px] text-slate-500 uppercase">SPO2</span></p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Blood Oxygen</p>
                 </div>
                 <div className="col-span-2 bg-slate-800 p-6 rounded-[32px] border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">Total Mindfulness</p>
                      <p className="text-xl font-black">{medSummary.minutes} Minutes</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl"><Clock size={24} className="text-slate-400" /></div>
                 </div>
              </div>

              <button 
                onClick={closeMeditation}
                className="w-full bg-white text-slate-900 py-5 rounded-[24px] font-black shadow-xl active:scale-95 transition-all"
              >
                Done
              </button>
            </div>
          )}
        </div>
      )}

      {/* AI FAB */}
      <button 
        onClick={() => navigate('/chat')}
        className="fixed bottom-24 right-6 w-16 h-16 bg-slate-900 text-white rounded-[24px] shadow-2xl flex items-center justify-center animate-bounce-slow active:scale-90 transition-transform z-10 border border-white/20 backdrop-blur-md"
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
        .animate-heart-beat {
          animation: heart-beat 1.5s infinite ease-in-out;
        }
        .animate-ping-slow {
          animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes scale-up {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-up {
          animation: scale-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
};

export default Home;
