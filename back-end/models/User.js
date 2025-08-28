import mongoose from "mongoose";

let userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    email: String,
    name: String,
    picture: String,

})

export const User = mongoose.models.user || mongoose.model('user', userSchema);
