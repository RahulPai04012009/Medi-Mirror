
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Heart, Flame, Ruler, CircleDot, Ear, 
  Pill, Brain, Footprints, Apple, Wind, Moon, 
  ClipboardList, Activity, ChevronRight, User, 
  LayoutGrid, Stethoscope
} from 'lucide-react';

interface CategoryItem {
  id: string;
  label: string;
  icon: React.ElementType;
  colorClass: string; // Text color
  bgClass: string;    // Background color
}

const CATEGORIES: CategoryItem[] = [
  { id: 'activity', label: 'Activity', icon: Flame, colorClass: 'text-orange-500', bgClass: 'bg-orange-500/15' },
  { id: 'body', label: 'Body Measurements', icon: Ruler, colorClass: 'text-purple-500', bgClass: 'bg-purple-500/15' },
  { id: 'cycle', label: 'Cycle Tracking', icon: CircleDot, colorClass: 'text-pink-500', bgClass: 'bg-pink-500/15' },
  { id: 'hearing', label: 'Hearing', icon: Ear, colorClass: 'text-blue-500', bgClass: 'bg-blue-500/15' },
  { id: 'heart', label: 'Heart', icon: Heart, colorClass: 'text-red-500', bgClass: 'bg-red-500/15' },
  { id: 'meds', label: 'Medications', icon: Pill, colorClass: 'text-cyan-500', bgClass: 'bg-cyan-500/15' },
  { id: 'mental', label: 'Mental Wellbeing', icon: Brain, colorClass: 'text-teal-500', bgClass: 'bg-teal-500/15' },
  { id: 'mobility', label: 'Mobility', icon: Footprints, colorClass: 'text-amber-500', bgClass: 'bg-amber-500/15' },
  { id: 'nutrition', label: 'Nutrition', icon: Apple, colorClass: 'text-green-500', bgClass: 'bg-green-500/15' },
  { id: 'respiratory', label: 'Respiratory', icon: Wind, colorClass: 'text-sky-500', bgClass: 'bg-sky-500/15' },
  { id: 'sleep', label: 'Sleep', icon: Moon, colorClass: 'text-indigo-500', bgClass: 'bg-indigo-500/15' },
  { id: 'symptoms', label: 'Symptoms', icon: ClipboardList, colorClass: 'text-violet-500', bgClass: 'bg-violet-500/15' },
  { id: 'vitals', label: 'Vitals', icon: Activity, colorClass: 'text-rose-500', bgClass: 'bg-rose-500/15' },
  { id: 'other', label: 'Other Data', icon: LayoutGrid, colorClass: 'text-slate-500', bgClass: 'bg-slate-500/15' },
];

export const Records: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = CATEGORIES.filter(cat => 
    cat.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryClick = (id: string) => {
    switch (id) {
      case 'activity': navigate('/activity'); break;
      case 'body': navigate('/body-measurements'); break;
      case 'mobility': navigate('/mobility'); break;
      case 'respiratory': navigate('/respiratory'); break;
      case 'sleep': navigate('/sleep'); break;
      case 'vitals': navigate('/vitals'); break;
      case 'mental': navigate('/mental'); break;
      case 'other': navigate('/other'); break;
      default: console.log("Category not implemented yet:", id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white pb-32 transition-colors">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-50/90 dark:bg-black/90 backdrop-blur-md px-6 pt-8 pb-4 border-b border-transparent dark:border-zinc-800 transition-colors">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-black tracking-tight">Browse</h1>
          <button 
            onClick={() => navigate('/settings')}
            className="w-10 h-10 bg-slate-200 dark:bg-zinc-800 rounded-full flex items-center justify-center hover:bg-slate-300 dark:hover:bg-zinc-700 transition-colors"
          >
             <User size={20} className="text-slate-600 dark:text-zinc-400" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" size={18} />
          <input 
            type="text" 
            placeholder="Search" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-200 dark:bg-zinc-900 rounded-xl py-3 pl-10 pr-4 text-sm font-bold placeholder:text-slate-500 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="px-6 space-y-6 mt-6">
        
        {/* Top Actions (Favorites) - Only show when not searching */}
        {!searchQuery && (
          <div className="space-y-4 animate-fade-in">
             <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-bold dark:text-zinc-100">Favorites</h2>
                <button className="text-blue-500 text-xs font-bold uppercase tracking-wider">Edit</button>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate('/home')}
                  className="bg-white dark:bg-zinc-900 p-4 rounded-[20px] flex flex-col items-start gap-3 active:scale-[0.98] transition-all border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-md"
                >
                  <div className="p-2.5 bg-red-500/15 rounded-full">
                    <Heart className="text-red-500 fill-red-500" size={20} />
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Summary</span>
                </button>
                <button 
                  onClick={() => navigate('/doctors')}
                  className="bg-white dark:bg-zinc-900 p-4 rounded-[20px] flex flex-col items-start gap-3 active:scale-[0.98] transition-all border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-md"
                >
                  <div className="p-2.5 bg-blue-500/15 rounded-full">
                    <Stethoscope className="text-blue-500" size={20} />
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Providers</span>
                </button>
             </div>
          </div>
        )}

        {/* Health Categories List */}
        <div className="animate-slide-up">
          <h2 className="text-xl font-bold dark:text-zinc-100 mb-3 px-1">Health Categories</h2>
          
          <div className="bg-white dark:bg-zinc-900 rounded-[24px] overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800/50 border border-slate-100 dark:border-zinc-800 shadow-sm">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleCategoryClick(item.id)}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors active:bg-slate-100 dark:active:bg-zinc-800 group"
                >
                  {/* Attractive Icon Container */}
                  <div className={`w-10 h-10 rounded-full ${item.bgClass} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                     <item.icon className={item.colorClass} size={20} />
                  </div>
                  
                  <div className="flex-1 font-semibold text-base text-slate-900 dark:text-white tracking-tight">
                    {item.label}
                  </div>
                  
                  <ChevronRight className="text-slate-300 dark:text-zinc-600 group-hover:text-slate-400 dark:group-hover:text-zinc-500 transition-colors" size={20} />
                </div>
              ))
            ) : (
               <div className="p-12 text-center">
                 <Search className="w-12 h-12 text-slate-200 dark:text-zinc-700 mx-auto mb-3" />
                 <p className="text-slate-400 dark:text-zinc-500 font-medium">No categories found</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
