import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Save, Package, History, User, LogOut } from "lucide-react";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [userDetails, setUserDetails] = useState({
        name: "Om Prajapati",
        email: "om@example.com",
        phone: "+91 98765 43210",
        address: "BVM Campus, V. V. Nagar, Gujarat",
    });

    const [orders] = useState({
        current: [
            {
                id: "ORD1234",
                date: "Nov 8, 2025",
                status: "Shipped",
                total: "₹1,250",
                items: [
                    { name: "Premium Almonds (500g)", quantity: 1, price: "₹550" },
                    { name: "Kesar Saffron (1g)", quantity: 1, price: "₹700" },
                ],
            },
            {
                id: "ORD1235",
                date: "Nov 9, 2025",
                status: "Processing",
                total: "₹2,000",
                items: [
                    { name: "Organic Cashews (1kg)", quantity: 1, price: "₹900" },
                    { name: "Raisins (500g)", quantity: 2, price: "₹550" },
                ],
            },
        ],
        past: [
            {
                id: "ORD1222",
                date: "Oct 28, 2025",
                status: "Delivered",
                total: "₹850",
                items: [
                    { name: "Walnuts (250g)", quantity: 2, price: "₹400" },
                    { name: "Dry Dates (250g)", quantity: 1, price: "₹50" },
                ],
            },
            {
                id: "ORD1201",
                date: "Oct 12, 2025",
                status: "Delivered",
                total: "₹1,500",
                items: [
                    { name: "Dry Figs (500g)", quantity: 1, price: "₹750" },
                    { name: "Black Raisins (500g)", quantity: 1, price: "₹750" },
                ],
            },
        ],
    });

    const handleChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setIsEditing(false);
        // API integration for updating user details can go here
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen w-full bg-[#FFF9F4] gap-6 flex flex-col py-10 px-5 md:px-12"
        >
            {/* Profile Header */}
            <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between bg-white/80 border border-[#E6D5C3] shadow-md rounded-2xl p-6 ">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-[#C68B59] flex items-center justify-center text-white text-3xl font-semibold shadow-inner">
                        {userDetails.name[0].toUpperCase() + userDetails.name.split(" ")[1]?.[0].toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[#5C2C06]">{userDetails.name}</h2>
                        <p className="text-[#8B5E3C]">{userDetails.email}</p>
                    </div>
                </div>
                <button className="mt-4 md:mt-0 flex items-center gap-2 bg-[#5C2C06] hover:bg-[#C68B59] text-white font-medium px-5 py-2 rounded-full shadow transition">
                    <LogOut size={18} />
                    Logout
                </button>
            </div>

            {/* Profile Details + Orders Section */}
            <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row  gap-8">
                {/* Profile Details */}
                <div className="bg-white/80 w-full border border-[#E6D5C3] rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-[#5C2C06] flex items-center gap-2">
                            <User size={20} /> Profile Details
                        </h3>
                        <button
                            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                            className="text-[#C68B59] hover:text-[#5C2C06] transition"
                        >
                            {isEditing ? <Save size={20} /> : <Edit size={20} />}
                        </button>
                    </div>

                    <div className="space-y-4">
                        {Object.keys(userDetails).map((key) => (
                            <div key={key}>
                                <label className="block text-sm text-[#8B5E3C] capitalize">{key}</label>
                                <input
                                    type="text"
                                    name={key}
                                    value={userDetails[key]}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full mt-1 px-3 py-2 rounded-lg border border-[#E6D5C3] text-[#5C2C06] focus:outline-none ${isEditing ? "bg-white" : "bg-transparent cursor-default"
                                        }`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Orders Section */}
                <div className="col-span-2 w-full grid gap-8">
                    {/* Current Orders */}
                    <div className="bg-white/80  border border-[#E6D5C3] rounded-2xl p-6 shadow-md">
                        <h3 className="text-xl font-semibold text-[#5C2C06] mb-4 flex items-center gap-2">
                            <Package size={20} /> Current Orders
                        </h3>
                        {orders.current.length > 0 ? (
                            <div className="space-y-5 max-h-[40vh] h-full overflow-y-auto">
                                {orders.current.map((order) => (
                                    <div
                                        key={order.id}
                                        className="bg-[#FFF9F4] border border-[#E6D5C3] rounded-xl p-5 shadow-sm"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                                            <div>
                                                <h4 className="font-semibold text-[#5C2C06] text-lg">
                                                    Order ID: {order.id}
                                                </h4>
                                                <p className="text-sm text-[#8B5E3C]">Date: {order.date}</p>
                                            </div>
                                            <span className="mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm bg-[#C68B59]/20 text-[#5C2C06] font-medium">
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="border-t border-[#E6D5C3] pt-3 space-y-3">
                                            {order.items.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex justify-between text-[#5C2C06] text-sm"
                                                >
                                                    <p>
                                                        {item.name} × {item.quantity}
                                                    </p>
                                                    <p>{item.price}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="border-t border-[#E6D5C3] mt-3 pt-2 flex justify-between text-[#5C2C06] font-semibold">
                                            <p>Total</p>
                                            <p>{order.total}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-[#8B5E3C]">No current orders found.</p>
                        )}
                    </div>
                </div>

            </div>
            {/* Past Orders */}
            <div className="bg-white/80 max-w-6xl w-full mx-auto border  border-[#E6D5C3] rounded-2xl p-6 shadow-md">
                <h3 className="text-xl font-semibold bg-white  text-[#5C2C06] mb-4 flex items-center gap-2">
                    <History size={20} /> Past Orders
                </h3>
                {orders.past.length > 0 ? (
                    <div className="space-y-5 max-h-[50vh] h-full overflow-y-auto">
                        {orders.past.map((order) => (
                            <div
                                key={order.id}
                                className="bg-[#FFF9F4] border border-[#E6D5C3] rounded-xl p-5 shadow-sm"
                            >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                                    <div>
                                        <h4 className="font-semibold text-[#5C2C06] text-lg">
                                            Order ID: {order.id}
                                        </h4>
                                        <p className="text-sm text-[#8B5E3C]">Date: {order.date}</p>
                                    </div>
                                    <span className="mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm bg-gray-200 text-[#5C2C06] font-medium">
                                        {order.status}
                                    </span>
                                </div>

                                <div className="border-t border-[#E6D5C3] pt-3 space-y-3">
                                    {order.items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex justify-between text-[#5C2C06] text-sm"
                                        >
                                            <p>
                                                {item.name} × {item.quantity}
                                            </p>
                                            <p>{item.price}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-[#E6D5C3] mt-3 pt-2 flex justify-between text-[#5C2C06] font-semibold">
                                    <p>Total</p>
                                    <p>{order.total}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-[#8B5E3C]">No past orders found.</p>
                )}
            </div>
        </motion.div>
    );
}
