const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mediaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Media', required: true },
    comment: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;

