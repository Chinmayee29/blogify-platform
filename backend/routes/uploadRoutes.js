const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');

const router = express.Router();

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Use memory storage to get file buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ message: 'Cloudinary credentials are not configured' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Upload using upload_stream to handle buffer
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'blogify_uploads' },
        (error, uploaded) => {
          if (error) return reject(error);
          return resolve(uploaded);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    return res.status(201).json({ url: result.secure_url });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Upload failed' });
  }
});

module.exports = router;


