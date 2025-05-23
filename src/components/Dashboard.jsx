import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [lowStockCount, setLowStockCount] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [productStats, setProductStats] = useState({ total_products: 0, low_stock_products: 0 });
  const [recentProducts, setRecentProducts] = useState([]);
  const [showLowStockModal, setShowLowStockModal] = useState(false);

  useEffect(() => {
    axios.get('http://localhost/server/api/products.php?action=low_stock_warning')
      .then(res => {
        console.log('Low stock API response:', res.data); // Debug line
        setLowStockCount(res.data.low_stock_count || 0);

        // Defensive: always set an array
        if (Array.isArray(res.data.low_stock_products)) {
          setLowStockProducts(res.data.low_stock_products);
        } else if (res.data.low_stock_products && typeof res.data.low_stock_products === 'object') {
          // If backend returns an object, wrap it in an array
          setLowStockProducts([res.data.low_stock_products]);
        } else {
          setLowStockProducts([]);
        }
      })
      .catch(err => console.error('Low Stock Fetch Error:', err));

    axios.get('http://localhost/server/api/products.php?action=product_stats')
      .then(res => setProductStats(res.data))
      .catch(err => console.error('Product Stats Error:', err));

    axios.get('http://localhost/server/api/products.php?action=recently_added')
      .then(res => {
        if (Array.isArray(res.data)) {
          setRecentProducts(res.data);
        } else {
          console.error("Expected array but got", typeof res.data);
        }
      })
      .catch(err => console.error('Recently Added Error:', err));
  }, []);

  const handleEditProduct = (product) => {
    alert(`Edit product: ${product.name}`);
  };

  return (
    <div className="mx-20 h-auto w-auto border-2 black rounded-xl bg-gray-400 bg-gradient-to-b from-white via-gray-300 to-gray-400 p-10">

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div
          className="bg-white border-2 black rounded-xl p-6 shadow cursor-pointer hover:bg-red-50 transition"
          onClick={() => setShowLowStockModal(true)}
          title="Click to view low stock products"
        >
          <h3 className="text-center text-lg font-semibold mb-2">Low Stocks Warning Display</h3>
          <p className="text-center text-2xl font-bold text-red-600 underline">{lowStockCount} low products</p>
        </div>

        <div className="bg-white border-2 black rounded-xl p-6 shadow">
          <h3 className="text-lg font-semibold mb-2">Total Products</h3>
          <p className="text-xl text-green-400">{productStats.total_products}</p>
          <h3 className="text-lg font-semibold mt-4">Total Low Stock Products</h3>
          <p className="text-xl text-yellow-400">{productStats.low_stock_products}</p>
        </div>
      </div>

      <div className="bg-white border-2 black rounded-xl p-6 shadow h-64 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Recently Added Products</h3>
        <ul className="space-y-2 text-gray-800">
          {recentProducts.length === 0 ? (
            <li>No recent products</li>
          ) : (
            recentProducts.map((product, index) => (
              <li key={index}>• {product.name || product}</li>
            ))
          )}
        </ul>
      </div>

      {/* Low Stock Modal */}
      {showLowStockModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h3 className="text-lg font-bold mb-4 text-red-600">Low Stock Products</h3>
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-600">No low stock products.</p>
            ) : (
              <table className="w-full border text-sm mb-4">
                <thead className="bg-red-100">
                  <tr>
                    <th className="border px-2 py-1">Name</th>
                    <th className="border px-2 py-1">Category</th>
                    <th className="border px-2 py-1">Stock</th>
                    <th className="border px-2 py-1">Actions</th> {/* Add Actions column */}
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((product, idx) => (
                    <tr key={idx} className="bg-red-50">
                      <td className="border px-2 py-1 font-semibold">{product.name}</td>
                      <td className="border px-2 py-1">{product.category}</td>
                      <td className="border px-2 py-1 text-red-600 font-bold">{product.stock}</td>
                      <td className="border px-2 py-1">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                          onClick={() => handleEditProduct(product)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              onClick={() => setShowLowStockModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
