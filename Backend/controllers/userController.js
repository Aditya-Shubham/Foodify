import User from "../models/User.js";

/* GET PROFILE */
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

/* UPDATE PROFILE */
export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  user.name = req.body.name;
  user.phone = req.body.phone;
  await user.save();
  res.json(user);
};

/* ADD / UPDATE ADDRESS */
export const saveAddresses = async (req, res) => {
  const user = await User.findById(req.user.id);
  user.addresses = req.body.addresses;
  await user.save();
  res.json(user.addresses);
};
