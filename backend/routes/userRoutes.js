const express = require('express');
const { registerUser, authUser } = require('../controllers/userControllers.js');

const router = express.Router();

router.route('/').post(registerUser);
router.route('/login').post(authUser); // ✅ Correct method used

module.exports = router;
