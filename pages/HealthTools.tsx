import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Camera, Upload, Send, Activity, AlertTriangle, CheckCircle, ArrowLeft, Mic } from 'lucide-react';
import { analyzeSymptoms, analyzeWound, chatWithMedi } from '../services/geminiService';
import { SymptomAnalysis, WoundAnalysis, ChatMessage } from '../types';

// --- Shared Components ---
const LoadingOverlay: React.FC<{ text: string }> = ({ text }) => (
  <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
    <p className="text-slate-600 font-medium animate-pulse">{text}</p>
  </div>
);

// --- Symptom Checker ---
const SymptomChecker: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SymptomAnalysis | null>(null);

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
    <div className="p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Symptom Checker</h2>
      
      {!result ? (
        <div className="flex-1 flex flex-col">
          <label className="text-sm font-medium text-slate-500 mb-2">Describe your symptoms</label>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-40 p-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none mb-6"
            placeholder="e.g., I have a throbbing headache and sensitivity to light..."
          />
          <div className="flex gap-4 items-center mb-8">
            <button className="p-3 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"><Mic size={20}/></button>
            <span className="text-xs text-slate-400">Voice input available</span>
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={loading || !input}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze Symptoms'}
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className={`p-4 rounded-xl border ${result.seeDoctor ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
            <h3 className={`font-bold text-lg mb-1 ${result.seeDoctor ? 'text-red-700' : 'text-green-700'}`}>
              {result.seeDoctor ? 'Doctor Consultation Recommended' : 'Self-Care likely sufficient'}
            </h3>
            <p className="text-sm opacity-80">{result.recommendation}</p>
          </div>

          <div>
             <h4 className="font-semibold text-slate-700 mb-3">Potential Causes</h4>
             <div className="space-y-3">
               {result.conditions.map((c, i) => (
                 <div key={i} className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                   <div>
                     <p className="font-medium text-slate-800">{c.name}</p>
                     <p className="text-xs text-slate-500">{c.probability} Probability</p>
                   </div>
                   <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                     c.severity === 'high' ? 'bg-red-100 text-red-600' : c.severity === 'medium' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                   }`}>{c.severity}</span>
                 </div>
               ))}
             </div>
          </div>
          <button onClick={() => setResult(null)} className="w-full py-3 text-slate-500 font-medium">Check Another</button>
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
      const data = await analyzeWound(base64);
      setResult(data);
    } catch (e) {
      alert("Could not analyze image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col relative">
      {loading && <LoadingOverlay text="Analyzing Wound..." />}
      
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Wound Scanner</h2>

      {!image ? (
        <div className="flex-1 flex flex-col justify-center items-center space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-64 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center bg-slate-50 text-slate-400 hover:bg-slate-100 hover:border-blue-400 transition-colors cursor-pointer"
          >
            <Camera size={48} className="mb-2" />
            <p>Tap to take photo or upload</p>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative rounded-2xl overflow-hidden shadow-lg h-64 bg-black">
            <img src={image} alt="Wound" className="w-full h-full object-contain" />
            <button 
              onClick={() => { setImage(null); setResult(null); }}
              className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full"
            >
              <ArrowLeft size={20} />
            </button>
          </div>

          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                   <p className="text-xs text-slate-500 mb-1">Redness</p>
                   <p className={`font-bold ${result.rednessLevel === 'High' ? 'text-red-500' : 'text-slate-800'}`}>{result.rednessLevel}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                   <p className="text-xs text-slate-500 mb-1">Infection Risk</p>
                   <p className="font-bold text-slate-800">{result.infectionProbability}</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-2 text-blue-700 font-semibold">
                  <Activity size={18} /> Analysis
                </div>
                <p className="text-sm text-slate-700">{result.advice}</p>
              </div>

              {result.urgentCareNeeded && (
                <button className="w-full bg-red-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 animate-pulse">
                   <AlertTriangle size={20} /> Find Urgent Care
                </button>
              )}
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

        // Format history for Gemini
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
        <div className="flex flex-col h-screen bg-slate-50 pb-20">
            <div className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="p-2 text-slate-500"><ArrowLeft /></button>
                <div className="flex-1">
                    <h2 className="font-bold text-slate-800">Medi Assistant</h2>
                    <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Online</p>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(m => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                            m.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-bl-none'
                        }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2">
                    <input 
                        className="flex-1 bg-transparent border-none focus:outline-none text-slate-800"
                        placeholder="Type a message..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                    />
                    <button onClick={handleSend} className="p-2 bg-blue-600 rounded-full text-white shadow-md hover:bg-blue-700 transition-colors">
                        <Send size={16} />
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
    <div className="h-full bg-slate-50">
      <div className="flex border-b border-slate-200 bg-white">
        <a href="?mode=symptom" className={`flex-1 py-4 text-center font-medium text-sm ${mode === 'symptom' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>Symptom Checker</a>
        <a href="?mode=wound" className={`flex-1 py-4 text-center font-medium text-sm ${mode === 'wound' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>Wound Scanner</a>
      </div>
      <div className="h-[calc(100vh-140px)]">
        {mode === 'symptom' ? <SymptomChecker /> : <WoundScanner />}
      </div>
    </div>
  );
};