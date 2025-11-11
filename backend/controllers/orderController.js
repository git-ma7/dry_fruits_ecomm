import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

// @desc Create order (Protected)
// @route POST /api/orders
export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items to order" });
    }

    const productIds = items.map((i) => i.product);
    const products = await Product.find({ _id: { $in: productIds } }).session(session);

    if (products.length !== items.length) {
      return res.status(400).json({ message: "Some products are invalid" });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Check stock and build order items
    for (const item of items) {
      const prod = products.find((p) => p._id.toString() === item.product);

      if (!prod) {
        await session.abortTransaction();
        return res.status(400).json({ message: `Product not found: ${item.product}` });
      }

      if (prod.stock < item.quantity) {
        await session.abortTransaction();
        return res
          .status(400)
          .json({ message: `Not enough stock for ${prod.name}. Available: ${prod.stock}` });
      }

      orderItems.push({
        product: prod._id,
        quantity: item.quantity,
        price: prod.price,
      });

      totalAmount += prod.price * item.quantity;
    }

    // Create the order first
    const order = await Order.create(
      [
        {
          user: req.user._id,
          items: orderItems,
          shippingAddress,
          totalAmount,
        },
      ],
      { session }
    );

    // Deduct stock only after order creation
    for (const item of items) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(order[0]);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Order creation failed:", error);
    res.status(500).json({ message: error.message });
  }
};


// @desc Get my orders (Protected)
// @route GET /api/orders/my
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "items.product",
      "name price"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get order by ID (Protected)
// @route GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product", "name price");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // ensure only owner or admin can view
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
