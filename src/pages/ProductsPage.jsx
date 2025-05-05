import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';

const BarcodeScanner = lazy(() => import('../components/BarcodeScanner'));

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scanLog, setScanLog] = useState([]);
  const [scannedProduct, setScannedProduct] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [formType, setFormType] = useState('add');
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    category: '',
    stock: '',
    barcode: ''
  });

  const fetchProducts = () => {
    setLoading(true);
    axios.get('http://localhost/server/api/products.php?action=display')
      .then(res => {
        setProducts(res.data);
        const lowStock = res.data.filter(p => parseInt(p.stock) < 5);
        setAlert(lowStock.length ? `${lowStock.length} product(s) are low in stock.` : null);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
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
    }, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const handleScan = (barcode) => {
    axios.get(`http://localhost/server/api/products.php?action=barcode&barcode=${barcode}`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          setScannedProduct(res.data[0]);
        } else {
          alert('Product not found for the scanned barcode.');
          setScannedProduct(null);
        }
      })
      .catch(err => {
        console.error('Error fetching product for scanned barcode:', err);
        alert('Failed to fetch product details.');
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    axios.get(`http://localhost/server/api/products.php?action=delete&id=${id}`)
      .then(() => {
        alert('Product deleted successfully.');
        fetchProducts();
      })
      .catch(err => console.error('Error deleting product:', err));
  };

  const openAddModal = () => {
    setFormType('add');
    setFormData({ id: null, name: '', category: '', stock: '', barcode: '' });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setFormType('edit');
    setFormData({ ...product });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { name, category, stock, barcode, id } = formData;
    if (!name || !category || !stock || !barcode || isNaN(parseInt(stock))) {
      alert('Please fill out all fields correctly.');
      return;
    }
    const payload = { name, category, stock: parseInt(stock), barcode };
    const request = formType === 'edit'
      ? axios.post('http://localhost/server/api/products.php?action=update', { ...payload, id })
      : axios.post('http://localhost/server/api/products.php?action=add', payload);

    request
      .then(() => {
        alert(`Product ${formType === 'edit' ? 'updated' : 'added'} successfully.`);
        setShowModal(false);
        fetchProducts();
      })
      .catch(err => console.error(`Error ${formType}ing product:`, err));
  };

  return (
    <div className="mx-20 h-auto w-auto border-2 black rounded-xl bg-gray-400 bg-gradient-to-b from-white via-gray-300 to-gray-400 p-10">
      <h2 className="text-2xl font-semibold mb-4">Product List</h2>
      <div className="mb-4 flex gap-4">
        <button onClick={openAddModal} className="bg-green-600 text-white px-4 py-2 rounded">+ Add Product</button>
        <button onClick={() => setShowScanner(prev => !prev)} className="bg-indigo-600 text-white px-4 py-2 rounded">
          {showScanner ? 'Close Scanner' : 'Open Scanner'}
        </button>
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Category</th>
              <th className="border px-2 py-1">Stock</th>
              <th className="border px-2 py-1">Barcode</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td className="border px-2 py-1">{product.name}</td>
                <td className="border px-2 py-1">{product.category}</td>
                <td className="border px-2 py-1">{product.stock}</td>
                <td className="border px-2 py-1">{product.barcode}</td>
                <td className="border px-2 py-1 space-x-2">
                  <button onClick={() => openEditModal(product)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {alert && <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded">{alert}</div>}

      {showScanner && (
        <div className="mt-6">
          <h3 className="mb-2 text-xl font-medium">Scan QR Code</h3>
          <Suspense fallback={<p>Loading scanner...</p>}>
            <BarcodeScanner onScan={handleScan} />
          </Suspense>
        </div>
      )}

      {scannedProduct && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-semibold">Scanned Product Details</h3>
          <p><strong>Name:</strong> {scannedProduct.name}</p>
          <p><strong>Category:</strong> {scannedProduct.category}</p>
          <p><strong>Stock:</strong> {scannedProduct.stock}</p>
          <p><strong>Barcode:</strong> {scannedProduct.barcode}</p>
        </div>
      )}

      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-2">Scan Log</h4>
        <ul className="text-sm text-gray-700 space-y-1 max-h-48 overflow-auto border p-2 bg-white rounded">
          {Array.isArray(scanLog) && scanLog.map((log, index) => (
            <li key={index}>
              <span className="font-mono">{log.barcode}</span> scanned at {log.timestamp}
            </li>
          ))}
        </ul>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">{formType === 'edit' ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" className="w-full border p-2 rounded" />
              <input name="category" value={formData.category} onChange={handleInputChange} placeholder="Category" className="w-full border p-2 rounded" />
              <input name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Stock" className="w-full border p-2 rounded" />
              <input name="barcode" value={formData.barcode} onChange={handleInputChange} placeholder="Barcode" className="w-full border p-2 rounded" />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  {formType === 'edit' ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
