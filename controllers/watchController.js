const Video = require('../models/Video');
const Channel = require('../models/Channel');
const getTimestamp = require('../utils/getTimeStamp');
const Comment = require('../models/Comment');
const ReplyComment = require('../models/ReplyComment')

module.exports.watchController = async (req, res) => {

    const video = await Video.findOne({ _id: req.params.video_id }).populate('channel');
    
    const AllVideos = await Video.find({ _id: { $ne: req.params.video_id } }).populate('channel');
    
    const user = await Channel.findOne({handle: req.cookies.userhandle});

    const comments = await Comment.find({ video: video._id }).populate('channel')
    .populate({
        path: 'replies',
        model: 'Replycomment', // Ensure correct model name
        populate: { path: 'channel' },
    });
    
    if (user && !video.viewsCount.includes(user._id)) {
        video.viewsCount.push(user._id);
        await user.save();
        await video.save();
    }

    res.render('watch', {user, video, comments, AllVideos, getTimestamp});
}

module.exports.subscribeController = async (req, res) => {

    const user = await Channel.findOne({handle: req.cookies.userhandle});
    
    const video = await Video.findOne({_id: req.params.video_id}).populate('channel');

    if (!video.channel.subscribers.includes(user._id)) {
        video.channel.subscribers.push(user._id);
        await video.channel.save();
    } else {
        video.channel.subscribers = video.channel.subscribers.filter(subscriber => subscriber.toString() !== user._id.toString());
        await video.channel.save();
    }

    res.redirect('/watch/' + req.params.video_id);

}

module.exports.likeController = async (req, res) => {
    const user = await Channel.findOne({ handle: req.cookies.userhandle });
    const video = await Video.findOne({ _id: req.params.video_id }).populate('channel');

    // Remove dislike if it exists
    video.dislikes = video.dislikes.filter(dislike => dislike.toString() !== user._id.toString());

    // Toggle like
    if (!video.likes.includes(user._id)) {
        video.likes.push(user._id);
    } else {
        video.likes = video.likes.filter(like => like.toString() !== user._id.toString());
    }

    await video.save();
    res.redirect('/watch/' + req.params.video_id);
};

module.exports.dislikeController = async (req, res) => {
    const user = await Channel.findOne({ handle: req.cookies.userhandle });
    const video = await Video.findOne({ _id: req.params.video_id }).populate('channel');

    // Remove like if it exists
    video.likes = video.likes.filter(like => like.toString() !== user._id.toString());

    // Toggle dislike
    if (!video.dislikes.includes(user._id)) {
        video.dislikes.push(user._id);
    } else {
        video.dislikes = video.dislikes.filter(dislike => dislike.toString() !== user._id.toString());
    }

    await video.save();
    res.redirect('/watch/' + req.params.video_id);
};

module.exports.commentController = async (req, res) => {
    const channel = await Channel.findOne({ handle: req.cookies.userhandle });
    const video = await Video.findOne({ _id: req.params.video_id }).populate('channel');

    try {
        const comment = await Comment.create({
            video: video._id,
            channel: channel._id,
            text: req.body.comment,
        })
    
        video.comments.push(comment._id);
        await video.save();
    
        res.redirect('/watch/' + req.params.video_id);
    }
    catch (error) {
        console.error(error);
        res.send("Error saving comment. Please try again.");
    }

}

module.exports.commentLikeController = async (req, res) => {
    const user = await Channel.findOne({ handle: req.cookies.userhandle });
    const comment = await Comment.findOne({ _id: req.params.comment_id }).populate('channel');

    // Remove dislike if it exists
    comment.dislikes = comment.dislikes.filter(dislike => dislike.toString()!== user._id.toString());
    // Toggle like
    if (!comment.likes.includes(user._id)) {
        comment.likes.push(user._id);
    } else {
        comment.likes = comment.likes.filter(like => like.toString()!== user._id.toString());
    }
    await comment.save();
    res.redirect('/watch/' + comment.video);

}

module.exports.commentDislikeController = async (req, res) => {
    const user = await Channel.findOne({ handle: req.cookies.userhandle });
    const comment = await Comment.findOne({ _id: req.params.comment_id }).populate('channel');
    // Remove like if it exists
    comment.likes = comment.likes.filter(like => like.toString()!== user._id.toString());
    // Toggle dislike
    if (!comment.dislikes.includes(user._id)) {
        comment.dislikes.push(user._id);
    } else {
        comment.dislikes = comment.dislikes.filter(dislike => dislike.toString()!== user._id.toString());
    }
    await comment.save();
    res.redirect('/watch/' + comment.video);
};

module.exports.commentReplyController = async (req, res) => {
    const channel = await Channel.findOne({ handle: req.cookies.userhandle });
    const comment = await Comment.findOne({ _id: req.params.comment_id }).populate('channel');
    const video = await Video.findOne({ _id: comment.video }).populate('channel');

    try {
        const reply = await ReplyComment.create({
            video: video._id,
            channel: channel._id,
            comment: comment._id,
            text: req.body.reply_comment,
        })
    
        comment.replies.push(reply._id);
        await comment.save();
    
        res.redirect('/watch/' + video._id);
    }
    catch (error) {
        console.error(error);
        res.send("Error saving reply. Please try again.");
    }

}

module.exports.notificationController = async (req, res) => {
    try {
        const { notification_id, video_id } = req.params;

        // User ko find karo
        const user = await Channel.findOne({ handle: req.cookies.userhandle });

        if (!user) {
            return res.status(404).send("User not found");
        }

        // Notification ko filter karke remove karo
        user.notifications = user.notifications.filter(
            (notification) => notification._id.toString() !== notification_id
        );

        // Save karo updated user
        await user.save();

        // Redirect to the video page
        res.redirect('/watch/' + video_id);
    } catch (error) {
        console.error("❌ Error deleting notification:", error.message);
        res.status(500).send("Error deleting notification");
    }
};
