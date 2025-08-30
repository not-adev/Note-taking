import User from "../models/User.js";
import jwt from "jsonwebtoken"
export const handleSignUp_with_Google = async (req, res) => {
    try {

        const { email, name, picture } = req.body;
        if (!email || !name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        let user = await User.findOne({ email });
        // Create and save new user
        if (!user) {
            console.log("creating user ")
            user = new User({ email, name, picture });
            await user.save();
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'fakdkhowrr9uwer34583jdf',
            { expiresIn: '3d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3 * 24 * 60 * 60 * 1000, // 7 days 
            path: '/',
        });

        return res.status(200).json({ code: 1, message: 'google login complete ', id: user._id });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ code: 0, message: error.message });
    }

}
