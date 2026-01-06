
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, ArrowLeft, Flame, Clock, 
  Plus, Sparkles, X, Check
} from 'lucide-react';
import { estimateActivityCalories } from '../services/geminiService';
import { HealthChart } from '../components/HealthChart';

const ACTIVITY_TYPES = [
  "Active Energy", "Activity", "Cardio Fitness", "Cardio Recovery", 
  "Cross Country Skiing Distance", "Cross Country Skiing Speed", 
  "Cycling Cadence", "Cycling Distance", "Cycling Functional Threshold Power", 
  "Cycling Power", "Cycling Speed", "Downhill Snow Sports Distance", 
  "Exercise Minutes", "Flights Climbed", "Move Minutes", "NikeFuel", 
  "Paddle Sports Distance", "Paddle Sports Speed", "Physical Effort", 
  "Pushes", "Resting Energy", "Rowing Distance", "Rowing Speed", 
  "Running Power", "Running Speed", "Skating Sports Distance", 
  "Stand Hours", "Stand Minutes", "Steps", "Swimming Distance", 
  "Swimming Strokes", "Underwater Depth", "Walking + Running Distance", 
  "Wheelchair Distance", "Workouts"
];

interface ActivityLog {
  id: string;
  activityName: string;
  startTime: string;
  endTime: string;
  date: string; // YYYY-MM-DD
  duration: number; // minutes
  calories: number;
  explanation?: string;
}

