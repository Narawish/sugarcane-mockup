import React from 'react';
import { Edit, Trash2, Download } from 'lucide-react';
import Pagination from './Pagination';
import { getStatusColor } from '../mockupData';
import * as XLSX from 'xlsx';

const DataTable = ({ 
  currentItems, 
  filteredData, 
  indexOfFirstItem, 
  indexOfLastItem, 
  currentPage, 
  totalPages, 
  handlePageChange,
  itemsPerPage, 
  setItemsPerPage 
}) => {
  // Excel export function
  const handleExportExcel = () => {
    // Prepare data for export
    const exportData = filteredData.map(item => {
      // Create a new object with more readable column names
      return {
        'ลำดับ': item.id,
        'วันที่-เวลา': item.datetime,
        'รถตัด': item.carNo,
        'คนขับ': item.driver,
        'กลุ่ม': item.group,
        'สถานะ': item.status,
        'แปลง': item.fieldNo,
        'พื้นที่ (ไร่)': item.areaOfField,
        'เจ้าของ': item.owner,
        'โควต้า': item.quotaGroup,
        'หมายเหตุ': item.remark
      };
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'รายการตัดอ้อย');

    // Export to Excel file
    XLSX.writeFile(workbook, `รายการตัดอ้อย_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
      {/* Export Button */}
      <div className="p-4 flex justify-end">
        <button 
          onClick={handleExportExcel}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <Download className="h-4 w-4" />
          <span>ส่งออก Excel</span>
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">ลำดับ</th>
            <th className="px-4 py-3">วันที่-เวลา</th>
            <th className="px-4 py-3">รถตัด</th>
            <th className="px-4 py-3">คนขับ</th>
            <th className="px-4 py-3">กลุ่ม</th>
            <th className="px-4 py-3">สถานะ</th>
            <th className="px-4 py-3">แปลง</th>
            <th className="px-4 py-3">พื้นที่ (ไร่)</th>
            <th className="px-4 py-3">เจ้าของ</th>
            <th className="px-4 py-3">โควต้า</th>
            <th className="px-4 py-3">หมายเหตุ</th>
            <th className="px-4 py-3">ดำเนินการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentItems.map((item) => {
            const statusColor = getStatusColor(item.status);
            return (
              <tr 
                key={item.id} 
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-center">{item.id}</td>
                <td className="px-4 py-3">{item.datetime}</td>
                <td className="px-4 py-3 font-medium">{item.carNo}</td>
                <td className="px-4 py-3">{item.driver}</td>
                <td className="px-4 py-3">{item.group}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                    ${statusColor === 'Done' ? 'bg-green-100 text-green-800' : 
                      statusColor === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                      statusColor === 'Waiting' ? 'bg-blue-100 text-blue-800' : 
                      statusColor === 'Cancel' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">{item.fieldNo}</td>
                <td className="px-4 py-3 text-right">{item.areaOfField}</td>
                <td className="px-4 py-3">{item.owner}</td>
                <td className="px-4 py-3">{item.quotaGroup}</td>
                <td className="px-4 py-3">{item.remark}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <Pagination 
        filteredData={filteredData}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfLastItem}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
};

export default DataTable;