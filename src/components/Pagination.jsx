import React from 'react';

const Pagination = ({
  filteredData,
  indexOfFirstItem,
  indexOfLastItem,
  currentPage,
  totalPages,
  handlePageChange,
  itemsPerPage,
  setItemsPerPage
}) => {
  return (
    <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
      <div className="flex-1 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-700">
            แสดง <span className="font-medium">{indexOfFirstItem + 1}</span> ถึง{' '}
            <span className="font-medium">
              {Math.min(indexOfLastItem, filteredData.length)}
            </span>{' '}
            จากทั้งหมด <span className="font-medium">{filteredData.length}</span> รายการ
          </p>
        </div>
        <div className="flex items-center">
          <select
            className="mr-4 border rounded-md px-2 py-1 text-sm"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              handlePageChange(1);
            }}
          >
            <option value={5}>5 รายการต่อหน้า</option>
            <option value={10}>10 รายการต่อหน้า</option>
            <option value={20}>20 รายการต่อหน้า</option>
            <option value={50}>50 รายการต่อหน้า</option>
            <option value={100}>100 รายการต่อหน้า</option>
          </select>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                currentPage === 1 
                  ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="sr-only">ก่อนหน้า</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Page Number Buttons */}
            {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
              // Calculate page numbers to show (centered around current page)
              let pageNum;
              if (totalPages <= 5) {
                pageNum = index + 1;
              } else if (currentPage <= 3) {
                pageNum = index + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + index;
              } else {
                pageNum = currentPage - 2 + index;
              }
              
              // Only show if pageNum is valid
              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      currentPage === pageNum
                        ? 'z-10 bg-green-50 border-green-500 text-green-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}
            
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                currentPage === totalPages 
                  ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="sr-only">ถัดไป</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;