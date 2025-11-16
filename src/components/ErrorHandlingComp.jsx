import { X } from 'lucide-react';

export const  ErrorHandlingComp = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-bg border rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-red-500 px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h3 className="text-lg font-semibold">Error</h3>
          <button
            onClick={onClose}
            className=" hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <p className="">{message}</p>
        </div>
        <div className="px-6 py-4 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
