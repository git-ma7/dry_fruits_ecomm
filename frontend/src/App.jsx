// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import AuthPage from "./pages/AuthPage";
import Checkout from "./pages/Checkout";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="grow bg-[#FFF9F4]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop/>} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About/> }/>
            <Route path="/contact" element={<Contact/>} />
            <Route path="/profile" element={<ProfilePage/>} />
            <Route path="/login" element={<AuthPage/>} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout/>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
