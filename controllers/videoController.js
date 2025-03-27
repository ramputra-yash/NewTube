const Video = require('../models/Video')
const Channel = require('../models/Channel')

module.exports.uploadVideo = async (req, res) => {
    let { title, description } = req.body;

    try {
        // Video upload karne wale user ka data
        const user = await Channel.findOne({ handle: req.cookies.userhandle }).populate('subscribers');

        if (!user) {
            return res.status(404).send("User not found");
        }

        // Naya video create karo
        const video = await Video.create({
            videoId: req.file.filename + Date.now(),
            title,
            filename: req.file.filename,
            uid: user._id + Date.now(),
            description,
            length: req.file.length,
            channel: user._id,
        });

        // Apne videos me push karo
        user.videos.push(video._id);
        await user.save();

        // Notification message
        const notificationMessage = `${user.handle} uploaded a new video: ${title}`;

        // Apne aap ko exclude karke subscribers ko filter karo
        const notifications = user.subscribers
            .filter((subscriber) => !subscriber._id.equals(user._id)) // Apne aap ko exclude kar rahe hain
            .map((subscriber) => ({
                updateOne: {
                    filter: { _id: subscriber._id },
                    update: {
                        $push: {
                            notifications: {
                                message: notificationMessage,
                                videoId: video._id,
                                createdAt: new Date(),
                            },
                        },
                    },
                },
            }));

        // Subscribers ko notification bhejo (Bulk update for efficiency)
        if (notifications.length > 0) {
            await Channel.bulkWrite(notifications);
        }
        res.redirect('/channel/' + user.handle);
    } catch (error) {
        console.error("❌ Error uploading video:", error.message);
        res.status(500).send("Error uploading video. Please try again.");
    }
};
