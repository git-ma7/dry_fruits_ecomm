import React, { useState } from "react";
import { motion } from "framer-motion";
import ItemManager from "../components/ItemManager";
import InventoryTracker from "../components/InventoryTracker";
import { Package, Layers } from "lucide-react";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("items");

  const tabClasses = (tab) =>
    `px-5 py-2 text-lg font-medium rounded-xl transition-all ${
      activeTab === tab
        ? "bg-[#C68B59] text-white shadow-md"
        : "text-[#5C2C06] hover:bg-[#FFF0E0]"
    }`;

  return (
    <div className="min-h-screen bg-[#FFF9F4] text-[#5C2C06] flex flex-col items-center p-6">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl md:text-4xl font-bold mb-8"
      >
        🛠️ Admin Dashboard
      </motion.h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button onClick={() => setActiveTab("items")} className={tabClasses("items")}>
          <Layers className="inline-block mr-2" /> Manage Items
        </button>
        <button onClick={() => setActiveTab("inventory")} className={tabClasses("inventory")}>
          <Package className="inline-block mr-2" /> Inventory Tracker
        </button>
      </div>

      {/* Main Panel */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg transition-all duration-300">
        {activeTab === "items" ? <ItemManager /> : <InventoryTracker />}
      </div>
    </div>
  );
}
