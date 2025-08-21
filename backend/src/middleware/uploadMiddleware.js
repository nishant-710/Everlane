const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const uploadDir = path.join(__dirname, "../../public/uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueFileName = `${uuidv4()}_${Date.now()}${ext}`;
    cb(null, uniqueFileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Error: Only images (jpeg, jpg, png) are allowed."));
};

const upload = multer({
  storage,
  limits: { fileSize: 11 * 1024 * 1024 },
  fileFilter,
});

module.exports = upload;
