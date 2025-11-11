import Address from "../models/addressModel.js";
import User from "../models/userModel.js";

// @desc Get all addresses of a user
// @route GET /api/addresses
// @access Private
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({
      isDefault: -1,
      createdAt: -1,
    }); 
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch addresses", error: error.message });
  }
};

// @desc Add new address
// @route POST /api/addresses
// @access Private
export const addAddress = async (req, res) => {
  try {
    const { line1, line2, city, state, postalCode, country, isDefault } = req.body;

    if (!line1 || !city || !state || !postalCode || !country)
      return res.status(400).json({ message: "Please fill all required fields." });

    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const newAddress = await Address.create({
      user: req.user._id,
      line1,
      line2,
      city,
      state,
      postalCode,
      country,
      isDefault: !!isDefault,
    });

    // 🧩 Add this: link new address to user
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { addresses: newAddress._id }, // prevents duplicates
    });

    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ message: "Failed to add address", error: error.message });
  }
};

// @desc Update existing address
// @route PUT /api/addresses/:id
// @access Private
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { line1, line2, city, state, postalCode, country, isDefault } = req.body;

    const address = await Address.findOne({ _id: id, user: req.user._id });
    if (!address) return res.status(404).json({ message: "Address not found" });

    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    address.line1 = line1 || address.line1;
    address.line2 = line2 || address.line2;
    address.city = city || address.city;
    address.state = state || address.state;
    address.postalCode = postalCode || address.postalCode;
    address.country = country || address.country;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    const updated = await address.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update address", error: error.message });
  }
};

// @desc Delete address
// @route DELETE /api/addresses/:id
// @access Private
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findOneAndDelete({ _id: id, user: req.user._id });
    if (!address) return res.status(404).json({ message: "Address not found" });
    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete address", error: error.message });
  }
};

// @desc Set default address
// @route PATCH /api/addresses/:id/default
// @access Private
export const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    await Address.updateMany({ user: req.user._id }, { isDefault: false });
    const updated = await Address.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { isDefault: true },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Address not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to set default address", error: error.message });
  }
};
