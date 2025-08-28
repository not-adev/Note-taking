import express from 'express';
import { connectDB } from './helper/dbConnection.js';
const app = express();
connectDB() 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

const port = 3000;

app.post('/signin', (req, res) => {
  res.send('Hello World!');
});
app.post('/signup', (req, res) => {
  res.send('Hello World!');
});
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