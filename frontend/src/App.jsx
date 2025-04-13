import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import WarehousesPage from './pages/WarehousesPage';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');

  const handleLogin = () => {
    if (loginPassword === 'admin123') {
      setLoggedIn(true);
    } else {
      alert('Invalid admin password!');
    }
  };

  if (!loggedIn) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <input
          type="password"
          className="border p-2 w-full mb-4"
          placeholder="Enter admin password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 w-full rounded"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/warehouses" element={<WarehousesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
