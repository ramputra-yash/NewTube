const Video = require('../models/Video');
const Channel = require('../models/Channel');
const cloudinary = require('cloudinary').v2;

module.exports.uploadVideo = async (req, res) => {
    let { title, description } = req.body;

    try {
        // User ka data fetch karein
        const user = await Channel.findOne({ handle: req.cookies.userhandle }).populate('subscribers');

        if (!user) {
            return res.status(404).send("User not found");
        }

        // Cloudinary pe video upload karein
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: "video", folder: "videos" },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            uploadStream.end(req.file.buffer);
        });

        console.log("✅ Cloudinary Upload Successful:", uploadResult);

        // Video save karein database me
        const video = await Video.create({
            videoId: uploadResult.public_id,  // Cloudinary se mila unique ID
            title,
            filename: uploadResult.secure_url, // Cloudinary ka video URL
            uid: user._id + Date.now(),
            description,
            length: req.file.size, // File ka size store karein
            channel: user._id,
        });

        // User ke videos me push karein
        user.videos.push(video._id);
        await user.save();

        // Subscribers ke liye notification
        const notificationMessage = `${user.handle} uploaded a new video: ${title}`;

        const notifications = user.subscribers
            .filter(subscriber => !subscriber._id.equals(user._id))
            .map(subscriber => ({
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

        // Bulk update notifications
        if (notifications.length > 0) {
            await Channel.bulkWrite(notifications);
        }

        res.redirect('/channel/' + user.handle);
    } catch (error) {
        console.error("❌ Error uploading video:", error.message);
        res.status(500).send("Error uploading video. Please try again.");
    }
};
