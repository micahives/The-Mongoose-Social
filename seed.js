const mongoose = require('mongoose');
const { User, Thought } = require('./models');
const connection = require('./config/connection');

// Seed data
const users = [
  { username: 'user1', email: 'user1@example.com' },
  { username: 'user2', email: 'user2@example.com' }
];

const thoughts = [
  { thoughtText: 'Thought 1', username: 'user1' },
  { thoughtText: 'Thought 2', username: 'user2' },
];

// Establish connection to MongoDB
connection.once('open', () => {
  console.log('Connected to MongoDB');

  User.insertMany(users)
    .then((insertedUsers) => {
      console.log('Inserted users:', insertedUsers);
      
      // Map user IDs to thoughts
      const thoughtsWithUserIds = thoughts.map(thought => ({
        ...thought,
        userId: insertedUsers.find(user => user.username === thought.username)._id
      }));

      // Insert thoughts
      return Thought.insertMany(thoughtsWithUserIds);
    })
    .then((insertedThoughts) => {
      console.log('Inserted thoughts:', insertedThoughts);
      console.log('Database seeded successfully');

      mongoose.connection.close();
    })
    .catch((error) => {
      console.error('Error seeding database:', error);
    });
});

connection.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error.message);
});