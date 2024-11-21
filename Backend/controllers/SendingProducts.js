const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const pool = require('../config/db');  // Import DB connection


// Get all branches

const getBranch = async (req, res) => {
    try {
        const [branch] = await pool.query('SELECT * FROM Branch');
        res.json(branch);
        //console.log(branch);
    } catch (err) {
        console.error('Error adding receipt:', err.message);
        res.status(500).json({ message: 'Error adding receipt', error: err.message });
        console.log(err);
    }
};

const addInvoice = async (req, res) => {
    try {
        const { BranchID, DateSent, Remarks } = req.body;
        const sql = 'INSERT INTO SendingInvoice (BranchID, DateSent, Remarks) VALUES (?, ?, ?)';
        const [result] = await pool.query(sql, [BranchID, DateSent, Remarks]);
        // Return the invoice ID (insertId) from the result
        const invoiceID = result.insertId;
        console.log(invoiceID);
        // Respond with a success message and the newly generated invoice ID
        res.status(201).json({
        message: 'Receipt added successfully',
        invoiceID: invoiceID,  // Include the invoiceID in the response
        
        });
        console.log(invoiceID);
    } catch (err) {
        console.error('Error adding receipt:', err.message);
        res.status(500).json({ message: 'Error adding receipt', error: err.message });
    }
};

const addProductToInvoice = async (req, res) => {
    try {
        const { InvoiceID, ProductID, Quantity, FreeIssue } = req.body;

        // Step 1: Check the available balance in the Inventory table
        const checkStockSql = 'SELECT QuantityInStock FROM Inventory WHERE ProductID = ?';
        const [stockResult] = await pool.query(checkStockSql, [ProductID]);

        if (stockResult.length === 0) {
            return res.status(404).json({ message: 'Product not found in inventory' });
        }

        const availableStock = stockResult[0].QuantityInStock;

        // Step 2: Verify if there's enough stock
        if (availableStock < Quantity) {
            return res.status(400).json({
                message: `Insufficient stock. Available balance: ${availableStock}`,
            });
        }

        // Step 3: Proceed to insert the product into SendingProductDetails
        const sql =
            'INSERT INTO SendingProductDetails (InvoiceID, ProductID, Quantity, FreeIssue) VALUES (?, ?, ?, ?)';
        const [result] = await pool.query(sql, [InvoiceID, ProductID, Quantity, FreeIssue]);

        // Step 4: Deduct the stock from Inventory
        //const updateStockSql = 'UPDATE Inventory SET QuantityInStock = QuantityInStock - ? WHERE ProductID = ?';
        //await pool.query(updateStockSql, [Quantity, ProductID]);

        res.status(201).json({ message: 'Product added successfully' });
    } catch (err) {
        console.error('Error adding product:', err.message);
        res.status(500).json({ message: 'Error adding product', error: err.message });
    }
};



const getBranchDetails = async (req, res) => {
    try {
        const branchID = req.params.id;
        console.log("Branch ID received:", branchID);  // Debug log

        const sql = 'SELECT BranchName, Address FROM Branch WHERE BranchID = ?';
        const [rows] = await pool.query(sql, [branchID]);

        console.log("Query result:", rows);  // Debug log

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Branch not found' });
        }

        const branchDetails = {
            name: rows[0].BranchName,
            address: rows[0].Address,
        };

        res.status(200).json(branchDetails);
    } catch (error) {
        console.error('Error fetching branch details:', error.message);
        res.status(500).json({ message: 'Error fetching branch details', error: error.message });
    }
};

module.exports = { getBranch, addInvoice, addProductToInvoice, getBranchDetails };
