const express = require('express');
const router = express.Router();
const {channelController} = require('../controllers/channelController');
const { isLoggedIn } = require('../middlewares/isLoggedIn')

router.get('/:channel_handle', isLoggedIn, channelController)

module.exports = router;