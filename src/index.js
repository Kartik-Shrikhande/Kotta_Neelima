require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const cookieParser = require('cookie-parser');



// Route imports
const galleryRoutes = require('./routes/galleryRoutes'); // Adjusted path
const adminRoutes = require('./routes/adminRoutes');     // Adjusted path
const mediaRoutes = require('./routes/mediaRoutes');
const pressRoutes = require('./routes/pressRoutes');
const articleRoutes = require('./routes/articleRoutes'); // Adjusted pat
const resetPasswordRoutes = require('./routes/resetPasswordRoute'); // Adjusted path
const hakkuRoutes = require('./routes/hakkuRoutes'); // Adjusted path
const pressReleaseRoutes = require('./routes/pressReleaseRoutes'); // Adjusted path
// Initialize express app 



const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//current in use
// const allowedOrigins = [
//     "http://localhost:5173",
//     "https://connect2-uni.vercel.app",

// ];
// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/press', pressRoutes);
app.use('/api/article', articleRoutes);
app.use('/api/password', resetPasswordRoutes);
app.use('/api/hakku', hakkuRoutes);
app.use('/api/press-release', pressReleaseRoutes);

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
