import mongoose from "mongoose";

// Thats how mongoose handle models they are like sql table - not really

const User = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },  // it like a email column in sql databases 
    password: {
      type: String,
      required: true,
    }, // it like a email column in sql databases 
  },
  { timestamps: true }
);

// this whole things is like a table in sql databases 




// if anyone can't get it I learnt it from Hitesh : https://youtu.be/eaQc7vbV4po?list=PLRAV69dS1uWR7KF-zV6YPYtKYEHENETyE&t=4085
// exact time stamp



export default mongoose.models.User || mongoose.model("User", User);  // this is what saves in mongoDb


