const mongoose = require('mongoose')
const { Schema } = mongoose


const videoSchema = new Schema({
    videoId: { type: String, required: true },
    title: { type: String, required: true },
    filename: { type: String, required: true },
    uid: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    likes: [{ type: Schema.Types.ObjectId, ref: "Channel" }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: "Channel" }],
    commentsStatus: { type: Boolean, default: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    viewsCount: [{ type: Schema.Types.ObjectId, ref: 'Channel' }],
    uploadDate: { type: Date },
    length: { type: Number },
    channel: { type: Schema.Types.ObjectId, ref: "Channel" }

}, { timestamps: true })

videoSchema.index({ title: 'text', description: 'text' })
videoSchema.index({ channel: 1 })
videoSchema.index({ length: 1 })
videoSchema.index({ uploadDate: 1 })

const Video = mongoose.model("Video", videoSchema)

module.exports = Video