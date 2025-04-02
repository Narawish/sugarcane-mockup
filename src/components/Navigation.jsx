import React, { useState } from 'react';
import { Home, FileText, LayoutDashboard } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { 
      name: 'หน้าหลัก', 
      icon: Home, 
      key: 'home' 
    },
    { 
      name: 'รายงาน', 
      icon: FileText, 
      key: 'reports' 
    },
    { 
      name: 'แดชบอร์ด', 
      icon: LayoutDashboard, 
      key: 'dashboard' 
    }
  ];

  return (
    <div className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-center">
        <nav className="flex space-x-8 py-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-200 ${
                activeTab === tab.key 
                  ? 'bg-green-100 text-green-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;