const mongoose = require('mongoose');
const { User, Thought } = require('./models');
const connection = require('./config/connection');

// Seed data
const users = [
  { username: 'user1', email: 'user1@example.com', friends: [] },
  { username: 'user2', email: 'user2@example.com', friends: [] },
];

const thoughts = [
  { thoughtText: 'Thought 1', username: 'user1', reactions: [] },
  { thoughtText: 'Thought 2', username: 'user2', reactions: [] }
];

connection.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    // Drop collections
    await Promise.all([User.deleteMany(), Thought.deleteMany()]);

    // Insert users
    const insertedUsers = await User.insertMany(users);
    console.log('Inserted users:', insertedUsers);

    // Insert thoughts
    const insertedThoughts = await Thought.insertMany(thoughts);
    console.log('Inserted thoughts:', insertedThoughts);

    // Add reactions to thoughts
    for (const thought of insertedThoughts) {
      const user = insertedUsers.find(user => user.username === thought.username);
      thought.reactions = [
        { reactionBody: 'Nice thought!', username: 'user1', reactionId: new mongoose.Types.ObjectId() },
        { reactionBody: 'Interesting!', username: 'user2', reactionId: new mongoose.Types.ObjectId() }
      ];
      await thought.save();
    }

    // Update friends for users
    for (const user of insertedUsers) {
      const otherUsers = insertedUsers.filter(u => u.username !== user.username);
      const friendData = otherUsers.map(u => ({ username: u.username, _id: u._id }));
      await User.updateOne({ _id: user._id }, { $push: { friends: { $each: friendData } } });
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
});

connection.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error.message);
});