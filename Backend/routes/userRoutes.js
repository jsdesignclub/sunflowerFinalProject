// /routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser, getUsers, deleteUser } = require('../controllers/userController');
const { getCategories, addProducts,getProducts, addReceipt,getProductsList,getReceiptDetails,getReceiptsSummary,getProductsByBranch } = require('../controllers/productController');
const { getBranch,addInvoice,addProductToInvoice , getBranchDetails} = require('../controllers/SendingProducts');
const { getVehicles,addVehicle } = require('../controllers/VehcleController');
const {  addSalesRep, getAllSalesReps,CreateBill, getSalesRepByUsername } = require('../controllers/SalesRepController');
const { addCustomer, getAllCustomers, getCustomerById, getCustomersByBranch } = require('../controllers/CustomerContraoller');
const router = express.Router();

// User Registration Route
router.post('/register', registerUser);

// User Login Route
router.post('/login', loginUser);

// Get All Users Route
router.get('/users', getUsers);

// Delete User Route
router.delete('/users/:id', deleteUser);
// Product Categories Route
router.get('/categories', getCategories);
// Add Product Route
router.post('/products', addProducts);
// get Product Route
router.get('/products', getProducts);

// Add Receipt Route
router.post('/add-receipt', addReceipt);

// Get Branch Route
router.get('/branches', getBranch);
//add invoice   
router.post('/sending-invoice', addInvoice);
// add invoice details  
router.post('/sending-product-details', addProductToInvoice);

// Get Branch Details Route
router.get('/branch/:id', getBranchDetails);
// get Product List Route
router.get('/products-list', getProductsList);

// get Receipt Summary Route
router.get('/receiptsDetails/:id',getReceiptDetails ); 
// get Receipt Details Route
router.get('/receiptsSummary', getReceiptsSummary);
   
// get vehicle details Route
router.get('/vehicles', getVehicles);

// Add Sales Representative Route
router.post('/add-sales-rep', addSalesRep);

// Add Customer Route
router.post('/add-customer', addCustomer);
// Get All Customers Route  
router.get('/customers', getAllCustomers);

// Get All Sales Reps Route
router.get('/sales-reps', getAllSalesReps);
// Create Bill Route
router.post('/create-bill', CreateBill);

// Get Sales Rep by Username Route
router.get('/sales-reps-by-username/:username', getSalesRepByUsername);

// Get customer by ID Route     
router.get('/customers/:id', getCustomerById);

// add vehicle
router.post('/add-vehicle', addVehicle);

// get products by branch id
router.get('/products-by-branch/:branchId', getProductsByBranch);

// get customers by branch id   
router.get('/getCustomersByBranch/:branchId', getCustomersByBranch);

module.exports = router;
