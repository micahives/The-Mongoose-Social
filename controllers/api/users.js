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

        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Remove a friend from a user's friend list
    async removeFriend(req, res) {
        try {

        } catch (err) {
            res.status(500).json(err);
        }
    },
};