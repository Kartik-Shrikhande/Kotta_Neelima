require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

// Route imports
const galleryRoutes = require('./routes/galleryRoutes'); // Adjusted path
const adminRoutes = require('./routes/adminRoutes');     // Adjusted path

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/gallery', galleryRoutes);
mongoose.set('bufferCommands', false);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL, {
  connectTimeoutMS: 100000,
  socketTimeoutMS: 100000,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((error) => console.error('❌ MongoDB connection error:', error));

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
