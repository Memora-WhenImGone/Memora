import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },

    fullname:{
         type: String,
        required: [true, "Please type your full name given by your parents"],
    }
    
})

const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;



