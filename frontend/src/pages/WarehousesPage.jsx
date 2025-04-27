import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WarehousesPage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [products, setProducts] = useState([]);
  const [adminPassword, setAdminPassword] = useState('');

  const fetchWarehouses = () => {
    setLoading(true);
    axios.get('http://localhost/server/api/warehouses.php')
      .then(res => {
        setWarehouses(res.data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load warehouses.");
      })
      .finally(() => setLoading(false));
  };

  const fetchProductsByWarehouse = (warehouseName) => {
    axios.get('http://localhost/server/api/products.php')
      .then(res => {
        const filtered = res.data.filter(p => p.warehouse === warehouseName);
        setProducts(filtered);
        setSelectedWarehouse(warehouseName);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const generateDemoStocks = () => {
    if (adminPassword !== 'admin123') {
      alert('Invalid admin password!');
      return;
    }

    const categories = ['Electronics', 'Clothing', 'Books'];
    const sampleProducts = warehouses.map((w, index) => ({
      name: `Sample Product ${index + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      stock: Math.floor(Math.random() * 20),
      warehouse: w.name,
      barcode: Math.random().toString(36).substring(2, 12)
    }));

    Promise.all(sampleProducts.map(product =>
      axios.post('http://localhost/server/api/products.php', product)
    ))
      .then(() => {
        alert('Sample stock generated!');
        if (selectedWarehouse) fetchProductsByWarehouse(selectedWarehouse);
      })
      .catch(err => {
        console.error(err);
        alert('Error generating sample stock.');
      });
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const addWarehouse = () => {
    if (!name.trim()) return alert('Warehouse name is required.');
    axios.post('http://localhost/server/api/warehouses.php', { name })
      .then(() => {
        setName('');
        fetchWarehouses();
      })
      .catch(err => console.error(err));
  };

  const editWarehouse = (id, currentName) => {
    const newName = prompt('Enter new warehouse name:', currentName);
    if (!newName || newName === currentName) return;
    axios.post('http://localhost/server/api/warehouses.php', { id, name: newName })
      .then(() => {
        fetchWarehouses();
      })
      .catch(err => console.error(err));
  };

  const deleteWarehouse = (id) => {
    if (!window.confirm('Are you sure you want to delete this warehouse?')) return;
    axios.delete(`http://localhost/server/api/warehouses.php/${id}`)
      .then(() => fetchWarehouses())
      .catch(err => console.error(err));
  };

  return (
    <div className="mx-20 h-auto w-auto border-2 black rounded-xl bg-gray-400
    bg-gradient-to-b from-white via-gray-300 to-gray-400 p-10">

      <h2 className="text-2xl font-semibold mb-4">Warehouses</h2>

      {loading && <p>Loading warehouses...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex space-x-2 mb-4">
        <input
          className="border p-2"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="New warehouse name"
        />
        <button
          onClick={addWarehouse}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul className="mb-6">
        {warehouses.map(w => (
          <li key={w.id} className="flex justify-between items-center border-b py-2 cursor-pointer hover:bg-gray-100">
            <span onClick={() => fetchProductsByWarehouse(w.name)}>{w.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => editWarehouse(w.id, w.name)}
                className="text-blue-500"
              >
                Edit
              </button>
              <button
                onClick={() => deleteWarehouse(w.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedWarehouse && (
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Products in {selectedWarehouse}</h3>
          {products.length === 0 ? (
            <p>No products yet.</p>
          ) : (
            <ul className="list-disc pl-6">
              {products.map((p, i) => (
                <li key={i}>{p.name} - Stock: {p.stock}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mt-6">
        <h4 className="font-semibold mb-2">Admin: Generate Demo Stock</h4>
        <input
          type="password"
          className="border p-2 mr-2"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          placeholder="Enter admin password"
        />
        <button
          onClick={generateDemoStocks}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Generate
        </button>
      </div>
    </div>
  );
};

export default WarehousesPage;
