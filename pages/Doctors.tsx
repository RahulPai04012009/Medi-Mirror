import React, { useState } from 'react';
import { Star, MapPin, Calendar, Clock, Video, Phone, Mic, FileText, Search, Filter, ArrowLeft, MoreVertical, X, Download } from 'lucide-react';
import { Doctor, Visit } from '../types';

const MOCK_DOCTORS: Doctor[] = [
  { id: '1', name: 'Dr. Sarah Wilson', specialty: 'Cardiologist', experience: '12 Years', hospital: 'City Heart Center', image: 'https://picsum.photos/id/1011/100/100', available: true, rating: 4.9 },
  { id: '2', name: 'Dr. Emily Chen', specialty: 'Dermatologist', experience: '8 Years', hospital: 'Skin Care Clinic', image: 'https://picsum.photos/id/1027/100/100', available: true, rating: 4.8 },
  { id: '3', name: 'Dr. James Carter', specialty: 'Pediatrician', experience: '15 Years', hospital: 'Childrens Wellness', image: 'https://picsum.photos/id/338/100/100', available: false, rating: 5.0 },
];

const MOCK_REPORTS = [
  { id: 'rep1', title: 'Cardiology Summary', date: 'Oct 12, 2023', doc: 'Dr. Sarah Wilson', type: 'PDF' },
  { id: 'rep2', title: 'Derm-Scan Results', date: 'Oct 05, 2023', doc: 'Dr. Emily Chen', type: 'JPG' },
];

