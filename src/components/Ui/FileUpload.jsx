import { useState, useRef } from 'react';
import { Upload, X, File, CheckCircle } from 'lucide-react';
import { AddfromFiles } from '../../db/models';
import { validateFile } from '../../services/validate';

function FileUpload({onSubmit, acceptedTypes = '.json'}) {
 const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const maxFiles = 1

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const remainingSlots = 1
    const filesToAdd = newFiles.slice(0, remainingSlots);
    
    setFiles(prev => [...prev, ...filesToAdd]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (files.length > 0) {
      onSubmit(files);
      console.log('Submitting files:', files);
      const reader = new FileReader();

      reader.onload = async() => {
        try {
          const json = JSON.parse(reader.result);
          // check if json is in valid format or not
          const validateJson = validateFile(json)
          if (!validateJson) {
            console.error("invalid Json")
            return
          }
          // handle adding to indexedDb
          await AddfromFiles(json)
        } catch (err) {
          window.dispatchEvent(new CustomEvent('error-handle',{detail: {message: "Wrong file added. Only Json are Valid"}}))
          console.error('error reading files',err)
        }
      };

      reader.readAsText(files[0]);
      setFiles([]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Upload Files</h2>
      
      {/* Drag and Drop Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Upload 
          size={48} 
          className={`mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} 
        />
        
        <p className="text-lg font-medium text-gray-700 mb-2">
          {isDragging ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-sm text-gray-500">
          or click to browse
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Max {maxFiles} files
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Selected Files ({files.length}/{maxFiles})
          </h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <File size={20} className="text-blue-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <CheckCircle size={20} className="text-green-500 shrink-0" />
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-3 p-1 hover:bg-gray-200 rounded transition-colors shrink-0"
                  aria-label="Remove file"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={files.length === 0}
          className={`
            flex-1 px-6 py-3 rounded-lg font-medium transition-all
            ${files.length > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Submit {files.length > 0 && `(${files.length})`}
        </button>
        
        {files.length > 0 && (
          <button
            onClick={() => setFiles([])}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}

export default FileUpload
