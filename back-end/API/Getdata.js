import User from "../models/User.js";
import jwt from "jsonwebtoken"
export async function handleGetData(req, res) {
    console.log("get data")
    const JWT_SECRET = process.env.JWT_SECRET || "fakdkhowrr9uwer34583jdf"; 

   

    const token = req.cookies.token; 

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const uesrId = jwt.verify(token, JWT_SECRET);
        console.log(uesrId)
        const user = await User.findOne({ _id :uesrId.userId },{_id : 0});
        console.log(user)
       return res.status(200).json({userData : user ,  message: 'successfull ' });
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

