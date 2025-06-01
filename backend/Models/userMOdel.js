const mongoose = require("mongoose");
const bcrypt=require('bcryptjs')// Import bcryptjs for hashing passwords
const userSchema= mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        pic: {
            type: String,
            default:
                "https://iconarchive.com/download/i107128/Flat-Design-Icons/Flat-User-Profile-2-icon.ico",
        },
    },
    {
        timestamps: true,
    }
);           

userSchema.methods.matchPassword = async function (enteredPassword) {
    // Compare the entered password with the hashed password
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
    if (!this.isModified) {
        next();
    }
    // Hash the password before saving
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;                                           