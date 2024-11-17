import React, { useEffect, useState } from "react";
import axios from "axios";

const SalesRepList = () => {
  const [salesReps, setSalesReps] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const fetchSalesReps = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/sales-reps");
        setSalesReps(response.data);
      } catch (error) {
        console.error("Error fetching sales representatives:", error);
      }
    };

    fetchSalesReps();
  }, []);

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-xl font-bold mb-6 text-center">Sales Representative List</h1>

      {/* Table view for larger screens */}
      <div className="hidden md:block">
        <table className="w-full border border-gray-200 bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left px-4 py-2 border-b">Name</th>
              <th className="text-left px-4 py-2 border-b">Phone</th>
              <th className="text-left px-4 py-2 border-b">Email</th>
              <th className="text-left px-4 py-2 border-b">Branch ID</th>
              <th className="text-left px-4 py-2 border-b">Created At</th>
            </tr>
          </thead>
          <tbody>
            {salesReps.map((rep) => (
              <tr key={rep.SalesRepID} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{`${rep.FirstName} ${rep.LastName}`}</td>
                <td className="px-4 py-2 border-b">{rep.PhoneNumber}</td>
                <td className="px-4 py-2 border-b">{rep.Email}</td>
                <td className="px-4 py-2 border-b">{rep.BranchID}</td>
                <td className="px-4 py-2 border-b">
                  {new Date(rep.CreatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="block md:hidden space-y-4">
        {salesReps.map((rep) => (
          <div
            key={rep.SalesRepID}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
          >
            {/* Compact view */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold">{`${rep.FirstName} ${rep.LastName}`}</p>
                <p className="text-sm text-gray-600">{rep.PhoneNumber}</p>
              </div>
              <button
                onClick={() => toggleRow(rep.SalesRepID)}
                className="text-blue-600 text-sm underline focus:outline-none"
              >
                {expandedRows[rep.SalesRepID] ? "Hide Details" : "View Details"}
              </button>
            </div>

            {/* Expanded view */}
            {expandedRows[rep.SalesRepID] && (
              <div className="mt-4 text-sm text-gray-700">
                <p>
                  <span className="font-bold">Email:</span> {rep.Email}
                </p>
                <p>
                  <span className="font-bold">Branch ID:</span> {rep.BranchID}
                </p>
                <p>
                  <span className="font-bold">Created At:</span>{" "}
                  {new Date(rep.CreatedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesRepList;
