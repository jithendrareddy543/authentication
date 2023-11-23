const crypto = require('crypto');
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;
const secretKey = crypto.randomBytes(32).toString('hex');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// Sample in-memory user data (replace with a database in a real app)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  country: String,
  mobile: Number,
  password: String,
});

const Registration = mongoose.model('Registration', userSchema);

app.use(bodyParser.json());

// Endpoint for user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists
  const user = await Registration.findOne({ name: username, password });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });

  // Return the token to the client
  res.json({ token });
});

// Middleware to verify JWT on protected routes
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    req.user = decoded;
    next();
  });
}

// Example protected route
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
