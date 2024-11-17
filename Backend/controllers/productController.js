// /controllers/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');  // Import DB connection
const { get } = require('../routes/userRoutes');

// User Registration Controller
const getCategories = async (req, res) => {
    try {
        const sql = 'SELECT * FROM productcategories'; // Query to get all categories
        const [categories] = await pool.query(sql);
        res.status(200).json(categories); // Return the list of categories
    } catch (err) {
        console.error('Error fetching categories:', err.message);
        res.status(500).json({ message: 'Error fetching categories', error: err.message });
    }

};

// Products Controller
const getProducts = async (req, res) => {
    try {
        const [products] = await pool.query('SELECT * FROM products');
        res.json(products);
        console.log(products);
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ message: 'Error fetching products', error: err.message });
    }
};


const addProducts = async (req, res) => {
    const { ProductName, CategoryId, UnitPrice, FreeIssue, Discount,  NewCategoryName } = req.body;
  console.log({ ProductName, CategoryId, UnitPrice, FreeIssue, Discount, NewCategoryName });
    // Basic validation
    /*
    if (!ProductName || !UnitPrice || UnitPrice <= 0) {
        //console.log({ ProductName, CategoryId, UnitPrice, FreeIssue, Discount, NewCategoryName });
        return res.status(400).json({ message: 'Invalid input data' });
    }
  */
    // Validate FreeIssue and Discount (ensure they are numbers)
    if (FreeIssue < 0 || Discount < 0) {
        return res.status(400).json({ message: 'Free issue and discount must be non-negative' });
    }
  
    const connection = await pool.getConnection();
    await connection.beginTransaction();
  
    try {
        let categoryID;
  
        if (NewCategoryName) {
            // User is adding a new category
            const [result] = await connection.query(
                'INSERT INTO productcategories (CategoryName) VALUES (?)',
                [NewCategoryName]
            );
            categoryID = result.insertId; // Get the ID of the newly created category
        } else {
            // Check if the category exists
            const [categoryRows] = await connection.query(
                'SELECT CategoryID FROM productcategories WHERE CategoryID = ?',
                [CategoryId]
            );
  
            if (categoryRows.length === 0) {
                return res.status(404).json({ message: 'Category not found' });
            }
  
            categoryID = categoryRows[0].CategoryID; // Ensure correct field name
        }
  
        // Insert the product into the products table with the selected category
        const [productResult] = await connection.query(
            'INSERT INTO products (ProductName, CategoryID, UnitPrice, FreeIssue, Discount) VALUES (?, ?, ?, ?, ?)',
            [ProductName, categoryID, UnitPrice, FreeIssue, Discount]
        );
  
        const productID = productResult.insertId;

        // Insert a new entry into the Inventory table with QuantityInStock set to 0
        await connection.query(
          'INSERT INTO Inventory (ProductID, QuantityInStock) VALUES (?, ?)',
          [productID, 0]
        );


        // Commit the transaction
        await connection.commit();
  
        // Respond with the result
        res.status(201).json({
            message: 'Product added successfully',
            product: {
                id: productResult.insertId,
                ProductName,
                CategoryID: categoryID,
                UnitPrice,
                FreeIssue,
                Discount
            }
        });
    } catch (err) {
        // Rollback the transaction in case of an error
        await connection.rollback();
        console.error('Error adding product and category:', err.message);
        res.status(500).json({ message: 'Error adding product and category', error: err.message });
    } finally {
        // Release the connection back to the pool
        connection.release();
    }
};

const addReceipt = async (req, res) => {
    const { receiptDate, items } = req.body;
    console.log("Full Request Body:", { receiptDate, items }); // Log the entire request body
  
    // Basic validation
    if (!receiptDate || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid data: receipt date and items are required.' });
    }
  
    // Validate each item in the items array
    for (const item of items) {
      console.log("Item received:", item); // Log each item for debugging
  
      if (
        !item.itemId ||
        typeof item.quantity !== 'number' ||
        isNaN(item.quantity) ||
        item.quantity <= 0 ||
        typeof item.price !== 'number' ||
        isNaN(item.price) ||
        item.price < 0
      ) {
        return res.status(400).json({
          message: 'Invalid item data: each item must have a valid itemId, quantity, and price.',
          item, // Return the problematic item in the response for easier debugging
        });
      }
    }
  
    const connection = await pool.getConnection();
    await connection.beginTransaction();
  
    try {
      // Insert receipt into the receipts table
      const [receiptResult] = await connection.query(
        'INSERT INTO receipts (ReceiptDate) VALUES (?)',
        [receiptDate]
      );
      const receiptId = receiptResult.insertId;
  
      // Insert each item into the receipt_items table
      const itemPromises = items.map(item => {
        return connection.query(
          'INSERT INTO receiptdetails (ReceiptID, ProductID, Quantity, UnitPrice, TotalPrice) VALUES (?, ?, ?, ?, ?)',
          [receiptId, item.itemId, item.quantity, item.price, item.price * item.quantity]
        );
      });
      await Promise.all(itemPromises);
  
      /* Example: Update inventory after adding receipt
      const updateInventoryPromises = items.map(item => {
        return connection.query(
          'UPDATE Inventory SET Quantity = Quantity - ? WHERE ProductID = ?',
          [item.quantity, item.itemId]
        );
      });
      await Promise.all(updateInventoryPromises);
  */
      // Commit the transaction
      await connection.commit();
      res.status(201).json({ message: 'Receipt added successfully', receiptId });
    } catch (error) {
      // Rollback the transaction in case of error
      await connection.rollback();
      console.error('Error adding receipt:', error.message);
      res.status(500).json({ message: 'Error adding receipt', error: error.message });
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
  };
  
  // Get all products
  const getProductsList = async (req, res) => {
      try {
        const sql = `
            SELECT p.ProductID, p.ProductName, p.UnitPrice, i.QuantityInStock
            FROM products p
            JOIN Inventory i ON p.ProductID = i.ProductID
        `;
        const [rows] = await pool.query(sql);

        res.status(200).json(rows);
        console.log("Fetched products:", rows);
      } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'Error fetching products', error: error.message });
        console.log("Error fetching products:", error.message);
      }
    };

    const getReceiptsSummary = async (req, res) => {
      try {
          const sql = 'SELECT ReceiptID, ReceiptDate FROM receipts';
          const [rows] = await pool.query(sql);
          res.status(200).json(rows);
          //console.log("Fetched receipts summary:", rows);
      } catch (error) {
          console.error('Error fetching receipts summary:', error.message);
          res.status(500).json({ message: 'Error fetching receipts summary', error: error.message });
      }
  };

  const getReceiptDetails = async (req, res) => {
    try {
        const receiptID = req.params.id;
        console.log("Receipt ID:", receiptID);
        const sql = `
            SELECT rd.ProductID, p.ProductName, rd.Quantity, rd.UnitPrice 
            FROM receiptdetails rd
            JOIN products p ON rd.ProductID = p.ProductID
            WHERE rd.ReceiptID = ?
        `;
        const [rows] = await pool.query(sql, [receiptID]);
        res.status(200).json(rows);
        console.log("details:", rows);
    } catch (error) {
        console.error('Error fetching receipt details:', error.message);
        res.status(500).json({ message: 'Error fetching receipt details', error: error.message });
    }
};


module.exports = { getCategories, addProducts , getProducts, addReceipt, getProductsList, getReceiptsSummary, getReceiptDetails};