import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddSalesRep = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        vehicleNumber: '',
        branchID: '',
        hireDate: '',
        salary: '',
    });
    const [vehicles, setVehicles] = useState([]);
    const [branches, setBranches] = useState([]);
    const [message, setMessage] = useState('');

    // Fetch Vehicle and Branch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const vehicleRes = await axios.get('http://localhost:5000/api/vehicles');
                const branchRes = await axios.get('http://localhost:5000/api/branches');
                setVehicles(vehicleRes.data);
                setBranches(branchRes.data);
                console.log(vehicleRes.data, branchRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/add-sales-rep', formData);
            setMessage('Sales representative added successfully!');
            setFormData({
                firstName: '',
                lastName: '',
                phoneNumber: '',
                email: '',
                vehicleNumber: '',
                branchID: '',
                hireDate: '',
                salary: '',
            });
        } catch (error) {
            console.error('Error adding sales representative:', error);
            setMessage('Failed to add sales representative.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">Add Sales Representative</h2>
            {message && (
                <div className={`mb-4 p-2 text-center text-white ${message.includes('successfully') ? 'bg-green-500' : 'bg-red-500'} rounded`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full mt-2 p-2 border rounded focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full mt-2 p-2 border rounded focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Phone Number</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full mt-2 p-2 border rounded focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full mt-2 p-2 border rounded focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Vehicle Number</label>
                    <select
                        name="vehicleNumber"
                        value={formData.vehicleNumber}
                        onChange={handleChange}
                        className="w-full mt-2 p-2 border rounded focus:outline-none focus:border-blue-500"
                        required
                    >
                        <option value="">Select Vehicle</option>
                        {vehicles.map((vehicle) => (
                            <option key={vehicle.VehicleNumber} value={vehicle.VehicleNumber}>
                                {vehicle.VehicleNumber}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">Branch ID</label>
                    <select
                        name="branchID"
                        value={formData.branchID}
                        onChange={handleChange}
                        className="w-full mt-2 p-2 border rounded focus:outline-none focus:border-blue-500"
                        required
                    >
                        <option value="">Select Branch</option>
                        {branches.map((branch) => (
                            <option key={branch.BranchID} value={branch.BranchID}>
                                {branch.BranchName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">Hire Date</label>
                    <input
                        type="date"
                        name="hireDate"
                        value={formData.hireDate}
                        onChange={handleChange}
                        className="w-full mt-2 p-2 border rounded focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Salary</label>
                    <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        className="w-full mt-2 p-2 border rounded focus:outline-none focus:border-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 mt-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition duration-200"
                >
                    Add Sales Rep
                </button>
            </form>
        </div>
    );
};

export default AddSalesRep;
