import mongoose from "mongoose";

let userSchema = new mongoose.Schema({
    email: String,
    name: String,
    picture: String,
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'note' }],

})

const User = mongoose.models.user || mongoose.model('user', userSchema);
export default User 
