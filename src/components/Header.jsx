import React from 'react';
import { Clock } from 'lucide-react';

const Header = ({ currentTime, formatDate, formatTime }) => {
  return (
    <header className="bg-green-800 text-white p-3 shadow-md">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">ระบบติดตามการตัดอ้อย</h1>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <div>
              <div className="text-sm font-medium">{formatDate(currentTime)}</div>
              <div className="text-xs">{formatTime(currentTime)}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;