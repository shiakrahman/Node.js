const express = require('express');
const { uploadMedia, deleteMedia } = require('../controllers/mediaController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const { likeMedia, commentOnMedia } = require('../controllers/mediaController');



router.post('/upload', protect, uploadMedia);
router.delete('/delete/:mediaId', protect, deleteMedia);
router.post('/like/:mediaId', protect, likeMedia);
router.post('/comment/:mediaId', protect, commentOnMedia);

module.exports = router;



