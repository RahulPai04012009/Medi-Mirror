import React, { useState } from 'react';
import { FileText, Download, Phone, Share2, Shield, Bell, LogOut, ChevronRight, User } from 'lucide-react';
import { UserProfile } from '../types';

// --- Records ---
export const Records: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reports');

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">My Records</h2>
        <button className="text-blue-600 font-semibold text-2xl">+</button>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-xl">
        {['reports', 'scans', 'meds'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {/* Mock Data */}
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
             <div className="flex gap-3 items-center">
               <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                 <FileText size={20} />
               </div>
               <div>
                 <h4 className="font-semibold text-slate-800">Blood Test Result</h4>
                 <p className="text-xs text-slate-400">Oct 12, 2023 • Dr. Wilson</p>
               </div>
             </div>
             <button className="text-slate-300 hover:text-blue-600"><Download size={20} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Emergency ---
export const Emergency: React.FC<{ user: UserProfile }> = ({ user }) => {
  return (
    <div className="p-6 bg-red-50 min-h-screen">
      <h2 className="text-2xl font-bold text-red-700 mb-6 flex items-center gap-2">
        <span className="animate-pulse">🚨</span> Emergency Mode
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button className="bg-red-600 text-white p-6 rounded-2xl shadow-red-300 shadow-lg flex flex-col items-center gap-2 active:scale-95 transition-transform">
           <Phone size={32} />
           <span className="font-bold text-lg">Call 911</span>
        </button>
        <button className="bg-white text-slate-800 p-6 rounded-2xl shadow-sm border border-red-100 flex flex-col items-center gap-2 active:scale-95 transition-transform">
           <Phone size={32} className="text-red-500" />
           <span className="font-bold text-lg">Contact {user.emergencyContact.relation}</span>
           <span className="text-xs text-slate-400">{user.emergencyContact.name}</span>
        </button>
      </div>

      <button className="w-full bg-slate-900 text-white py-4 rounded-xl flex items-center justify-center gap-3 mb-8 shadow-lg">
        <Share2 size={20} /> Share Live Location
      </button>

      <div className="bg-white p-6 rounded-2xl border-l-4 border-red-500 shadow-md">
        <h3 className="font-bold text-slate-800 mb-4 uppercase tracking-wider text-sm">Paramedic Info</h3>
        <div className="grid grid-cols-2 gap-y-4 text-sm">
          <div>
            <p className="text-slate-400">Name</p>
            <p className="font-semibold">{user.name}</p>
          </div>
          <div>
            <p className="text-slate-400">Blood Group</p>
            <p className="font-semibold text-red-600 bg-red-50 inline-block px-2 rounded">{user.bloodGroup}</p>
          </div>
          <div className="col-span-2">
            <p className="text-slate-400">Allergies</p>
            <p className="font-semibold text-slate-800">{user.allergies || 'None'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-slate-400">Conditions</p>
            <p className="font-semibold text-slate-800">{user.conditions || 'None'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Settings ---
export const SettingsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Settings</h2>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
         {[
           { icon: User, label: 'Edit Profile' },
           { icon: Shield, label: 'Privacy & Security' },
           { icon: Bell, label: 'Notifications' },
         ].map((item, i) => (
           <div key={i} className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <item.icon size={20} />
                </div>
                <span className="font-medium text-slate-700">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
           </div>
         ))}
      </div>

      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
        <h4 className="font-semibold text-blue-800 mb-1">Go Premium</h4>
        <p className="text-xs text-blue-600 mb-3">Unlock unlimited AI scans and video consultations.</p>
        <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium">Upgrade</button>
      </div>

      <button className="w-full flex items-center justify-center gap-2 text-red-500 font-medium py-4">
        <LogOut size={20} /> Log Out
      </button>

      <p className="text-center text-xs text-slate-300 mt-10">Version 1.0.0 • HIPAA Compliant</p>
    </div>
  );
};