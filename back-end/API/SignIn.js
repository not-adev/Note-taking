import User from '../models/User.js';
import jwt from "jsonwebtoken"

export const handleSignIn = async (req, res) => {
    try {
        const { email, maxAge } = req.body;
        console.log(maxAge)

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ code: 0, message: 'User not found' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'fakdkhowrr9uwer34583jdf',
            { expiresIn: '3d' }
        );
        if (maxAge) {
            res.cookie('token', token, {
                httpOnly: true,
                secure:true ,
                sameSite: 'none',
                maxAge: 3 * 24 * 60 * 60 * 1000, // 7 days 
                path: '/',
            });
        }
        else {
            res.cookie('token', token, {
                httpOnly: true,
                secure: true ,
                sameSite: 'none',
                path: '/',
            });

        }




        res.status(200).json({ code: 1, message: 'Cookie set successfully' });
    } catch (error) {
        res.status(500).json({ code: 0, message: error.message })
    }


};
