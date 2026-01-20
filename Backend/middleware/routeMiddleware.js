export const allowRoles = (...roles) => {
  return (req, res, next) => {
    // req.user must come from authMiddleware (protect)
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions",
      });
    }

    next();
  };
};