
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const pool = require('../config/db');




const addSalesRep = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, email, vehicleNumber, branchID, hireDate, salary } = req.body;
        console.log("Received Sales Rep Data:", req.body);
        const sql = 'INSERT INTO SalesRep (firstName, lastName, phoneNumber, email, vehicleNumber, branchID, hireDate, salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const [result] = await pool.query(sql, [firstName, lastName, phoneNumber, email, vehicleNumber, branchID, hireDate, salary]);
        res.status(201).json({ message: 'Sales representative added successfully' });
    } catch (err) {
        console.error('Error adding sales representative:', err.message);
        res.status(500).json({ message: 'Error adding sales representative', error: err.message });
    }
};

const getAllSalesReps = async (req, res) => {
    try {
        const sql = 'SELECT * FROM SalesRep';
        const [salesReps] = await pool.query(sql);
        res.status(200).json(salesReps);
    } catch (error) {
        console.error("Error fetching sales reps:", error);
        res.status(500).json({ message: "Error fetching sales reps", error: error.message });
    }
};


const getSalesRepByUsername = async (req, res) => {
    try {
        // Destructure `username` from request parameters
        const { username } = req.params;
       // console.log("Username:", username);

        // SQL query to fetch sales rep by FirstName
        const sql = 'SELECT * FROM SalesRep WHERE FirstName = ?';
        const [salesRep] = await pool.query(sql, [username]);

        //console.log("SalesRep Data:", salesRep);

        // Check if sales rep is found
        if (!salesRep || salesRep.length === 0) {
            return res.status(404).json({ message: 'Sales rep not found' });
        }

        // Respond with the sales rep data
        res.status(200).json({
            message: 'Sales rep found',
            salesRepID: salesRep[0].SalesRepID, // Assuming `SalesRepID` is a column in the table
            salesRep: salesRep[0], // Include the full sales rep data if needed
            
        });
        //console.log("SalesRep Data:", salesRep[0].id);
    } catch (error) {
        console.error("Error fetching sales rep by username:", error);

        // Send a generic error response
        res.status(500).json({
            message: "Error fetching sales rep by username",
            error: error.message,
        });
    }
};


const CreateBill = async (req, res) => {
    try {
        const { date, customerId, salesRepId, products } = req.body;

        console.log("Received Bill Data:", req.body);

        // Convert customerId and salesRepId to integers
        const customerID = parseInt(customerId, 10);
        const salesRepID = parseInt(salesRepId, 10);


        // Validate required fields
        if (isNaN(customerID) || isNaN(salesRepID)) {
            return res.status(400).json({ message: 'Invalid customerId or salesRepId' });
        }
        if (!Date.parse(date)) {
            return res.status(400).json({ message: 'Invalid date format' });
        }
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'No products provided for the bill' });
        }

        // Step 1: Insert the bill record
        const sqlBill = 'INSERT INTO Bill (CustomerID, SalesRepID, BillDate) VALUES (?, ?, ?)';
        const [billResult] = await pool.query(sqlBill, [customerID, salesRepID, date]);

        const billID = billResult.insertId;

        // Step 2: Insert BillDetails for each product
        const billDetailsQueries = products.map(product => {
            const { productId, quantity, unitPrice } = product; // Note: changed to productId here
            const totalPrice = quantity * unitPrice;

            // Validate each field
            if (!productId || !quantity || !unitPrice) {
                console.log("Product details missing:", product);
                return res.status(400).json({
                    message: `Missing product details: productId=${productId}, quantity=${quantity}, unitPrice=${unitPrice}`
                });
            }

            return pool.query(
                'INSERT INTO BillDetails (BillID, ProductID, Quantity, UnitPrice, TotalPrice) VALUES (?, ?, ?, ?, ?)',
                [billID, productId, quantity, unitPrice, totalPrice]
            );
        });

        await Promise.all(billDetailsQueries);

        res.status(201).json({ message: 'Bill and BillDetails created successfully' });

    } catch (err) {
        console.error('Error creating bill:', err.message);
        res.status(500).json({ message: 'Error creating bill', error: err.message });
    }
};



module.exports = { addSalesRep, getAllSalesReps, CreateBill, getSalesRepByUsername };