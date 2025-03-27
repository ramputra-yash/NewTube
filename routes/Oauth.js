const express = require('express');
const router = express.Router();
const passport = require('passport');

// Route to initiate Google OAuth
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
}));

// Google callback route
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/', // Redirect on failure
    }),
    (req, res) => {
        res.cookie('userhandle', req.user.handle, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration (7 days)
        });
        res.redirect('/'); // Redirect to on success
    }
);

module.exports = router;
