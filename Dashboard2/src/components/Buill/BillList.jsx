import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BillDetails = () => {
  const { billId } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);

  useEffect(() => {
    const fetchBillDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/bills/${billId}`);
        setBill(response.data);
      } catch (error) {
        console.error("Error fetching bill details:", error);
      }
    };

    fetchBillDetails();
  }, [billId]);

  if (!bill) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <button
        onClick={() => navigate(-1)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Back
      </button>
      <h1 className="text-xl font-bold mb-6 text-center">Bill Details</h1>
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <p>
          <span className="font-bold">Bill Number:</span> {bill.BillNumber}
        </p>
        <p>
          <span className="font-bold">Date:</span>{" "}
          {new Date(bill.Date).toLocaleDateString()}
        </p>
        <p>
          <span className="font-bold">Sales Representative:</span>{" "}
          {bill.SalesRepName || "Unknown"}
        </p>
        <p>
          <span className="font-bold">Customer:</span> {bill.CustomerName}
        </p>
        <h2 className="font-bold mt-4 mb-2">Products:</h2>
        <ul>
          {bill.Products.map((product, index) => (
            <li key={index} className="border-b py-2">
              {product.ProductName} - {product.Quantity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BillDetails;
