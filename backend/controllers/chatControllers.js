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

module.exports = { accessChat };
