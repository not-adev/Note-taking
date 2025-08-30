// import { Note } from "../models/Notes.js";
// import User from "../models/User.js";

// export async function handleAddNote(req, res) {
//     const { title, body } = req.body;

//     if (!title || !body || !userId) {
//         return res.status(400).json({ message: "Missing required fields" });
//     }

//     try {
//         // Create and save the note
//         const newNote = await Note.create({ title, body });
//         const JWT_SECRET = process.env.JWT_SECRET || "fakdkhowrr9uwer34583jdf";
//         const token = req.cookies.token;
//         const userId = jwt.verify(token, JWT_SECRET);
//         // Link the note to the user
//         await User.updateOne(
//             { _id: userId },
//             { $push: { notes: newNote._id } }
//         );

//         return res.status(200).json({ message: "Note added", id : newNote._id });
//     } catch (err) {
//         return res.status(500).json({ message: "Server error", error: err });
//     }
// }