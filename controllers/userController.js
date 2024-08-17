const User = require('../models/User');


exports.updateUserProfile = async (req, res) => {
    const { username, email } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;

        const updatedUser = await user.save();

        res.json({
            userId: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteUserAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        res.json({ message: 'User account deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
