const express = require('express');
const cors = require('cors');
const { db } = require('./db/db'); // This should connect to MongoDB
const { readdirSync } = require('fs');
const path = require('path');  // For serving static files
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Automatically load all route files from the routes directory
readdirSync('./routes').map((route) =>
  app.use('/api/v1', require('./routes/' + route))
);

// Start server
const server = () => {
  db();
  app.listen(PORT, () => {
    console.log('Server listening on port:', PORT);
  });
};

server();
