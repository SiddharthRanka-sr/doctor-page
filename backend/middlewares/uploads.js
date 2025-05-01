const multer = require('multer');
const path = require('path');

// Set up the file storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Specify the folder where files will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));  // Use the original file extension
  }
});

// Validate file type (only allow images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];  // Allow jpeg, png, gif
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // Accept file
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and GIF are allowed.'));
  }
};

// Set up multer instance with storage and fileFilter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },  // Limit file size to 5MB
});

module.exports = upload;
