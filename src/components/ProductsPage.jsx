import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import { flushSync } from 'react-dom';

const BarcodeScanner = lazy(() => import('../components/BarcodeScanner'));

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scannedProduct, setScannedProduct] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [formType, setFormType] = useState('add');
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    category: '',
    stock: '',
    barcode: '',
    warehouse_id: ''
  });
  const [warehouseForm, setWarehouseForm] = useState({
    name: '',
    location: ''
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    axios.get('http://localhost/server/api/products.php?action=display')
      .then(res => {
        setProducts(res.data);
        const lowStock = res.data.filter(p => parseInt(p.stock) < 5);
        setLowStockProducts(lowStock);
        setAlert(lowStock.length ? `${lowStock.length} product(s) are low in stock.` : null);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setError("Failed to load products.");
      })
      .finally(() => setLoading(false));
  };

  const fetchCategories = () => {
    axios.get('http://localhost/server/api/products.php?action=categories')
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  };

  const fetchWarehouses = () => {
    axios.get('http://localhost/server/api/products.php?action=warehouses')
      .then(res => setWarehouses(res.data))
      .catch(() => setWarehouses([]));
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchWarehouses();
    const interval = setInterval(() => {
      fetchProducts();
    }, 60000);
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
    setFormData({
      id: product.id,
      name: product.name,
      category: product.category,
      stock: product.stock,
      barcode: product.barcode,
      warehouse_id: product.warehouse_id || ''
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleWarehouseInputChange = (e) => {
    const { name, value } = e.target;
    setWarehouseForm({ ...warehouseForm, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { name, category, stock, barcode, warehouse_id, id } = formData;

    if (!name || !category || !stock || !barcode || !warehouse_id || isNaN(parseInt(stock))) {
      alert('Please fill out all fields correctly.');
      return;
    }

    const payload = { name, category, stock: parseInt(stock), barcode, warehouse_id };
    const url = formType === 'edit'
      ? 'http://localhost/server/api/products.php?action=update'
      : 'http://localhost/server/api/products.php?action=add';

    try {
      const response = await axios.post(url, formType === 'edit' ? { ...payload, id } : payload);

      if (response.status === 200) {
        flushSync(() => {
          setShowModal(false);
        });

        setFormData({ id: null, name: '', category: '', stock: '', barcode: '', warehouse_id: '' });
        fetchProducts();

        setTimeout(() => {
          alert(`Product ${formType === 'edit' ? 'updated' : 'added'} successfully.`);
        }, 100);
      } else {
        alert('Something went wrong.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while processing the product.');
    }
  };

  const handleAddWarehouse = async (e) => {
    e.preventDefault();

    const { name, location } = warehouseForm;

    if (!name || !location) {
      alert('Please fill out all fields correctly.');
      return;
    }

    try {
      const response = await axios.post('http://localhost/server/api/products.php?action=addWarehouse', warehouseForm);

      if (response.status === 200) {
        setShowWarehouseModal(false);
        setWarehouseForm({ name: '', location: '' });
        fetchWarehouses();
        alert('Warehouse added successfully.');
      } else {
        alert('Something went wrong.');
      }
    } catch (error) {
      console.error('Error adding warehouse:', error);
      alert('An error occurred while adding the warehouse.');
    }
  };

  return (
    <div className="mx-20 h-auto w-auto border-2 black rounded-xl bg-gray-400 bg-gradient-to-b from-white via-gray-300 to-gray-400 p-10">
      <h2 className="text-2xl font-semibold mb-4">Product List</h2>
      <div className="mb-4 flex gap-4 items-center">
        <button onClick={openAddModal} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-200 shadow-md hover:shadow-lg active:scale-95">
          + Add Product
        </button>
        <button onClick={() => setShowScanner(prev => !prev)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition duration-200 shadow-md hover:shadow-lg active:scale-95">
          {showScanner ? 'Close Scanner' : 'Open Scanner'}
        </button>
        <button onClick={() => setShowWarehouseModal(true)} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded">
          Add Warehouse
        </button>
        <select
          className="border rounded px-3 py-2"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          className="border rounded px-3 py-2"
          value={selectedWarehouse}
          onChange={e => setSelectedWarehouse(e.target.value)}
        >
          <option value="">All Warehouses</option>
          {warehouses.map(wh => (
            <option key={wh.id} value={wh.id}>{wh.name}</option>
          ))}
        </select>
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
              <th className="border px-2 py-1">Warehouse</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter(product =>
                (!selectedCategory || product.category === selectedCategory) &&
                (!selectedWarehouse || String(product.warehouse_id) === String(selectedWarehouse))
              )
              .map(product => (
                <tr key={product.id}>
                  <td className="border px-2 py-1">{product.name}</td>
                  <td className="border px-2 py-1">{product.category}</td>
                  <td className="border px-2 py-1">{product.stock}</td>
                  <td className="border px-2 py-1">{product.barcode}</td>
                  <td className="border px-2 py-1">{product.warehouse_name || 'N/A'}</td>
                  <td className="border px-2 py-1 space-x-2">
                    <button onClick={() => openEditModal(product)} className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition duration-200 shadow-md hover:shadow-lg active:scale-95">Edit</button>
                    <button onClick={() => handleDelete(product.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition duration-200 shadow-md hover:shadow-lg active:scale-95">Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {alert && (
        <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded">
          <div>{alert}</div>
          {lowStockProducts.length > 0 && (
            <ul className="mt-2 space-y-1">
              {lowStockProducts.map(product => (
                <li key={product.id} className="flex items-center justify-between">
                  <span>
                    <strong>{product.name}</strong> (Stock: {product.stock})
                  </span>
                  <button
                    className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                    onClick={() => openEditModal(product)}
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

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
          <div className="mt-3 flex gap-2">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              onClick={() => openEditModal(scannedProduct)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              onClick={() => handleDelete(scannedProduct.id)}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">{formType === 'edit' ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" className="w-full border p-2 rounded" />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Stock" className="w-full border p-2 rounded" />
              <input name="barcode" value={formData.barcode} onChange={handleInputChange} placeholder="Barcode" className="w-full border p-2 rounded" />
              <select
                name="warehouse_id"
                value={formData.warehouse_id || ""}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Warehouse</option>
                {warehouses.map(wh => (
                  <option key={wh.id} value={wh.id}>{wh.name}</option>
                ))}
              </select>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded transition duration-200">Cancel</button>
                <button type="button" onClick={handleFormSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200">
                  {formType === 'edit' ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-xs">
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <ul className="mb-4">
              {categories.length === 0 ? (
                <li className="text-gray-500">No categories found.</li>
              ) : (
                categories.map(cat => (
                  <li key={cat} className="py-1 border-b last:border-b-0">{cat}</li>
                ))
              )}
            </ul>
            <button
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded transition duration-200"
              onClick={() => setShowCategoryModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showWarehouseModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-xs">
            <h3 className="text-lg font-bold mb-4">Add Warehouse</h3>
            <form onSubmit={handleAddWarehouse}>
              <input name="name" value={warehouseForm.name} onChange={handleWarehouseInputChange} placeholder="Warehouse Name" className="w-full border p-2 rounded mb-2" />
              <input name="location" value={warehouseForm.location} onChange={handleWarehouseInputChange} placeholder="Location" className="w-full border p-2 rounded mb-2" />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowWarehouseModal(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


export default ProductsPage;
