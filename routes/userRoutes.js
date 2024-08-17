const express = require('express');
const {deleteUserAccount } = require('../controllers/userController');
const { updateUserProfile} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();


router.delete('/delete', protect, deleteUserAccount);
router.put('/update', protect, updateUserProfile);

module.exports = router;
