const Channel = require('../models/Channel');
const Video = require('../models/Video');
const getTimestamp = require('../utils/getTimeStamp');

module.exports.channelController = async (req, res) => {

    const user = await Channel.findOne({handle: req.params.channel_handle}).populate('videos')

    const videos = await Video.find({channel: user._id}).populate('channel')

    res.render('pages/channel', {user, videos, getTimestamp})
}
