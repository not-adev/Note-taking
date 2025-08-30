import express from 'express';
import { connectDB } from './helper/dbConnection.js';
import { handleSignIn } from './API/SignIn.js';
import cookieParser from 'cookie-parser';
import { handleSignUp } from './API/SignUp.js';
import cors from 'cors';

import { handleGetData } from './API/Getdata.js';
// import { handleDeleteNotes } from './API/DeleteNotes.js';
import {handleGetNotes} from "./API/GetNotes.js" ;
import {handleSignUp_with_Google} from './API/SignUpwithGoogle.js'
// import {handleAddNote} from "./API/AddNote.js"

import { sendEmail } from './API/SendEmail.js';
const app = express();
connectDB() 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(cors({
  origin: `${process.env.FRONT_END_URL}`, 
  credentials: true
}));

const port = 3000;

app.post('/signin', handleSignIn);

app.post('/otpVerification' ,sendEmail)
app.post('/signup', handleSignUp);
app.get('/logout', (req, res) => {
  res.send('Hello World!');
});
app.post("/signup_withGoogle",handleSignUp_with_Google)
app.get('/getdata', handleGetData);
app.get('/getNotes', handleGetNotes);
// app.post('/deletNote', handleDeleteNotes);
// app.post('/addNote', handleAddNote);





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});