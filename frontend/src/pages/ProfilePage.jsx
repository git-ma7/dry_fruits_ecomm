import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import {
  Edit,
  Save,
  User,
  LogOut,
  MapPin,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProfilePage() {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addresses: [],
  });
  const [newAddress, setNewAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);

  // ✅ Fetch user (with addresses populated)
  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetails(data); // now data.addresses is full array of address objects
    } catch (err) {
      console.error("Failed to load user:", err);
    }
  };


  useEffect(() => {
    fetchUserData();
    console.log(userDetails)
  }, []);

  // Profile form handlers
  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      setIsEditing(false);
      await axios.put(`${API_BASE_URL}/api/users/profile`, userDetails, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchUserData(); // refresh
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  // Address handlers
  const handleAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/api/addresses`, newAddress, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchUserData(); // reload addresses
      setNewAddress({
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        isDefault: false,
      });
    } catch (err) {
      console.error("Add address failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const setDefaultAddress = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/addresses/${id}/default`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchUserData();
    } catch (err) {
      console.error("Set default failed:", err);
    }
  };

  const deleteAddress = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchUserData();
    } catch (err) {
      console.error("Delete address failed:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full bg-[#FFF9F4] flex flex-col py-10 px-5 md:px-12"
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between bg-white/80 border border-[#E6D5C3] shadow-md rounded-2xl p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-[#C68B59] flex items-center justify-center text-white text-3xl font-semibold shadow-inner">
            {userDetails.firstName
              ? userDetails.firstName.charAt(0).toUpperCase()
              : "U"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#5C2C06]">
              {userDetails.firstName} {userDetails.lastName}
            </h2>
            <p className="text-[#8B5E3C]">{userDetails.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-[#5C2C06] hover:bg-[#C68B59] text-white font-medium px-5 py-2 rounded-full shadow transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Profile and Address Section */}
      <div className=" max-w-6xl w-full mx-auto flex flex-col gap-8 mt-8">
        {/* Profile Details */}
        <div className="bg-white/80 w-full border border-[#E6D5C3] rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-[#5C2C06] flex items-center gap-2">
              <User size={20} /> Profile Details
            </h3>
            <button
              onClick={() =>
                isEditing ? handleSaveProfile() : setIsEditing(true)
              }
              className="text-[#C68B59] hover:text-[#5C2C06] transition"
            >
              {isEditing ? <Save size={20} /> : <Edit size={20} />}
            </button>
          </div>

          <div className="space-y-4">
            {["firstName", "lastName", "email", "phone"].map((key) => (
              <div key={key}>
                <label className="block text-sm text-[#8B5E3C] capitalize">
                  {key}
                </label>
                <input
                  type="text"
                  name={key}
                  value={userDetails[key] || ""}
                  onChange={handleChange}
                  disabled={key === "email" || !isEditing}
                  className={`w-full mt-1 px-3 py-2 rounded-lg border border-[#E6D5C3] text-[#5C2C06] focus:outline-none ${
                    isEditing && key !== "email"
                      ? "bg-white"
                      : "bg-transparent cursor-default"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Address Management */}
        <div className="bg-white/80 w-full border border-[#E6D5C3] rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-[#5C2C06] mb-4 flex items-center gap-2">
            <MapPin size={20} /> Saved Addresses
          </h3>

          {/* Existing Addresses */}
          {userDetails.addresses?.length === 0 ? (
            <p className="text-[#8B5E3C] text-sm">No addresses saved yet.</p>
          ) : (
            <div className="space-y-4 max-h-[30vh] overflow-y-auto">
              {userDetails.addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="border border-[#E6D5C3] rounded-lg p-3 flex justify-between items-start"
                >
                  <div>
                    <p className="font-medium text-[#5C2C06]">{addr.line1}</p>
                    {addr.line2 && <p className="text-sm">{addr.line2}</p>}
                    <p className="text-sm text-[#8B5E3C]">
                      {addr.city}, {addr.state} - {addr.postalCode}
                    </p>
                    <p className="text-sm text-[#8B5E3C]">{addr.country}</p>
                    {addr.isDefault && (
                      <span className="text-xs bg-[#C68B59]/20 px-2 py-1 rounded text-[#5C2C06]">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(addr._id)}
                        className="text-sm text-[#C68B59] hover:underline"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => deleteAddress(addr._id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Address Form */}
          <form onSubmit={handleAddAddress} className="mt-6 space-y-3">
            <h4 className="text-md font-semibold text-[#5C2C06] flex items-center gap-1">
              <Plus size={16} /> Add New Address
            </h4>
            {["line1", "line2", "city", "state", "postalCode", "country"].map(
              (f) => (
                <input
                  key={f}
                  name={f}
                  placeholder={f[0].toUpperCase() + f.slice(1)}
                  value={newAddress[f]}
                  onChange={handleAddressChange}
                  required={
                    ["line1", "city", "state", "postalCode", "country"].includes(
                      f
                    )
                  }
                  className="w-full p-2 rounded-lg border border-[#E6D5C3] text-[#5C2C06] bg-white/50 focus:outline-none"
                />
              )
            )}
            <label className="flex items-center gap-2 text-sm text-[#5C2C06]">
              <input
                type="checkbox"
                name="isDefault"
                checked={newAddress.isDefault}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, isDefault: e.target.checked })
                }
              />
              Set as default
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C68B59] hover:bg-[#5C2C06] text-white py-2 rounded-md font-medium transition"
            >
              {loading ? "Adding..." : "Add Address"}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
