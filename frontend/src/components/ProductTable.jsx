import React from 'react';

const ProductTable = ({ products }) => {
  return (
    <table className="w-full table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Category</th>
          <th className="px-4 py-2">Stock</th>
          <th className="px-4 py-2">Warehouse</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={index} className={product.stock < 5 ? 'bg-red-100' : ''}>
            <td className="border px-4 py-2">{product.name}</td>
            <td className="border px-4 py-2">{product.category}</td>
            <td className="border px-4 py-2">{product.stock}</td>
            <td className="border px-4 py-2">{product.warehouse}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;