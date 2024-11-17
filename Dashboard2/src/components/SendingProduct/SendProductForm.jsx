import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa';

const SendProductForm = () => {
  const [branches, setBranches] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedBranchID, setSelectedBranchID] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [items, setItems] = useState([]);
  const [selectedProductID, setSelectedProductID] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchResponse, productResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/branches'),
          axios.get('http://localhost:5000/api/products'),
        ]);
        setBranches(branchResponse.data);
        setProducts(productResponse.data);
      } catch (error) {
        console.error('Error fetching branches or products:', error);
      }
    };

    fetchData();
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
            UnitPrice: product.UnitPrice,
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
  
    if (!selectedBranchID || !invoiceDate || items.length === 0) {
      alert('Please fill in all fields.');
      return;
    }
  
    try {
      // Submit invoice data
      const invoiceResponse = await axios.post('http://localhost:5000/api/sending-invoice', {
        BranchID: selectedBranchID,
        DateSent: invoiceDate,
        Remarks: remarks,
      });
  
      const invoiceID = invoiceResponse.data.invoiceID;
  
      if (!invoiceID) {
        alert('Invoice ID is missing.');
        return;
      }
  
      // Fetch branch details using the selectedBranchID
      const branchResponse = await axios.get(`http://localhost:5000/api/branch/${selectedBranchID}`);
      const branchName = branchResponse.data.name;  // Assuming your API returns `name` and `address` fields
      const branchAddress = branchResponse.data.address;
  
      // Submit each product in the invoice
      const sendingProductPromises = items.map((item) =>
        axios.post('http://localhost:5000/api/sending-product-details', {
          InvoiceID: invoiceID,
          ProductID: item.ProductID,
          Quantity: item.Quantity,
        })
      );
  
      await Promise.all(sendingProductPromises);
  
      alert('Products sent to branch successfully!');
  
      // Clear form fields and items for a new invoice
      setSelectedBranchID('');
      setInvoiceDate('');
      setRemarks('');
      setItems([]);
  
      // Prepare print content with invoice details and products
      const printContents = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h1>Invoice</h1>
          <p><strong>Invoice Number:</strong> ${invoiceID}</p>
          <p><strong>Date:</strong> ${invoiceDate}</p>
          <p><strong>Branch:</strong> ${branchName}</p>
          <p><strong>Address:</strong> ${branchAddress}</p>
          <p><strong>Remarks:</strong> ${remarks}</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background-color: #f0f0f0;">
                <th style="padding: 8px; border: 1px solid #ccc;">Product Name</th>
                <th style="padding: 8px; border: 1px solid #ccc;">Quantity</th>
                <th style="padding: 8px; border: 1px solid #ccc;">Unit Price</th>
                <th style="padding: 8px; border: 1px solid #ccc;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item) => `
                    <tr>
                      <td style="padding: 8px; border: 1px solid #ccc;">${item.ProductName}</td>
                      <td style="padding: 8px; border: 1px solid #ccc;">${item.Quantity}</td>
                      <td style="padding: 8px; border: 1px solid #ccc;">${item.UnitPrice}</td>
                      <td style="padding: 8px; border: 1px solid #ccc;">${(
                        parseFloat(item.UnitPrice) * parseFloat(item.Quantity)
                      ).toFixed(2)}</td>
                    </tr>`
                )
                .join('')}
            </tbody>
          </table>
        </div>
      `;
  
      // Open a new window and print the content
      const printWindow = window.open('', '_blank');
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice Print</title>
            <style>
              /* Hide delete icon in print view */
              .print-hide { display: none; }
              /* Style adjustments for printing */
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { padding: 8px; border: 1px solid #ccc; }
              thead { background-color: #f0f0f0; }
            </style>
          </head>
          <body onload="window.print(); window.close();">${printContents}</body>
        </html>
      `);
      printWindow.document.close();
  
    } catch (error) {
      console.error('Error sending products:', error.response ? error.response.data : error.message);
    alert(`Error sending products to branch: ${error.response ? error.response.data.message : error.message}`);
    }
  };
   
  return (
    <div className="container mx-auto p-4 lg:flex lg:space-x-8">
      {/* Left Panel: Invoice creation */}
      <div className="lg:w-1/2 p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Send Products to Branch</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Branch:</label>
          <select
            value={selectedBranchID}
            onChange={(e) => setSelectedBranchID(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600"
          >
            <option value="">Choose a branch</option>
            {branches.map((branch) => (
              <option key={branch.BranchID} value={branch.BranchID}>
                {branch.BranchName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date:</label>
          <input
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Remarks:</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600"
            rows="4"
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
          Add to Invoice
        </button>
      </div>

      {/* Right Panel: Product Table */}
      <div className="lg:w-1/2 mt-6 lg:mt-0 p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Invoice Details</h2>

        <div id="invoice-details">
          {items.length > 0 ? (
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-blue-100">
                  <th className="py-2 px-4 border-b">Product Name</th>
                  <th className="py-2 px-4 border-b">Quantity</th>
                  <th className="py-2 px-4 border-b">Price</th>
                  <th className="py-2 px-4 border-b">Total</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{item.ProductName}</td>
                    <td className="py-2 px-4">{item.Quantity}</td>
                    <td className="py-2 px-4">{item.UnitPrice}</td>
                    <td className="py-2 px-4">
                        { 
                        !isNaN(parseFloat(item.UnitPrice)) && !isNaN(parseFloat(item.Quantity))
                            ? (parseFloat(item.UnitPrice) * parseFloat(item.Quantity)).toFixed(2) // Ensure the total price is formatted to 2 decimal places
                            : 'N/A'
                        }
                        
                        
                        </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={() => handleDeleteItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">No items added to invoice.</p>
          )}
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleSubmitAndPrint}
            className="flex-1 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit & Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendProductForm;
