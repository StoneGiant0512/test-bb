const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { createTable } = require('./config/database');
const projectRoutes = require('./routes/projectRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database table on startup
createTable()
  .then(() => {
    console.log('Database initialized successfully');
  })
  .catch((error) => {
    console.error('Error initializing database:', error);
  });

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Project Dashboard API',
    version: '1.0.0',
    endpoints: {
      projects: '/api/projects',
    },
  });
});

app.use('/api/projects', projectRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/projects`);
});

module.exports = app;

