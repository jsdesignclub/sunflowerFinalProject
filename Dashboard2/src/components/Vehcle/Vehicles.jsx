import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/vehicles');
                setVehicles(response.data);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        };

        fetchVehicles();
    }, []);

    return (
        <div className="p-4 bg-white shadow-md rounded-lg mb-4">
            <h2 className="text-xl font-bold mb-4 text-center">Vehicles</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left text-gray-600 bg-gray-100 border">Vehicle Number</th>
                            <th className="px-4 py-2 text-left text-gray-600 bg-gray-100 border">Vehicle Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle.VehicleNumber} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border">{vehicle.VehicleNumber}</td>
                                <td className="px-4 py-2 border">{vehicle.VehicleName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Vehicles;
