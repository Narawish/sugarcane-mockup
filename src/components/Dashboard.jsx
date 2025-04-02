import React, { useState, useMemo, useCallback } from 'react';
import { 
  LineChart, 
  BarChart,
  ScatterChart,
  Line, 
  Bar,
  Scatter,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import _ from 'lodash';
import { 
  BarChart2, 
  List, 
  Dot, 
  Filter, 
  Layers,
  Settings,
  ChartLine,
  X,
  SlidersHorizontal,
  Plus
} from 'lucide-react';

// Color palette
const COLORS = [
  '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', 
  '#EC4899', '#F43F5E', '#F97316', '#EAB308'
];

// Supported chart types
const CHART_TYPES = {
  line: { 
    icon: ChartLine, 
    name: 'กราฟเส้น',
    component: LineChart,
    chartElement: Line
  },
  bar: { 
    icon: BarChart2, 
    name: 'กราฟแท่ง',
    component: BarChart,
    chartElement: Bar
  },
  scatter: { 
    icon: Dot, 
    name: 'กราฟกระจาย',
    component: ScatterChart,
    chartElement: Scatter
  }
};

const Dashboard = ({ harvestData }) => {
  // State for sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Parse date from Thai datetime format
  const parseThaiDate = (dateStr) => {
    if (!dateStr) return null;
    const [datePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/');
    // Convert to Buddhist era to Gregorian
    const gregorianYear = parseInt(year) - 543;
    return new Date(gregorianYear, parseInt(month) - 1, parseInt(day));
  };

  // Dynamically get all possible columns from the data
  const dataColumns = useMemo(() => {
    if (harvestData.length === 0) return [];
    
    // Create a mapping of columns with more readable names
    const columnMapping = {
      datetime: 'วันที่ - เวลา',
      carNo: 'รถตัด',
      driver: 'คนขับ',
      group: 'กลุ่ม',
      status: 'สถานะ',
      areaOfField: 'พื้นที่ (ไร่)',
      owner: 'เจ้าของ',
      quotaGroup: 'โควต้า'
    };

    // Include datetime and other meaningful columns
    return Object.keys(harvestData[0])
      .filter(key => 
        !['id', 'remark', 'fieldNo'].includes(key)
      )
      .map(key => ({
        key,
        label: columnMapping[key] || key
      }));
  }, [harvestData]);

  // Determine date range for datetime filter
  const dateRange = useMemo(() => {
    if (harvestData.length === 0) return { 
      min: new Date(), 
      max: new Date() 
    };

    const dates = harvestData.map(item => parseThaiDate(item.datetime));
    return {
      min: new Date(Math.min(...dates)),
      max: new Date(Math.max(...dates))
    };
  }, [harvestData]);

  // State for dashboard configuration
  // State for dashboard configuration
  const [dashboardConfig, setDashboardConfig] = useState(() => {
    // Ensure we have data columns and data before initializing
    if (dataColumns.length === 0 || harvestData.length === 0) {
      return {
        filters: {
          datetimeRange: {
            start: dateRange.min.toISOString().split('T')[0],
            end: dateRange.max.toISOString().split('T')[0]
          }
        },
        charts: []
      };
    }

    // Find first numeric column for Y-axis
    const numericColumn = dataColumns.find(({key}) => 
      typeof harvestData[0][key] === 'number' || 
      !isNaN(parseFloat(harvestData[0][key]))
    )?.key || dataColumns[0]?.key;

    return {
      filters: {
        datetimeRange: {
          start: dateRange.min.toISOString().split('T')[0],
          end: dateRange.max.toISOString().split('T')[0]
        }
      },
      charts: [
        {
          id: 'chart1',
          xAxis: 'datetime',
          yAxis: numericColumn,
          chartType: 'bar',
          title: 'พื้นที่เก็บเกี่ยวตามรถตัด',
          aggregationType: 'individual'
        }
      ]
    };
  });

  // Filter options
  const filterOptions = useMemo(() => {
    const options = {};
    dataColumns.forEach(({key}) => {
      if (key === 'datetime') return; // Skip datetime as we're handling it separately
      
      let uniqueValues = [...new Set(harvestData.map(item => item[key]))];
      options[key] = ['ทั้งหมด', ...uniqueValues];
    });
    return options;
  }, [harvestData]);

  // Apply filters to data
  const filteredData = useMemo(() => {
    return harvestData.filter(item => {
      // Date range filter
      const itemDate = parseThaiDate(item.datetime);
      const startDate = new Date(dashboardConfig.filters.datetimeRange.start);
      const endDate = new Date(dashboardConfig.filters.datetimeRange.end);
      
      // Check if item date is within the selected range
      const withinDateRange = itemDate >= startDate && itemDate <= endDate;

      // Other column filters
      const otherFiltersMatch = Object.entries(dashboardConfig.filters)
        .filter(([key]) => key !== 'datetimeRange')
        .every(([column, selectedValue]) => 
          selectedValue === 'ทั้งหมด' || item[column] === selectedValue
        );

      return withinDateRange && otherFiltersMatch;
    });
  }, [harvestData, dashboardConfig.filters]);

  // Process data for a specific chart
  const processChartData = useCallback((chart) => {
    // Check if we have data and a valid chart configuration
    if (!chart || dataColumns.length === 0 || filteredData.length === 0) {
      return [];
    }

    // Special handling for datetime x-axis and area of field y-axis
    if (chart.xAxis === 'datetime' && chart.yAxis === 'areaOfField') {
      // Group by date and sort
      const groupedByDate = _.groupBy(filteredData, item => 
        item.datetime.split(' ')[0] // Use only the date part
      );

      // Sort dates chronologically
      const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
        // Convert Thai date to sortable format
        const parseDate = (dateStr) => {
          const [day, month, year] = dateStr.split('/');
          return new Date(parseInt(year) - 543, parseInt(month) - 1, parseInt(day));
        };
        return parseDate(a) - parseDate(b);
      });

      // Calculate daily and cumulative data
      let cumulativeSum = 0;
      return sortedDates.map(date => {
        const items = groupedByDate[date];
        const dailyArea = _.sumBy(items, item => parseFloat(item.areaOfField));
        
        if (chart.aggregationType === 'cumulative') {
          cumulativeSum += dailyArea;
          return {
            date,
            area: parseFloat(cumulativeSum.toFixed(2))
          };
        }
        
        return {
          date,
          area: parseFloat(dailyArea.toFixed(2))
        };
      });
    }

    // Default grouping for other scenarios
    const groupedData = _.groupBy(filteredData, chart.xAxis);

    return Object.entries(groupedData).map(([xValue, items]) => ({
      [chart.xAxis]: xValue,
      [chart.yAxis]: _.sumBy(items, item => {
        const value = item[chart.yAxis];
        return typeof value === 'string' ? parseFloat(value) || 0 : value;
      })
    }));
  }, [filteredData, dataColumns]);

  // Render a specific chart type
  const renderChart = (chart) => {
    const ChartComponent = CHART_TYPES[chart.chartType].component;
    const ChartElement = CHART_TYPES[chart.chartType].chartElement;
    const processedData = processChartData(chart);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={processedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={chart.xAxis === 'datetime' ? 'date' : chart.xAxis}
            label={{ 
              value: `แกน X: ${chart.xAxis}`, 
              position: 'insideBottomRight', 
              offset: -5 
            }} 
          />
          <YAxis 
            label={{ 
              value: `แกน Y: ${chart.yAxis}`, 
              angle: -90, 
              position: 'insideLeft' 
            }} 
          />
          <Tooltip 
            formatter={(value, name) => [
              typeof value === 'number' ? value.toFixed(2) : value, 
              name
            ]}
          />
          <Legend />
          <ChartElement 
            dataKey="area"
            name={chart.yAxis}
            type={chart.chartType === 'line' ? 'monotone' : undefined}
            fill={COLORS[0]}
          />
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  // Add a new chart
  const addChart = () => {
    // Ensure we have data columns and data before adding a chart
    if (dataColumns.length === 0 || harvestData.length === 0) {
      return;
    }

    // Find datetime and area columns
    const datetimeColumn = dataColumns.find(({key}) => key === 'datetime');
    const areaColumn = dataColumns.find(({key}) => key === 'areaOfField');

    setDashboardConfig(prev => ({
      ...prev,
      charts: [
        ...(prev.charts || []),
        {
          id: `chart${(prev.charts?.length || 0) + 1}`,
          xAxis: 'datetime',
          yAxis: 'areaOfField',
          chartType: 'bar',
          title: `กราฟใหม่ ${(prev.charts?.length || 0) + 1}`,
          aggregationType: 'individual'
        }
      ]
    }));
  };

  // Remove a chart
  const removeChart = (chartId) => {
    setDashboardConfig(prev => ({
      ...prev,
      charts: prev.charts.filter(chart => chart.id !== chartId)
    }));
  };

  // Update a specific chart
  const updateChart = (chartId, updates) => {
    setDashboardConfig(prev => ({
      ...prev,
      charts: prev.charts.map(chart => 
        chart.id === chartId ? { ...chart, ...updates } : chart
      )
    }));
  };

  // Update filter for a column
  const updateFilter = (column, value) => {
    setDashboardConfig(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [column]: value
      }
    }));
  };

  // Update date range filter
  const updateDateRangeFilter = (field, value) => {
    setDashboardConfig(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        datetimeRange: {
          ...prev.filters.datetimeRange,
          [field]: value
        }
      }
    }));
  };

  return (
    <div className="flex">
      {/* Sidebar Filters */}
      <div className={`
        ${isSidebarOpen ? 'w-64' : 'w-16'} 
        bg-white shadow-md transition-all duration-300 ease-in-out
        fixed left-0 top-16 bottom-16 z-40 overflow-y-auto
      `}>
        {/* Sidebar Toggle */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-4 right-4 z-50"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Filter className="h-6 w-6" />}
        </button>

        {/* Filters Content */}
        
        <div className="p-4 pt-16 h-full">
          {isSidebarOpen ? 
          <>
          <h3 className="text-xl font-bold text-gray-800 flex items-center mb-4">
            <Filter className="mr-2 h-5 w-5" /> ตัวกรอง
          </h3>
          
          {/* Date Range Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ช่วงวันที่
            </label>
            <div className="flex flex-col space-y-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">เริ่มต้น</label>
                <input
                  type="date"
                  className="w-full border rounded-md px-3 py-2"
                  value={dashboardConfig.filters.datetimeRange.start}
                  min={dateRange.min.toISOString().split('T')[0]}
                  max={dateRange.max.toISOString().split('T')[0]}
                  onChange={(e) => updateDateRangeFilter('start', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">สิ้นสุด</label>
                <input
                  type="date"
                  className="w-full border rounded-md px-3 py-2"
                  value={dashboardConfig.filters.datetimeRange.end}
                  min={dateRange.min.toISOString().split('T')[0]}
                  max={dateRange.max.toISOString().split('T')[0]}
                  onChange={(e) => updateDateRangeFilter('end', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Other Filters */}
          {dataColumns.filter(({key}) => key !== 'datetime').map(({key, label}) => (
            <div key={key} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
              <select
                className="w-full border rounded-md px-3 py-2"
                value={dashboardConfig.filters[key] || 'ทั้งหมด'}
                onChange={(e) => updateFilter(key, e.target.value)}
              >
                {filterOptions[key].map(value => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          ))}
          </>
          : ""}
        </div>
      </div>
      

      {/* Main Content */}
      <div className={`
        ${isSidebarOpen ? 'ml-64' : 'ml-16'} 
        flex-grow transition-all duration-300 ease-in-out p-4
      `}>
        {/* Charts Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Layers className="mr-2 h-6 w-6" /> แดชบอร์ด
            </h2>
            <div className="flex space-x-2">
              <button 
                onClick={addChart}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Plus className="mr-2 h-4 w-4" /> เพิ่มกราฟ
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {dashboardConfig.charts.map((chart) => (
              <div 
                key={chart.id} 
                className="bg-gray-50 rounded-lg p-4 relative"
              >
                {/* Chart Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {chart.title}
                  </h3>
                  <button 
                    onClick={() => removeChart(chart.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Chart Configuration */}
                <div className="grid md:grid-cols-3 gap-2 mb-4">
                  {/* X-Axis Selection */}
                  <select
                    value={chart.xAxis}
                    onChange={(e) => updateChart(chart.id, { xAxis: e.target.value })}
                    className="border rounded-md px-2 py-1 text-sm"
                  >
                    {dataColumns.map(({key, label}) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>

                  {/* Y-Axis Selection */}
                  <select
                    value={chart.yAxis}
                    onChange={(e) => updateChart(chart.id, { yAxis: e.target.value })}
                    className="border rounded-md px-2 py-1 text-sm"
                  >
                    {dataColumns.map(({key, label}) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>

                  {/* Chart Type Selection */}
                  <div className="flex space-x-1">
                    {Object.entries(CHART_TYPES).map(([type, { icon: Icon, name }]) => (
                      <button
                        key={type}
                        onClick={() => updateChart(chart.id, { chartType: type })}
                        className={`p-1 rounded-md ${
                          chart.chartType === type 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={name}
                      >
                        <Icon className="h-5 w-5" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aggregation Toggle for Area Field */}
                {chart.yAxis === 'areaOfField' && (
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-sm text-gray-700">ประเภทการรวม:</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateChart(chart.id, { aggregationType: 'individual' })}
                        className={`px-3 py-1 rounded-md text-sm ${
                          chart.aggregationType === 'individual'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        รายวัน
                      </button>
                      <button
                        onClick={() => updateChart(chart.id, { aggregationType: 'cumulative' })}
                        className={`px-3 py-1 rounded-md text-sm ${
                          chart.aggregationType === 'cumulative'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        สะสม
                      </button>
                    </div>
                  </div>
                )}

                {/* Chart Rendering */}
                {renderChart(chart)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;