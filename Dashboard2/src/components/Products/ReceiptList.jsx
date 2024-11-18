import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReceiptList = () => {
    const [receipts, setReceipts] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null);  // Track the selected receipt for expanded view
    const [receiptDetails, setReceiptDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all receipts
    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const response = await axios.get('http://sunflowerfinalproject-production.up.railway.app/api/receiptsSummary');
                setReceipts(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching receipts');
                setLoading(false);
            }
        };

        fetchReceipts();
    }, []);

    // Fetch details of a specific receipt
    const fetchReceiptDetails = async (receiptID) => {
        try {
            const response = await axios.get(`http://sunflowerfinalproject-production.up.railway.app/api/receiptsDetails/${receiptID}`);
            setReceiptDetails(response.data);
          
        } catch (error) {
            console.error('Error fetching receipt details:', error);
        }
    };

    // Toggle the expanded view of a receipt
    const toggleExpand = (receiptID) => {
        if (selectedReceipt === receiptID) {
            setSelectedReceipt(null);
            setReceiptDetails([]);
        } else {
            setSelectedReceipt(receiptID);
            fetchReceiptDetails(receiptID);
        }
    };

    if (loading) return <p className="text-center my-4">Loading...</p>;
    if (error) return <p className="text-center my-4 text-red-500">{error}</p>;

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold mb-4 text-center">Receipts</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="block md:hidden">
                    {receipts.map((receipt) => (
                        <div key={receipt.ReceiptID} className="border-b border-gray-200">
                            <div 
                                className="p-4 flex justify-between items-center cursor-pointer"
                                onClick={() => toggleExpand(receipt.ReceiptID)}
                            >
                                <p className="text-sm font-semibold">Receipt #{receipt.ReceiptID}</p>
                                <p className="text-sm">{new Date(receipt.ReceiptDate).toLocaleDateString()}</p>
                                <p className="text-sm font-semibold">Rs{receipt.Total}</p>
                            </div>
                            {selectedReceipt === receipt.ReceiptID && (
                                <div className="bg-gray-50 p-4">
                                    <h3 className="text-sm font-semibold mb-2">Receipt Details</h3>
                                    {receiptDetails.length > 0 ? (
                                        <ul>
                                            {receiptDetails.map((detail) => (
                                                <li key={detail.ProductID} className="flex justify-between text-sm mb-1">
                                                    <span>{detail.ProductName}</span>
                                                    <span>Qty: {detail.Quantity}</span>
                                                    <span>Price: Rs{detail.UnitPrice}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 text-sm">No details available</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Desktop View */}
                <table className="hidden md:table w-full bg-white">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">Receipt ID</th>
                            <th className="py-2 px-4 border-b">Date</th>
                            <th className="py-2 px-4 border-b">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {receipts.map((receipt) => (
                            <React.Fragment key={receipt.ReceiptID}>
                                <tr 
                                    className="border-b hover:bg-gray-50 cursor-pointer" 
                                    onClick={() => toggleExpand(receipt.ReceiptID)}
                                >
                                    <td className="py-2 px-4">{receipt.ReceiptID}</td>
                                    <td className="py-2 px-4">{new Date(receipt.ReceiptDate).toLocaleDateString()}</td>
                                    <td className="py-2 px-4">Rs{receipt.Total}</td>
                                </tr>
                                {selectedReceipt === receipt.ReceiptID && receiptDetails.length > 0 && (
                                    <tr>
                                        <td colSpan="3" className="p-4 bg-gray-50">
                                            <h3 className="text-sm font-semibold mb-2">Receipt Details</h3>
                                            <ul>
                                                {receiptDetails.map((detail) => (
                                                    <li key={detail.ProductID} className="flex justify-between text-sm mb-1">
                                                        <span>{detail.ProductName}</span>
                                                        <span>Qty: {detail.Quantity}</span>
                                                        <span>Price: Rs{detail.UnitPrice}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReceiptList;
