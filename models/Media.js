const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mediaURL: { type: String, required: true },
    description: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Media = mongoose.model('Media', mediaSchema);
module.exports = Media;
