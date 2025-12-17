import React, { useState } from 'react';
import { Star, MapPin, Calendar, Clock, Video, Phone } from 'lucide-react';
import { Doctor } from '../types';

const MOCK_DOCTORS: Doctor[] = [
  { id: '1', name: 'Dr. Sarah Wilson', specialty: 'Cardiologist', experience: '12 Years', hospital: 'City Heart Center', image: 'https://picsum.photos/id/1011/100/100', available: true, rating: 4.9 },
  { id: '2', name: 'Dr. Emily Chen', specialty: 'Dermatologist', experience: '8 Years', hospital: 'Skin Care Clinic', image: 'https://picsum.photos/id/1027/100/100', available: true, rating: 4.8 },
  { id: '3', name: 'Dr. James Carter', specialty: 'Pediatrician', experience: '15 Years', hospital: 'Childrens Wellness', image: 'https://picsum.photos/id/338/100/100', available: false, rating: 5.0 },
];

export const Doctors: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  if (selectedDoctor) {
    return (
      <div className="p-6 min-h-screen bg-white">
        <button onClick={() => setSelectedDoctor(null)} className="mb-4 text-slate-500 font-medium">← Back</button>
        
        <div className="flex items-center gap-4 mb-6">
          <img src={selectedDoctor.image} className="w-20 h-20 rounded-2xl object-cover shadow-md" alt={selectedDoctor.name} />
          <div>
            <h2 className="text-xl font-bold text-slate-900">{selectedDoctor.name}</h2>
            <p className="text-blue-600 font-medium">{selectedDoctor.specialty}</p>
            <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
              <MapPin size={14} /> {selectedDoctor.hospital}
            </div>
          </div>
        </div>

        {!isBooking ? (
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-slate-50 rounded-xl text-center border border-slate-100">
                 <p className="text-2xl font-bold text-slate-800">500+</p>
                 <p className="text-xs text-slate-500">Patients</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-xl text-center border border-slate-100">
                 <p className="text-2xl font-bold text-slate-800">{selectedDoctor.experience}</p>
                 <p className="text-xs text-slate-500">Experience</p>
               </div>
             </div>

             <div className="space-y-3 pt-4">
               <h3 className="font-bold text-slate-800">About Doctor</h3>
               <p className="text-slate-500 text-sm leading-relaxed">
                 A dedicated {selectedDoctor.specialty} with over {selectedDoctor.experience} of experience in diagnosing and treating complex conditions. Committed to providing patient-centered care.
               </p>
             </div>

             <div className="fixed bottom-24 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
               <button onClick={() => setIsBooking(true)} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30">Book Appointment</button>
             </div>
          </div>
        ) : (
          <div className="animate-fade-in space-y-6">
            <h3 className="font-bold text-lg text-slate-800">Select Date & Time</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[12, 13, 14, 15, 16].map(d => (
                <div key={d} className={`min-w-[60px] h-[80px] rounded-xl flex flex-col items-center justify-center border ${d === 13 ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white border-slate-200 text-slate-600'}`}>
                  <span className="text-xs font-medium">Oct</span>
                  <span className="text-xl font-bold">{d}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
               {['09:00 AM', '10:30 AM', '01:00 PM', '03:00 PM', '04:30 PM'].map((t, i) => (
                 <button key={t} className={`py-2 rounded-lg text-sm border ${i === 2 ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold' : 'border-slate-200 text-slate-600'}`}>{t}</button>
               ))}
            </div>

            <h3 className="font-bold text-lg text-slate-800 mt-6">Consultation Type</h3>
            <div className="space-y-3">
               <label className="flex items-center gap-4 p-4 border border-blue-200 bg-blue-50 rounded-xl cursor-pointer">
                 <div className="w-5 h-5 rounded-full border-4 border-blue-600 bg-white"></div>
                 <Video className="text-blue-600" />
                 <div>
                   <p className="font-semibold text-slate-800">Video Call</p>
                   <p className="text-xs text-slate-500">Connect within app</p>
                 </div>
               </label>
               <label className="flex items-center gap-4 p-4 border border-slate-200 bg-white rounded-xl opacity-60">
                 <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                 <MapPin className="text-slate-400" />
                 <div>
                   <p className="font-semibold text-slate-800">In-Person</p>
                   <p className="text-xs text-slate-500">{selectedDoctor.hospital}</p>
                 </div>
               </label>
            </div>

            <button onClick={() => { alert('Appointment Confirmed!'); setSelectedDoctor(null); setIsBooking(false); }} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg mt-8">Confirm Booking</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Find a Doctor</h2>
      
      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {['All', 'General', 'Cardiologist', 'Dentist', 'Neurologist'].map((c, i) => (
          <button key={c} className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${i === 0 ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {MOCK_DOCTORS.map(doc => (
          <div key={doc.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 transition-transform hover:scale-[1.01] cursor-pointer" onClick={() => setSelectedDoctor(doc)}>
             <img src={doc.image} alt={doc.name} className="w-20 h-20 rounded-xl object-cover bg-slate-100" />
             <div className="flex-1">
               <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-800">{doc.name}</h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md">
                    <Star size={10} fill="currentColor" /> {doc.rating}
                  </div>
               </div>
               <p className="text-blue-600 text-sm font-medium">{doc.specialty}</p>
               <p className="text-slate-400 text-xs mt-1">{doc.hospital}</p>
               <div className="mt-3 flex gap-2">
                 <button className="flex-1 bg-slate-100 text-slate-600 text-xs font-semibold py-2 rounded-lg">Profile</button>
                 <button className="flex-1 bg-blue-600 text-white text-xs font-semibold py-2 rounded-lg">Book</button>
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};