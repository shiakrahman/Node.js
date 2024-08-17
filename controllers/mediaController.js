const Media = require('../models/Media');
const multer = require('multer');
const path = require('path');
const Comment = require('../models/Comment');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});


const upload = multer({ storage });

exports.uploadMedia = [
    upload.single('mediaFile'),
    async (req, res) => {
        const { description } = req.body;
        try {
            const media = await Media.create({
                userId: req.user._id,
                mediaURL: req.file.path,
                description,
            });
            res.status(201).json({
                mediaId: media._id,
                mediaURL: media.mediaURL,
                description: media.description,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
];

exports.deleteMedia = async (req, res) => {
    const { mediaId } = req.params;
    try {
        console.log('User:', req.user); // Log user details
        console.log('Media ID:', mediaId); // Log media ID

        const media = await Media.findById(mediaId);
        if (!media) return res.status(404).json({ message: 'Media not found' });

        await Media.deleteOne({ _id: mediaId });
        res.json({ message: 'Media deleted successfully' });
    } catch (error) {
        console.error('Error:', error); // Log error
        res.status(400).json({ message: error.message });
    }
};



// Like a media post
exports.likeMedia = async (req, res) => {
    const { mediaId } = req.params;
    try {
        const media = await Media.findById(mediaId);
        if (!media) return res.status(404).json({ message: 'Media not found' });

        if (media.likes.includes(req.user._id)) {
            return res.status(400).json({ message: 'You have already liked this media' });
        }

        media.likes.push(req.user._id);
        await media.save();
        res.json({
            mediaId: media._id,
            likesCount: media.likes.length,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Comment on a media post
exports.commentOnMedia = async (req, res) => {
    const { mediaId } = req.params;
    const { comment } = req.body;
    try {
        const media = await Media.findById(mediaId);
        console.log(media);
        if (!media) return res.status(404).json({ message: 'Media not found' });

        const newComment = await Comment.create({
            userId: req.user._id,
            mediaId: media._id,
            comment,
        });

        res.status(201).json({
            commentId: newComment._id,
            comment: newComment.comment,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

