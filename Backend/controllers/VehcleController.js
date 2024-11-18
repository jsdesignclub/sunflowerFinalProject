
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

module.exports = {getVehicles};