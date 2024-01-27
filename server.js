const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const thoughtRoutes = require('./routes/thoughtRoutes');
const connection = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/thoughts', thoughtRoutes);

connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

connection.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error.message);
});