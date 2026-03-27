import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Admin from './pages/Admin';
import AdminOrders from './pages/AdminOrders';
import Contact from './pages/Contact';
import About from './pages/About';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import Checkout from './pages/Checkout';
import DeliveryInstructions from './pages/DeliveryInstructions';
import WhatsAppButton from './components/WhatsAppButton';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function UserProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route 
                  path="/products" 
                  element={
                    <UserProtectedRoute>
                      <Products />
                    </UserProtectedRoute>
                  } 
                />
                <Route 
                  path="/products/:id" 
                  element={
                    <UserProtectedRoute>
                      <ProductDetails />
                    </UserProtectedRoute>
                  } 
                />
                <Route 
                  path="/about" 
                  element={
                    <UserProtectedRoute>
                      <About />
                    </UserProtectedRoute>
                  } 
                />
                <Route 
                  path="/contact" 
                  element={
                    <UserProtectedRoute>
                      <Contact />
                    </UserProtectedRoute>
                  } 
                />
                <Route 
                  path="/cart" 
                  element={
                    <UserProtectedRoute>
                      <Cart />
                    </UserProtectedRoute>
                  } 
                />
                <Route 
                  path="/my-orders" 
                  element={
                    <UserProtectedRoute>
                      <MyOrders />
                    </UserProtectedRoute>
                  } 
                />
                <Route 
                  path="/checkout/:id" 
                  element={
                    <UserProtectedRoute>
                      <Checkout />
                    </UserProtectedRoute>
                  } 
                />
                <Route path="/delivery" element={<DeliveryInstructions />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/admin" 
                  element={
                    <AdminProtectedRoute>
                      <Admin />
                    </AdminProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/orders" 
                  element={
                    <AdminProtectedRoute>
                      <AdminOrders />
                    </AdminProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
            <WhatsAppButton />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
