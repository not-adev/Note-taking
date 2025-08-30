// import { Note } from "../models/Notes.js";
// import User from "../models/User.js";
// import jwt from "jsonwebtoken"

// export async function handleDeleteNotes(req, res) {
//   const { id } = req.body;

//   if (!id) {
//     return res.status(400).json({ message: 'Note ID is required' });
//   }

//   try {
//     // Delete the note from the Note model
//     const deletionResult = await Note.deleteOne({ _id: id });

//     if (deletionResult.deletedCount === 0) {
//       return res.status(404).json({ message: 'Note not found' });
//     }

//     // Remove the note reference from all users
//     await User.updateMany(
//       { notes: id },
//       { $pull: { notes: id } }
//     );

//     return res.status(200).json({ message: 'Note deleted successfully' });
//   } catch (err) {
//     return res.status(500).json({ message: 'Server error', error: err });
//   }
// }