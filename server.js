const express = require('express');
const next = require('next');
const passport = require('passport');
const session = require('express-session');
const passportDiscord = require('passport-discord');
const dotenv = require('dotenv');

dotenv.config();

const { Strategy: DiscordStrategy } = passportDiscord;
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));

  passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'email'],
  }, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }));

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  server.use(passport.initialize());
  server.use(passport.session());

  // Define /api/user route
  server.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
      // Send user data if authenticated
      res.status(200).json({ user: req.user });
    } else {
      // If not authenticated, send null or an empty user object
      res.status(401).json({ user: null });
    }
  });

  server.get('/auth/discord', passport.authenticate('discord'));
  server.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/',
  }), (req, res) => {
    res.redirect('/');
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(process.env.PORT, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});