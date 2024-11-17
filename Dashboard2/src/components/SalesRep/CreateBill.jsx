import React, { useState, useEffect } from "react";
import axios from "axios";





const CreateBill = () => {
    const [billNumber, setBillNumber] = useState(Date.now());
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [billItems, setBillItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [salesRepId, setSalesRepId] = useState(null);
// State for selected product
const [selectedProduct, setSelectedProduct] = useState(null);

// State for selected customer
const [selectedCustomer, setSelectedCustomer] = useState(null);

// Example handlers to demonstrate usage
const handleProductSelection = (product) => {
  setSelectedProduct(product);
};

const handleCustomerSelection = (customer) => {
  setSelectedCustomer(customer);
};
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get the username and role from localStorage
                const storedUsername = localStorage.getItem('username');
                const storedRole = localStorage.getItem('role');
                setUsername(storedUsername || '');
                setRole(storedRole || '');

                // Fetch customers and products
                const [customerResponse, productResponse] = await Promise.all([
                    axios.get("http://localhost:5000/api/customers"),
                    axios.get("http://localhost:5000/api/products"),
                ]);

                setCustomers(customerResponse.data);
                setProducts(productResponse.data);

                // Fetch sales rep data based on username
                if (storedUsername) {
                    const salesRepResponse = await axios.get(
                        `http://localhost:5000/api/sales-reps-by-username/${storedUsername}`
                    );
                    const salesRep = salesRepResponse.data;
                     setSalesRepId(salesRepResponse.data.salesRep.SalesRepID);
                    console.log("SalesRepID:", salesRepResponse.data.salesRep.SalesRepID);
                    if (salesRep?.SalesRepID) {
                       
                         
                    }

                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const totalAmount = billItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        setTotal(totalAmount);
    }, [billItems]);

    const handleAddProduct = () => {
        const product = products.find((p) => Number(p.ProductID) === Number(selectedProduct.productId));
        if (product && selectedProduct.quantity > 0) {
            setBillItems((prevItems) => [
                ...prevItems,
                {
                    productId: product.ProductID,
                    productName: product.ProductName,
                    quantity: selectedProduct.quantity,
                    unitPrice: Number(product.UnitPrice),
                },
            ]);
            setSelectedProduct({ productId: "", quantity: 1 });
           
        }
    };

    const handleRemoveProduct = (index) => {
        setBillItems(billItems.filter((_, i) => i !== index));
    };

    const handleSubmitAndPrint = async () => {
        if (!salesRepId) {
            alert("Only sales representatives can create a bill.");
            return;
        }
    
        try {
            // Fetch customer details using selectedCustomer ID
            const customerResponse = await axios.get(`http://localhost:5000/api/customers/${selectedCustomer}`);
            const customer = customerResponse.data[0]; // Assuming the response contains { name, address }
            console.log('customer',customer);
            // Access individual properties
            console.log('First Name:', customer.FirstName); // Should log "jayasena"
            console.log('Last Name:', customer.LastName); // Should log "Palihakoon"
            // Create the bill
            await axios.post("http://localhost:5000/api/create-bill", {
                billNumber,
                date,
                customerId: selectedCustomer,
                salesRepId,
                products: billItems,
            });
            alert("Bill created successfully!");
    
            // Prepare print content
            const printContents = `
                <div style="padding: 20px; font-family: Arial, sans-serif;">
                    <h1>Bill</h1>
                    <p><strong>Bill Number:</strong> ${billNumber}</p>
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Customer Name:</strong> ${customer.FirstName}</p>
                    <p><strong>Customer Address:</strong> ${customer.Address}</p>
    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <thead>
                            <tr style="background-color: #f0f0f0;">
                                <th style="padding: 8px; border: 1px solid #ccc;">Product Name</th>
                                <th style="padding: 8px; border: 1px solid #ccc;">Quantity</th>
                                <th style="padding: 8px; border: 1px solid #ccc;">Price</th>
                                <th style="padding: 8px; border: 1px solid #ccc;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${billItems
                                .map(
                                    (item) => `
                                        <tr>
                                            <td style="padding: 8px; border: 1px solid #ccc;">${item.productName || "Unknown Product"}</td>
                                            <td style="padding: 8px; border: 1px solid #ccc;">${item.quantity || 0}</td>
                                            <td style="padding: 8px; border: 1px solid #ccc;">${item.unitPrice || 0}</td>
                                            <td style="padding: 8px; border: 1px solid #ccc;">${((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}</td>
                                        </tr>
                                    `
                                )
                                .join('')}
                        </tbody>
                    </table>
                </div>
            `;
    
            // Print the bill
            const printWindow = window.open('', '_blank');
            printWindow.document.open();
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print Bill</title>
                    </head>
                    <body onload="window.print(); window.close();">${printContents}</body>
                </html>
            `);
            printWindow.document.close();
        } catch (error) {
            console.error("Error creating bill:", error);
            alert("Failed to create bill. Please try again.");
        }
    };
    
    const handlePrint = (printContents) => {
        const printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Bill</title>
                    <style>
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
    };
    
    // Render nothing if the user is not a sales rep
    if (!salesRepId) {
        return <p className="text-center mt-6">You do not have access to this page.</p>;
    }

    return (
        <div className="p-4 w-full lg:max-w-full mx-auto bg-white shadow-md rounded-lg mt-6">
            <h2 className="text-2xl font-semibold text-center mb-4">Create New Bill</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4 p-4 bg-gray-100 rounded-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Bill Number</label>
                        <input
                            type="text"
                            value={billNumber}
                            disabled
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md bg-gray-200"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Customer</label>
                        <select
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="">Select a customer</option>
                            {customers.map((customer) => (
                                <option key={customer.CustomerID} value={customer.CustomerID}>
                                    {customer.FirstName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="space-y-4 p-4 bg-gray-100 rounded-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product</label>
                        <select
                            value={products.productId}
                            onChange={(e) => setSelectedProduct({ ...selectedProduct, productId: e.target.value })}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                        >
                            <option value="">Select a product</option>
                            {products.map((product) => (
                                <option key={product.ProductID} value={product.ProductID}>
                                    {product.ProductID} - {product.ProductName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input
                            type="number"
                            value={products.quantity}
                            onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: e.target.value })}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            min="1"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleAddProduct}
                        className="w-full py-2 bg-indigo-600 text-white rounded-md"
                    >
                        Add Product
                    </button>
                </div>
            </div>
            <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-sm">
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="py-2">Item</th>
                            <th className="py-2">Quantity</th>
                            <th className="py-2">Price</th>
                            <th className="py-2">Total</th>
                            <th className="py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {billItems.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="py-2">{item.productName}</td>
                                <td className="py-2">{item.quantity}</td>
                                <td className="py-2">${item.unitPrice.toFixed(2)}</td>
                                <td className="py-2">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                                <td className="py-2">
                                    <button
                                        onClick={() => handleRemoveProduct(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="text-right font-semibold mt-4">Total: ${total.toFixed(2)}</div>
            </div>
            <div className="mt-4 flex justify-end">
                <button
                    onClick={handleSubmitAndPrint}
                    className="py-2 px-4 bg-green-600 text-white rounded-md"
                >
                    Submit and Print
                </button>
            </div>
        </div>
    );
};

export default CreateBill;
