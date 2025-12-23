const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const os = require('os');

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Use /tmp on Vercel (or any read-only env) or fall back to ./uploads locally
        // Vercel serverless functions allow writing to /tmp
        const uploadPath = process.env.NODE_ENV === 'production' ? '/tmp' : './uploads/';
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

// Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|webp/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Upload endpoint
router.post('/', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).json({ message: err });
        } else {
            if (req.file == undefined) {
                res.status(400).json({ message: 'No file selected!' });
            } else {
                res.json({
                    message: 'File Uploaded!',
                    filePath: `/uploads/${req.file.filename}`
                });
            }
        }
    });
});

module.exports = router;
