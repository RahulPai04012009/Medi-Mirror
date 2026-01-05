
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Plus, ChevronRight, Ruler, Search, 
  TrendingUp, Calendar, X, Save
} from 'lucide-react';

const MEASUREMENT_TYPES = [
  { id: 'weight', label: 'Weight', unit: 'lbs' },
  { id: 'height', label: 'Height', unit: 'ft/in' },
  { id: 'bmi', label: 'Body Mass Index', unit: '' },
  { id: 'body_fat', label: 'Body Fat Percentage', unit: '%' },
  { id: 'lean_mass', label: 'Lean Body Mass', unit: 'lbs' },
  { id: 'waist', label: 'Waist Circumference', unit: 'in' },
  { id: 'body_temp', label: 'Body Temperature', unit: '°F' },
  { id: 'basal_temp', label: 'Basal Body Temperature', unit: '°F' },
  { id: 'wrist_temp', label: 'Wrist Temperature', unit: '°F' },
  { id: 'electro', label: 'Electrodermal Activity', unit: 'µS' },
  { id: 'vision', label: 'Vision Prescription', unit: '' },
];

interface MeasurementLog {
  id: string;
  typeId: string;
  value: string;
  date: string; // YYYY-MM-DD
  time: string;
  note?: string;
}

export const BodyMeasurements: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);
  
  // Local State for Data
  const [logs, setLogs] = useState<MeasurementLog[]>(() => {
    const saved = localStorage.getItem('medimirror_body_logs');
    return saved ? JSON.parse(saved) : [
      { id: '1', typeId: 'weight', value: '204', date: '2024-09-15', time: '08:00', note: 'Morning weigh-in' }
    ];
  });

  // Modal Inputs
  const [inputValue, setInputValue] = useState('');
  const [inputDate, setInputDate] = useState(new Date().toISOString().split('T')[0]);
  const [inputTime, setInputTime] = useState(new Date().toTimeString().slice(0, 5));

  useEffect(() => {
    localStorage.setItem('medimirror_body_logs', JSON.stringify(logs));
  }, [logs]);

  // --- BMI Calculation Logic ---
  // Whenever logs change, check if we need to auto-generate a BMI entry
  useEffect(() => {
    // Get latest weight
    const weightLogs = logs.filter(l => l.typeId === 'weight').sort((a,b) => b.date.localeCompare(a.date));
    const heightLogs = logs.filter(l => l.typeId === 'height').sort((a,b) => b.date.localeCompare(a.date));

    if (weightLogs.length > 0 && heightLogs.length > 0) {
      const latestWeight = parseFloat(weightLogs[0].value);
      const latestHeightStr = heightLogs[0].value; // Assuming format like "5'10" or just inches
      
      // Simple parser for ft'in" or cm
      let heightInInches = 0;
      if (latestHeightStr.includes("'")) {
        const parts = latestHeightStr.split("'");
        heightInInches = (parseInt(parts[0]) * 12) + (parseInt(parts[1]) || 0);
      } else {
        heightInInches = parseFloat(latestHeightStr); // Assume inches if just number
      }

      if (latestWeight > 0 && heightInInches > 0) {
        const bmi = (latestWeight / (heightInInches * heightInInches)) * 703;
        const bmiValue = bmi.toFixed(1);

        // Check if we already have a BMI log for this date/weight combo to avoid infinite loop
        const existingBMI = logs.find(l => l.typeId === 'bmi' && l.date === weightLogs[0].date);
        if (!existingBMI || existingBMI.value !== bmiValue) {
           // Add BMI Log
           const newBMI: MeasurementLog = {
             id: Date.now().toString() + '_bmi',
             typeId: 'bmi',
             value: bmiValue,
             date: weightLogs[0].date,
             time: weightLogs[0].time,
             note: 'Auto-calculated'
           };
           // Use functional update to avoid dependency loop issues, check existence inside
           setLogs(prev => {
             const exists = prev.find(p => p.id === newBMI.id);
             return exists ? prev : [newBMI, ...prev];
           });
        }
      }
    }
  }, [logs]);

  const handleSave = () => {
    if (!selectedMetric || !inputValue) return;

    const newLog: MeasurementLog = {
      id: Date.now().toString(),
      typeId: selectedMetric,
      value: inputValue,
      date: inputDate,
      time: inputTime
    };

    setLogs(prev => [newLog, ...prev]);
    setShowLogModal(false);
    setInputValue('');
  };

  const getLatestLog = (typeId: string) => {
    const typeLogs = logs.filter(l => l.typeId === typeId);
    if (typeLogs.length === 0) return null;
    return typeLogs.reduce((prev, current) => (prev.date > current.date) ? prev : current);
  };

  // Sections
  const activeMetrics = MEASUREMENT_TYPES.filter(t => getLatestLog(t.id) !== null);
  const inactiveMetrics = MEASUREMENT_TYPES.filter(t => getLatestLog(t.id) === null);

  // --- Detail View ---
  if (selectedMetric && !showLogModal) {
    const metricDef = MEASUREMENT_TYPES.find(m => m.id === selectedMetric);
    const metricLogs = logs.filter(l => l.typeId === selectedMetric).sort((a,b) => b.date.localeCompare(a.date));
    const latest = metricLogs[0];

    return (
      <div className="min-h-screen bg-black text-white pb-10 animate-slide-up">
        {/* Detail Header */}
        <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-zinc-800 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <button onClick={() => setSelectedMetric(null)} className="flex items-center gap-1 text-purple-500 font-medium active:opacity-70">
              <ArrowLeft size={20} /> <span className="text-sm">Body Measurements</span>
            </button>
            <h1 className="font-bold text-sm truncate">{metricDef?.label}</h1>
            <button onClick={() => setShowLogModal(true)} className="text-purple-500 active:opacity-70">
              <Plus size={24} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Summary */}
          {latest ? (
             <div className="space-y-1">
               <div className="flex items-baseline gap-1">
                 <span className="text-4xl font-black tracking-tight">{latest.value}</span>
                 <span className="text-xl text-zinc-500 font-bold">{metricDef?.unit}</span>
               </div>
               <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                 {new Date(latest.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
               </p>
             </div>
          ) : (
            <div className="py-10 text-center text-zinc-500">
               <p className="text-sm">No Data Recorded</p>
               <button onClick={() => setShowLogModal(true)} className="mt-4 text-purple-500 font-bold text-sm">Add First Entry</button>
            </div>
          )}

          {/* Graph Placeholder */}
          {metricLogs.length > 0 && (
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 h-64 flex flex-col justify-between">
               <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-zinc-500">Last 6 Months</span>
                 <TrendingUp size={16} className="text-purple-500" />
               </div>
               <div className="flex items-end justify-around h-40 gap-2">
                  {metricLogs.slice(0, 7).reverse().map((log, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group">
                       <span className="text-[9px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">{log.value}</span>
                       <div className="w-full bg-purple-900/50 rounded-t-md relative hover:bg-purple-600 transition-colors" style={{ height: `${Math.min(100, (parseFloat(log.value)/parseFloat(latest.value || '1')) * 60)}%` }}></div>
                       <span className="text-[9px] text-zinc-600">{log.date.slice(5)}</span>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Options */}
          <div className="bg-zinc-900 rounded-xl overflow-hidden divide-y divide-zinc-800">
             <div className="p-4 flex justify-between items-center active:bg-zinc-800 transition-colors">
                <span className="text-sm font-medium">Add to Favorites</span>
                <ChevronRight size={16} className="text-zinc-600" />
             </div>
             <div className="p-4 flex justify-between items-center active:bg-zinc-800 transition-colors">
                <span className="text-sm font-medium">Show All Data</span>
                <ChevronRight size={16} className="text-zinc-600" />
             </div>
          </div>
          
          {/* History List */}
          <div>
            <h3 className="text-lg font-bold mb-3">History</h3>
            <div className="bg-zinc-900 rounded-xl overflow-hidden divide-y divide-zinc-800 border border-zinc-800">
              {metricLogs.map(log => (
                <div key={log.id} className="p-4 flex justify-between items-center">
                   <div>
                     <p className="text-sm font-bold text-white">{log.value} <span className="text-xs font-normal text-zinc-500">{metricDef?.unit}</span></p>
                   </div>
                   <div className="text-right">
                     <p className="text-xs text-zinc-400">{new Date(log.date).toLocaleDateString()}</p>
                     <p className="text-[10px] text-zinc-600">{log.time}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Main List View ---
  return (
    <div className="min-h-screen bg-black text-white pb-10">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-zinc-800 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/records')} className="flex items-center gap-1 text-purple-500 font-medium active:opacity-70">
            <ArrowLeft size={20} /> <span className="text-sm">Browse</span>
          </button>
          <div className="flex gap-4">
            <Search size={20} className="text-purple-500" />
            <Plus size={24} className="text-purple-500" />
          </div>
        </div>
        <div className="px-4 pb-3">
           <h1 className="text-3xl font-black tracking-tight text-white">Body Measurements</h1>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-6">
        
        {/* Active Metrics Section (Older/Today) */}
        {activeMetrics.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">Recent Data</h2>
            <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 divide-y divide-zinc-800">
              {activeMetrics.map(metric => {
                const latest = getLatestLog(metric.id)!;
                return (
                  <div 
                    key={metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                    className="p-4 active:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-center mb-1">
                       <div className="flex items-center gap-2">
                          <Ruler size={16} className="text-purple-500" />
                          <span className="font-bold text-sm text-purple-400">{metric.label}</span>
                       </div>
                       <span className="text-xs text-zinc-500 font-medium">
                         {new Date(latest.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                       </span>
                    </div>
                    <div className="flex justify-between items-end">
                       <span className="text-2xl font-black tracking-tight">{latest.value} <span className="text-sm text-zinc-500 font-bold">{metric.unit}</span></span>
                       <ChevronRight size={18} className="text-zinc-600 mb-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Data Available Section */}
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-white">No Data Available</h2>
          <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 divide-y divide-zinc-800">
             {inactiveMetrics.map(metric => (
               <div 
                 key={metric.id}
                 onClick={() => setSelectedMetric(metric.id)}
                 className="p-4 flex justify-between items-center active:bg-zinc-800 transition-colors cursor-pointer"
               >
                 <span className="font-bold text-sm text-white">{metric.label}</span>
                 <ChevronRight size={16} className="text-zinc-600" />
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
           <div className="bg-zinc-900 w-full max-w-sm rounded-[32px] p-6 border border-zinc-700 space-y-6 animate-slide-up">
              <div className="flex justify-between items-center">
                 <div>
                   <h3 className="text-xl font-black text-white">Add Data</h3>
                   <p className="text-xs text-zinc-400 font-bold">{MEASUREMENT_TYPES.find(m => m.id === selectedMetric)?.label}</p>
                 </div>
                 <button onClick={() => setShowLogModal(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-400">
                    <X size={18} />
                 </button>
              </div>

              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Value ({MEASUREMENT_TYPES.find(m => m.id === selectedMetric)?.unit})</label>
                    <input 
                      type="number" 
                      value={inputValue} 
                      onChange={e => setInputValue(e.target.value)}
                      placeholder="0.0"
                      autoFocus
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white text-3xl font-black outline-none focus:border-purple-500 placeholder:text-zinc-800"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Date</label>
                      <input type="date" value={inputDate} onChange={e => setInputDate(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-bold outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Time</label>
                      <input type="time" value={inputTime} onChange={e => setInputTime(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-bold outline-none" />
                    </div>
                 </div>
              </div>

              <button 
                 onClick={handleSave}
                 disabled={!inputValue}
                 className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
              >
                 Add to Records <Save size={18} />
              </button>
           </div>
        </div>
      )}
    </div>
  );
};
