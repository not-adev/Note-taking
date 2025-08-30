import User from "../models/User.js";
import jwt from "jsonwebtoken"
// import { Note } from "../models/Notes";
export async function handleGetNotes(req, res) {
     const JWT_SECRET = process.env.JWT_SECRET || "fakdkhowrr9uwer34583jdf"; 
    const token = req.cookies.token; 

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const uesrId = jwt.verify(token, JWT_SECRET);
        const notes = await User.findOne({ uesrId }).populate('notes');;
        // const notes = await NoteModel.find({ id: { $in:user.notes } });
        if(!notes){
         return   res.status(200).json({notes : [] ,  message: 'successfull ' });
        }

       return res.status(200).json({notes : notes ,  message: 'successfull ' });
    
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
