const express = require('express');
const router = express.Router();
const {studioController,contentController, customizationController, editController, editPostController, deleteController, CustomizeProfileController} = require('../controllers/studioController');
const { uploadVideo } = require('../controllers/videoController')
const { isLoggedIn } = require('../middlewares/isLoggedIn')
const upload = require('../middlewares/upload')
const imageUpload = require('../middlewares/imageUpload')

router.get('/channel/:handle/content', isLoggedIn, contentController);
router.get('/channel/:handle', isLoggedIn, studioController);
router.get('/channel/:handle/content/:video_id/edit', isLoggedIn, editController);
router.post('/channel/:handle/content/:video_id/edit', isLoggedIn, editPostController);
router.get('/channel/:handle/content/:video_id/delete', isLoggedIn, deleteController);
router.get('/channel/:handle/customization', isLoggedIn, customizationController);
router.post(
    '/channel/:handle/customization/edit',
    isLoggedIn,
    imageUpload.fields([
      { name: 'bannerImageURL', maxCount: 1 },
      { name: 'logoURL', maxCount: 1 }
    ]),
    CustomizeProfileController
  );
router.post('/channel/:handle/video/upload', isLoggedIn, upload.single('video_upload_file'), uploadVideo);

module.exports = router;