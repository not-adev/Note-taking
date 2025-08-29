import mongoose from "mongoose";

let userSchema = new mongoose.Schema({
    email: String,
    name: String,
    picture: String,

})

const User = mongoose.models.user || mongoose.model('user', userSchema);
export default User 
