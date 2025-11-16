import { useState } from 'react';
import { Eye, EyeOff, Globe, User, Lock, CheckCircle } from 'lucide-react';
import Overlay from '../../overlay';
import MasterKey from '../MasterKey';
import { encryption } from '../../../services/cryptoUtils.';
import { addData } from '../../../db/models';
import { checkPasswordConsistency } from '../../../services/bcrypt';
import { ListOfServices } from '../../../constants/ServiceList';
import SelectService from '../SelectService';

const AddForm = ({closeOverlay}) => {

  const [formData, setFormData] = useState({
    websiteName: '',
    usernameOrEmail: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  // onSubmit - handling encryption and saving to db
  const onSubmit = async(masterkey) => {
    
    let newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('handling submit')
    // handling encryption
    // checking if the master key is any genuine by seeing the response of already existed db,if not password is inconsistent skip it if it's first element
    // handling password matching
    const isConsistent = await checkPasswordConsistency(masterkey)
    if(!isConsistent) {
      console.error("inconsistent password")
      newErrors.masterKey = 'Inconsistent Password, Please use same masterKey to encrypt all password.'
      setErrors(newErrors)
      return
    }
    closeOverlay()
    let unencryptedPassword = formData.password
    const {cipherText,salt,iv} = await encryption(unencryptedPassword, masterkey)
    // desinging the data object to store it to db.
    const data = {
      ServiceName: formData.websiteName,
      Fields: {
        Identifier: formData.usernameOrEmail,
        Passwd: cipherText,
        Decrypt: {
          Salt: salt,
          Iv: iv,
        }
      }
      }
      // saving to db
      await addData(data)
      // clean up
      setFormData({
      websiteName: '',
      usernameOrEmail: '',
      password: ''
    });
    setErrors({});

    }
  const onCancel = () => {
    console.log('handling canceling')
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.websiteName.trim()) {
      newErrors.websiteName = 'Website name is required';
    }
    
    if (!formData.usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = 'Username or email is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
    
  //   const newErrors = validate();
    
  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     return;
  //   }
    
  //   setFormData({
  //     websiteName: '',
  //     usernameOrEmail: '',
  //     password: ''
  //   });
  //   setErrors({});
  // };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-text mb-6">Add Credentials</h2>
      
      <div className="space-y-5">
        {/* Website Name Field */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Website Name
          </label>
          <div className="relative">
            {/* <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Globe size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              name="websiteName"
              value={formData.websiteName}
              onChange={handleChange}
              placeholder="e.g., Google, Facebook, GitHub"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.websiteName ? 'border-red-500' : 'border-gray-300'
              }`}
            /> */}
              <SelectService handleChange={handleChange} formData={formData} />
          </div>
          {errors.websiteName && (
            <p className="text-red-500 text-xs mt-1">{errors.websiteName}</p>
          )}
        </div>

        {/* Username or Email Field */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Username or Email
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <User size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              placeholder="username or email@example.com"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.usernameOrEmail ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.usernameOrEmail && (
            <p className="text-red-500 text-xs mt-1">{errors.usernameOrEmail}</p>
          )}


        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Lock size={20} className="text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-2">
          {errors.masterKey && <div className='text-red-700'>{errors.masterKey}</div>} 
          {/* calling to master key to get master key */}
          <Overlay
          trigger={
            <button
              className="flex-1 bg-button text-white px-6 py-3 rounded-lg font-medium hover:bg-button-hover transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              Submit
            </button>
          }
          >
            {/* Masterkey overlay */}
            {({closeOverlay}) => (
              <MasterKey onSubmit={onSubmit} closeOverlay={closeOverlay} />
            ) }
          </Overlay>
          
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );

}
export default AddForm;