import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navigation from './navigation/LandingNavigation';
import Home from './landingPages/Home';
import Features from './landingPages/Features';
import Solution from './landingPages/Solution';
import Developers from './landingPages/Developers';

import Login from './login/LoginInterface';

import AdminLogin from './login/admin/AdminLogin';
import AdminLayout from './login/admin/AdminLayout';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import WarehousesPage from './pages/WarehousesPage';

import UserLayout from './login/user/UserLayout';
import UserLogin from './login/user/UserLogin';
import UserDashboard from './components/UserDashboard';
import UserProductsPage from './components/UserProducsPage';
import UserScanner from './components/UserScanner';



function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Navigation />}>
          <Route index element={<Home />} />
          <Route path="features" element={<Features />} />
          <Route path="solution" element={<Solution />} />
          <Route path="developers" element={<Developers />} />
          <Route path="admin-login" element={<AdminLogin />} />
          <Route path="user-login" element={<UserLogin />} />
          <Route path="login" element={<Login />} />
        </Route>

        <Route path="/admin" element={<AdminLayout/>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="warehouses" element={<WarehousesPage />} />
        </Route>

        <Route path="/user" element={<UserLayout/>}>
          <Route index element={<UserDashboard />} />
          <Route path="products" element={<UserProductsPage />} />
          <Route path="scanner" element={<UserScanner />} />
        </Route>
      </Routes>

    </Router>
  );
}

export default App;
