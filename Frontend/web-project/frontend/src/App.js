import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import { BooksProvider } from "./context/BookContext";
import { CartProvider } from "./context/CartContext";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Cart from "./pages/Cart";
import BookDetails from "./pages/BookDetails";
import MyOrders from "./pages/MyOrders";
import RequestBook from "./pages/RequestBook";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import OAuthSuccess from "./pages/OAuthSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

import { Toaster } from "react-hot-toast";

import Footer from "./components/Footer";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const contentStyles = {
    flex: 1, // Pushes footer down
    display: "flex",
    flexDirection: "column"
  };

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <div style={contentStyles}>
        {children}
      </div>
    </>
  );
};

function App() {
  const appStyles = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#F5F5DC" // Global background to avoid white gaps
  };

  return (
    <Router>
      <Toaster position="top-center" containerStyle={{ zIndex: 99999 }} />
      <AuthProvider>
        <CartProvider>
          <BooksProvider>
            <OrderProvider>
              <div style={appStyles}>
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin-portal" element={<AdminLogin />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/oauth-success" element={<OAuthSuccess />} />
                    <Route path="/product/:id" element={<BookDetails />} />
                    <Route path="/my-orders" element={<MyOrders />} />
                    <Route path="/request-book" element={<RequestBook />} />

                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/order-success" element={<OrderSuccess />} />

                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

                    {/* Secret Admin Login */}
                    <Route path="/admin-panel" element={<AdminLogin />} />
                    <Route path="*" element={<div style={{ textAlign: "center", padding: "50px", fontSize: "1.5rem" }}>404 - Page Not Found</div>} />
                  </Routes>
                </MainLayout>
                <Footer />
              </div>
            </OrderProvider>
          </BooksProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
