import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// @desc    Create order
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    const products = await Product.find({ _id: { $in: items.map((i) => i.product) } });
    if (products.length !== items.length) return res.status(400).json({ message: "Invalid product(s)" });

    const totalAmount = items.reduce((sum, item) => {
      const prod = products.find((p) => p._id.toString() === item.product);
      return sum + prod.price * item.quantity;
    }, 0);

    const order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.product", "name price");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product", "name price");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
