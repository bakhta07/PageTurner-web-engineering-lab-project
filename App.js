import { BooksProvider } from "./context/BookContext";
import { OrderProvider } from "./context/OrderContext"; // ✅ correct
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import Checkout from "./pages/Checkout";



function App() {
  return (
    <BooksProvider>
      <OrderProvider> {/* ✅ use correct name */}
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/catalog"
              element={
                <ProtectedRoute>
                  <Catalog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
                path="/checkout"
              element={
              <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  }
/>

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </Router>
      </OrderProvider>
    </BooksProvider>
  );
}

export default App;
