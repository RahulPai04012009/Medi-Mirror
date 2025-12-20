
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Camera, Activity, AlertTriangle, CheckCircle, 
  ArrowLeft, Mic, Search, ChevronRight, Thermometer, Brain, 
  Wind, Info, ShieldCheck, Sparkles, Clock, MapPin, Download, Share2,
  Stethoscope, Pill, BookOpen, Navigation
} from 'lucide-react';
import { analyzeSymptoms, analyzeWound, chatWithMedi, mapSearchWithContext } from '../services/geminiService';
import { SymptomAnalysis, WoundAnalysis, ChatMessage, Place } from '../types';

// --- Shared Components ---
const LoadingOverlay: React.FC<{ text: string }> = ({ text }) => (
  <div className="fixed inset-0 bg-white/95 z-[100] flex flex-col items-center justify-center backdrop-blur-xl">
    <div className="relative mb-8">
      <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-[30px] animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Sparkles size={28} className="text-blue-500 animate-pulse" />
      </div>
    </div>
    <p className="text-slate-900 font-black text-xl mb-1 tracking-tight">{text}</p>
    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] animate-pulse">Consulting Gemini Bio-AI</p>
  </div>
);

// --- Symptom Checker ---
const SymptomChecker: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SymptomAnalysis | null>(null);
  const [showQuickSelect, setShowQuickSelect] = useState(true);
  const navigate = useNavigate();

  const commonSymptoms = [
    { label: 'Headache', icon: <Brain size={14} /> },
    { label: 'Fever', icon: <Thermometer size={14} /> },
    { label: 'Cough', icon: <Wind size={14} /> },
    { label: 'Nausea', icon: <Activity size={14} /> },
    { label: 'Fatigue', icon: <Clock size={14} /> },
  ];

  const addSymptom = (s: string) => setInput(prev => prev ? `${prev}, ${s}` : s);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const data = await analyzeSymptoms(input);
      setResult(data);
    } catch (e) {
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {loading && <LoadingOverlay text="Analyzing Vitals" />}
      
      {!result ? (
        <div className="flex-1 flex flex-col p-8 space-y-8 overflow-y-auto pb-32">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Diagnostic Lab</h2>
            <p className="text-slate-500 text-sm font-medium">Describe your symptoms to our medical AI.</p>
          </div>

          <div className="bg-white rounded-[40px] p-6 shadow-2xl shadow-blue-100/30 border border-slate-50 space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Consultation Input</span>
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl cursor-pointer hover:bg-blue-100 transition-colors">
                <Mic size={20} />
              </div>
            </div>
            
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-40 text-slate-800 bg-transparent focus:outline-none resize-none placeholder:text-slate-300 font-bold text-lg leading-relaxed"
              placeholder="e.g., I've had a recurring migraine since this morning with slight nausea..."
            />

            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-teal-500" />
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Secured • HIPAA</span>
              </div>
              <p className="text-[10px] text-slate-300 font-bold">{input.length} characters</p>
            </div>
          </div>

          {showQuickSelect && (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Common Indicators</h3>
                <button onClick={() => setShowQuickSelect(false)} className="text-[10px] font-black text-blue-600">Hide All</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {commonSymptoms.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => addSymptom(s.label)}
                    className="flex items-center gap-2.5 px-5 py-3 bg-white border border-slate-100 rounded-[20px] text-xs font-black text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all active:scale-90 shadow-sm"
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="fixed bottom-24 left-8 right-8">
            <button 
              onClick={handleAnalyze}
              disabled={loading || !input}
              className="w-full bg-slate-900 text-white py-6 rounded-[30px] font-black text-lg shadow-2xl shadow-blue-900/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
            >
              <Search size={22} />
              Start Analysis
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col p-8 space-y-8 overflow-y-auto pb-32 animate-fade-in bg-white">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setResult(null)}
              className="p-3 bg-slate-50 rounded-2xl text-slate-500 transition-all hover:bg-slate-100"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="text-center">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Patient Report</h4>
              <p className="text-xs font-bold text-slate-900">{new Date().toLocaleDateString()}</p>
            </div>
            <button className="p-3 bg-slate-50 rounded-2xl text-slate-500">
              <Share2 size={20} />
            </button>
          </div>

          {/* Clinical Banner */}
          <div className={`p-8 rounded-[40px] relative overflow-hidden ${
            result.seeDoctor 
              ? 'bg-red-50 text-red-900' 
              : 'bg-green-50 text-green-900'
          }`}>
            <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/30 rounded-full blur-2xl"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-2xl ${result.seeDoctor ? 'bg-red-100' : 'bg-green-100'}`}>
                {result.seeDoctor ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/40 px-3 py-1.5 rounded-xl">
                Priority: {result.seeDoctor ? 'High' : 'Normal'}
              </span>
            </div>
            
            <h3 className="text-2xl font-black mb-3 tracking-tighter leading-tight">
              {result.seeDoctor ? 'Consultation Required' : 'Self-Care Monitoring'}
            </h3>
            <p className="text-sm font-bold opacity-70 leading-relaxed">
              {result.recommendation}
            </p>
          </div>

          {/* Medical Insights Card */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-lg shadow-blue-50 space-y-5">
             <div className="flex items-center gap-2 mb-2">
                <BookOpen size={18} className="text-blue-500" />
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">Understanding the Condition</h4>
             </div>
             
             <div>
               <h5 className="font-bold text-slate-900 mb-1">What is it?</h5>
               <p className="text-sm text-slate-500 leading-relaxed">{result.explanation}</p>
             </div>

             <div className="pt-4 border-t border-slate-50">
               <h5 className="font-bold text-slate-900 mb-1">Recommended Treatment</h5>
               <p className="text-sm text-slate-500 leading-relaxed">{result.treatment}</p>
             </div>
          </div>

          {/* Medicines Card */}
          {result.suggestedMedicines && result.suggestedMedicines.length > 0 && (
             <div className="bg-teal-50 rounded-[32px] border border-teal-100 p-6 space-y-4">
               <div className="flex items-center gap-2 mb-2">
                  <Pill size={18} className="text-teal-600" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-teal-800">Suggested Relief (OTC)</h4>
               </div>
               <div className="flex flex-wrap gap-2">
                 {result.suggestedMedicines.map((med, i) => (
                   <span key={i} className="px-3 py-1.5 bg-white text-teal-700 font-bold text-xs rounded-lg border border-teal-100 shadow-sm">
                     {med}
                   </span>
                 ))}
               </div>
               <p className="text-[10px] text-teal-600 italic mt-2">*Please consult a pharmacist before taking any medication.</p>
             </div>
          )}

          {/* Pathology Section */}
          <div className="space-y-4">
             <div className="flex items-center justify-between px-1">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analyzed Pathologies</h4>
               <Info size={14} className="text-slate-300" />
             </div>
             <div className="space-y-4">
               {result.conditions.map((c, i) => (
                 <div key={i} className="bg-slate-50 p-6 rounded-[30px] border border-slate-100 group transition-all hover:shadow-lg hover:bg-white">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-lg font-black text-slate-900 tracking-tight">{c.name}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Confidence Level: {c.probability}</p>
                     </div>
                     <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                       c.severity === 'high' ? 'bg-red-100 text-red-600' : c.severity === 'medium' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                     }`}>
                       {c.severity}
                     </div>
                   </div>
                   <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          c.severity === 'high' ? 'bg-red-500' : c.severity === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                        }`}
                        style={{ width: c.probability }}
                      ></div>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Action Hub */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <button 
              onClick={() => navigate(`/map?q=${encodeURIComponent(result.specialistType || 'General Physician')}`)}
              className="flex items-center gap-3 p-6 bg-slate-900 text-white rounded-[32px] font-black text-xs active:scale-95 transition-all shadow-xl"
            >
              <MapPin size={18} className="text-blue-400" /> 
              <span>Find {result.specialistType || 'Doctors'}</span>
            </button>
            <button 
              onClick={() => navigate('/doctors')}
              className="flex items-center gap-3 p-6 bg-blue-50 text-blue-700 rounded-[32px] font-black text-xs active:scale-95 transition-all"
            >
              <Clock size={18} /> Book Visit
            </button>
          </div>

          <button 
            className="w-full py-6 flex items-center justify-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest"
          >
            <Download size={14} /> Export Medical PDF
          </button>
        </div>
      )}
    </div>
  );
};

// --- Wound Scanner ---
const WoundScanner: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WoundAnalysis | null>(null);
  const [nearbyDoctors, setNearbyDoctors] = useState<Place[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocation({ lat: 37.7749, lng: -122.4194 })
      );
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        analyze(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyze = async (base64: string) => {
    setLoading(true);
    try {
      // 1. Get AI Analysis
      const data = await analyzeWound(base64);
      setResult(data);

      // 2. Fetch Nearby Specialists immediately if possible
      if (data.specialistType && location) {
        // We use mapSearchWithContext to get real places
        try {
           const searchRes = await mapSearchWithContext(data.specialistType, 'hospital', location);
           // Take top 3 closest
           setNearbyDoctors(searchRes.places.slice(0, 3));
        } catch (err) {
           console.error("Failed to auto-fetch doctors", err);
        }
      }
    } catch (e) {
      alert("Could not analyze image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col relative bg-white">
      {loading && <LoadingOverlay text="Vision AI Scanning" />}
      
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Vision Scanner</h2>
        <p className="text-slate-400 font-medium text-sm">Upload a photo for instant tissue analysis.</p>
      </div>

      {!image ? (
        <div className="flex-1 flex flex-col justify-center items-center">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-80 border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center bg-slate-50 text-slate-400 hover:bg-slate-100 hover:border-blue-400 transition-all cursor-pointer group"
          >
            <div className="p-6 bg-white rounded-full shadow-lg mb-6 group-hover:scale-110 transition-transform">
              <Camera size={48} className="text-blue-600" />
            </div>
            <p className="font-black text-slate-800 tracking-tight">Capture or Upload</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-2">Maximum 5MB JPG/PNG</p>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      ) : (
        <div className="space-y-6 overflow-y-auto pb-32">
          <div className="relative rounded-[40px] overflow-hidden shadow-2xl h-80 bg-black border-4 border-white">
            <img src={image} alt="Wound" className="w-full h-full object-cover" />
            <button 
              onClick={() => { setImage(null); setResult(null); setNearbyDoctors([]); }}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-3 rounded-2xl hover:bg-white/40 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          </div>

          {result && (
            <div className="space-y-6 animate-fade-in">
              {/* Diagnosis Header */}
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">{result.conditionName || "Analysis Complete"}</h3>
                <div className="flex items-center gap-2">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                     result.severity === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 
                     result.severity === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                     'bg-green-50 text-green-600 border-green-100'
                   }`}>
                     Severity: {result.severity}
                   </span>
                   <span className="text-xs text-slate-400 font-medium">Confidence: {result.infectionProbability}</span>
                </div>
              </div>

              {/* Description & Advice */}
              <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-4">
                 <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Description</h4>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">{result.description}</p>
                 </div>
                 <div className="pt-4 border-t border-slate-200">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Clinical Advice</h4>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">{result.advice}</p>
                 </div>
              </div>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tissue Redness</p>
                   <p className={`text-lg font-black ${result.rednessLevel === 'High' ? 'text-red-500' : 'text-slate-800'}`}>{result.rednessLevel}</p>
                </div>
                <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Healing Stage</p>
                   <p className="text-lg font-black text-slate-800">{result.healingStage}</p>
                </div>
              </div>
              
              {/* Urgent Care Button if needed */}
              {result.urgentCareNeeded && (
                <button className="w-full bg-red-600 text-white py-5 rounded-[28px] font-black flex items-center justify-center gap-3 animate-pulse shadow-2xl shadow-red-200">
                   <AlertTriangle size={24} /> Locate Urgent Care
                </button>
              )}

              {/* Nearest Specialists List */}
              <div className="space-y-4">
                 <div className="flex items-center justify-between px-1">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     Nearest {result.specialistType}s
                   </h4>
                   <button 
                    onClick={() => navigate(`/map?q=${encodeURIComponent(result.specialistType || 'Hospital')}`)}
                    className="text-[10px] font-black text-blue-600 uppercase tracking-widest"
                   >
                     View Map
                   </button>
                 </div>
                 
                 {nearbyDoctors.length > 0 ? (
                   <div className="space-y-3">
                     {nearbyDoctors.map((doc, i) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                          <div className="flex items-center gap-3">
                             <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Stethoscope size={18} /></div>
                             <div className="min-w-0 max-w-[150px]">
                               <p className="text-xs font-bold text-slate-800 truncate">{doc.name}</p>
                               <p className="text-[10px] text-slate-400 truncate">{doc.address || "Nearby"}</p>
                             </div>
                          </div>
                          <a 
                            href={doc.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-slate-900 text-white rounded-xl active:scale-95 transition-transform"
                          >
                            <Navigation size={16} />
                          </a>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-xs text-slate-400 font-medium">Searching nearby specialists...</p>
                   </div>
                 )}
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- Chat Assistant ---
export const Chat: React.FC = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', role: 'ai', text: 'Hi! I\'m Medi. Ask me anything about your health.', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        const history = messages.map(m => ({
            role: m.role === 'ai' ? 'model' : 'user',
            parts: [{ text: m.text }]
        }));

        try {
            const replyText = await chatWithMedi(history, userMsg.text);
            const aiMsg: ChatMessage = { 
                id: (Date.now() + 1).toString(), 
                role: 'ai', 
                text: replyText || "I'm having trouble connecting right now.", 
                timestamp: new Date() 
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: "Sorry, I can't answer that right now.", timestamp: new Date() }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            <div className="bg-white/80 backdrop-blur-xl p-5 border-b border-slate-50 flex items-center gap-4 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="p-3 bg-slate-50 rounded-2xl text-slate-500"><ArrowLeft /></button>
                <div className="flex-1">
                    <h2 className="font-black text-slate-900 tracking-tight">Medi AI</h2>
                    <p className="text-[10px] font-bold text-green-500 flex items-center gap-1 uppercase tracking-widest">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Encrypted Session
                    </p>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map(m => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-5 rounded-[28px] text-sm font-bold leading-relaxed ${
                            m.role === 'user' 
                            ? 'bg-slate-900 text-white rounded-br-none shadow-xl' 
                            : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-bl-none'
                        }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-slate-50 p-5 rounded-[28px] rounded-bl-none border border-slate-100 flex gap-1.5">
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></span>
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div className="p-6 bg-white border-t border-slate-50">
                <div className="flex items-center gap-3 bg-slate-50 rounded-[28px] p-2 pl-6">
                    <input 
                        className="flex-1 bg-transparent border-none focus:outline-none text-slate-800 font-bold placeholder:text-slate-300"
                        placeholder="Ask anything..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                    />
                    <button onClick={handleSend} className="w-12 h-12 bg-slate-900 rounded-2xl text-white shadow-xl flex items-center justify-center hover:bg-slate-800 transition-colors">
                        <Search size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ToolWrapper: React.FC = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'symptom';

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-8 pt-8 pb-4">
        <div className="flex p-1.5 bg-slate-100 rounded-[24px]">
          <a href="?mode=symptom" className={`flex-1 py-4 text-center font-black text-[10px] uppercase tracking-widest rounded-[20px] transition-all ${mode === 'symptom' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Diagnostic</a>
          <a href="?mode=wound" className={`flex-1 py-4 text-center font-black text-[10px] uppercase tracking-widest rounded-[20px] transition-all ${mode === 'wound' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>Scanning</a>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {mode === 'symptom' ? <SymptomChecker /> : <WoundScanner />}
      </div>
    </div>
  );
};
