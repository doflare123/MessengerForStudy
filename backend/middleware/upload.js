const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });
const cloudinary = require('../utils/Cloudinary')

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'avatars',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 200, height: 200, crop: 'limit' }]
    }
  });
  
  const upload = multer({ storage });
  
  module.exports = upload;
