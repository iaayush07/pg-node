const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const pool = require('./config/db.js'); // Import the db pool
const anyRoutes = require('./routes/anyRoutes.js'); // Import the routes
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));

// Connect to PostgreSQL and create the anys table if it doesn't exist
pool.query(`
    CREATE TABLE IF NOT EXISTS anys (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE
    );
`)
    .then(() => {
        console.log('Anys table is ready');
        // Start the Express server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(err => console.error('Connection error', err.stack));

// Use the routes
app.use('/', anyRoutes);