export const ActivityHub: React.FC = () => {
  const navigate = useNavigate();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  
  // Modal State
  const [showLogModal, setShowLogModal] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [intensity, setIntensity] = useState('Moderate');

  // Logs Data with safe initialization
  const [logs, setLogs] = useState<ActivityLog[]>([
    { id: '1', activityName: 'Cycling Distance', date: new Date().toISOString().split('T')[0], startTime: '07:30', endTime: '08:15', duration: 45, calories: 380, explanation: 'Based on moderate cycling (~8 METs)' }
  ]);

  const handleBack = () => {
    if (selectedActivity) {
      setSelectedActivity(null);
    } else {
      navigate('/records');
    }
  };

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const startMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;
    return Math.max(0, endMin - startMin);
  };

  const handleEstimateAndSave = async () => {
    if (!selectedActivity || !startTime || !endTime) return;
    
    setIsCalculating(true);
    const duration = calculateDuration(startTime, endTime);
    
    try {
      const result = await estimateActivityCalories(selectedActivity, duration, intensity);
      
      const newLog: ActivityLog = {
        id: Date.now().toString(),
        activityName: selectedActivity,
        date: date,
        startTime,
        endTime,
        duration,
        calories: Math.round(result?.calories || 0), // Safety check
        explanation: result?.explanation || "Estimated"
      };
      
      setLogs(prev => [newLog, ...prev]);
      setShowLogModal(false);
      // Reset form
      setStartTime('');
      setEndTime('');
    } catch (e) {
      alert("Could not estimate calories. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  const getFilteredLogs = () => {
    if (!selectedActivity) return [];
    return logs.filter(l => l.activityName === selectedActivity);
  };

  // Prepare chart data for selected activity
  const getChartData = () => {
    const data = getFilteredLogs();
    if (!data) return [];
    return data.map(l => ({
      date: l.date,
      value: l.calories || 0
    }));
  };
  
  // Calculate Summary Data for "Move" Ring
  const todaysCalories = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return logs
      .filter(l => l.date === todayStr)
      .reduce((acc, curr) => acc + (curr.calories || 0), 0);
  }, [logs]);

  const CALORIE_GOAL = 600;
  // Prevent NaN by ensuring fallback values
  const progressPercent = Math.min(((todaysCalories || 0) / (CALORIE_GOAL || 1)) * 100, 100);

  // --- Detail View ---
  if (selectedActivity) {
    const activityLogs = getFilteredLogs();
    const totalCalories = activityLogs.reduce((acc, curr) => acc + (curr.calories || 0), 0);

    return (
      <div className="min-h-screen bg-black text-white pb-10 animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-zinc-800 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <button onClick={handleBack} className="flex items-center gap-1 text-orange-500 font-medium">
              <ArrowLeft size={20} /> <span className="text-sm">Activity</span>
            </button>
            <h1 className="font-bold text-sm truncate max-w-[200px]">{selectedActivity}</h1>
            <button onClick={() => setShowLogModal(true)} className="text-orange-500">
               <Plus size={24} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Summary Card */}
          <div className="space-y-1">
             <h2 className="text-3xl font-black tracking-tight text-white flex items-end gap-2">
               {totalCalories} <span className="text-lg text-orange-500 font-bold mb-1">kcal</span>
             </h2>
             <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest">Total Burned (All Time)</p>
          </div>

          {/* Chart */}
          <HealthChart 
            data={getChartData()} 
            barColor="bg-orange-600" 
            textColor="text-orange-500" 
            unit="kcal" 
            aggregationType="sum" 
          />

          {/* About Section */}
          <div className="space-y-2">
             <h3 className="text-lg font-bold">About {selectedActivity}</h3>
             <p className="text-sm text-zinc-400 leading-relaxed">
               {selectedActivity} contributes to your total Active Energy. Tracking this helps understand your daily metabolic rate and fitness progress.
             </p>
          </div>

          {/* Options */}
          <div className="bg-zinc-900 rounded-xl overflow-hidden divide-y divide-zinc-800">
             <div className="p-4 flex justify-between items-center active:bg-zinc-800 transition-colors">
                <span className="text-sm font-medium">Add to Favorites</span>
                <ChevronRight size={16} className="text-zinc-600" />
             </div>
             <div className="p-4 flex justify-between items-center active:bg-zinc-800 transition-colors">
                <span className="text-sm font-medium">Data Sources & Access</span>
                <ChevronRight size={16} className="text-zinc-600" />
             </div>
          </div>

          {/* History / Logs */}
          <div className="space-y-4 pt-4">
             <h3 className="text-lg font-bold">History</h3>
             {activityLogs.length > 0 ? (
               <div className="space-y-3">
                 {activityLogs.map(log => (
                   <div key={log.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                      <div>
                         <div className="flex items-center gap-2 text-sm font-bold text-white mb-1">
                            <Clock size={14} className="text-orange-500" />
                            {new Date(log.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})} • {log.startTime}
                         </div>
                         <p className="text-xs text-zinc-500">{log.explanation || `${log.duration} min duration`}</p>
                      </div>
                      <div className="text-right">
                         <span className="block text-lg font-black text-orange-500">{log.calories}</span>
                         <span className="text-[10px] text-zinc-500 uppercase font-bold">kcal</span>
                      </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="p-8 text-center text-zinc-600 bg-zinc-900/50 rounded-xl">
                 No data recorded yet. Tap + to log.
               </div>
             )}
          </div>
        </div>

        {/* Modal */}
        {showLogModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
             <div className="bg-zinc-900 w-full max-w-sm rounded-[32px] p-6 border border-zinc-700 space-y-6 animate-slide-up">
                <div className="flex justify-between items-center">
                   <h3 className="text-xl font-black text-white">Log {selectedActivity}</h3>
                   <button onClick={() => setShowLogModal(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-400">
                      <X size={18} />
                   </button>
                </div>

                <div className="space-y-4">
                   <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Date</label>
                      <input 
                        type="date" 
                        value={date} 
                        onChange={e => setDate(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-bold outline-none focus:border-orange-500"
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Start Time</label>
                         <input 
                           type="time" 
                           value={startTime} 
                           onChange={e => setStartTime(e.target.value)}
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-bold outline-none focus:border-orange-500"
                         />
                      </div>
                      <div>
                         <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">End Time</label>
                         <input 
                           type="time" 
                           value={endTime} 
                           onChange={e => setEndTime(e.target.value)}
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-bold outline-none focus:border-orange-500" 
                         />
                      </div>
                   </div>

                   <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Intensity</label>
                      <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                         {['Low', 'Moderate', 'High'].map(lvl => (
                           <button 
                             key={lvl}
                             onClick={() => setIntensity(lvl)}
                             className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${intensity === lvl ? 'bg-zinc-800 text-orange-500 shadow-sm' : 'text-zinc-500'}`}
                           >
                             {lvl}
                           </button>
                         ))}
                      </div>
                   </div>
                </div>

                <button 
                   onClick={handleEstimateAndSave}
                   disabled={isCalculating || !startTime || !endTime}
                   className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                >
                   {isCalculating ? (
                     <>Calculating <Sparkles className="animate-spin" size={16} /></>
                   ) : (
                     <>Add & Estimate Calories <Check size={18} /></>
                   )}
                </button>
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-10">
      {/* List View Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-zinc-800 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/records')} className="flex items-center gap-1 text-orange-500 font-medium">
            <ArrowLeft size={20} /> <span className="text-sm">Browse</span>
          </button>
          <h1 className="font-bold text-lg">Activity</h1>
          <div className="w-8"></div>
        </div>
        <div className="px-4 pb-3">
           <h2 className="text-3xl font-black tracking-tight mb-4">Activity</h2>
           <div className="text-zinc-500 text-sm font-bold bg-zinc-900 py-2 px-4 rounded-xl">
             {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
           </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="space-y-6">
           {/* Dynamic Move Card */}
           <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
             <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-orange-500">Move</span>
                <span className="text-xs text-zinc-500">TODAY</span>
             </div>
             <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">{todaysCalories}</span>
                <span className="text-sm font-bold text-zinc-400">/ {CALORIE_GOAL} kcal</span>
             </div>
             <div className="w-full bg-zinc-800 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className="h-full bg-orange-600 transition-all duration-1000 ease-out" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
             </div>
           </div>

           <div className="bg-zinc-900 rounded-xl overflow-hidden divide-y divide-zinc-800 border border-zinc-800">
              {ACTIVITY_TYPES.map((type) => (
                <div 
                  key={type}
                  onClick={() => setSelectedActivity(type)}
                  className="p-4 flex justify-between items-center cursor-pointer active:bg-zinc-800 transition-colors"
                >
                   <span className="text-sm font-bold text-white">{type}</span>
                   <ChevronRight size={16} className="text-zinc-600" />
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
