import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa';

const AddReceiptForm = () => {
  const [receiptId, setReceiptId] = useState(null);
  const [receiptDate, setReceiptDate] = useState('');
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProductID, setSelectedProductID] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddItem = () => {
    if (selectedProductID && quantity) {
      const product = products.find((p) => p.ProductID === parseInt(selectedProductID));
      if (product) {
        setItems([
          ...items,
          {
            ProductID: product.ProductID,
            ProductName: product.ProductName,
            Quantity: quantity,
            Price: product.UnitPrice,
          },
        ]);
        setSelectedProductID('');
        setQuantity('');
      }
    }
  };

  const handleDeleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmitAndPrint = async (e) => {
    e.preventDefault();
    
    const validItems = items.map(item => ({
      itemId: item.ProductID,
      quantity: parseFloat(item.Quantity),
      price: parseFloat(item.Price),
    }));
  
    const isValid = validItems.every(item => {
      const hasValidId = Boolean(item.itemId);
      const hasValidQuantity = !isNaN(item.quantity) && item.quantity > 0;
      const hasValidPrice = !isNaN(item.price) && item.price >= 0;
      return hasValidId && hasValidQuantity && hasValidPrice;
    });
  
    if (!isValid) {
      alert("Please enter valid itemId, quantity, and price values for all items.");
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/add-receipt', {
        receiptDate,
        items: validItems,
      });
  
      // Assuming the response includes a receipt ID
      setReceiptId(response.data.receiptId);

      alert('Receipt added successfully!');
      setReceiptDate('');
      setItems([]);
      
      // Trigger print after successful submission
      window.print();
    } catch (error) {
      console.error('Error adding receipt:', error.response ? error.response.data : error.message);
      alert('Error adding receipt. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4 lg:flex lg:space-x-8">
      <div className="lg:w-1/2 p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Add Product to Receipt</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Date:</label>
          <input
            type="date"
            value={receiptDate}
            onChange={(e) => setReceiptDate(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Product:</label>
          <select
            value={selectedProductID}
            onChange={(e) => setSelectedProductID(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600"
          >
            <option value="">Choose a product</option>
            {products.map((product) => (
              <option key={product.ProductID} value={product.ProductID}>
                {product.ProductName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600"
          />
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
        >
          Add to Receipt
        </button>
      </div>

      <div className="lg:w-1/2 mt-6 lg:mt-0 p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Receipt Details</h2>

        {/* Print-only section */}
        <div className="print-section">
          <p className="mb-2">
            <strong>Receipt ID:</strong> {receiptId}
          </p>
          <p className="mb-4">
            <strong>Receipt Date:</strong> {receiptDate}
          </p>

          {items.length > 0 ? (
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-blue-100">
                  <th className="py-2 px-4 border-b">Product Name</th>
                  <th className="py-2 px-4 border-b">Quantity</th>
                  <th className="py-2 px-4 border-b">Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{item.ProductName}</td>
                    <td className="py-2 px-4">{item.Quantity}</td>
                    <td className="py-2 px-4">{item.Price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">No items added to receipt.</p>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={handleSubmitAndPrint}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit & Print Receipt
          </button>
        </div>
      </div>

      <style jsx>{`
        /* Hide everything except the print section when printing */
        @media print {
          body * {
            visibility: hidden;
          }
          .print-section, .print-section * {
            visibility: visible;
          }
          .print-section {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AddReceiptForm;
