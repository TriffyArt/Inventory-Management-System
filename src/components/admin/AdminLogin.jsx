import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [loginPassword, setLoginPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (loginPassword === 'admin123') {
      navigate('/admin');
    } else {
      alert('Invalid admin password!');
    }
  };

  return (
    <div className="mx-20 h-auto w-auto pb-28 pt-22 flex flex-col items-center border-2 black rounded-xl bg-gray-400
          bg-gradient-to-b from-white via-gray-300 to-gray-400 font-serif">
        
        <div className='border-2 shadow-md'>
          <div className='w-auto h-auto px-29 py-2 bg-black text-center'>
            <h1 className='text-xl font-semibold text-white'>Admin Login</h1>
          </div>
          
          <div className='bg-gray-200 shadow p-12 rounded font-sans mt-0 font-serif text-center flex flex-col items-center w-100'>

            <img src="/admin.png" alt="admin icon" className='h-30 w-30' />
              
            <input
                type="password"
                className="border p-2 w-full mb-4 rounded-lg"
                placeholder="Enter admin password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            <button
                onClick={handleLogin}
                className="bg-black text-white px-4 py-2 w-full rounded-2xl transition-all font-semibold duration-300 ease-in-out hover:scale-105 hover:text-white cursor-pointer">
                Login
            </button>
          </div>
        </div>
        
    </div>
  );
};

export default AdminLogin;