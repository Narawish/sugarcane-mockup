import React, { useMemo } from 'react';
import _ from 'lodash';

const SummaryStats = ({ harvestData }) => {
  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    // Count of each status
    const statusCounts = _.countBy(harvestData, 'status');

    // Total area calculations
    const totalArea = _.sumBy(harvestData, item => parseFloat(item.areaOfField));
    
    // Status-wise area calculations
    const statusAreaBreakdown = _(harvestData)
      .groupBy('status')
      .mapValues(group => _.sumBy(group, item => parseFloat(item.areaOfField)))
      .value();

    return {
      statusCounts,
      totalArea,
      statusAreaBreakdown
    };
  }, [harvestData]);

  // Status color mapping
  const getStatusColor = (status) => {
    const colorMap = {
      'เสร็จสิ้น': 'bg-green-100 text-green-800',
      'รอดำเนินการ': 'bg-yellow-100 text-yellow-800',
      'กำลังรอ': 'bg-blue-100 text-blue-800',
      'ยกเลิก': 'bg-red-100 text-red-800',
      'อื่นๆ': 'bg-gray-100 text-gray-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Area */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-2">พื้นที่รวมทั้งหมด</h3>
        <p className="text-3xl font-bold text-green-600">
          {summaryStats.totalArea.toFixed(1)}
          <span className="text-sm text-gray-500 font-normal ml-2">ไร่</span>
        </p>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white p-4 rounded-lg shadow-md col-span-2">
        <h3 className="text-lg font-medium text-gray-900 mb-2">สรุปสถานะการตัดอ้อย</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(summaryStats.statusCounts).map(([status, count]) => (
            <div 
              key={status} 
              className={`p-3 rounded-lg ${getStatusColor(status)} flex flex-col`}
            >
              <span className="text-sm font-medium">{status}</span>
              <div className="flex justify-between items-center mt-1">
                <span className="text-2xl font-bold">{count}</span>
                <span className="text-sm">
                  {summaryStats.statusAreaBreakdown[status]?.toFixed(1) || '0.0'} ไร่
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryStats;