const getTimestamp = require('../utils/getTimeStamp');
const Channel = require('../models/Channel');
const Video = require('../models/Video');

module.exports.indexController = async (req, res) => {

    const videos = await Video.find().populate('channel');

    const user = await Channel.findOne({handle: req.cookies.userhandle});

    res.render('index', {user, videos, getTimestamp});
}

module.exports.otherChannelController = async (req, res) => {
    const user = await Channel.findOne({handle: req.cookies.userhandle}).populate('videos');

    const otherUser = await Channel.findOne({handle: req.params.userhandle}).populate('videos');

    if(otherUser) {
        const videos = await Video.find({channel: otherUser._id}).populate('channel');
        res.render('pages/otherchannel', {user, videos, otherUser, getTimestamp})
    }

}

module.exports.searchController = async (req, res) => {
    try {
        const query = req.query.q;

        const user = await Channel.findOne({ handle: req.cookies.userhandle }).populate('notifications');

        // Perform case-insensitive search on title, description, or tags
        const videos = await Video.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } }
            ]
        }).populate('channel');

        res.render('searched', {user, videos, query, getTimestamp });
    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).send('Internal Server Error');
    }
}