// src/context/AdminContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // adjust base URL as needed for your deployment
  const API_URL = import.meta.env.VITE_API_URL;

  // Setup axios defaults for authorization header
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/products`);
      setProducts(data);
      setInventory(
        data.map((p) => ({
          id: p._id,
          name: p.name,
          stock: p.stock,
          status: p.status,
        }))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Create new product
  const addProduct = async (productData) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/products`, productData);
      setProducts((prev) => [...prev, data]);
      setInventory((prev) => [
        ...prev,
        { id: data._id, name: data.name, stock: data.stock, status: data.status },
      ]);
    } catch (err) {
      console.error(err);
      alert("Error creating product");
    }
  };

  // Update product
  const updateProduct = async (id, updatedData) => {
    try {
      const { data } = await axios.put(`${API_URL}/api/products/${id}`, updatedData);
      setProducts((prev) => prev.map((p) => (p._id === id ? data : p)));
      setInventory((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, stock: data.stock, status: data.status } : i
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error updating product");
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setInventory((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
  };

  // Update stock (auto-deactivate when stock is 0)
  const updateStock = async (id, newStock) => {
    try {
      const updatedData = {
        stock: newStock,
        status: newStock === 0 ? "inactive" : "active",
      };
      const { data } = await axios.put(`${API_URL}/api/products/${id}`, updatedData);

      setInventory((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, stock: data.stock, status: data.status }
            : i
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error updating stock");
    }
  };

  const value = {
    products,
    inventory,
    users,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
