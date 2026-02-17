import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide a email"],
      unique: true,
      lowercase: true, 
      trim: true,      
    },

    password: {
      type: String,
      required: [true, "Please provide a password"],
    },

    fullname: {
      type: String,
      required: [true, "Please type your full name given by your parents"],
    },
  },
  { timestamps: true } 
);

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;
