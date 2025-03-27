const mongoose = require('mongoose')
const { Schema } = mongoose

const replycommentSchema = new Schema({
    video: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
    channel: { type: Schema.Types.ObjectId, ref: 'Channel', required: true },
    text: { type: String, trim: true, required: true },
    comment: {type: Schema.Types.ObjectId, ref: 'Comment', required: true  },
    postedDate: { type: Date, default: Date.now },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Channel' }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: 'Channel' }],
})

const replyComment = mongoose.model('Replycomment', replycommentSchema)

module.exports = replyComment