const express = require('express');
const router = express.Router();
const { watchController, subscribeController, likeController, dislikeController, notificationController, commentController, commentLikeController, commentDislikeController, commentReplyController } = require('../controllers/watchController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');

router.get('/:video_id/like', isLoggedIn, likeController)
router.get('/:video_id/dislike', isLoggedIn, dislikeController)
router.get('/:video_id', isLoggedIn, watchController)
router.get('/:video_id/:notification_id', isLoggedIn, notificationController)
router.post('/:video_id/subscribe', isLoggedIn, subscribeController)
router.post('/:video_id/comment', isLoggedIn, commentController);
router.get('/:video_id/comment/:comment_id/like', isLoggedIn, commentLikeController)
router.get('/:video_id/comment/:comment_id/dislike', isLoggedIn, commentDislikeController)
router.post('/:video_id/comment/:comment_id/reply', isLoggedIn, commentReplyController)

module.exports = router;