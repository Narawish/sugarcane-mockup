import React, { useState, useEffect } from 'react';
import { initialData } from './mockupData';
import { formatDate, formatTime } from './utils/formatters';
import {
  Header,
  Controls,
  DataTable,
  SummaryStats,
  Footer,
  Navigation,
  Dashboard
} from './components';

const App = () => {
  // State for the tracker data
  const [harvestData, setHarvestData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('ทั้งหมด');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // New state for active tab
  const [activeTab, setActiveTab] = useState('home');
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Filter data based on search term and status filter
  const filteredData = harvestData.filter(item => {
    const matchesSearch = 
      Object.values(item).some(value => 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === 'ทั้งหมด' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle refresh data
  const handleRefresh = () => {
    // In a real application, this would fetch the latest data from the server
    setCurrentTime(new Date());
    alert("รีเฟรชข้อมูลสำเร็จ");
  };

  // Unique status values for filter dropdown
  const statusOptions = ['ทั้งหมด', ...new Set(harvestData.map(item => item.status))];

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <SummaryStats harvestData={harvestData} />;
      case 'reports':
        return (
          <>
            <Controls 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              statusOptions={statusOptions}
              handleRefresh={handleRefresh}
            />
            <DataTable 
              currentItems={currentItems}
              filteredData={filteredData}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
            />
          </>
        );
      case 'dashboard':
        return <Dashboard harvestData={harvestData} />;
      default:
        return <SummaryStats harvestData={harvestData} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header 
        currentTime={currentTime}
        formatDate={formatDate}
        formatTime={formatTime}
      />

      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <main className="flex-grow container mx-auto p-4">
        {renderTabContent()}
      </main>
      
      <Footer />
    </div>
  );
};

export default App;