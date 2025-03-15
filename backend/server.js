const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://afsanashehrin:tMhBWYZPzHspyT4K@cluster0.pxygg.mongodb.net/Crud_app?retryWrites=true&w=majority&appName=Cluster0',);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model('User', userSchema,'user');
app.get('/', (req, res) => {
    res.send('Welcome to the User Management API!');
  });

app.post('/user', async (req, res) => {
    try {
        const { name, email } = req.body;
        const newUser = new User({ name, email });
        await newUser.save();
        res.status(201).json(newUser);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
});

app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, { name, email }, { new: true });
        res.json(updatedUser);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(204).send();
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});