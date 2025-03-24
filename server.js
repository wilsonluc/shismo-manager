import express from "express";
import cors from "cors";
import next from "next";
import passport from "passport";
import passportDiscord from "passport-discord";
import { config } from "dotenv";
import session from "express-session";

config();

const { Strategy: DiscordStrategy } = passportDiscord;
const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  const corsOptions = {
    methods: ["GET", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  if (process.env.NODE_ENV === 'production') {
    corsOptions.origin = "https://manager.shismoplugins.com";  // TODO: Update with domain
  } else {
    corsOptions.origin = "http://localhost:3000";  // Local development URL
  }

  // Initialize session middleware
  server.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: false,
    })
  );

  // Initialize passport after session middleware
  server.use(passport.initialize());
  server.use(passport.session());

  // Passport Discord strategy setup
  passport.use(
    new DiscordStrategy(
      {
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: process.env.DISCORD_CALLBACK_URL,
        scope: ["identify", "email"],
      },
      (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );

  // Serialize and deserialize user
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  // Route to fetch user data
  server.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.status(200).json({ user: req.user });
    } else {
      res.status(200).json({ user: null });
    }
  });

  // Discord OAuth routes
  server.get("/auth/discord", passport.authenticate("discord"));
  server.get(
    "/auth/discord/callback",
    passport.authenticate("discord", {
      failureRedirect: "/",
    }),
    (req, res) => {
      res.redirect("/");
    }
  );

  // Logout
  server.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to log out" });
      }
      // Clear the session
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to destroy session" });
        }
        res.status(200).json({ message: "Logged out successfully" });
      });
    });
  });

  // Catch-all route handler for Next.js pages
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  // Start the server
  server.listen(process.env.PORT, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log("> Ready on http://0.0.0.0:" + process.env.PORT);
  });  
});
