import mongoose from "mongoose";

let noteSchema = new mongoose.Schema({
  title : String ,
  body : String ,
})
  
export const Note = mongoose.models.note || mongoose.model('note', noteSchema);