export const Doctors: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [activeCall, setActiveCall] = useState<'audio' | 'video' | null>(null);
  const [activeTab, setActiveTab] = useState<'find' | 'history'>('find');

  const handleCall = (type: 'audio' | 'video') => {
    setActiveCall(type);
    setTimeout(() => {
      alert(`Simulating ${type} call with ${selectedDoctor?.name}. In a real app, this would use the Gemini Live API or a WebRTC service.`);
      setActiveCall(null);
    }, 3000);
  };

  if (activeCall) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col items-center justify-center p-6 text-white overflow-hidden">
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 animate-pulse">
            <img src={selectedDoctor?.image} alt="Doctor" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
            {activeCall === 'video' ? 'Video Live' : 'Voice Live'}
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-1">{selectedDoctor?.name}</h2>
        <p className="text-slate-400 text-sm mb-12">Connecting to secure server...</p>
        
        <div className="grid grid-cols-3 gap-8 mb-12">
          <button className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors">
            <Mic size={24} />
          </button>
          <button onClick={() => setActiveCall(null)} className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg shadow-red-500/40">
            <X size={24} />
          </button>
          <button className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors">
            {activeCall === 'video' ? <Video size={24} /> : <Phone size={24} />}
          </button>
        </div>
        
        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em]">Encrypted Session • Medi-Mirror</p>
      </div>
    );
  }

  if (selectedDoctor) {
    return (
      <div className="p-0 min-h-screen bg-white">
        {/* Header */}
        <div className="relative h-64">
           <img src={selectedDoctor.image} className="w-full h-full object-cover" alt={selectedDoctor.name} />
           <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
           <button onClick={() => setSelectedDoctor(null)} className="absolute top-6 left-6 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-slate-800 shadow-sm">
             <ArrowLeft size={20} />
           </button>
           <button className="absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-slate-800 shadow-sm">
             <MoreVertical size={20} />
           </button>
        </div>
        
        <div className="px-6 -mt-12 relative z-10">
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedDoctor.name}</h2>
                <p className="text-blue-600 font-semibold">{selectedDoctor.specialty}</p>
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-orange-500 bg-orange-50 px-3 py-1.5 rounded-xl">
                <Star size={14} fill="currentColor" /> {selectedDoctor.rating}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
              <MapPin size={16} /> {selectedDoctor.hospital}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleCall('audio')}
                className="flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-2xl font-bold text-sm transition-all active:scale-95"
              >
                <Phone size={18} /> Audio Call
              </button>
              <button 
                onClick={() => handleCall('video')}
                className="flex items-center justify-center gap-2 py-3 bg-teal-50 text-teal-600 rounded-2xl font-bold text-sm transition-all active:scale-95"
              >
                <Video size={18} /> Video Call
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div>
               <h3 className="font-bold text-slate-800 mb-3">Professional Stats</h3>
               <div className="grid grid-cols-3 gap-4">
                 <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                   <p className="text-lg font-bold text-slate-800">500+</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Patients</p>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                   <p className="text-lg font-bold text-slate-800">{selectedDoctor.experience}</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Exp.</p>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                   <p className="text-lg font-bold text-slate-800">4.9</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rating</p>
                 </div>
               </div>
            </div>

            <div>
               <h3 className="font-bold text-slate-800 mb-2">About Doctor</h3>
               <p className="text-slate-500 text-sm leading-relaxed">
                 Dr. Wilson is a leading specialist in cardiac health with a focus on preventative care and patient education.
               </p>
            </div>

            {/* Integrated Reports from this Doctor */}
            <div>
               <h3 className="font-bold text-slate-800 mb-3">Reports from {selectedDoctor.name.split(' ')[1]}</h3>
               <div className="space-y-3">
                 {MOCK_REPORTS.filter(r => r.doc === selectedDoctor.name).map(report => (
                   <div key={report.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FileText size={18} /></div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{report.title}</p>
                          <p className="text-[10px] text-slate-400">{report.date}</p>
                        </div>
                     </div>
                     <button className="text-blue-600"><Download size={18} /></button>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-24 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
          <button 
            onClick={() => setIsBooking(true)} 
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-2xl pointer-events-auto active:scale-[0.98] transition-all"
          >
            Schedule Consultation
          </button>
        </div>

        {/* Booking Modal Overlay */}
        {isBooking && (
          <div className="fixed inset-0 bg-black/60 z-[110] flex items-end justify-center p-0">
             <div className="w-full max-w-md bg-white rounded-t-[40px] p-8 animate-slide-up">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-slate-800">Book Appointment</h3>
                 <button onClick={() => setIsBooking(false)} className="p-2 bg-slate-100 rounded-full"><X size={20} /></button>
               </div>
               
               <p className="text-sm text-slate-400 mb-6">Choose your preferred date and time for a session with {selectedDoctor.name}.</p>
               
               <div className="flex gap-3 overflow-x-auto no-scrollbar mb-6">
                 {[12, 13, 14, 15, 16].map(d => (
                   <button key={d} className={`min-w-[64px] h-[80px] rounded-2xl flex flex-col items-center justify-center border transition-all ${d === 13 ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                     <span className="text-[10px] font-bold uppercase mb-1">Oct</span>
                     <span className="text-xl font-black">{d}</span>
                   </button>
                 ))}
               </div>

               <div className="grid grid-cols-3 gap-3 mb-8">
                 {['09:00 AM', '10:30 AM', '01:00 PM', '03:00 PM', '04:30 PM'].map((t, i) => (
                   <button key={t} className={`py-3 rounded-xl text-xs font-bold border transition-all ${i === 2 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-100 text-slate-500'}`}>{t}</button>
                 ))}
               </div>

               <button 
                onClick={() => { alert('Consultation Confirmed!'); setIsBooking(false); setSelectedDoctor(null); }} 
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-200"
               >
                 Confirm Booking
               </button>
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-screen">
      {/* Search Header */}
      <div className="bg-white px-6 pt-6 pb-4 sticky top-0 z-10 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Doctor Hub</h2>
        
        <div className="relative group mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search symptoms, specialists..." 
            className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm outline-none"
          />
        </div>

        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button 
            onClick={() => setActiveTab('find')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'find' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
          >
            Find Specialists
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
          >
            My History & Reports
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        {activeTab === 'find' ? (
          <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics'].map((cat, i) => (
                <button key={cat} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${i === 0 ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-100'}`}>
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {MOCK_DOCTORS.map(doc => (
                <div key={doc.id} onClick={() => setSelectedDoctor(doc)} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 transition-all hover:shadow-md active:scale-[0.98] cursor-pointer">
                   <div className="relative shrink-0">
                     <img src={doc.image} alt={doc.name} className="w-20 h-20 rounded-2xl object-cover" />
                     {doc.available && <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />}
                   </div>
                   <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-800 text-sm truncate">{doc.name}</h3>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-lg">
                          <Star size={10} fill="currentColor" /> {doc.rating}
                        </div>
                     </div>
                     <p className="text-blue-600 text-[10px] font-bold uppercase tracking-wider">{doc.specialty}</p>
                     <p className="text-slate-400 text-xs mt-1 truncate">{doc.hospital}</p>
                     <div className="mt-3 flex gap-2">
                        <button className="flex-1 bg-blue-50 text-blue-600 text-[10px] font-bold py-2 rounded-lg hover:bg-blue-100 transition-colors">Book</button>
                        <button className="flex-1 bg-slate-900 text-white text-[10px] font-bold py-2 rounded-lg hover:bg-slate-800 transition-colors">Details</button>
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <section>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest mb-4 opacity-50">Recent Consultations</h3>
              <div className="space-y-3">
                {MOCK_DOCTORS.slice(0, 2).map((doc, idx) => (
                  <div key={doc.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={doc.image} className="w-10 h-10 rounded-full object-cover" alt="Doc" />
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs">{doc.name}</h4>
                        <p className="text-[10px] text-slate-400">{idx === 0 ? 'Oct 12' : 'Oct 05'} • {idx === 0 ? 'Video Call' : 'In-Person'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Phone size={14} /></button>
                       <button className="p-2 bg-teal-50 text-teal-600 rounded-lg"><Video size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest mb-4 opacity-50">Latest Reports</h3>
              <div className="space-y-3">
                {MOCK_REPORTS.map(report => (
                  <div key={report.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs">{report.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium uppercase">{report.date} • {report.doc}</p>
                      </div>
                    </div>
                    <button className="text-slate-300 group-hover:text-blue-600 transition-colors">
                      <Download size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
