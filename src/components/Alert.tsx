import React from 'react';

const Alert = ({ type, message, onClose }) => {
  // הגדרת הסגנונות בהתאם לסוג האלרט
  const alertStyles = {
    success: "text-green-800 border-green-300 bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800",
    error: "text-red-800 border-red-300 bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800",
    info: "text-blue-800 border-blue-300 bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800",
    warning: "text-yellow-800 border-yellow-300 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800",
  };

  // בחירת סגנון לפי סוג האלרט
  const currentStyle = alertStyles[type] || alertStyles.info;

  return (
    <div className={`flex items-center p-4 mb-4 text-sm border rounded-lg ${currentStyle}`} role="alert">
      <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        {type === 'success' && (
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L8.586 12l-2.293 2.293a1 1 0 001.414 1.414L9 13.414l3.293 3.293a1 1 0 001.414-1.414L10.414 12l2.293-2.293z" />
        )}
        {type === 'error' && (
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm0 6a1 1 0 100-2 1 1 0 000 2z" />
        )}
        {type === 'info' && (
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-4h2v-6h-2v6zM9 9h2V7H9v2z" />
        )}
        {type === 'warning' && (
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm.93-11.412a1 1 0 00-1.86 0l-3 9a1 1 0 001.858.552L10 14.347l2.93 1.693a1 1 0 001.858-.552l-3-9zM10 16a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
        )}
      </svg>
      <span className="sr-only">{type === 'success' ? 'Success' : type === 'error' ? 'Error' : type === 'info' ? 'Info' : 'Warning'}</span>
      <div className="flex-1">
        {message}
      </div>
      <button onClick={onClose} className="ml-4 text-gray-500 dark:text-gray-400">
        <span className="sr-only">Close</span>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default Alert;
