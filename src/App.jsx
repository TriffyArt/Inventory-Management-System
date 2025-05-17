import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navigation from './components/LandingNavigation';
import Home from './components/Home';
import Features from './components/Features';
import Solution from './components/Solution';
import Developers from './components/Developers';

import LoginInterface from './components/LoginInterface';

import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/Dashboard';
import ProductsPage from './components/ProductsPage';

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
          <Route path="login" element={<LoginInterface />} />
        </Route>

        <Route path="/admin" element={<AdminLayout/>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsPage />} />
        </Route>
      </Routes>

    </Router>
  );
}

export default App;
