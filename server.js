require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());

// ✅ Serve static files
app.use(express.static('public'));

// ✅ API routes
app.use('/api/auth', authRoutes);

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
