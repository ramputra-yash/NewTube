
const Channel = require('../models/Channel')

async function createUniqueHandle(baseHandle) {
    let handle = baseHandle
    let oldhandle = await Channel.findOne({ handle });
    if (!oldhandle) return handle
    while (await Channel.findOne({ handle })) {
      const randomDigits = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      const candidateHandles = Array.from({ length: 10 }, () => `${baseHandle}${randomDigits}`)
      const existingHandles = await Channel.find({ handle: { $in: candidateHandles } }, 'handle')
      const existingSet = new Set(existingHandles.map(doc => doc.handle))
      handle = candidateHandles.find(candidate => !existingSet.has(candidate))
    }
    return handle
}

module.exports = createUniqueHandle;
  