const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema({
    thoughtText: { type: String, required: true, minlength: 1, maxlength: 280 },
    createdAt: { type: Date, default: Date.now },
    username: { type: String, required: true },
    reactions: [reactionSchema],
},
{
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true },
}
);

// Virtual to retrieve length of reactions array
thoughtSchema
    .virtual('reactionCount')
    .get(function () {
        return `${this.reactions.length}`;
    });

// Virtual to format createdAt date
thoughtSchema
    .virtual('formattedCreatedAt')
    .get(function () {
        return this.createdAt.toLocaleString();
    });

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;