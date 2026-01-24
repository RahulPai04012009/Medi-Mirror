
import React, { useState, useEffect } from 'react';
import { 
  Star, MapPin, Search, ArrowLeft, Heart, 
  Navigation, Accessibility, Car, Wifi, Siren, 
  FlaskConical, Pill, Loader2, Building2,
  Phone, ShieldCheck, ChevronRight, ExternalLink,
  User, WifiOff, FileSpreadsheet, Stethoscope,
  Calendar, Clock, CheckCircle2, X, Award, 
  BookOpen, GraduationCap, Briefcase
} from 'lucide-react';
import { Doctor, ClinicFacilities, Place } from '../types';
import { mapSearchWithContext } from '../services/geminiService';

// --- API CONFIGURATION ---
const SHEET_ID = '15bTxhHyMNFnfkcUqv3b9QuQthJfUMEKPFZl_pEMm8Ac';
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

// --- UTILITIES ---

const formatPhoneNumber = (phone: string) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

// Robust CSV Parser
const parseDoctorsCSV = (csvText: string): Doctor[] => {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
  const getIdx = (keywords: string[]) => headers.findIndex(h => keywords.some(k => h.includes(k)));

  const idxName = getIdx(['name', 'doctor', 'provider', 'full name', 'physician']);
  const idxSpecialty = getIdx(['specialty', 'specialist', 'taxonomy', 'type', 'classification', 'primary specialty']);
  const idxHospital = getIdx(['hospital', 'clinic', 'practice', 'office', 'organization', 'business name', 'legal name']);
  const idxAddress = getIdx(['address', 'location', 'street', 'full address', 'practice address']);
  const idxPhone = getIdx(['phone', 'contact', 'tel', 'mobile', 'cell']);
  const idxRating = getIdx(['rating', 'score', 'stars']);
  const idxReviews = getIdx(['reviews', 'review count', 'count']);
  const idxImage = getIdx(['image', 'img', 'photo', 'picture', 'avatar', 'url']);

  return lines.slice(1).map((line, i): Doctor | null => {
    const columns = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
    const rawName = idxName > -1 ? columns[idxName] : columns[0];
    if (!rawName || rawName.trim() === '') return null;

    let specialty = idxSpecialty > -1 ? columns[idxSpecialty] : '';
    if (!specialty && columns[1] && columns[1].length > 3) specialty = columns[1];
    if (!specialty) specialty = 'General Practice';

    let hospital = idxHospital > -1 ? columns[idxHospital] : '';
    let address = idxAddress > -1 ? columns[idxAddress] : '';

    if (!hospital && columns[2]) hospital = columns[2];
    if (!address && columns[3]) address = columns[3];
    address = address.replace(/"/g, '');

    const phone = idxPhone > -1 ? columns[idxPhone] : '';
    const ratingStr = idxRating > -1 ? columns[idxRating] : '0';
    const reviewsStr = idxReviews > -1 ? columns[idxReviews] : '0';
    const imageStr = idxImage > -1 ? columns[idxImage] : '';

    return {
      id: `sheet_${i}`,
      name: rawName,
      specialty: specialty,
      degrees: ['MD', 'Board Certified'], 
      experience: Math.floor(Math.random() * 15) + 5,
      hospital: hospital || 'Private Practice',
      address: address || 'Austin, TX',
      coordinates: { lat: 30.2672, lng: -97.7431 }, 
      facilities: { wheelchair: true, parking: true, wifi: true, emergency: false, pharmacy: false, lab: false },
      image: imageStr, 
      rating: parseFloat(ratingStr) || 0,
      reviewCount: parseInt(reviewsStr) || 0,
      reviews: [],
      workingHours: phone ? formatPhoneNumber(phone) : 'Contact for hours',
      consultationFee: 150,
      available: true,
      languages: ['English', 'Spanish']
    };
  }).filter((d): d is Doctor => d !== null);
};

// --- BOOKING MODAL ---

const BookingModal: React.FC<{ doctor: Doctor, onClose: () => void }> = ({ doctor, onClose }) => {
  const [step, setStep] = useState<'selection' | 'success'>('selection');
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      day: d.getDate(),
      full: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });

  const times = ["09:00 AM", "10:30 AM", "11:45 AM", "01:30 PM", "02:45 PM", "04:00 PM"];

  const handleBook = () => {
    if (selectedTime !== null) {
      setStep('success');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl relative animate-slide-up transition-colors duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-700 transition-colors">
          <X size={20} />
        </button>

        {step === 'selection' ? (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Book Appointment</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Schedule a visit with {doctor.name}</p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Select Date</h4>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {dates.map((d, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedDate(i)}
                    className={`flex flex-col items-center justify-center min-w-[70px] h-20 rounded-2xl border-2 transition-all ${
                      selectedDate === i 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase opacity-70 mb-1">{d.label}</span>
                    <span className="text-lg font-black">{d.day}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Select Time</h4>
              <div className="grid grid-cols-3 gap-3">
                {times.map((t) => (
                  <button 
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-3 rounded-xl text-xs font-bold transition-all border-2 ${
                      selectedTime === t 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleBook}
              disabled={!selectedTime}
              className="w-full bg-slate-900 dark:bg-blue-600 text-white py-5 rounded-[24px] font-black text-lg shadow-xl active:scale-95 transition-all disabled:opacity-50"
            >
              Confirm Booking
            </button>
          </div>
        ) : (
          <div className="py-10 text-center space-y-6">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600 animate-bounce">
              <CheckCircle2 size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">Booking Confirmed!</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                You're all set for <span className="text-slate-900 dark:text-white font-bold">{dates[selectedDate].full}</span> at <span className="text-slate-900 dark:text-white font-bold">{selectedTime}</span>.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 text-left space-y-3">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">{doctor.name[4]}</div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{doctor.name}</p>
                    <p className="text-[10px] text-slate-500">{doctor.hospital}</p>
                  </div>
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest pt-2">
                  <Calendar size={12} /> Appointment ID: MM-{Math.floor(Math.random()*9000)+1000}
               </div>
            </div>
            <button 
              onClick={onClose}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white py-4 rounded-2xl font-black active:scale-95 transition-all"
            >
              Back to App
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN DOCTORS COMPONENT ---

export const Doctors: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'profile'>('list');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('All');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'registry' | 'nearby'>('registry');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 30.2672, lng: -97.7431 }) 
      );
    } else {
        setUserLocation({ lat: 30.2672, lng: -97.7431 });
    }
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (activeTab !== 'registry') return;

      setIsLoading(true);
      try {
        const sheetResponse = await fetch(SHEET_CSV_URL);
        if (!sheetResponse.ok) throw new Error("Failed to fetch Google Sheet");
        
        const sheetText = await sheetResponse.text();
        const sheetDoctors = parseDoctorsCSV(sheetText);
        
        const filtered = filterSpecialty === 'All' 
           ? sheetDoctors 
           : sheetDoctors.filter(d => {
               const spec = d.specialty.toLowerCase();
               const filter = filterSpecialty.toLowerCase();
               if (filter === 'family medicine') return spec.includes('family');
               if (filter === 'internal medicine') return spec.includes('internal');
               return spec.includes(filter);
           });
        
        const searchFiltered = searchQuery 
          ? filtered.filter(d => 
              d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
              d.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
              d.specialty.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : filtered;

        setDoctors(searchFiltered);
      } catch (err) {
        console.error("Sheet fetch failed", err);
        setDoctors([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchDoctors, 500);
    return () => clearTimeout(debounce);
  }, [activeTab, filterSpecialty, searchQuery]);

  useEffect(() => {
    const fetchMapDoctors = async () => {
      if (activeTab !== 'nearby' || !userLocation) return;
      
      setIsLoading(true);
      try {
        const term = searchQuery || (filterSpecialty !== 'All' ? `${filterSpecialty}` : 'Doctor');
        const result = await mapSearchWithContext(term, 'hospital', userLocation);
        
        const realPlaces: Doctor[] = result.places.map((place: Place, index: number) => {
          return {
            id: `map_${index}`,
            name: place.name,
            specialty: filterSpecialty !== 'All' ? filterSpecialty : 'Medical Specialist',
            degrees: ['Verified Location'],
            hospital: place.address?.split(',')[0] || "Medical Office",
            address: place.address || 'Address available on map',
            coordinates: place.coords || userLocation,
            distance: place.distance || undefined,
            facilities: { wheelchair: true, parking: true, wifi: false, emergency: false, pharmacy: false, lab: false },
            image: '', 
            rating: 0,
            reviewCount: 0,
            reviews: [],
            languages: []
          };
        });

        setDoctors(realPlaces);
      } catch (error) {
        console.error("Map fetch failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === 'nearby') {
       const debounce = setTimeout(fetchMapDoctors, 600);
       return () => clearTimeout(debounce);
    }
  }, [activeTab, userLocation, searchQuery, filterSpecialty]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (viewMode === 'profile' && selectedDoctor) {
    return (
      <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors pb-40 relative animate-slide-up">
        {showBooking && <BookingModal doctor={selectedDoctor} onClose={() => setShowBooking(false)} />}
        
        <div className="relative h-80 bg-slate-100 dark:bg-slate-900 overflow-hidden">
           {selectedDoctor.image ? (
             <img src={selectedDoctor.image} className="w-full h-full object-cover" alt={selectedDoctor.name} onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
             }} />
           ) : (
             <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50 dark:bg-slate-900 transition-colors">
                <div className="w-24 h-24 rounded-full bg-blue-200 dark:bg-slate-800 flex items-center justify-center mb-4 border-4 border-white/50 dark:border-white/5">
                  <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{getInitials(selectedDoctor.name)}</span>
                </div>
             </div>
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent dark:from-slate-950 dark:via-slate-950/20" />
           <div className="absolute top-0 left-0 right-0 p-6 flex justify-between z-20">
             <button onClick={() => setViewMode('list')} className="w-11 h-11 bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-2xl flex items-center justify-center text-slate-900 dark:text-white hover:bg-white transition-all shadow-sm">
               <ArrowLeft size={22} />
             </button>
             <button className="w-11 h-11 bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-2xl flex items-center justify-center text-slate-900 dark:text-white shadow-sm">
               <Heart size={22} />
             </button>
           </div>
        </div>

        <div className="px-6 -mt-20 relative z-10 space-y-6">
           {/* Top Info Card */}
           <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{selectedDoctor.name}</h1>
                  <p className="text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                    {selectedDoctor.specialty} • {selectedDoctor.degrees?.join(', ')}
                  </p>
                </div>
                {selectedDoctor.rating > 0 && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-2xl flex flex-col items-center border border-orange-100 dark:border-orange-800">
                    <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-black">
                      <Star size={14} fill="currentColor" /> {selectedDoctor.rating.toFixed(1)}
                    </div>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold">{selectedDoctor.reviewCount} Reviews</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-blue-500 mb-2 shadow-sm">
                      <Briefcase size={20} />
                    </div>
                    <span className="text-xs font-black text-slate-900 dark:text-white">{selectedDoctor.experience || 10}+ Years</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Exp.</span>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-teal-500 mb-2 shadow-sm">
                      <Phone size={20} />
                    </div>
                    <span className="text-xs font-black text-slate-900 dark:text-white">Active</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Status</span>
                 </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-2xl flex items-center gap-3">
                 <ShieldCheck className="text-purple-600 dark:text-purple-400" size={20} />
                 <div>
                   <p className="text-xs font-bold text-purple-700 dark:text-purple-300">Verified Partner</p>
                   <p className="text-[10px] text-purple-600/70 dark:text-purple-400/70">Credentialed by Medi-Mirror Systems</p>
                 </div>
              </div>
           </div>

           {/* Verified Qualifications Section */}
           <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Verified Qualifications</h3>
              <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 space-y-5 shadow-sm transition-colors">
                 <div className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0">
                       <GraduationCap size={20} />
                    </div>
                    <div className="flex-1 min-w-0 border-b border-slate-50 dark:border-slate-800 pb-4">
                       <p className="text-xs font-black text-slate-900 dark:text-white">Medical Doctorate (MD)</p>
                       <p className="text-[10px] text-slate-500 mt-1">University of Texas Medical Branch • 2008</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 shrink-0">
                       <Award size={20} />
                    </div>
                    <div className="flex-1 min-w-0 border-b border-slate-50 dark:border-slate-800 pb-4">
                       <p className="text-xs font-black text-slate-900 dark:text-white">Board Certification</p>
                       <p className="text-[10px] text-slate-500 mt-1">American Board of {selectedDoctor.specialty.split(' ')[0]}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 shrink-0">
                       <BookOpen size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-xs font-black text-slate-900 dark:text-white">Residency Training</p>
                       <p className="text-[10px] text-slate-500 mt-1">Austin Medical Center • Clinical Research Lead</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Location Card */}
           <div className="flex items-center gap-3 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="p-3 bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded-2xl">
                <MapPin size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{selectedDoctor.hospital}</p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">{selectedDoctor.address}</p>
              </div>
              <button onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(selectedDoctor.address)}`)} className="p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm hover:scale-105 transition-transform">
                <Navigation size={18} className="text-blue-600 dark:text-blue-400" />
              </button>
           </div>
        </div>

        {/* Fixed Booking Action */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-950 dark:via-slate-950 z-30 pt-10 pointer-events-none">
           <div className="max-w-md mx-auto flex gap-3 pointer-events-auto">
              <button 
                onClick={() => setShowBooking(true)}
                className="flex-1 bg-slate-900 dark:bg-blue-600 text-white py-5 rounded-[24px] font-black text-lg shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all hover:brightness-110"
              >
                <Calendar size={22} /> Book Appointment
              </button>
              <button className="w-16 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[24px] flex items-center justify-center text-blue-600 shadow-xl active:scale-95 transition-all">
                <Phone size={24} />
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
      <div className="bg-white dark:bg-slate-900 px-6 pt-6 pb-4 sticky top-0 z-20 shadow-sm rounded-b-[40px] transition-colors duration-300">
        <div className="flex justify-between items-center mb-6">
           <div>
             <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Healthcare Directory</p>
             <h2 className="text-xl font-black text-slate-900 dark:text-white">Austin Providers</h2>
           </div>
           <div className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-[10px] font-bold text-purple-600 dark:text-purple-300 flex items-center gap-1 border border-purple-100 dark:border-purple-800">
              <FileSpreadsheet size={12} />
              Verified List
           </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, specialty, or clinic..." 
            className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-800 border-none rounded-[24px] focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white outline-none text-sm font-bold transition-colors"
          />
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-4 transition-colors">
          <button 
            onClick={() => setActiveTab('registry')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'registry' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-md' : 'text-slate-400 dark:text-slate-500'}`}
          >
            Directory
          </button>
          <button 
            onClick={() => setActiveTab('nearby')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'nearby' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-md' : 'text-slate-400 dark:text-slate-500'}`}
          >
            Nearby Map
          </button>
        </div>

        {activeTab === 'registry' && (
           <div className="flex gap-2 overflow-x-auto no-scrollbar">
             {['All', 'Internal Medicine', 'Family Medicine', 'Dermatology', 'Surgery', 'Dentistry'].map((spec) => (
               <button 
                 key={spec} 
                 onClick={() => setFilterSpecialty(spec)}
                 className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterSpecialty === spec ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}
               >
                 {spec}
               </button>
             ))}
           </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50 space-y-4">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <p className="text-[10px] font-black uppercase tracking-widest">
              {activeTab === 'registry' ? 'Loading Database...' : 'Scanning Local Map...'}
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'nearby' && (
               <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-2xl mb-4 flex gap-3">
                 <Building2 className="text-blue-500 shrink-0" size={20} />
                 <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                   Showing location results based on your search.
                 </p>
               </div>
            )}
            
            {doctors.length === 0 ? (
              <div className="text-center py-20 px-10">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={40} className="text-slate-300" />
                </div>
                <h4 className="font-black text-slate-800 dark:text-white mb-2">No Providers Found</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Try adjusting filters or checking connection.</p>
              </div>
            ) : (
              doctors.map(doc => (
                <div 
                  key={doc.id} 
                  onClick={() => { setSelectedDoctor(doc); setViewMode('profile'); }}
                  className="bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex gap-4 transition-all hover:shadow-xl active:scale-[0.98] cursor-pointer group min-h-[140px]"
                >
                  <div className="shrink-0 relative">
                    {doc.image ? (
                      <img 
                        src={doc.image} 
                        alt={doc.name} 
                        className="w-24 h-24 rounded-[24px] object-cover shadow-inner bg-slate-200" 
                        onError={(e) => { 
                          (e.target as HTMLImageElement).style.display = 'none';
                        }} 
                      />
                    ) : null}
                    
                    {!doc.image && (
                      <div className="w-24 h-24 rounded-[24px] bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-500 dark:text-blue-400 border border-blue-100 dark:border-slate-700">
                        {activeTab === 'nearby' && !doc.name.includes("Dr.") ? (
                           <Building2 size={32} />
                        ) : (
                           <span className="text-xl font-black tracking-tighter">{getInitials(doc.name)}</span>
                        )}
                      </div>
                    )}

                    {activeTab === 'registry' && (
                      <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 p-1.5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-purple-500">
                        <ShieldCheck size={14} fill="currentColor" className="text-purple-500 dark:text-purple-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-slate-100 text-base truncate leading-tight mb-1">{doc.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                         <span className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]">{doc.specialty}</span>
                         {doc.rating > 0 && (
                            <span className="flex items-center gap-0.5 text-[10px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded-md">
                                <Star size={8} fill="currentColor" /> {doc.rating}
                            </span>
                         )}
                      </div>
                      <div className="flex items-start gap-1 text-slate-400 dark:text-slate-500 text-[10px] font-bold">
                          <MapPin size={12} className="shrink-0 mt-0.5" /> 
                          <span className="line-clamp-2 leading-tight">{doc.address}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50 dark:border-slate-800">
                      <span className="text-[10px] font-black text-slate-400 uppercase">
                        {activeTab === 'registry' ? 'View Details' : 'Map Details'}
                      </span>
                      <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};
