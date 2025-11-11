import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import { Edit3, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InventoryTracker() {
  const { products, updateProduct, loading } = useContext(AdminContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newStock, setNewStock] = useState("");

  const handleUpdate = async (item) => {
    const updatedStock = parseInt(newStock);

    if (isNaN(updatedStock) || updatedStock < 0) return;

    // Automatically update status based on stock
    const updatedData = {
      stock: updatedStock,
      status: updatedStock === 0 ? "inactive" : "active",
    };

    await updateProduct(item._id, updatedData);

    setSelectedItem(null);
    setNewStock("");
  };

  return (
    <div className="bg-white/80 border border-[#E6D5C3] rounded-2xl p-6 shadow-lg relative">
      <h2 className="text-2xl font-semibold text-[#5C2C06] mb-4">Inventory Tracker</h2>

      {loading ? (
        <p className="text-center text-[#8B5E3C]">Loading inventory...</p>
      ) : (
        <table className="w-full text-left text-[#5C2C06] border-collapse">
          <thead>
            <tr className="border-b border-[#E6D5C3]">
              <th className="py-2">Item</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item._id} className="border-b border-[#E6D5C3]">
                <td className="py-2">{item.name}</td>
                <td>{item.stock}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="text-[#5C2C06] hover:text-[#C68B59]"
                  >
                    <Edit3 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Popup Modal for Stock Update */}
      <AnimatePresence>
        {selectedItem && (
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
              className="bg-[#FFF9F4] border border-[#E6D5C3] rounded-2xl p-6 w-full max-w-sm shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 text-[#8B5E3C] hover:text-[#5C2C06]"
              >
                <X size={20} />
              </button>

              <h3 className="text-xl font-semibold text-[#5C2C06] mb-4">
                Update Stock for {selectedItem.name}
              </h3>

              <input
                type="number"
                placeholder="Enter new stock quantity"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                className="w-full border border-[#E6D5C3] rounded-lg px-3 py-2 mb-4 focus:outline-[#C68B59]"
              />

              <button
                onClick={() => handleUpdate(selectedItem)}
                className="w-full bg-[#5C2C06] hover:bg-[#C68B59] text-white py-2 rounded-full transition"
              >
                Save Changes
              </button>

              {parseInt(newStock) === 0 && (
                <p className="text-sm text-red-600 mt-2">
                  ⚠️ This will set the product to inactive.
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
