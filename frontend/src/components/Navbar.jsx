import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <h1 className="text-xl font-bold text-gray-700">Inventory System</h1>
      <div className="space-x-4">
        <Link to="/" className="text-gray-600 hover:text-blue-500">Dashboard</Link>
        <Link to="/products" className="text-gray-600 hover:text-blue-500">Products</Link>
        <Link to="/warehouses" className="text-gray-600 hover:text-blue-500">Warehouses</Link>
      </div>
    </nav>
  );
};

export default Navbar;