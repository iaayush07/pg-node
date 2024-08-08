const anyModel = require('../models/anyModel.js');
const Joi = require('joi');

// Define Joi schema for data validation
const anysSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
});

// Create a new entry
const createAny = async (req, res) => {
    const { error } = anysSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name, email } = req.body;
    try {
        const any = await anyModel.createAny(name, email);
        res.status(201).json(any);
    } catch (err) {
        console.error('Error creating entry', err.stack);
        res.status(500).json({ error: 'Error creating entry' });
    }
};

// Get all entries
const getAllAnys = async (req, res) => {
    try {
        const anys = await anyModel.getAllAnys();
        res.status(200).json(anys);
    } catch (err) {
        console.error('Error fetching entries', err.stack);
        res.status(500).json({ error: 'Error fetching entries' });
    }
};

// Get a single entry by ID
const getAnyById = async (req, res) => {
    try {
        const any = await anyModel.getAnyById(req.params.id);
        if (!any) return res.status(404).json({ error: 'Entry not found' });
        res.status(200).json(any);
    } catch (err) {
        console.error('Error fetching entry', err.stack);
        res.status(500).json({ error: 'Error fetching entry' });
    }
};

// Update an entry by ID
const updateAnyById = async (req, res) => {
    const { error } = anysSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name, email } = req.body;
    try {
        const any = await anyModel.updateAnyById(req.params.id, name, email);
        if (!any) return res.status(404).json({ error: 'Entry not found' });
        res.status(200).json(any);
    } catch (err) {
        console.error('Error updating entry', err.stack);
        res.status(500).json({ error: 'Error updating entry' });
    }
};

// Delete an entry by ID
const deleteAnyById = async (req, res) => {
    try {
        const any = await anyModel.deleteAnyById(req.params.id);
        if (!any) return res.status(404).json({ error: 'Entry not found' });
        res.status(200).json(any);
    } catch (err) {
        console.error('Error deleting entry', err.stack);
        res.status(500).json({ error: 'Error deleting entry' });
    }
};

module.exports = {
    createAny,
    getAllAnys,
    getAnyById,
    updateAnyById,
    deleteAnyById,
};
