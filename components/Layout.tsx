import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Stethoscope, FileText, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Search, label: 'Check', path: '/check' }, // Shared route for Symptom/Wound selection
    { icon: Stethoscope, label: 'Doctors', path: '/doctors' },
    { icon: FileText, label: 'Records', path: '/records' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg pb-safe-area">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
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
    <div className="min-h-screen bg-slate-50 pb-20 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {children}
      <BottomNav />
    </div>
  );
};

export default Layout;