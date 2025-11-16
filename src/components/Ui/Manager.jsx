import { useState } from 'react';
import { Plus } from 'lucide-react';
import Overlay from '../overlay';
import AddForm from './options/Add'
import DeleteForm from './options/Delete';
import RetriveForm from './options/Retrive';
import DownloadComponent from './DownloadComponent';
import {CheckCheck,Trash,ShieldPlus} from 'lucide-react'


const Home = ({ 
  options = [],
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="container-size mx-auto rounded-lg border border-text shadow-lg p-6">
      {/* Header with Title and Plus Icon */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl">Manager section</h2>
        <div className="relative">
          <button
            onClick={handleToggleMenu}
            className="p-3 bg-button rounded-full hover:bg-button-hover transition-all hover:scale-110 active:scale-95"
            aria-label="Open menu"
          >
            <Plus size={24} className={`transition-transform ${isMenuOpen ? 'rotate-45' : ''}`} />
          </button>
          
          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-bg rounded-lg shadow-xl border border-gray-200 z-10">
              {options.map((option, index) => (
                <Overlay
                trigger={
                <button
                  key={index}
                  className="w-full text-left px-4 py-3 hover:bg-text rounded-lg text-text hover:text-bg transition-colors flex items-center gap-3"
                >
                  {option.icon && <span className="">{option.icon}</span>}
                  <div>
                    <div className="font-medium">{option.label}</div>
                    {option.description && (
                      <div className="text-xs text-gray-500">{option.description}</div>
                    )}
                  </div>
                </button>
                }  
                key={option.id}
               >
                {option.trigger}
                </Overlay>
                // options click


              ))}
            </div>
          )}
        </div>
      </div>

      {/* Description/Information Section */}
      <div className="mb-6">
        <p className="text-gray-600 text-center leading-relaxed">
          this is password management section. 
        </p>
      </div>
    </div>
  );
};

const Manager = () => {
  const options = [
    { 
      id: 'Add', 
      label: 'Add new field', 
      description: 'add new password field',
      icon: <ShieldPlus />,
      trigger: ({closeOverlay})=>(<AddForm closeOverlay={closeOverlay}/>)
    },
    { 
      id: 'Retrive', 
      label: 'Get Password', 
      description: 'get password',
      icon: <CheckCheck />,
      trigger: (<RetriveForm/>)
    },
    { 
      id: 'Delete', 
      label: 'Delete an entry', 
      description: 'Delete an existing Entry',
      icon: <Trash />,
      trigger: ({closeOverlay})=>(<DeleteForm closeOverlay={closeOverlay}/>)
    },
  ];

  return (
    <div className="p-8">
      <Home
        options={options}
      />
      <DownloadComponent />
    </div>
  );
};

export default Manager;