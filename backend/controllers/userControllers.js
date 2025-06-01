const asyncHandler = require('express-async-handler');
const User = require('../Models/userMOdel.js');
const generateToken = require('../config/generateToken.js');

const registerUser=asyncHandler(async(req,res)=>{
    const{name,email,password,pic}=req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error('Please Enter all the fields');
    }

    const userExists = await User.findOne({ email });
    //findOne is a mongoose method to find a single document in the collection
    if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({
        name,
        email,
        password,
        pic
    });

    //if new user is created successfully, return the user details
    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token:generateToken(user._id), // You can add a token generation logic here if needed
        });
    } else {
        res.status(400);
        throw new Error('Failed to create the user');
    }
})



const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body; 
    // Check if email and password are provided
    const user = await User.findOne({ email }); 
    
    if(user&&(await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id), // Generate a token for the authenticated user
        });
    }else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

module.exports = {
    registerUser,authUser
};