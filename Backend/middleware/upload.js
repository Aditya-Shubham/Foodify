import multer from "multer";
import path from "path";
import fs from "fs";

const restaurantDir = "uploads/restaurants";
const menuDir = "uploads/menu";
const aadhaarDir = "uploads/aadhaar";
const drivingDir = "uploads/driving-license";

// auto-create folders
[
  "uploads",
  restaurantDir,
  menuDir,
  aadhaarDir,
  drivingDir
].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "aadhaar") cb(null, aadhaarDir);
    else if (file.fieldname === "drivingLicense") cb(null, drivingDir);
    else if (file.fieldname === "restaurantImage") cb(null, restaurantDir);
    else if (file.fieldname === "menuImages") cb(null, menuDir);
    else cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
    );
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error("Only image files allowed"));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});
