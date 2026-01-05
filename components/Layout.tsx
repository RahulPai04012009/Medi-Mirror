
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Map as MapIcon, Users, LayoutGrid } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Search, label: 'Check', path: '/check' },
    { icon: MapIcon, label: 'Map', path: '/map' },
    { icon: Users, label: 'Doctors', path: '/doctors' },
    { icon: LayoutGrid, label: 'Browse', path: '/records' }, // Updated to Browse/Records
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg pb-safe-area z-50 transition-colors duration-300">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <item.icon
                size={24}
                className={`transition-all duration-300 ${
                  isActive ? 'drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]' : ''
                }`}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 max-w-md mx-auto shadow-2xl overflow-hidden relative transition-colors duration-300">
      {children}
      <BottomNav />
    </div>
  );
};

export default Layout;
