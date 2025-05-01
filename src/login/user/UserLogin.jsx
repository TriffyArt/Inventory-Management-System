import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (loginUsername === 'user' && loginPassword === 'user123') { 
      navigate('/user');
    } else {
      alert('Invalid username or password!');
    }
  };

  return (
    <div className="mx-20 h-auto w-auto pb-22 pt-22 flex flex-col items-center border-2 black rounded-xl bg-gray-400
          bg-gradient-to-b from-white via-gray-300 to-gray-400 font-serif">
      
      <div className="border-2 shadow-md">
        <div className="w-auto h-auto px-31 py-2 bg-black shadow items-center">
          <h1 className="text-xl font-semibold text-white">User Login</h1>
        </div>

        <div className="bg-gray-200 shadow p-8 rounded font-sans mt-0 font-serif text-center flex flex-col items-center w-90">

          <img src="/user.png" alt="user icon" className="h-30 w-28 pb-4"/>

          <input
            type="text"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            className="border p-2 w-full mb-4 rounded-lg"
            placeholder="Enter username"
          />

          <input
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="border p-2 w-full mb-4 rounded-lg"
            placeholder="Enter user password"
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

export default UserLogin;
