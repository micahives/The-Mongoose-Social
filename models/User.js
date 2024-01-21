const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    // Includes regex to match a valid email address
    email: { type: String, required: true, unique: true, match: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/ },
    thoughts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thought',
      }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
});

// Virtual friendCount that retrieves the length of the friends array
userSchema
  .virtual('friends')
  .get(function () {
    return `${this.friends.length}`;
  });

// Initializes user model
const User = model('User', userSchema);

module.exports = User;