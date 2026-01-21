import multer from "multer";
import path from "path";
import fs from "fs";

const restaurantDir = "uploads/restaurants";
const menuDir = "uploads/menu";

// auto-create folders
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
if (!fs.existsSync(restaurantDir)) fs.mkdirSync(restaurantDir, { recursive: true });
if (!fs.existsSync(menuDir)) fs.mkdirSync(menuDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "restaurantImage") cb(null, restaurantDir);
    else if (file.fieldname === "menuImages") cb(null, menuDir);
    else cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error("Only image files are allowed"));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

