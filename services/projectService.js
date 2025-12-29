const { pool } = require('../config/database');

/**
 * Get all projects from the database with pagination
 * @param {Object} filters - Optional filters (status, search)
 * @param {Object} pagination - Pagination options (page, limit, sortBy, sortOrder)
 * @returns {Promise<Object>} Object with projects array and pagination metadata
 */
const getAllProjects = async (filters = {}, pagination = {}) => {
  try {
    let query = 'SELECT * FROM projects WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) FROM projects WHERE 1=1';
    const params = [];
    let paramCount = 1;

    // Filter by status if provided
    if (filters.status && filters.status !== 'all') {
      query += ` AND status = $${paramCount}`;
      countQuery += ` AND status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    // Search by name or assigned team member if provided
    if (filters.search) {
      query += ` AND (name ILIKE $${paramCount} OR assigned_team_member ILIKE $${paramCount})`;
      countQuery += ` AND (name ILIKE $${paramCount} OR assigned_team_member ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
      paramCount++;
    }

    // Get total count
    const countResult = await pool.query(countQuery, params);
    const totalCount = parseInt(countResult.rows[0].count);

    // Sorting
    const sortBy = pagination.sortBy || 'created_at';
    const sortOrder = pagination.sortOrder || 'DESC';
    const validSortFields = ['name', 'status', 'deadline', 'assigned_team_member', 'budget', 'created_at'];
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY ${safeSortBy} ${safeSortOrder}`;

    // Pagination
    const page = parseInt(pagination.page) || 1;
    const limit = parseInt(pagination.limit) || 10;
    const offset = (page - 1) * limit;

    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    
    const totalPages = Math.ceil(totalCount / limit);

    return {
      projects: result.rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

/**
 * Get a single project by ID
 * @param {number} id - Project ID
 * @returns {Promise<Object>} Project object
 */
const getProjectById = async (id) => {
  try {
    const query = 'SELECT * FROM projects WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    throw error;
  }
};

/**
 * Create a new project
 * @param {Object} projectData - Project data (name, status, deadline, assigned_team_member, budget)
 * @returns {Promise<Object>} Created project object
 */
const createProject = async (projectData) => {
  try {
    const { name, status, deadline, assigned_team_member, budget } = projectData;
    
    const query = `
      INSERT INTO projects (name, status, deadline, assigned_team_member, budget)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [name, status, deadline, assigned_team_member, budget];
    const result = await pool.query(query, values);
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

/**
 * Update an existing project
 * @param {number} id - Project ID
 * @param {Object} projectData - Updated project data
 * @returns {Promise<Object>} Updated project object
 */
const updateProject = async (id, projectData) => {
  try {
    const { name, status, deadline, assigned_team_member, budget } = projectData;
    
    const query = `
      UPDATE projects
      SET name = $1,
          status = $2,
          deadline = $3,
          assigned_team_member = $4,
          budget = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;
    
    const values = [name, status, deadline, assigned_team_member, budget, id];
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

/**
 * Delete a project by ID
 * @param {number} id - Project ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
const deleteProject = async (id) => {
  try {
    const query = 'DELETE FROM projects WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};

