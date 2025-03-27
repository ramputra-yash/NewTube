const Channel = require('../models/Channel');
const Video = require('../models/Video');
const getTimeStamp = require('../utils/getTimeStamp')

module.exports.studioController = async (req, res) => {
    const user = await Channel.findOne({ handle: req.cookies.userhandle }).populate('notifications');
    res.render('studio', { user, getTimeStamp });
}
module.exports.contentController = async (req, res) => {
    const user = await Channel.findOne({ handle: req.cookies.userhandle }).populate('videos');

    const videos = await Video.find({ channel: user._id }).populate('channel');

    res.render('pages/content', {user, videos, getTimeStamp});
}
module.exports.customizationController = async (req, res) => {
    const user = await Channel.findOne({ handle: req.cookies.userhandle }).populate('videos');
    res.render('pages/customization', {user});
}

module.exports.editController = async (req, res) => {
    const user = await Channel.findOne({ handle: req.cookies.userhandle });
    const video = await Video.findById(req.params.video_id);
    res.render('edit', { user, video, getTimeStamp });
}

module.exports.editPostController = async (req, res) => {
    const video = await Video.findByIdAndUpdate(req.params.video_id, {
        title: req.body.title,
        description: req.body.description,
    }, { new: true });

    res.redirect(`/channel/${req.cookies.userhandle}`);
}

module.exports.deleteController = async (req, res) => {
    await Video.findByIdAndDelete(req.params.video_id);
    res.redirect(`/channel/${req.cookies.userhandle}`);
}

module.exports.CustomizeProfileController = async (req, res) => {
    try {
        // Handle extract karo
        const handle = req.cookies.userhandle ? req.cookies.userhandle : req.params.handle;
        
        // Image URLs extract karo
        const bannerImageURL = req.files?.bannerImageURL?.[0]?.path || null;
        const logoURL = req.files?.logoURL?.[0]?.path || null;

        // User find karo aur update karo
        const updatedUser = await Channel.findOneAndUpdate(
            { handle: handle },
            {   
                name: req.body.channelname,
                description: req.body.description,
                ...(bannerImageURL && { bannerImageURL }),
                ...(logoURL && { logoURL })
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Redirect
        res.redirect(`/channel/${handle}`);
    } catch (error) {
        console.error("🚨 Error: ", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};