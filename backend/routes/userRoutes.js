const express = require('express');
const { registerUser, authUser } = require('../controllers/userControllers.js');
const { allUsers } = require('../controllers/userControllers.js'); // Importing allUsers function
const { protect } = require('../middleware/authMiddleware.js'); // Importing protect middleware

const router = express.Router();

router.route('/').post(registerUser).get(protect,allUsers);
router.route('/login').post(authUser); // ✅ Correct method used

module.exports = router;
