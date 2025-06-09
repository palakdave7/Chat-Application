const expressAsyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel.js");
const User = require("../Models/userMOdel.js"); // ✅ Required for User.populate()

const accessChat = expressAsyncHandler(async (req, res) => {
    const { userId } = req.body; // Extract userId from request body

    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400); // 400 Bad Request
    }

    // ✅ Check for existing one-on-one chat
    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } }, // Current user
            { users: { $elemMatch: { $eq: userId } } }        // Other user
        ]
    })
    .populate("users", "-password")
    .populate("latestMessage");

    // ✅ Populate sender of the latest message
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email"
    });

    // ✅ If chat exists, return it
    if (isChat.length > 0) {
        return res.send(isChat[0]);
    }

    // ✅ If chat doesn't exist, create it
    const chatData = {
        chatName: "sender", // Optional: This is often used in frontend
        isGroupChat: false,
        users: [req.user._id, userId],
    };

    try {
        const createdChat = await Chat.create(chatData);
        const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
        return res.status(200).json(fullChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message); // Proper error reporting
    }
});


const fetchChats= expressAsyncHandler(async (req, res) => {
    try {
        // ✅ Fetch all chats for the user
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 }) // Sort by latest update
        .then(async (results) => {
            // ✅ Populate sender of the latest message
            results = await User.populate(results, {
                path: "latestMessage.sender",
                select: "name pic email",
            });
        })
    }
    catch (error) {
        res.status(400);
        throw new Error(error.message); // Proper error reporting
    }   

});

const createGroupChat = expressAsyncHandler(async (req, res) => {
    if( !req.body.users || !req.body.name){
        return res.status(400).send({ message: "Please fill all the fields" }); 
    } 
    var users = JSON.parse(req.body.users); // Parse users from request body

    if (users.length < 2) {
        return res.status(400).send({ message: "More than 2 users are required to form a group chat" });
    }

    users.push(req.user); // Add the creator to the group
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name ,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message); // Proper error reporting
    }
}
);

const renameGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body; // Extract chatId and chatName from request body

    if (!chatId || !chatName) {
        return res.status(400).send({ message: "Please fill all the fields" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { chatName },
        { new: true } // Return the updated document
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!updatedChat) {
        return res.status(404).send({ message: "Chat not found" });
    }

    res.status(200).json(updatedChat);
}); 

const addToGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body; // Extract chatId and userId from request body

    if (!chatId || !userId) {
        return res.status(400).send({ message: "Please fill all the fields" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { users: userId } }, // Add user to the group
        { new: true } // Return the updated document
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!updatedChat) {
        return res.status(404).send({ message: "Chat not found" });
    }

    res.status(200).json(updatedChat);
});

const removeFromGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body; // Extract chatId and userId from request body

    if (!chatId || !userId) {
        return res.status(400).send({ message: "Please fill all the fields" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { users: userId } }, // Remove user from the group
        { new: true } // Return the updated document
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!updatedChat) {
        return res.status(404).send({ message: "Chat not found" });
    }

    res.status(200).json(updatedChat);
});

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup };
