const express=require('express');
// Importing express to create a router for chat-related routes
const router=express.Router()
const {protect} = require('../middleware/authMiddleware.js');
// Importing the 'protect' middleware to secure routes
// Importing the router from express
const { accessChat } = require('../controllers/chatControllers.js');

router.route('/').post(protect,accessChat);
// Defining a POST route for accessing a chat, protected by the 'protect' middleware

// router.route('/').get(protect,fetchChats);
// // Defining a GET route for fetching chats, also protected by the 'protect' middleware

// router.route('/group').post(protect,createGroupChat);
// // Defining a POST route for creating a group chat, protected by the 'protect' middleware       
// router.route('/rename').put(protect,renameGroup);
// // Defining a PUT route for renaming a group, protected by the 'protect' middleware
// router.route('/groupremove').put(protect,removeFromGroup);
// // Defining a PUT route for removing a user from a group, protected by the 'protect' middleware
// router.route('/groupadd').put(protect,addToGroup);
// // Defining a PUT route for adding a user to a group, protected by the 'protect' middleware

// module.exports=router;
// // Exporting the router so it can be used in other parts of the application