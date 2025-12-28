const { pool } = require('../config/database');

/**
 * Create projects table if it doesn't exist
 */
const createProjectsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'on hold', 'completed')),
      deadline DATE NOT NULL,
      assigned_team_member VARCHAR(255) NOT NULL,
      budget DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('✓ Projects table created or already exists');
  } catch (error) {
    console.error('✗ Error creating projects table:', error);
    throw error;
  }
};

/**
 * Create users table if it doesn't exist
 */
const createUsersTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('✓ Users table created or already exists');
  } catch (error) {
    console.error('✗ Error creating users table:', error);
    throw error;
  }
};

/**
 * Initialize all database tables
 * This function creates all required tables in the correct order
 */
const initializeDatabase = async () => {
  try {
    console.log('Initializing database tables...');
    
    // Create tables in order (if there are dependencies)
    await createProjectsTable();
    await createUsersTable();
    
    console.log('✓ Database initialized successfully');
  } catch (error) {
    console.error('✗ Error initializing database:', error);
    throw error;
  }
};

module.exports = {
  createProjectsTable,
  createUsersTable,
  initializeDatabase,
};

