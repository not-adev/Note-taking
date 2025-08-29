import User from '../models/User.js';

export const handleSignUp = async (req, res) => {

    try {
        const { email, name } = req.body;
        if (!email || !name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        console.log("hi from fdlflj")



        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(200).json({ code: 0, error: 'user aredy exist' });
        }

        // Create and save new user
        user = new User({ email, name });
        await user.save();

        return res.status(200).json({ code: 1, message: 'User created', id : user._id });
    } catch (err) {
        console.error('Error in handleUserAuth:', err);
        res.status(500).json({ error: 'Internal server error' });
    }


}