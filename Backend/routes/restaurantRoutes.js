import express from "express";
const router = express.Router();

// your routes here
router.get("/", (req, res) => {
  res.send("Restaurant route works!");
});

export default router; // ✅ default export
