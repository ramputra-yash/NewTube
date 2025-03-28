const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary Storage for Videos
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'user_videos', // Videos ke liye alag folder
      resource_type: 'video', // Video files ke liye
      public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '-').replace(/[^\w.-]/g, '')}`,
      format: ['mp4', 'mkv', 'avi', 'mov'], // Allowed formats
    };
  },
});
const upload = multer({ storage: storage })
module.exports = upload;
