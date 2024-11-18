
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const pool = require('../config/db'); 



const getVehicles = async (req, res) => {
    try {
        const sql = `SELECT VehicleNumber, VehicleName FROM vehicles`;
        const [rows] = await pool.query(sql);

        res.status(200).json(rows);
        
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ message: 'Failed to fetch vehicles', error: error.message });
    }

};  

// add vehicle      

const addVehicle = async (req, res) => {
    const { VehicleNumber, VehicleName } = req.body; 
    console.log("Received Vehicle Data:", req.body);   
    try {
                            const sql = `INSERT INTO vehicles (VehicleNumber, VehicleName) VALUES (?, ?)`;
            const [result] = await pool.query(sql, [VehicleNumber, VehicleName]);
            res.status(201).json({ message: 'Vehicle added successfully', vehicleId: result.insertId });
    } catch (error) {
        console.error('Error adding vehicle:', error);
        res.status(500).json({ message: 'Failed to add vehicle', error: error.message });       
    }

};
module.exports = {getVehicles, addVehicle};