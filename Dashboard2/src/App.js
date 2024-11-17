// App.js

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from "./components/shared/Layout";
import { Dashboard } from "./components/shared/Dashboard";
import LoginPage from './components/shared/LoginPage';
import ProtectedRoute from './components/shared/ProtectedRoute';
import { AuthProvider } from './AuthContext';
import { About } from './components/shared/About';
import NewUser from './components/UserManagement/NewUser';
import AddProductForm from './components/Products/AddProductForm';
import AddReceiptForm from './components/Products/AddReceiptForm';
import SendProductForm from './components/SendingProduct/SendProductForm';
import ProductList from './components/Products/ProductList';
import ReceiptList from './components/Products/ReceiptList';
import Vehicles from './components/Vehcle/Vehicles';
import AddVehicle from './components/Vehcle/AddVehicle';
import AddSalesRep from './components/SalesRep/AddSalesRep';
import CustomerForm from './components/Customer/CustomerForm';
import CreateBill from './components/SalesRep/CreateBill';
import CustomerList from './components/Customer/CustomerList';
import SalesRepList from './components/SalesRep/SalesRepList';
import BillDetails from './components/Buill/BillList';
function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/Login" element={<LoginPage />} />
            <Route
              path="/"
              element={<ProtectedRoute element={<Layout />} />} // Public layout route
            >
              {/* Define role-based routes here */}
              <Route
                path="Dashboard"
                element={<ProtectedRoute element={<Dashboard />} roles={['admin', 'salesrep','manager']} />}
              />
              <Route
                path="NewUser"
                element={<ProtectedRoute element={<NewUser />} roles={['admin', 'manager','manager']} />}
              />
              <Route
                path="AddProductForm"
                element={<ProtectedRoute element={<AddProductForm />} roles={['admin', 'manager','manager']} />}
              />
                <Route
                path="AddReceiptForm"
                element={<ProtectedRoute element={<AddReceiptForm/>} roles={['admin', 'manager','manager']} />}
              />
                <Route
                path="SendProductForm"
                element={<ProtectedRoute element={<SendProductForm/>} roles={['admin', 'manager','manager']} />}
              />
                <Route
                path="ProductList"
                element={<ProtectedRoute element={<ProductList/>} roles={['admin', 'manager','manager']} />}
              />
               <Route
                path="ReceiptList"
                element={<ProtectedRoute element={<ReceiptList/>} roles={['admin', 'manager','manager']} />}
              />
              <Route
                path="Vehicles"
                element={<ProtectedRoute element={<Vehicles/>} roles={['admin', 'manager','manager']} />}
              />
               <Route
                path="AddVehicle"
                element={<ProtectedRoute element={<AddVehicle/>} roles={['admin', 'manager','manager']} />}
              />
               <Route
                path="AddSalesRep"
                element={<ProtectedRoute element={<AddSalesRep/>} roles={['admin', 'manager','manager']} />}
              />
              <Route
                path="CustomerForm"
                element={<ProtectedRoute element={<CustomerForm/>} roles={['admin', 'manager','manager']} />}
              />
              <Route
                path="CreateBill"
                element={<ProtectedRoute element={<CreateBill/>} roles={['salesrep']} />}
              />
               <Route
                path="CustomerList"
                element={<ProtectedRoute element={<CustomerList/>} roles={['admin','salesrep']} />}
              />
               <Route
                path="SalesRepList"
                element={<ProtectedRoute element={<SalesRepList/>} roles={['admin','salesrep']} />}
              />
               <Route
                path="BillDetails"
                element={<ProtectedRoute element={<BillDetails/>} roles={['admin','salesrep']} />}
              />
              <Route
                path="About"
                element={<ProtectedRoute element={<About />} roles={['admin', 'salesrep']} />}
              />
            </Route>
            <Route path="*" element={<Navigate to="/Login" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
