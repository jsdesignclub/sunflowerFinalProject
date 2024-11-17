import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/customers");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-xl font-bold mb-6 text-center">Customer List</h1>
      {/* Table view for larger screens */}
      <div className="hidden md:block">
        <table className="w-full border border-gray-200 bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left px-4 py-2 border-b">Customer Name</th>
              <th className="text-left px-4 py-2 border-b">Phone</th>
              <th className="text-left px-4 py-2 border-b">Email</th>
              <th className="text-left px-4 py-2 border-b">Address</th>
              <th className="text-left px-4 py-2 border-b">Branch ID</th>
              <th className="text-left px-4 py-2 border-b">Created At</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.CustomerID} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{`${customer.FirstName} ${customer.LastName}`}</td>
                <td className="px-4 py-2 border-b">{customer.PhoneNumber}</td>
                <td className="px-4 py-2 border-b">{customer.Email}</td>
                <td className="px-4 py-2 border-b">{customer.Address}</td>
                <td className="px-4 py-2 border-b">{customer.BranchID}</td>
                <td className="px-4 py-2 border-b">
                  {new Date(customer.CreatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="block md:hidden space-y-4">
        {customers.map((customer) => (
          <div
            key={customer.CustomerID}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
          >
            {/* Compact view */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold">{`${customer.FirstName} ${customer.LastName}`}</p>
                <p className="text-sm text-gray-600">{customer.PhoneNumber}</p>
              </div>
              <button
                onClick={() => toggleRow(customer.CustomerID)}
                className="text-blue-600 text-sm underline focus:outline-none"
              >
                {expandedRows[customer.CustomerID] ? "Hide Details" : "View Details"}
              </button>
            </div>

            {/* Expanded view */}
            {expandedRows[customer.CustomerID] && (
              <div className="mt-4 text-sm text-gray-700">
                <p>
                  <span className="font-bold">Email:</span> {customer.Email}
                </p>
                <p>
                  <span className="font-bold">Address:</span> {customer.Address}
                </p>
                <p>
                  <span className="font-bold">Branch ID:</span> {customer.BranchID}
                </p>
                <p>
                  <span className="font-bold">Created At:</span>{" "}
                  {new Date(customer.CreatedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerList;
