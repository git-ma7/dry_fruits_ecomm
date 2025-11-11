import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import { Plus, Trash2, Edit3, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ItemManager() {
  const { products, addProduct, deleteProduct, updateProduct, loading } = useContext(AdminContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  // inside useState
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    sku: "",
    status: "active",
    images: [""],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) {
      alert("Please fill in product name and price.");
      return;
    }

    if (editingProduct) {
      await updateProduct(editingProduct._id, formData);
    } else {
      await addProduct(formData);
    }
    resetForm();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    // when editing a product
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      sku: product.sku || "",
      status: product.status || "active",
      images: product.images?.length ? product.images : [""],
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      sku: "",
      status: "active",
      image: "",
    });
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white/80 border border-[#E6D5C3] rounded-2xl p-6 shadow-lg relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-[#5C2C06]">Manage Products</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#5C2C06] hover:bg-[#C68B59] text-white px-4 py-2 rounded-full transition"
        >
          <Plus size={18} /> Add Item
        </button>
      </div>

      {/* Product List */}
      {loading ? (
        <p className="text-center text-[#8B5E3C]">Loading products...</p>
      ) : (
        <ul className="space-y-3">
          {products.map((p) => (
            <li
              key={p._id}
              className="flex justify-between items-center border border-[#E6D5C3] p-4 rounded-xl bg-[#FFF9F4]"
            >
              <div className="flex items-center gap-3">
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 rounded-md object-cover border border-[#E6D5C3]"
                  />
                )}
                <div>
                  <p className="font-semibold text-[#5C2C06]">{p.name}</p>
                  <p className="text-sm text-[#8B5E3C]">
                    ₹{p.price} | Stock: {p.stock} | SKU: {p.sku}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-[#5C2C06] hover:text-[#C68B59] transition"
                >
                  <Edit3 size={20} />
                </button>
                <button
                  onClick={() => deleteProduct(p._id)}
                  className="text-[#C68B59] hover:text-red-600 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Popup Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-[#FFF9F4] border border-[#E6D5C3] rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={resetForm}
                className="absolute top-3 right-3 text-[#8B5E3C] hover:text-[#5C2C06]"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-semibold text-[#5C2C06] mb-4">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>

              <div className="space-y-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-[#E6D5C3] rounded-lg px-3 py-2 focus:outline-[#C68B59]"
                />

                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-[#E6D5C3] rounded-lg px-3 py-2 focus:outline-[#C68B59]"
                />

                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border border-[#E6D5C3] rounded-lg px-3 py-2 focus:outline-[#C68B59]"
                />

                {!editingProduct && (
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full border border-[#E6D5C3] rounded-lg px-3 py-2 focus:outline-[#C68B59]"
                  />
                )}

                <input
                  type="text"
                  name="sku"
                  placeholder="SKU"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full border border-[#E6D5C3] rounded-lg px-3 py-2 focus:outline-[#C68B59]"
                />

                {/* ✅ Image URL Input (Array compatible) */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ImageIcon size={18} className="text-[#C68B59]" />
                    <label className="text-sm font-medium text-[#5C2C06]">
                      Image URL
                    </label>
                  </div>
                  <input
                    type="text"
                    name="image"
                    placeholder="https://example.com/image.jpg"
                    value={formData.images[0] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, images: [e.target.value] })
                    }
                    className="w-full border border-[#E6D5C3] rounded-lg px-3 py-2 focus:outline-[#C68B59]"
                  />
                  {formData.images[0] && (
                    <img
                      src={formData.images[0]}
                      alt="Preview"
                      className="w-full h-32 object-cover mt-2 rounded-md border border-[#E6D5C3]"
                    />
                  )}
                </div>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-[#E6D5C3] rounded-lg px-3 py-2 focus:outline-[#C68B59]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                <button
                  onClick={handleSave}
                  className="w-full mt-4 bg-[#5C2C06] hover:bg-[#C68B59] text-white font-medium py-2 rounded-full transition"
                >
                  {editingProduct ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
