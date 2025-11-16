import { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

// using hashPassword to verify key everytime that's will be better for handling db  so there will be a field name jwt password. adding masterkey on first entry and retriving everytime if it's broked. 

export default function MasterKey({ onSubmit , closeOverlay }) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password.trim()) return;
    
    setIsLoading(true);
    try {
      await onSubmit?.(password);
      closeOverlay?.()
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };


  return (
    <div className="w-full max-w-md p-6 rounded-lg shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-text" />
          <h2 className="text-xl font-semibold text-text">Master Password</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={handleKeyPress}
            placeholder="Enter master password"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
            autoFocus
          />
          <button
            onClick={handleSubmit}
            disabled={!password.trim() || isLoading}
            className="p-3 bg-button text-white rounded-lg hover:bg-button-hover disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}