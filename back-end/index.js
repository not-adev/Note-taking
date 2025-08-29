import express from 'express';
import { connectDB } from './helper/dbConnection.js';
import { handleSignIn } from './API/SignIn.js';
import { sendEmail } from './API/SendEmail.js';
const app = express();
connectDB() 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

const port = 3000;

app.post('/signin', handleSignIn);

app.post('/otpVerification' ,sendEmail)
app.post('/signup', handleSignUp);
app.get('/logout', (req, res) => {
  res.send('Hello World!');
});
app.post('/addNote', (req, res) => {
  res.send('Hello World!');
});
app.post('/deleteNote', (req, res) => {
  res.send('Hello World!');
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});