import React from 'react';
import { Search, Filter, RefreshCw, Download, Plus } from 'lucide-react';

const Controls = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, statusOptions, handleRefresh }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหา..."
              className="pl-10 pr-4 py-2 border rounded-md w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          
          {/* Status filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select 
              className="border rounded-md px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status === 'All' ? 'ทั้งหมด' : status}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            className="flex items-center gap-1 px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
            <span>รีเฟรช</span>
          </button>
          
          <button className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            <Plus className="h-4 w-4" />
            <span>เพิ่มข้อมูล</span>
          </button>
          
          
        </div>
      </div>
    </div>
  );
};

export default Controls;