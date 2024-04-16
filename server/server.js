const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');
const { authenticateJWT } = require('./middlewares/auth');
const config = require('./config');
const session = require('express-session');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');


app.use(cors({
  origin: 'http://localhost:3000', // Replace with your client URL
  credentials: true // Allow cookies to be sent
}));
app.use(cookieParser());

// Middleware
app.use(express.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000
  }
}
));
app.use(passport.initialize());
app.use(passport.session()); // Use passport.session() after express-session


app.get('/logout', (req, res) => {
  // Passport.js logout with callback function
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
      res.status(500).json({ message: 'Failed to logout' });
    } else {
      res.status(200).json({ message: 'Logout successful' });
    }
  });
});


require('./config/passport');

// Routes
app.use('/auth', authRoutes);

// Protected route
app.get('/authorize', authenticateJWT);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/oauth2-nodejs')
  .then(() => {
    console.log('MongoDB connected');
    // Start server
    app.listen(5000, () => console.log('Server started on http://localhost:5000'));
  })
  .catch(err => console.error(err));
