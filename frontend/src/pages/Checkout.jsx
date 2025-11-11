import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Checkout() {
  const { cartItems, subtotal, total, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    paymentMethod: "Online",
  });

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch user info & saved addresses
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Prefill user contact info
        setFormData((prev) => ({
          ...prev,
          name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
          email: data.email || "",
          phone: data.phone || "",
        }));

        // Prefill address list and default address
        if (data.addresses?.length) {
          setAddresses(data.addresses);
          const defaultAddr = data.addresses.find((a) => a.isDefault);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr._id);
            setFormData((prev) => ({
              ...prev,
              line1: defaultAddr.line1,
              line2: defaultAddr.line2,
              city: defaultAddr.city,
              state: defaultAddr.state,
              postalCode: defaultAddr.postalCode,
              country: defaultAddr.country,
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    fetchUserData();
  }, []);

  // Handle field changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle address selection
  const handleAddressSelect = (id) => {
    setSelectedAddressId(id);
    const addr = addresses.find((a) => a._id === id);
    if (addr) {
      setFormData((prev) => ({
        ...prev,
        line1: addr.line1,
        line2: addr.line2,
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        country: addr.country,
      }));
    } else {
      // Clear address fields when "Use new address" is chosen
      setFormData((prev) => ({
        ...prev,
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
      }));
    }
  };

  // Handle order placement
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      navigate("/shop");
      return;
    }

    const { name, email, phone, line1, city, state, postalCode } = formData;
    if (!name || !email || !phone || !line1 || !city || !state || !postalCode) {
      alert("Please fill in all required details.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item._id || item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          line1: formData.line1,
          line2: formData.line2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          name,
          email,
          phone,
        },
        paymentMethod: formData.paymentMethod,
        totalAmount: total,
      };

      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE_URL}/api/orders`, orderPayload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      alert("✅ Order placed successfully!");
      clearCart();
      navigate("/shop");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F4] text-[#5C2C06] flex flex-col relative pb-10">
      <div className="max-w-6xl mx-auto w-full mt-8 px-6 md:px-10">
        <h1 className="text-4xl font-bold mb-8 text-center uppercase">
          Checkout
        </h1>

        {error && (
          <p className="text-center text-red-600 bg-red-100 border border-red-300 py-2 rounded mb-4">
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse items-center md:items-start md:flex-row gap-10">
          {/* LEFT: Shipping form */}
          <form
            onSubmit={handlePlaceOrder}
            className="bg-white/60 backdrop-blur-md w-full rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold mb-6 border-b border-[#C68B59]/40 pb-3">
              Shipping Information
            </h2>

            {/* Saved Addresses */}
            {addresses.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Select Saved Address
                </label>
                <select
                  value={selectedAddressId || ""}
                  onChange={(e) => handleAddressSelect(e.target.value)}
                  className="w-full p-3 rounded-lg border border-[#C68B59]/30 bg-white/50 focus:outline-none"
                >
                  <option value="">Use New Address</option>
                  {addresses.map((addr) => (
                    <option key={addr._id} value={addr._id}>
                      {addr.line1}, {addr.city}, {addr.state}
                      {addr.isDefault ? " (Default)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="p-3 rounded-lg border border-[#C68B59]/30 bg-white/50 focus:outline-none"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="p-3 rounded-lg border border-[#C68B59]/30 bg-white/50 focus:outline-none"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="p-3 rounded-lg border border-[#C68B59]/30 bg-white/50 focus:outline-none"
              />
              <input
                type="text"
                name="line1"
                placeholder="Address Line 1"
                value={formData.line1}
                onChange={handleChange}
                className="p-3 rounded-lg border border-[#C68B59]/30 bg-white/50 focus:outline-none"
              />
              <input
                type="text"
                name="line2"
                placeholder="Address Line 2 (Optional)"
                value={formData.line2}
                onChange={handleChange}
                className="p-3 rounded-lg border border-[#C68B59]/30 bg-white/50 focus:outline-none"
              />

              <div className="grid grid-cols-2 gap-5">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="p-3 rounded-lg border border-[#C68B59]/30 bg-white/50 focus:outline-none"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className="p-3 rounded-lg border border-[#C68B59]/30 bg-white/50 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="p-3 rounded-lg border border-[#C68B59]/30 bg-white/50 focus:outline-none"
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  className="p-3 rounded-lg border border-[#C68B59]/30 bg-white/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-[#C68B59]/30 bg-white/50 focus:outline-none"
              >
                <option value="Online">Online Payment</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
          </form>
          <div className="flex flex-col w-full">
            {/* RIGHT: Order Summary */}
            <div className="bg-white/60 backdrop-blur-md w-full h-fit rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 border-b border-[#C68B59]/40 pb-3">
                Order Summary
              </h2>

              {cartItems.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-lg text-[#5C2C06]/70 mb-5">
                    Your cart is empty.
                  </p>
                  <Link
                    to="/shop"
                    className="bg-[#C68B59] text-white px-6 py-2 rounded-full hover:bg-[#5C2C06] transition"
                  >
                    Go to Shop
                  </Link>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-[#C68B59]/20">
                    {cartItems.map((item) => (
                      <div key={item._id || item.id} className="flex justify-between py-3">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-[#5C2C06]/60">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#C68B59]/30 mt-4 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <p>Subtotal</p>
                      <p>₹{subtotal}</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Delivery</p>
                      <p>FREE SHIPPING</p>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t border-[#C68B59]/30 pt-3">
                      <p>Total</p>
                      <p>₹{total}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`w-full mt-6 py-3 cursor-pointer rounded-full font-semibold transition-all ${loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#C68B59] text-white hover:bg-[#5C2C06]"
                }`}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
