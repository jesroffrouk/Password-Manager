import { useEffect, useState } from "react";
import { X } from 'lucide-react';

const Overlay = ({ children, trigger, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(()=>{
    // there is a bug in this function that i need to fix so in my app.jsx for rendering download component as overlay , i don't pass the trigger so i want it to run this but sometimes i might want it to run if it's children is changed. well it's fine for now but i would have to fix it to make it render when i don't pass trigger. In another word, I need to build consistency of this component , which I am going to fix later on. 
    if(!trigger){
      setIsOpen(true)
    }
  },[children])

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false) 
    }, 500);
    if (onClose) onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      {/* Trigger element */}
      {
        trigger && <div onClick={handleOpen}>{trigger}</div>
      }

      {/* Overlay */}
      {isOpen && (
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4 ${isClosing ? 'animate-collapse': 'animate-expand'}`}
          onClick={handleBackdropClick}
        >
          <div className="bg-bg border rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto relative">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close overlay"
            >
              <X size={20} className="text-gray-600" />
            </button>

            {/* Content */}
            <div className="p-6">
               {typeof children === 'function' ? children({ closeOverlay: handleClose }) : children}
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        @keyframes expand {
          from {
            opacity: 0;
            transform: scale(0.7);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes collapse {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.7);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        .animate-expand {
          animation: expand 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-collapse {
          animation: collapse 0.5s cubic-bezier(0.7, 0, 0.84, 0) forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-fadeOut {
          animation: fadeOut 0.5s ease-in forwards;
        }
      `}</style>
    </>
  );
};

export default Overlay