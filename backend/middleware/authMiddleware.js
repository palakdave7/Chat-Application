const jwt=require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../Models/userMOdel.js'); // Mongoose User model

const protect = asyncHandler(async (req, res, next) => {
    // Check if the request has an Authorization header and it starts with 'Bearer'
    // Format expected: "Authorization: Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token part from the Authorization header
            // Example: "Bearer abc123token" => token = "abc123token"
            const token = req.headers.authorization.split(' ')[1];

            // Verify the token using the JWT_SECRET environment variable
            // This checks if the token is valid and was signed using your secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Use the decoded token's payload to find the user by ID
            // Usually, the payload has a structure like: { id: 'userId', iat: ..., exp: ... }
            // We exclude the password field for security before attaching user to request
            req.user = await User.findById(decoded.id).select('-password');

            // If token is valid and user found, call next() to continue to the next middleware or route
            next();
        } catch (error) {
            // If token verification fails (e.g., expired or tampered), return 401 Unauthorized
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        // If Authorization header is missing or not in the correct format, return 401
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports={protect};