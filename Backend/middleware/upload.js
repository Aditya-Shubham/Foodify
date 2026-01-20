import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "restaurantImage") {
      cb(null, "uploads/restaurants");
    } else if (file.fieldname === "menuImages") {
      cb(null, "uploads/menu");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });