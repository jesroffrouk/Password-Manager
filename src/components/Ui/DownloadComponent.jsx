import { useEffect, useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { dataExist, RetriveAllData } from '../../db/models';
import { CleaningDB } from '../../db/models';

export default function DownloadComponent({closeOverlay}) {
  const [status, setStatus] = useState('');
  const [dataAlreadyExist,setDataAlreadyExist] = useState(false)

  useEffect(()=>{
    const handleAsync = async() =>{
      const data = await dataExist()
      setDataAlreadyExist(data)
    }
    handleAsync()
    window.addEventListener("db-updated",handleAsync)
    return () => window.removeEventListener("db-updated",handleAsync)
  },[])

  const handleSave = async() => {
    // before saving retrive data from db.
    const data = await RetriveAllData()
    // Create a blob with the data
    let jsonData = JSON.stringify(data)
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `data-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Show status and clear after a short delay
    setStatus('File saved! Clearing data...');
    setTimeout(() => {
      handleClear();
      setStatus('Data cleared successfully!');
      setTimeout(() => setStatus(''), 2000);
    }, 1000);
  };

  const handleClear = async() => {
    await CleaningDB()
    if(closeOverlay) closeOverlay()
  };

  return (
    <div className="mx-auto flex items-center justify-center p-4 ">
      {/* handle width for overlay separately */}
      <div className={`rounded-lg shadow-lg ${closeOverlay ? '':'border border-text'} p-8 container-size`}>
        <h1 className="text-2xl font-bold mb-6">Data Manager</h1>
        
        <div className="bg-text border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            If you want to extract, save it to file and clear data.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!dataAlreadyExist}
            className="flex-1 flex items-center justify-center gap-2 bg-button text-white px-6 py-3 rounded-lg font-medium hover:bg-button-hover disabled:bg-gray-300 disabled:text-bg disabled:cursor-not-allowed transition-colors"
          >
            <Download size={20} />
            Save to File
          </button>
          
          <button
            onClick={handleClear}
            disabled={!dataAlreadyExist}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:text-bg disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 size={20} />
            Clear
          </button>
        </div>

        {status && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 text-center">{status}</p>
          </div>
        )}
      </div>
    </div>
  );
}