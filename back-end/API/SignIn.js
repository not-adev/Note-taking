import { User } from '../models/User';

export const handleSignIn = async (req, res) => {
    try {
        const { email } = req.body;


    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ code: 0, message: 'User not found' });
    }

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'fakdkhowrr9uwer34583jdf',
        { expiresIn: '7d' }
    );

    res.cookie('taoken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
    });

    res.status(200).json({ code: 1, message: 'Cookie set successfully' });
    } catch (error) {
        res.status(500).json({code : 0  , message : error.message})
    }
    

};
