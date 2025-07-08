// middleware/file-upload.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config(); // load .env values for cloudinary config

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'picport', // optional: your folder name on Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});

const fileUpload = multer({ storage });

export default fileUpload;
