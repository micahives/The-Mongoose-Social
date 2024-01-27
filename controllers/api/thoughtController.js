const { Thought, User } = require('../../models');
const mongoose = require('mongoose');

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get a single thought by its _id
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v');

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      await User.findByIdAndUpdate(
        req.body.userId,
        { $push: { thoughts: thought._id } },
        { new: true }
      );
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Update a thought by its _id
  async updateThought(req, res) {
    try {
      const updatedThought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true });
      res.json(updatedThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a thought by its _id
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      await User.findByIdAndUpdate(
        thought.userId,
        { $pull: { thoughts: req.params.thoughtId } }
      );

      res.json({ message: 'Thought deleted.' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

// Create a reaction for a specific thought
async createReaction(req, res) {
  try {
    const { thoughtId } = req.params;
    const { reactionBody, username } = req.body;

    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    // Generate ObjectId for reactionId
    const reactionId = new mongoose.Types.ObjectId();

    // Push new reaction with generated reactionId
    thought.reactions.push({ reactionId, reactionBody, username });
    await thought.save();

    res.status(201).json(thought);
  } catch (error) {
    console.error('Error creating reaction:', error);
    res.status(500).json({ error: 'Server error' });
  }
},

  // Delete a reaction from a specific thought
  async deleteReaction(req, res) {
    try {
      // Extract thoughtId and reactionId from request parameters
      const { thoughtId, reactionId } = req.params;

      // Find the thought by its ID
      const thought = await Thought.findById(thoughtId);

      // Check if the thought exists
      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }

      // Filter out the reaction with the provided reactionId
      thought.reactions = thought.reactions.filter(reaction => reaction._id.toString() !== reactionId);

      // Save the updated thought
      await thought.save();

      // Respond with a success status
      res.status(200).json({ message: 'Reaction successfully deleted' });
    } catch (error) {
      // Handle errors
      console.error('Error deleting reaction:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
};
