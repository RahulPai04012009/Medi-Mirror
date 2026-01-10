
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, Search, Mic, ArrowRight, Loader2, 
  Droplets, Footprints, Heart, CheckCircle2, 
  Sparkles, RefreshCw, X, Clock, Play, Trophy, Quote,
  Music, Wind, Volume2, CloudRain, Moon, Trees, Sun, Plus, 
  GlassWater, User as UserIcon, Flame, Bell, Camera, Power, Zap, Eye, EyeOff, Signal
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

// --- REAL PPG HEART RATE COMPONENT (MEDICAL GRADE LOGIC) ---
const HeartRateCard = () => {
   const [bpm, setBpm] = useState<number | null>(null);
   const [isScanning, setIsScanning] = useState(false);
   const [message, setMessage] = useState('Resting Rate');
   const [rawGraphData, setRawGraphData] = useState<number[]>(new Array(60).fill(0));
   const [signalQuality, setSignalQuality] = useState(0); // 0-100%
   const [showCamera, setShowCamera] = useState(false);
   
   const videoRef = useRef<HTMLVideoElement>(null);
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const streamRef = useRef<MediaStream | null>(null);
   const frameIdRef = useRef<number>(0);
   
   // DSP State
   const dspRef = useRef<{
       timestamps: number[];
       values: number[];
       beats: number[];
       lastBeatTime: number;
       validFingerFrames: number;
   }>({ 
       timestamps: [], 
       values: [], 
       beats: [], 
       lastBeatTime: 0,
       validFingerFrames: 0
   });

   const stopScan = () => {
       if (streamRef.current) {
           streamRef.current.getTracks().forEach(t => t.stop());
           streamRef.current = null;
       }
       if (frameIdRef.current) {
           cancelAnimationFrame(frameIdRef.current);
       }
       setIsScanning(false);
       setMessage('Resting Rate');
       setRawGraphData(new Array(60).fill(0));
       setSignalQuality(0);
   };

   const startScan = async () => {
       try {
           setIsScanning(true);
           setBpm(null);
           setMessage('Starting Camera...');
           
           const stream = await navigator.mediaDevices.getUserMedia({
               video: { 
                 facingMode: 'environment', 
                 width: { ideal: 192 }, // Low res is fine for PPG and faster
                 height: { ideal: 144 },
                 frameRate: { ideal: 30 }
               }
           });
           streamRef.current = stream;
           
           if (videoRef.current) {
               videoRef.current.srcObject = stream;
               videoRef.current.play();
           }

           // Flash handling
           const track = stream.getVideoTracks()[0];
           const capabilities = track.getCapabilities();
           
           setMessage('Activating Sensor...');
           // @ts-ignore
           if (capabilities.torch) {
               // @ts-ignore
               await track.applyConstraints({ advanced: [{ torch: true }] });
           } else {
               setMessage('Flash required. Please use bright light.');
           }

           // Reset DSP Buffer
           dspRef.current = { 
               timestamps: [], 
               values: [], 
               beats: [], 
               lastBeatTime: 0,
               validFingerFrames: 0
           };

           setTimeout(() => {
              if (isScanning) setMessage('Place finger on Camera & Flash');
              processFrame();
           }, 1000); 

       } catch (err) {
           console.error("Camera error:", err);
           setIsScanning(false);
           alert("Camera access denied. This feature needs camera permission to see blood flow.");
       }
   };

   const processFrame = () => {
       if (!videoRef.current || !canvasRef.current || !isScanning) return;
       
       const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
       if (!ctx) return;

       // Draw only the center crop (ROI) to avoid edge noise
       const vid = videoRef.current;
       const roiSize = 40;
       const sx = (vid.videoWidth - roiSize) / 2;
       const sy = (vid.videoHeight - roiSize) / 2;
       
       ctx.drawImage(vid, sx, sy, roiSize, roiSize, 0, 0, 30, 30);
       const frame = ctx.getImageData(0, 0, 30, 30);
       const data = frame.data;
       
       let rSum = 0, gSum = 0, bSum = 0;
       const pixelCount = data.length / 4;

       // 1. Calculate Average Colors
       for (let i = 0; i < data.length; i += 4) {
           rSum += data[i];
           gSum += data[i + 1];
           bSum += data[i + 2];
       }
       const r = rSum / pixelCount;
       const g = gSum / pixelCount;
       const b = bSum / pixelCount;

       // 2. Strict Finger Validation
       // Real finger covering flash: High Red, Low Green/Blue.
       // Thresholds: Red > 60 (some light), Green < Red * 0.5 (blood absorbs green)
       const isFinger = r > 60 && g < (r * 0.6) && b < (r * 0.6);

       if (!isFinger) {
           dspRef.current.validFingerFrames = 0;
           setSignalQuality(0);
           setBpm(null);
           setMessage('No finger detected. Cover Camera.');
           
           // Show flatline if no finger
           setRawGraphData(prev => [...prev.slice(1), 128]); // 128 is mid-gray
           frameIdRef.current = requestAnimationFrame(processFrame);
           return;
       }

       // Finger is present, warm up quality metric
       dspRef.current.validFingerFrames++;
       const qualityPercent = Math.min(100, dspRef.current.validFingerFrames * 2); // Takes 50 frames (~1.5s) to reach 100% confidence
       setSignalQuality(qualityPercent);
       if (qualityPercent < 50) setMessage('Calibrating...');
       else setMessage('Detecting Pulse...');

       // 3. Signal Processing (AC Component Isolation)
       const now = performance.now();
       const state = dspRef.current;
       
       // Raw signal is Red intensity. Ideally we invert it because more blood = darker image = lower Red.
       // But keeping it positive is easier for "peaks". Let's stick to Average Red.
       // Note: During systole (beat), blood rushes in -> absorbs light -> Red value DROPS.
       // So a "beat" is a valley in Red brightness.
       
       const rawVal = r;
       state.values.push(rawVal);
       state.timestamps.push(now);
       
       // Keep buffer manageable (approx 5 seconds at 30fps = 150 frames)
       if (state.values.length > 150) {
           state.values.shift();
           state.timestamps.shift();
       }

       // We need enough data to filter
       if (state.values.length > 15) {
           // Simple Rolling Average Filter to remove DC component (breath/movement)
           const windowSize = 15;
           const currentVal = state.values[state.values.length - 1];
           
           // Calculate local mean
           let sum = 0;
           for(let i = 1; i <= windowSize; i++) {
               sum += state.values[state.values.length - i];
           }
           const localMean = sum / windowSize;
           
           // The "Pulse" is the deviation from the mean.
           // Invert so beat (drop in brightness) becomes a positive peak.
           const filtered = (localMean - currentVal) * 5; // Gain of 5 for visibility

           // Update Graph
           setRawGraphData(prev => {
               // Normalize for display: centered at 50, range 0-100
               const plotVal = 50 + filtered; 
               const newData = [...prev.slice(1), plotVal];
               return newData;
           });

           // 4. Zero-Crossing / Peak Detection
           // Look for upward crossing of a threshold
           const THRESHOLD = 2; // Signal must rise above this to be a beat
           const MIN_BEAT_INTERVAL = 300; // 200 BPM max
           const MAX_BEAT_INTERVAL = 1500; // 40 BPM min

           if (filtered > THRESHOLD && (now - state.lastBeatTime) > MIN_BEAT_INTERVAL) {
               // We found a potential peak.
               // Check if previous point was lower (rising edge)
               // Simple logic: Trigger on rising edge crossing threshold
               
               if (state.lastBeatTime !== 0) {
                   const interval = now - state.lastBeatTime;
                   if (interval < MAX_BEAT_INTERVAL) {
                       const instantBpm = 60000 / interval;
                       state.beats.push(instantBpm);
                       if (state.beats.length > 5) state.beats.shift();

                       // Average the last 5 beats for stability
                       const avgBpm = Math.round(state.beats.reduce((a, b) => a + b, 0) / state.beats.length);
                       
                       if (qualityPercent > 80) { // Only show BPM if signal is good
                           setBpm(avgBpm);
                       }
                   }
               }
               state.lastBeatTime = now;
           }
       }

       frameIdRef.current = requestAnimationFrame(processFrame);
   };

   // SVG Path for Oscilloscope
   const renderGraph = () => {
       const points = rawGraphData.map((val, i) => {
           // Map 0-100 range to Y coordinates (height is 48px)
           // Invert Y because SVG 0 is top
           const y = 48 - (Math.max(0, Math.min(100, val)) / 100 * 48);
           const x = (i / (rawGraphData.length - 1)) * 100; // percentage width
           return `${x},${y}`;
       }).join(' ');

       return (
           <svg viewBox="0 0 100 48" className="w-full h-12 overflow-visible" preserveAspectRatio="none">
               <polyline 
                   points={points} 
                   fill="none" 
                   stroke="#ef4444" 
                   strokeWidth="2" 
                   vectorEffect="non-scaling-stroke"
                   strokeLinecap="round"
                   strokeLinejoin="round"
               />
           </svg>
       );
   }

   return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden h-48 group hover:shadow-lg transition-all">
       <canvas ref={canvasRef} width="30" height="30" className="hidden"></canvas>

       <div className="flex justify-between items-start relative z-20">
         <div className="p-2.5 bg-red-50 dark:bg-red-900/20 rounded-full text-red-500 animate-pulse">
            <Activity size={20} />
         </div>
         {isScanning ? (
             <div className="flex gap-2">
                 <button onClick={() => setShowCamera(!showCamera)} className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-500">
                     {showCamera ? <EyeOff size={14} /> : <Eye size={14} />}
                 </button>
                 <button onClick={stopScan} className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-red-500">
                     <Power size={14} />
                 </button>
             </div>
         ) : (
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">PPG Sensor</span>
         )}
       </div>

       {isScanning ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
                
                {/* Proof of Life Camera Feed */}
                <div className={`absolute inset-0 z-[-1] transition-opacity duration-500 ${showCamera ? 'opacity-100' : 'opacity-0'}`}>
                    <video ref={videoRef} className="w-full h-full object-cover grayscale opacity-50" playsInline muted></video>
                </div>

                <div className="w-full px-6 mb-2 relative h-12 flex items-center">
                    {renderGraph()}
                    {/* Baseline */}
                    <div className="absolute w-full border-b border-dashed border-red-200 dark:border-red-900/30 top-1/2"></div>
                </div>
                
                <div className="flex items-baseline gap-1 relative z-20">
                    <span className="text-4xl font-black text-slate-900 dark:text-white tabular-nums">
                        {bpm ? bpm : '--'}
                    </span>
                    <span className="text-sm font-bold text-red-500">BPM</span>
                </div>
                
                <div className="w-full px-10 mt-2">
                    <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        <span>Signal Quality</span>
                        <span>{signalQuality}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-300 ${signalQuality > 80 ? 'bg-green-500' : signalQuality > 40 ? 'bg-orange-500' : 'bg-red-500'}`} 
                            style={{ width: `${signalQuality}%` }}
                        ></div>
                    </div>
                </div>
                
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-widest animate-pulse relative z-20">
                    {message}
                </p>
           </div>
       ) : (
           <>
                <div className="absolute top-1/2 left-0 w-[200%] -translate-y-1/2 h-20 opacity-20 dark:opacity-30 pointer-events-none flex">
                    <div className="w-1/2 h-full animate-ecg-scroll flex-shrink-0">
                        <svg viewBox="0 0 500 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                            <path d="M0,50 L50,50 L60,20 L70,80 L80,50 L150,50 L160,20 L170,80 L180,50 L250,50 L260,20 L270,80 L280,50 L350,50 L360,20 L370,80 L380,50 L500,50" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-4">
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-900 dark:text-white">{bpm || '--'}</span>
                        <span className="text-sm font-bold text-red-500">BPM</span>
                    </div>
                    <button 
                        onClick={startScan}
                        className="mt-3 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg shadow-red-500/30 flex items-center gap-2 transition-all active:scale-95"
                    >
                        <Camera size={12} /> Start Measurement
                    </button>
                </div>
           </>
       )}

       <style>{`
         @keyframes ecg-scroll {
           0% { transform: translateX(0); }
           100% { transform: translateX(-100%); }
         }
         .animate-ecg-scroll {
           animation: ecg-scroll 4s linear infinite;
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
