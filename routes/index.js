const express = require('express');
const router = express.Router();
const {indexController, otherChannelController, searchController} = require('../controllers/indexController')

router.get('/search', searchController)
router.get('/', indexController)
router.get('/:userhandle', otherChannelController);

module.exports = router;