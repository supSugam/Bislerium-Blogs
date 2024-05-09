import React from 'react';
import { cn } from '../utils/cn';

interface PaginationProps {
  onPageChange: (pageNumber: number) => void;
  pageSize: number;
  totalItems: number;
  currentPage: number;
}

const Paginate: React.FC<PaginationProps> = ({
  onPageChange,
  pageSize,
  totalItems,
  currentPage,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li key={i}>
          <a
            href="#"
            className={cn(
              'inline-flex items-center',
              i === currentPage
                ? 'border border-gray-300 bg-gray-100'
                : 'border border-gray-300 bg-white',
              'px-4 py-2 text-gray-500 hover:bg-gray-50'
            )}
            onClick={() => onPageChange(i)}
          >
            {i}
          </a>
        </li>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex justify-center w-full self-end mt-auto">
      <nav aria-label="Pagination">
        <ul className="inline-flex items-center -space-x-px rounded-md text-sm shadow-sm">
          <li>
            <button
              className={cn(
                'inline-flex items-center space-x-2 rounded-l-md border',
                'px-4 py-2 font-medium text-gray-500 hover:bg-gray-50',
                {
                  'border-gray-300 bg-white': currentPage !== 1,
                  'border-gray-300 bg-gray-100 cursor-not-allowed':
                    currentPage === 1,
                }
              )}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Previous</span>
            </button>
          </li>
          {renderPageNumbers()}
          <li>
            <button
              className={cn(
                'inline-flex items-center space-x-2 rounded-r-md border',
                'px-4 py-2 font-medium text-gray-500 hover:bg-gray-50',
                {
                  'border-gray-300 bg-white': currentPage !== totalPages,
                  'border-gray-300 bg-gray-100 cursor-not-allowed':
                    currentPage === totalPages,
                }
              )}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <span>Next</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Paginate;
