import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [branchID, setBranchID] = useState('');
    const [branches, setBranches] = useState([]);

    // Fetch branches for the dropdown
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/branches');
                setBranches(response.data);
            } catch (error) {
                console.error('Error fetching branches:', error);
            }
        };
        fetchBranches();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const customerData = {
            firstName,
            lastName,
            phoneNumber,
            email,
            address,
            branchID,
        };

        try {
            await axios.post('http://localhost:5000/api/add-customer', customerData);
            alert('Customer added successfully');
            // Clear form fields
            setFirstName('');
            setLastName('');
            setPhoneNumber('');
            setEmail('');
            setAddress('');
            setBranchID('');
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md mt-8">
            <h2 className="text-2xl font-bold text-center mb-4">Add Customer</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Phone Number</label>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Address</label>
                    <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
                    ></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium">Branch</label>
                    <select
                        value={branchID}
                        onChange={(e) => setBranchID(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
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
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
                >
                    Add Customer
                </button>
            </form>
        </div>
    );
};

export default CustomerForm;
