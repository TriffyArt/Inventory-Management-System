import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import ProductTable from '../components/ProductTable';
const BarcodeScanner = lazy(() => import('../components/BarcodeScanner'));

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scanLog, setScanLog] = useState([]);

  const fetchProducts = () => {
    setLoading(true);
    axios.get('http://localhost/server/api/products.php')
      .then(res => {
        setProducts(res.data);
        const lowStock = res.data.filter(p => p.stock < 5);
        setAlert(lowStock.length ? `${lowStock.length} product(s) are low in stock.` : null);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load products.");
      })
      .finally(() => setLoading(false));
  };

  const fetchScanLogs = () => {
    axios.get('http://localhost/server/api/scanlog.php')
      .then(res => setScanLog(res.data))
      .catch(err => console.error('Failed to load scan logs:', err));
  };

  useEffect(() => {
    fetchProducts();
    fetchScanLogs();
    const interval = setInterval(() => {
      fetchProducts();
      fetchScanLogs();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleScan = (barcode) => {
    const timestamp = new Date().toLocaleString();
    axios.post('http://localhost/server/api/scanlog.php', { barcode, timestamp })
      .then(fetchScanLogs);

    axios.get('http://localhost/server/api/products.php')
      .then(res => {
        const existing = res.data.find(p => p.barcode === barcode);
        if (existing) {
          const updated = { ...existing, stock: parseInt(existing.stock) + 1 };
          axios.post('http://localhost/server/api/products.php', updated)
            .then(() => {
              alert('Existing product found. Stock updated.');
              fetchProducts();
            });
        } else {
          const name = prompt('Enter product name for new barcode:');
          if (!name) return;
          const category = prompt('Enter product category:');
          if (!category) return;
          const warehouse = prompt('Enter warehouse name:');
          if (!warehouse) return;

          const newProduct = { name, category, stock: 1, warehouse, barcode };
          axios.post('http://localhost/server/api/products.php', newProduct)
            .then(() => {
              alert('New product created.');
              fetchProducts();
            });
        }
      })
      .catch(err => console.error('Scan error:', err));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    axios.delete(`http://localhost/server/api/products.php/${id}`)
      .then(() => fetchProducts())
      .catch(err => console.error(err));
  };

  const handleEdit = (product) => {
    const name = prompt('Edit name:', product.name);
    const category = prompt('Edit category:', product.category);
    const warehouse = prompt('Edit warehouse:', product.warehouse);
    const stock = prompt('Edit stock:', product.stock);
    const barcode = prompt('Edit barcode:', product.barcode);

    if (name && category && warehouse && stock && barcode) {
      const updated = { id: product.id, name, category, stock: parseInt(stock), warehouse, barcode };
      axios.post('http://localhost/server/api/products.php', updated)
        .then(() => {
          alert('Product updated.');
          fetchProducts();
        })
        .catch(err => console.error(err));
    }
  };

  const handleManualAdd = () => {
    const name = prompt('Enter product name:');
    const category = prompt('Enter product category:');
    const warehouse = prompt('Enter warehouse name:');
    const stock = prompt('Enter initial stock:');
    const barcode = prompt('Enter barcode:');

    if (name && category && warehouse && stock && barcode) {
      const newProduct = { name, category, stock: parseInt(stock), warehouse, barcode };
      axios.post('http://localhost/server/api/products.php', newProduct)
        .then(() => {
          alert('Product manually added.');
          fetchProducts();
        })
        .catch(err => console.error(err));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Product List</h2>
      <div className="mb-4">
        <button onClick={handleManualAdd} className="bg-green-600 text-white px-4 py-2 rounded">+ Add Product</button>
      </div>
      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Category</th>
              <th className="border px-2 py-1">Stock</th>
              <th className="border px-2 py-1">Warehouse</th>
              <th className="border px-2 py-1">Barcode</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{product.name}</td>
                <td className="border px-2 py-1">{product.category}</td>
                <td className="border px-2 py-1">{product.stock}</td>
                <td className="border px-2 py-1">{product.warehouse}</td>
                <td className="border px-2 py-1">{product.barcode}</td>
                <td className="border px-2 py-1 space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >Edit</button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {alert && <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded">{alert}</div>}

      <h3 className="mt-6 mb-2 text-xl font-medium">Scan Barcode</h3>
      <Suspense fallback={<p>Loading scanner...</p>}>
        {typeof window !== 'undefined' && (
          <BarcodeScanner onScan={(text) => handleScan(text)} />
        )}
      </Suspense>

      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-2">Scan Log</h4>
        <ul className="text-sm text-gray-700 space-y-1 max-h-48 overflow-auto border p-2 bg-white rounded">
          {scanLog.map((log, index) => (
            <li key={index}>
              <span className="font-mono">{log.barcode}</span> scanned at {log.timestamp}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProductsPage;