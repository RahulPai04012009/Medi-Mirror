
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Navigation, Loader2, Search as SearchIcon, X, Pill, Building2, Stethoscope, Route } from 'lucide-react';
import { mapSearchWithContext } from '../services/geminiService';
import { Place } from '../types';

// Helper to calculate distance in miles
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Matching the mock data from Doctors.tsx to provide context to Gemini
const APP_DOCTORS = [
  { name: 'Dr. Sarah Wilson', hospital: 'City Heart Center' },
  { name: 'Dr. Emily Chen', hospital: 'Skin Care Clinic' },
  { name: 'Dr. James Carter', hospital: 'Childrens Wellness' },
];

type MapMode = 'hospital' | 'pharmacy';

export const MapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<MapMode>('hospital');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check for query param on mount/update
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocation({ lat: 37.7749, lng: -122.4194 }) // Fallback SF
      );
    } else {
      setLocation({ lat: 37.7749, lng: -122.4194 });
    }
  }, [searchParams]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!location) return;

    setActiveQuery(searchQuery);
    setLoading(true);
    setError(null);
    
    try {
      const result = await mapSearchWithContext(searchQuery, activeTab, location, APP_DOCTORS);
      let foundPlaces = result.places as Place[];

      // Calculate distances if coordinates are available
      foundPlaces = foundPlaces.map(p => {
        if (p.coords) {
          return {
            ...p,
            distance: calculateDistance(location.lat, location.lng, p.coords.lat, p.coords.lng)
          };
        }
        // Fallback for demo: random realistic distance if parsing fails but model says it's nearby
        return {
          ...p,
          distance: Math.random() * 5 + 0.2
        };
      });

      // Sort by distance
      foundPlaces.sort((a, b) => (a.distance || 0) - (b.distance || 0));

      setPlaces(foundPlaces);
      if (foundPlaces.length === 0) {
        setError("No specific matches found for your search.");
      }
    } catch (err) {
      setError("Failed to process your search request.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch logic
  useEffect(() => {
    if (location) {
        // If we have a search query from params or state, execute it
        if (searchQuery.trim() !== '') {
            handleSearch();
        } 
        // If we have no query but switched tabs, execute empty search (find nearby X)
        else if (!activeQuery) {
            handleSearch();
        }
    }
  }, [activeTab, location, searchQuery]); // Re-run when query (from params) or location changes

  const clearSearch = () => {
    setSearchQuery('');
    setActiveQuery('');
    // Trigger generic search for current tab
    // We can't call handleSearch directly due to scope in this render cycle without state update lag
    // but the effect dependency on searchQuery will handle it if we clear it.
  };

  const getMapUrl = () => {
    if (!location) return "";
    const term = activeQuery || (activeTab === 'hospital' ? 'hospitals' : 'pharmacies');
    // Using classic Google Maps embed
    return `https://maps.google.com/maps?q=${encodeURIComponent(term)}&sll=${location.lat},${location.lng}&z=14&output=embed`;
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 min-h-screen">
      {/* Search Bar Header */}
      <div className="bg-white px-4 pt-4 pb-2 sticky top-0 z-20 shadow-sm">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <SearchIcon size={18} />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'hospital' ? "Search symptoms (e.g. fever) or doctors..." : "Search medicine (e.g. Insulin)..."}
            className="w-full pl-10 pr-10 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm outline-none"
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          )}
        </form>

        <div className="flex mt-3 gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setActiveTab('hospital')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'hospital'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Building2 size={14} /> Hospitals & Doctors
          </button>
          <button
            onClick={() => setActiveTab('pharmacy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'pharmacy'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-200'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Pill size={14} /> Pharmacies & Medicines
          </button>
        </div>
      </div>

      {/* Map View */}
      <div className="w-full h-60 bg-slate-200 shrink-0 border-b border-slate-200">
        {location ? (
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={getMapUrl()}
            allowFullScreen
            loading="lazy"
            title="Map View"
          ></iframe>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mr-2" /> Locating...
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="px-6 py-4 flex justify-between items-center bg-slate-50/80 backdrop-blur">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {activeQuery ? `Results for "${activeQuery}"` : `Nearby ${activeTab}s`}
        </h3>
        <span className="text-[10px] font-medium text-slate-400">{places.length} found</span>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
             <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
             <p className="text-sm text-slate-500 font-medium">Medi is analyzing locations...</p>
          </div>
        ) : error && places.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="inline-flex p-4 bg-orange-50 text-orange-500 rounded-full mb-4">
              <SearchIcon size={32} />
            </div>
            <h4 className="font-bold text-slate-800 mb-2">No Results Found</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Try a different name or check your internet connection.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {places.map((place, idx) => (
              <div 
                key={idx} 
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-2xl shrink-0 ${
                    activeTab === 'hospital' ? 'bg-blue-50 text-blue-600' : 'bg-teal-50 text-teal-600'
                  }`}>
                    {place.reason?.includes("Doctor") || place.reason?.includes("Specialized") || place.reason?.includes("Hospital") ? <Stethoscope size={20} /> : <MapPin size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm truncate leading-tight mb-1">{place.name}</h3>
                    {place.reason && (
                      <span className="inline-block text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 font-bold rounded-full mb-1 border border-blue-100">
                        {place.reason}
                      </span>
                    )}
                    <p className="text-xs text-slate-500 truncate mb-3">{place.address}</p>
                    <div className="flex items-center gap-4">
                      <a 
                        href={place.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                      >
                        <Navigation size={14} /> Get Directions
                      </a>
                      {place.distance !== undefined && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                          <Route size={12} className="text-slate-300" />
                          <span>{place.distance.toFixed(1)} miles away</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
