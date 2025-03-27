const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Channel = require('../models/Channel');
require('dotenv').config();

// Helper function to create a unique handle
const createUniqueHandle = require('../utils/createUniqueHandle');

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CB_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if channel already exists by email
                let channel = await Channel.findOne({ email: profile.emails[0].value });

                if (!channel) {
                    // Create unique handle if channel doesn't exist
                    const handle = await createUniqueHandle(profile.emails[0].value.split('@')[0]);
                    
                    channel = await Channel.create({
                        name: profile.displayName,
                        handle: handle,
                        email: profile.emails[0].value,
                        logoURL: profile.photos[0].value.split('=')[0],
                    });
                }

                // Return the user object to store in the session
                done(null, channel);
            } catch (err) {
                done(err, null);
            }
        }
    )
);

// Serialize user (store only channel ID in session)
passport.serializeUser((channel, done) => {
    done(null, channel.id);
});

// Deserialize user (retrieve channel from DB using ID)
passport.deserializeUser(async (id, done) => {
    try {
        const channel = await Channel.findById(id);
        done(null, channel);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
