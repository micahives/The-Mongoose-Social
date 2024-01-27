const { User } = require('../../models');

module.exports = {
    // Get all users
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },

    // Get a single user
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId }).select('-__v');

            if (!user) {
                return res.status(404).json({ error: 'Not Found', message: 'No user with that ID' });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },

    // Create a new user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.status(200).json(user);
        } catch (err) {
            res.status(400).json({ error: 'Bad Request', details: err.message });
        }
    },

    // Update a user
    async updateUser(req, res) {
        try {
            const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
            
            if (!user) {
                return res.status(404).json({ error: 'Not Found', message: 'No user with that ID' });
            }

            res.json(user);
        } catch (err) {
            res.status(400).json({ error: 'Bad Request', details: err.message });
        }
    },

    // Delete a user
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });

            if (!user) {
                return res.status(404).json({ error: 'Not Found', message: 'No user with that ID' });
            }

            res.status(200).end();
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },

    // Add a new friend to a user's friend list
    async addFriend(req, res) {
        try {
            const user = await User.findById(req.params.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            const friend = await User.findById(req.params.friendId);
            if (!friend) {
                return res.status(404).json({ message: 'Friend not found' });
            }
    
            if (user.friends.includes(friend._id)) {
                return res.status(400).json({ message: 'User is already friends with this user' });
            }
    
            user.friends.push(friend._id);
            await user.save();
    
            res.status(200).json({ message: 'Friend added successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },

    // Remove a friend from a user's friend list
    async removeFriend(req, res) {
        try {
            const user = await User.findById(req.params.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            const friendIndex = user.friends.indexOf(req.params.friendId);
            if (friendIndex === -1) {
                return res.status(400).json({ message: 'User is not friends with this user' });
            }
    
            user.friends.splice(friendIndex, 1);
            await user.save();
    
            res.status(200).json({ message: 'Friend removed successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    }
};