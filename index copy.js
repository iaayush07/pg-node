const express = require('express');
const { Client } = require('pg');
const Joi = require('joi');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));

// PostgreSQL client setup
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Connect to PostgreSQL and create the anys table if it doesn't exist
client.connect()
    .then(() => {
        console.log('Connected to PostgreSQL');
        return client.query(`
            CREATE TABLE IF NOT EXISTS anys (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE
            );
        `);
    })
    .then(() => {
        console.log('Anys table is ready');
        // Start the Express server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(err => console.error('Connection error', err.stack));

// Define Joi schema for data validation
const anysSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
});

// Create a new entry
app.post('/anys', async (req, res) => {
    const { error } = anysSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name, email } = req.body;
    const query = 'INSERT INTO anys (name, email) VALUES ($1, $2) RETURNING *';
    const values = [name, email];
    try {
        const result = await client.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating entry', err.stack);
        res.status(500).json({ error: 'Error creating entry' });
    }
});

// Get all entries
app.get('/anys', async (req, res) => {
    const query = 'SELECT * FROM anys';
    try {
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching entries', err.stack);
        res.status(500).json({ error: 'Error fetching entries' });
    }
});

// Get a single entry by ID
app.get('/anys/:id', async (req, res) => {
    const query = 'SELECT * FROM anys WHERE id = $1';
    const values = [req.params.id];
    try {
        const result = await client.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching entry', err.stack);
        res.status(500).json({ error: 'Error fetching entry' });
    }
});

// Update an entry by ID
app.put('/anys/:id', async (req, res) => {
    const { error } = anysSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name, email } = req.body;
    const query = 'UPDATE anys SET name = $1, email = $2 WHERE id = $3 RETURNING *';
    const values = [name, email, req.params.id];
    try {
        const result = await client.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating entry', err.stack);
        res.status(500).json({ error: 'Error updating entry' });
    }
});

// Delete an entry by ID
app.delete('/anys/:id', async (req, res) => {
    const query = 'DELETE FROM anys WHERE id = $1 RETURNING *';
    const values = [req.params.id];
    try {
        const result = await client.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error deleting entry', err.stack);
        res.status(500).json({ error: 'Error deleting entry' });
    }
});
