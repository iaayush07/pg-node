const pool = require('../config/db.js');

const createAny = async (name, email) => {
    const query = 'INSERT INTO anys (name, email) VALUES ($1, $2) RETURNING *';
    const values = [name, email];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const getAllAnys = async () => {
    const query = 'SELECT * FROM anys';
    const result = await pool.query(query);
    return result.rows;
};

const getAnyById = async (id) => {
    const query = 'SELECT * FROM anys WHERE id = $1';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const updateAnyById = async (id, name, email) => {
    const query = 'UPDATE anys SET name = $1, email = $2 WHERE id = $3 RETURNING *';
    const values = [name, email, id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteAnyById = async (id) => {
    const query = 'DELETE FROM anys WHERE id = $1 RETURNING *';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

module.exports = {
    createAny,
    getAllAnys,
    getAnyById,
    updateAnyById,
    deleteAnyById,
};
