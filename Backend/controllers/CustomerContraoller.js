const bcrypt = require('bcryptjs');    
const jwt = require('jsonwebtoken');
const pool = require('../config/db');


const addCustomer = async (req, res) => {
    const { firstName, lastName, phoneNumber, email, address, branchID } = req.body;

    try {
        const sql = `
            INSERT INTO Customer (FirstName, LastName, PhoneNumber, Email, Address, BranchID)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(sql, [firstName, lastName, phoneNumber, email, address, branchID]);
        
        res.status(201).json({ message: 'Customer added successfully', customerId: result.insertId });
    } catch (error) {
        console.error('Error adding customer:', error.message);
        res.status(500).json({ message: 'Failed to add customer', error: error.message });
    }
};

// get all customers
const getAllCustomers = async (req, res) => {
    try {
        const sql = `SELECT * FROM Customer`;
        const [customers] = await pool.query(sql);
        res.status(200).json(customers);
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ message: "Error fetching customers", error: error.message });
    }
};

// get customer by id   
const getCustomerById = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = `SELECT * FROM Customer WHERE CustomerID = ?`;
        const [customer] = await pool.query(sql, [id]); 
        res.status(200).json(customer);
        console.log("Fetched customer:", customer);
    } catch (error) {
        console.error("Error fetching customer:", error);
        res.status(500).json({ message: "Error fetching customer", error: error.message });
    }
};

// get customer by branch id
const getCustomersByBranch = async (req, res) => {
    const { branchId } = req.params;
    console.log("Received branchId:", branchId);
    try {
        const sql = `SELECT * FROM Customer WHERE BranchID = ?`;
        const [customers] = await pool.query(sql, [branchId]);
        res.status(200).json(customers);  
        console.log("Fetched customers by branch:", customers);      
    } catch (error) {
        console.error("Error fetching customers by branch:", error);
        res.status(500).json({ message: "Error fetching customers by branch", error: error.message });      
    }
};


module.exports = { addCustomer,getAllCustomers, getCustomerById , getCustomersByBranch }; 
