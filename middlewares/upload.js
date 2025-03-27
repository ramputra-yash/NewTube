const multer  = require('multer')
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/videos/')
  },
  filename: function (req, file, cb) {
    const fn = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, fn + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })
module.exports = upload;