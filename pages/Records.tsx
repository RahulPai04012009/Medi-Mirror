
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Heart, Flame, Ruler, CircleDot, Ear, 
  Pill, Brain, Move, Apple, Wind, Bed, 
  ClipboardList, Activity, ChevronRight, User, 
  Stethoscope, FileText, ArrowRight, LayoutGrid
} from 'lucide-react';

interface CategoryItem {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string; // Tailwind class for background opacity
}

const CATEGORIES: CategoryItem[] = [
  { id: 'activity', label: 'Activity', icon: Flame, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  { id: 'body', label: 'Body Measurements', icon: Ruler, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  { id: 'cycle', label: 'Cycle Tracking', icon: CircleDot, color: 'text-pink-500', bgColor: 'bg-pink-500/10' },
  { id: 'hearing', label: 'Hearing', icon: Ear, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  { id: 'heart', label: 'Heart', icon: Heart, color: 'text-red-500', bgColor: 'bg-red-500/10' },
  { id: 'meds', label: 'Medications', icon: Pill, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10' },
  { id: 'mental', label: 'Mental Wellbeing', icon: Brain, color: 'text-teal-500', bgColor: 'bg-teal-500/10' },
  { id: 'mobility', label: 'Mobility', icon: Move, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  { id: 'nutrition', label: 'Nutrition', icon: Apple, color: 'text-green-500', bgColor: 'bg-green-500/10' },
  { id: 'respiratory', label: 'Respiratory', icon: Wind, color: 'text-sky-500', bgColor: 'bg-sky-500/10' },
  { id: 'sleep', label: 'Sleep', icon: Bed, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10' },
  { id: 'symptoms', label: 'Symptoms', icon: ClipboardList, color: 'text-violet-500', bgColor: 'bg-violet-500/10' },
  { id: 'vitals', label: 'Vitals', icon: Activity, color: 'text-rose-500', bgColor: 'bg-rose-500/10' },
];

export const Records: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = CATEGORIES.filter(cat => 
    cat.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryClick = (id: string) => {
    if (id === 'activity') {
      navigate('/activity');
    } else if (id === 'body') {
      navigate('/body-measurements');
    }
    // Add logic for other categories if needed later
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white pb-32 transition-colors">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-50/80 dark:bg-black/80 backdrop-blur-xl px-6 pt-6 pb-2">
        <div className="flex justify-between items-end mb-4">
          <h1 className="text-4xl font-black tracking-tight">Browse</h1>
          <div className="w-9 h-9 bg-slate-200 dark:bg-zinc-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-300 dark:hover:bg-zinc-700 transition-colors" onClick={() => navigate('/settings')}>
             <User size={20} className="text-slate-500 dark:text-zinc-400" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-200 dark:bg-zinc-900 rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold placeholder:text-slate-500 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
      </div>

      <div className="px-6 space-y-8 mt-4">
        
        {/* Top Actions (Favorites) */}
        {!searchQuery && (
          <div className="space-y-4 animate-fade-in">
             <div 
               onClick={() => navigate('/home')}
               className="bg-white dark:bg-zinc-900 rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer"
             >
               <div className="flex items-center gap-3">
                 <Heart className="text-blue-500 fill-blue-500" size={24} />
                 <span className="font-bold text-lg">Summary</span>
               </div>
               <ChevronRight className="text-slate-300 dark:text-zinc-600" size={20} />
             </div>
             
             {/* Quick Links */}
             <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate('/doctors')}
                  className="bg-white dark:bg-zinc-900 p-4 rounded-2xl flex flex-col gap-2 items-start active:scale-[0.98] transition-transform"
                >
                  <Stethoscope className="text-blue-500" size={24} />
                  <span className="font-bold text-sm">Providers</span>
                </button>
                <button 
                  className="bg-white dark:bg-zinc-900 p-4 rounded-2xl flex flex-col gap-2 items-start active:scale-[0.98] transition-transform"
                >
                  <FileText className="text-purple-500" size={24} />
                  <span className="font-bold text-sm">Documents</span>
                </button>
             </div>
          </div>
        )}

        {/* Health Categories List */}
        <div className="space-y-2 animate-slide-up">
          <h2 className="text-xl font-bold dark:text-zinc-100">Health Categories</h2>
          
          <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleCategoryClick(item.id)}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors active:bg-slate-100 dark:active:bg-zinc-800"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0`}>
                     <item.icon className={item.color} size={24} />
                  </div>
                  <div className="flex-1 font-semibold text-base tracking-wide text-slate-900 dark:text-white">
                    {item.label}
                  </div>
                  <ChevronRight className="text-slate-300 dark:text-zinc-600" size={20} />
                </div>
              ))
            ) : (
               <div className="p-8 text-center text-slate-400 dark:text-zinc-500 font-medium">
                 No categories found
               </div>
            )}
            
            {/* "Other Data" at bottom if clearing search */}
            {!searchQuery && (
              <div className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors">
                 <div className="w-8 h-8 flex items-center justify-center">
                    <LayoutGrid className="text-blue-500" size={24} />
                 </div>
                 <div className="flex-1 font-semibold text-base tracking-wide text-slate-900 dark:text-white">
                    Other Data
                 </div>
                 <ChevronRight className="text-slate-300 dark:text-zinc-600" size={20} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
