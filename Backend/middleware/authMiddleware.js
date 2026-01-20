import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect route (user must be logged in)
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) return res.status(401).json({ message: "User not found" });

      next();
    } catch (err) {
      console.error("Protect middleware error:", err);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

// Admin only access
export const adminOnly = (req, res, next) => {
  if (!req.user) return res.status(403).json({ message: "Access denied: no user" });
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied: admin only" });
  next();
};