const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

/**
 * Create a new user with hashed password
 * @param {string} email - User email
 * @param {string} password - Plain text password
 * @param {string} name - User name
 * @returns {Promise<Object>} Created user object (without password)
 */
const createUser = async (email, password, name) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const query = `
    INSERT INTO users (email, password, name)
    VALUES ($1, $2, $3)
    RETURNING id, email, name, created_at
  `;
  
  const result = await pool.query(query, [email, hashedPassword, name]);
  return result.rows[0];
};

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise<Object>} User object (includes password for verification)
 */
const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

/**
 * Get user by ID (without password)
 * @param {number} id - User ID
 * @returns {Promise<Object>} User object (without password)
 */
const getUserById = async (id) => {
  const query = 'SELECT id, email, name, created_at FROM users WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

/**
 * Verify password against hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} True if password matches
 */
const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  verifyPassword,
};

