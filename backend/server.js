const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error('DB connection error:', err));
