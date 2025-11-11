import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc Register new user
// @route POST /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // const hashedPassword = await bcrypt.hash(password, 10);

    const isAdmin = email === process.env.ADMIN_EMAIL; // mark admin

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: password,
      phone,
      isAdmin,
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id, user.isAdmin),
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

// @desc Login user
// @route POST /api/users/login
export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });
    console.log(user);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(password,user.password,isMatch);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });


    // auto-set admin
    if (email === process.env.ADMIN_EMAIL && !user.isAdmin) {
      user.isAdmin = true;
      await user.save();
    }

    res.json({
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id, user.isAdmin),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get user profile (Protected)
// @route GET /api/users/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controllers/userController.js
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("addresses") // assuming addresses are separate model refs
      .select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

