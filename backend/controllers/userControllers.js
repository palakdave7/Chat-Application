const asyncHandler = require('express-async-handler'); // Middleware to handle async errors
const User = require('../Models/userMOdel.js'); // Mongoose User model
const generateToken = require('../config/generateToken.js'); // Function to generate JWT token

// ========================
// Register a New User
// ========================
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body; // Destructure user input

    // Check for required fields
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please Enter all the fields'); // Custom error if missing fields
    }

    // Check if user already exists in DB
    const userExists = await User.findOne({ email }); // Mongoose method to find one user by email
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Create new user
    const user = await User.create({
        name,
        email,
        password,
        pic
    });

    // If user created, send back their data with token
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id), // Token created using user ID
        });
    } else {
        res.status(400);
        throw new Error('Failed to create the user');
    }
});

// ========================
// Authenticate/Login User
// ========================
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body; // Extract login credentials

    const user = await User.findOne({ email }); // Check for user in DB

    // If user found and password matched using custom method from model
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id), // Token returned on login
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password'); // Unauthorized access
    }
});

// ========================
// Get All Users (with Search)
// ========================
const allUsers = asyncHandler(async (req, res) => {
    // Search query (optional) from URL this is search query of mongodb
    const keyword = req.query.search
        ? {
              // Search by name or email using regex (case-insensitive)
              $or: [
                  { name: { $regex: req.query.search, $options: 'i' } },
                  { email: { $regex: req.query.search, $options: 'i' } },
              ],
          }
        : {};

    // Get users that match keyword, excluding current logged-in user
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }); // $ne = not equal
    res.send(users); // Send matched users as response
});

module.exports = {
    registerUser, // To register a new user
    authUser,     // To login/authenticate a user
    allUsers      // To get list of users (search + excluding self)
};
