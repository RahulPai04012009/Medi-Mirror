
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Plus, ChevronRight, X, Save, 
  Sparkles, Footprints, Wind, Moon, Brain,
  Activity, Smartphone, Move, LayoutGrid, BookOpen
} from 'lucide-react';
import { getHealthInsight } from '../services/geminiService';
import { HealthChart } from '../components/HealthChart';

// --- Configuration Types ---

interface MetricConfig {
  id: string;
  label: string;
  unit: string;
  description?: string;
}

interface Article {
  title: string;
  image: string;
  content?: string;
}

interface PageConfig {
  title: string;
  colorClass: string; // Tailwind text color class, e.g. "text-orange-500"
  bgClass: string;    // Tailwind bg color class, e.g. "bg-orange-500/10"
  icon: React.ElementType;
  metrics: MetricConfig[];
  articles?: Article[];
}

// --- Data Store ---

const useHealthData = (categoryKey: string) => {
  const [logs, setLogs] = useState<any[]>(() => {
    const saved = localStorage.getItem(`medimirror_${categoryKey}_logs`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(`medimirror_${categoryKey}_logs`, JSON.stringify(logs));
  }, [logs, categoryKey]);

  const addLog = (metricId: string, value: string, date: string, time: string) => {
    const newLog = {
      id: Date.now().toString(),
      metricId,
      value,
      date,
      time
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const getLatestLog = (metricId: string) => {
    const metricLogs = logs.filter(l => l.metricId === metricId);
    if (metricLogs.length === 0) return null;
    return metricLogs.reduce((prev, current) => (prev.date > current.date) ? prev : current);
  };

  return { logs, addLog, getLatestLog };
};

// --- Generic Component ---

const HealthCategoryPage: React.FC<{ config: PageConfig; categoryKey: string }> = ({ config, categoryKey }) => {
  const navigate = useNavigate();
  const { logs, addLog, getLatestLog } = useHealthData(categoryKey);
  
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [viewingArticle, setViewingArticle] = useState<Article | null>(null);

  const [inputValue, setInputValue] = useState('');
  const [inputDate, setInputDate] = useState(new Date().toISOString().split('T')[0]);
  const [inputTime, setInputTime] = useState(new Date().toTimeString().slice(0, 5));
  
  // AI Insight State
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Derived State
  const activeMetrics = config.metrics.filter(m => getLatestLog(m.id) !== null);
  const inactiveMetrics = config.metrics.filter(m => getLatestLog(m.id) === null);
  const currentMetricDef = config.metrics.find(m => m.id === selectedMetric);

  // Generate Insight when entering detail view
  useEffect(() => {
    if (selectedMetric && currentMetricDef) {
      const latest = getLatestLog(selectedMetric);
      if (latest) {
        setLoadingInsight(true);
        getHealthInsight(currentMetricDef.label, latest.value, currentMetricDef.unit)
          .then(setAiInsight)
          .finally(() => setLoadingInsight(false));
      } else {
        setAiInsight(`Start tracking ${currentMetricDef.label} to get AI-powered health insights.`);
      }
    }
  }, [selectedMetric, logs]); 

  const handleSave = () => {
    if (!selectedMetric || !inputValue) return;
    addLog(selectedMetric, inputValue, inputDate, inputTime);
    setShowLogModal(false);
    setInputValue('');
  };

  const getChartData = () => {
     if(!selectedMetric) return [];
     return logs
       .filter(l => l.metricId === selectedMetric)
       .map(l => ({
           date: l.date,
           value: parseFloat(l.value) || 0
       }));
  };

  // Extract base color class for chart bars (e.g. "text-orange-500" -> "bg-orange-500")
  const barColorClass = config.colorClass.replace('text-', 'bg-');

  // --- Detail View ---
  if (selectedMetric && !showLogModal) {
    const metricLogs = logs.filter(l => l.metricId === selectedMetric).sort((a: any, b: any) => b.date.localeCompare(a.date));
    const latest = metricLogs[0];

    return (
      <div className="min-h-screen bg-black text-white pb-10 animate-slide-up">
        {/* Detail Header */}
        <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-zinc-800 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <button onClick={() => setSelectedMetric(null)} className={`flex items-center gap-1 font-medium ${config.colorClass}`}>
              <ArrowLeft size={20} /> <span className="text-sm">{config.title}</span>
            </button>
            <h1 className="font-bold text-sm truncate">{currentMetricDef?.label}</h1>
            <button onClick={() => setShowLogModal(true)} className={config.colorClass}>
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
                 <span className="text-xl text-zinc-500 font-bold">{currentMetricDef?.unit}</span>
               </div>
               <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                 {new Date(latest.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
               </p>
             </div>
          ) : (
            <div className="py-10 text-center text-zinc-500">
               <p className="text-sm">No Data Available</p>
               <button onClick={() => setShowLogModal(true)} className={`mt-4 font-bold text-sm ${config.colorClass}`}>Add Data Source</button>
            </div>
          )}

          {/* New Chart Component */}
          {latest && (
             <HealthChart 
               data={getChartData()} 
               barColor={barColorClass}
               textColor={config.colorClass} 
               unit={currentMetricDef?.unit || ''} 
               aggregationType="average" 
             />
          )}

          {/* AI Insight Card */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-5 border border-zinc-800 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-20"><Sparkles size={40} className="text-white" /></div>
             <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><Sparkles size={14} className={config.colorClass} /> AI Analysis</h3>
             <p className="text-sm text-zinc-400 leading-relaxed">
               {loadingInsight ? "Analyzing your data..." : aiInsight}
             </p>
          </div>

          {/* History List */}
          <div>
            <h3 className="text-lg font-bold mb-3">All Data</h3>
            <div className="bg-zinc-900 rounded-xl overflow-hidden divide-y divide-zinc-800 border border-zinc-800">
              {metricLogs.map((log: any) => (
                <div key={log.id} className="p-4 flex justify-between items-center">
                   <div>
                     <p className="text-sm font-bold text-white">{log.value} <span className="text-xs font-normal text-zinc-500">{currentMetricDef?.unit}</span></p>
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
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-zinc-800 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/records')} className={`flex items-center gap-1 font-medium ${config.colorClass}`}>
            <ArrowLeft size={20} /> <span className="text-sm">Browse</span>
          </button>
          <div className={`w-8 h-8 rounded-full ${config.bgClass} flex items-center justify-center`}>
             <config.icon size={16} className={config.colorClass} />
          </div>
        </div>
        <div className="px-4 pb-3">
           <h1 className="text-3xl font-black tracking-tight text-white">{config.title}</h1>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-8">
        
        {activeMetrics.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">Recent</h2>
            <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 divide-y divide-zinc-800">
              {activeMetrics.map(metric => {
                const latest = getLatestLog(metric.id);
                return (
                  <div 
                    key={metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                    className="p-4 active:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-center mb-1">
                       <span className={`font-bold text-sm ${config.colorClass}`}>{metric.label}</span>
                       <span className="text-xs text-zinc-500 font-medium">
                         {new Date(latest.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
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

        {/* Articles / Get More Section */}
        {config.articles && (
          <div className="space-y-4">
             <h2 className="text-lg font-bold text-white">Get More From Health</h2>
             <div className="grid grid-cols-2 gap-4">
               {config.articles.map((article, i) => (
                 <button 
                    key={i} 
                    onClick={() => setViewingArticle(article)}
                    className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 text-left group active:scale-95 transition-transform"
                 >
                    <div className="h-24 bg-zinc-800 relative">
                       <img src={article.image} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                    </div>
                    <div className="p-4">
                       <h3 className="font-bold text-sm leading-tight text-white mb-2">{article.title}</h3>
                       <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
                         Read Article <ChevronRight size={10} />
                       </p>
                    </div>
                 </button>
               ))}
             </div>
          </div>
        )}
      </div>

      {/* Article Viewer Modal */}
      {viewingArticle && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-zinc-900 w-full max-w-md rounded-[32px] overflow-hidden border border-zinc-800 animate-slide-up flex flex-col max-h-[85vh]">
            <div className="relative h-60 shrink-0">
              <img src={viewingArticle.image} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
              <button 
                onClick={() => setViewingArticle(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                 <div className="flex items-center gap-2 mb-2">
                   <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-black/50 backdrop-blur-md ${config.colorClass} border border-white/10`}>
                      {config.title} Guide
                   </span>
                 </div>
                 <h2 className="text-2xl font-black text-white leading-tight shadow-black drop-shadow-lg">{viewingArticle.title}</h2>
              </div>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="prose prose-invert prose-sm">
                <p className="text-zinc-300 leading-relaxed text-sm">
                  {viewingArticle.content || "This topic is essential for maintaining a balanced and healthy lifestyle. Understanding the fundamentals can help you make better decisions about your daily routine and long-term health goals."}
                </p>
                <p className="text-zinc-300 leading-relaxed text-sm mt-4">
                  Regular monitoring and small lifestyle adjustments can lead to significant improvements over time. Consult with a healthcare professional for personalized advice tailored to your specific needs.
                </p>
                
                <div className="mt-8 p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-start gap-3">
                   <BookOpen size={20} className={config.colorClass} />
                   <div>
                      <h4 className="font-bold text-white text-sm mb-1">Did you know?</h4>
                      <p className="text-xs text-zinc-400">Consistent tracking of this metric is linked to better health outcomes in 85% of patients.</p>
                   </div>
                </div>
              </div>
              
              <button 
                onClick={() => setViewingArticle(null)}
                className={`w-full mt-8 py-4 rounded-2xl font-black text-sm ${config.bgClass.replace('/10', '')} text-white active:scale-95 transition-transform`}
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
           <div className="bg-zinc-900 w-full max-w-sm rounded-[32px] p-6 border border-zinc-700 space-y-6 animate-slide-up">
              <div className="flex justify-between items-center">
                 <div>
                   <h3 className="text-xl font-black text-white">Log Data</h3>
                   <p className="text-xs text-zinc-400 font-bold">{currentMetricDef?.label}</p>
                 </div>
                 <button onClick={() => setShowLogModal(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-400">
                    <X size={18} />
                 </button>
              </div>

              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Value ({currentMetricDef?.unit})</label>
                    <input 
                      type={currentMetricDef?.id === 'state_of_mind' ? "text" : "number"}
                      value={inputValue} 
                      onChange={e => setInputValue(e.target.value)}
                      placeholder={currentMetricDef?.id === 'state_of_mind' ? "Happy, Anxious..." : "0.0"}
                      autoFocus
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white text-3xl font-black outline-none focus:border-white placeholder:text-zinc-800"
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
                 className={`w-full text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale ${config.bgClass.replace('/10', '')}`}
              >
                 Add to Records <Save size={18} />
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

// --- Page Exports ---

// Mobility
const MOBILITY_CONFIG: PageConfig = {
  title: "Mobility",
  colorClass: "text-amber-500",
  bgClass: "bg-amber-500/10",
  icon: Move,
  metrics: [
    { id: 'walking_speed', label: 'Walking Speed', unit: 'mph' },
    { id: 'step_length', label: 'Step Length', unit: 'in' },
    { id: 'walking_asymmetry', label: 'Walking Asymmetry', unit: '%' },
    { id: 'double_support_time', label: 'Double Support Time', unit: '%' },
  ]
};

export const MobilityPage: React.FC = () => <HealthCategoryPage config={MOBILITY_CONFIG} categoryKey="mobility" />;

// Respiratory
const RESPIRATORY_CONFIG: PageConfig = {
  title: "Respiratory",
  colorClass: "text-sky-500",
  bgClass: "bg-sky-500/10",
  icon: Wind,
  metrics: [
    { id: 'blood_oxygen', label: 'Blood Oxygen', unit: '%' },
    { id: 'respiratory_rate', label: 'Respiratory Rate', unit: 'br/min' },
    { id: 'pef', label: 'Peak Expiratory Flow', unit: 'L/min' },
  ]
};

export const RespiratoryPage: React.FC = () => <HealthCategoryPage config={RESPIRATORY_CONFIG} categoryKey="respiratory" />;

// Sleep
const SLEEP_CONFIG: PageConfig = {
  title: "Sleep",
  colorClass: "text-indigo-500",
  bgClass: "bg-indigo-500/10",
  icon: Moon,
  metrics: [
    { id: 'time_in_bed', label: 'Time in Bed', unit: 'hr' },
    { id: 'time_asleep', label: 'Time Asleep', unit: 'hr' },
    { id: 'deep_sleep', label: 'Deep Sleep', unit: 'hr' },
  ],
  articles: [
    { 
      title: "Why Sleep Stages Matter", 
      image: "https://images.unsplash.com/photo-1511295742362-92c96b535cb0?auto=format&fit=crop&q=80&w=300&h=200",
      content: "Sleep occurs in cycles that range from light sleep to deep sleep and REM sleep. Deep sleep is crucial for physical restoration, while REM sleep supports cognitive functions like memory and learning. Understanding your sleep architecture can help you optimize your rest."
    }
  ]
};

export const SleepPage: React.FC = () => <HealthCategoryPage config={SLEEP_CONFIG} categoryKey="sleep" />;

// Vitals
const VITALS_CONFIG: PageConfig = {
  title: "Vitals",
  colorClass: "text-rose-500",
  bgClass: "bg-rose-500/10",
  icon: Activity,
  metrics: [
    { id: 'heart_rate', label: 'Heart Rate', unit: 'bpm' },
    { id: 'blood_pressure', label: 'Blood Pressure', unit: 'mmHg' },
    { id: 'body_temperature', label: 'Body Temperature', unit: '°F' },
    { id: 'blood_glucose', label: 'Blood Glucose', unit: 'mg/dL' },
  ]
};

export const VitalsPage: React.FC = () => <HealthCategoryPage config={VITALS_CONFIG} categoryKey="vitals" />;

// Mental Wellbeing
const MENTAL_CONFIG: PageConfig = {
  title: "Mental Wellbeing",
  colorClass: "text-teal-500",
  bgClass: "bg-teal-500/10",
  icon: Brain,
  metrics: [
    { id: 'state_of_mind', label: 'State of Mind', unit: 'Mood' },
    { id: 'mindful_minutes', label: 'Mindful Minutes', unit: 'min' },
    { id: 'time_in_daylight', label: 'Time in Daylight', unit: 'min' },
  ],
  articles: [
    { 
      title: "Benefits of Mindfulness", 
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=300&h=200",
      content: "Mindfulness is the practice of purposely bringing one's attention in the present moment without judgment. Studies suggest that mindfulness practices can help reduce stress, lower blood pressure, improve sleep, and may even help treat anxiety and depression."
    }
  ]
};

export const MentalWellbeingPage: React.FC = () => <HealthCategoryPage config={MENTAL_CONFIG} categoryKey="mental" />;

// Other Data
const OTHER_CONFIG: PageConfig = {
  title: "Other Data",
  colorClass: "text-blue-500",
  bgClass: "bg-blue-500/10",
  icon: LayoutGrid,
  metrics: [
    { id: 'uv_index', label: 'UV Index', unit: 'index' },
    { id: 'water_temp', label: 'Water Temperature', unit: '°F' },
    { id: 'handwashing', label: 'Handwashing', unit: 'sec' },
  ]
};

export const OtherDataPage: React.FC = () => <HealthCategoryPage config={OTHER_CONFIG} categoryKey="other" />;
