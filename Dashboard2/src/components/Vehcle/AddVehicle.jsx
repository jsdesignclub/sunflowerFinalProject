import React, { useState } from 'react';
import axios from 'axios';

const AddVehicle = () => {
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [vehicleName, setVehicleName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/vehicles', {
                vehicleNumber,
                vehicleName,
            });
            setMessage('Vehicle added successfully!');
            setVehicleNumber('');
            setVehicleName('');
        } catch (error) {
            console.error('Error adding vehicle:', error);
            setMessage('Failed to add vehicle.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Add New Vehicle</h2>
            {message && (
                <div className="mb-4 p-2 text-center text-white bg-green-500 rounded">
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="vehicleNumber" className="block text-gray-700">
                        Vehicle Number
                    </label>
                    <input
                        type="text"
                        id="vehicleNumber"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                        className="w-full mt-2 p-2 border rounded focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="vehicleName" className="block text-gray-700">
                        Vehicle Name
                    </label>
                    <input
                        type="text"
                        id="vehicleName"
                        value={vehicleName}
                        onChange={(e) => setVehicleName(e.target.value)}
                        className="w-full mt-2 p-2 border rounded focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 mt-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition duration-200"
                >
                    Add Vehicle
                </button>
            </form>
        </div>
    );
};

export default AddVehicle;
