import { useState } from 'react';
import { Eye, EyeOff, Globe, User, Lock } from 'lucide-react';

export default function ShowPassword({crendentials}) {
    // this component just going to receive the fields and show it to user. that's it. 
    //  this component is going to handle decryption by retriving data from indexed db and decrypting it. 
    // this component is also going to receive which info to show that will be get from retrive.jsx. so it is going to rendered inside retrive.jsx. that would be easy to get it those fields. 
  const {ServiceName,Identifier,Password} = crendentials
  const [showUsername, setShowUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const maskText = (text) => '•'.repeat(text?.length || 8);

  return (
    <div className="w-full max-w-md p-6 rounded-lg shadow-lg">
      <div className="space-y-4">
        {/* Website Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Globe className="w-4 h-4" />
            Website
          </label>
          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">
            {ServiceName || 'Not specified'}
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <User className="w-4 h-4" />
            Username
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-4 py-3 bg-gray-50 text-gray-800 rounded-lg font-mono">
              {showUsername ? Identifier : maskText(Identifier)}
            </div>
            <button
              onClick={() => setShowUsername(!showUsername)}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {showUsername ? (
                <EyeOff className="w-5 h-5 text-gray-600" />
              ) : (
                <Eye className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Lock className="w-4 h-4" />
            Password
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-4 py-3 bg-gray-50 text-gray-800 rounded-lg font-mono">
              {showPassword ? Password : maskText(Password)}
            </div>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-600" />
              ) : (
                <Eye className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}