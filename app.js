const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const passport = require('passport');
const expressSession = require('express-session');
const indexRoute = require('./routes/index');
const watchRoute = require('./routes/watch');
const channelRoute = require('./routes/channel');
const studioRoute = require('./routes/studio');
const OauthRoute = require('./routes/Oauth');
const db = require('./config/connecting-db');
require('./config/googleStrategy');
db();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
}))
app.use(passport.initialize());
app.use(passport.session());

app.get('/logout', (req, res) => {
  try {
    // Application ke session ya authentication cookie ko clear karo
    res.clearCookie('userhandle'); // Yahan apne cookie ka naam do

    // Agar session use karte ho to destroy karo
    if (req.session) {
        req.session.destroy(() => {
            console.log('Session destroyed');
        });
    }

    // Redirect to login page ya home page
    res.redirect('/');
} catch (err) {
    console.error('Logout error:', err);
    res.status(500).send('Logout failed');
}
})

app.use('/', indexRoute);
app.use('/auth', OauthRoute);
app.use('/watch', watchRoute);
app.use('/channel', channelRoute);
app.use('/studio', studioRoute);

app.get('*', (req, res) => {
  res.render('error')
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listening on ${port}`)
})