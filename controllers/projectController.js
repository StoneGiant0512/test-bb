const projectService = require('../services/projectService');

/**
 * Get all projects with optional filtering and pagination
 * @route GET /api/projects
 * @query page - Page number (default: 1)
 * @query limit - Items per page (default: 10)
 * @query sortBy - Field to sort by (default: created_at)
 * @query sortOrder - Sort order: asc or desc (default: desc)
 */
const getAllProjects = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      search: req.query.search,
    };

    const pagination = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'DESC',
    };

    const result = await projectService.getAllProjects(filters, pagination);
    
    res.status(200).json({
      success: true,
      count: result.pagination.totalCount,
      data: result.projects,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error in getAllProjects controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message,
    });
  }
};

/**
 * Get a single project by ID
 * @route GET /api/projects/:id
 */
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await projectService.getProjectById(parseInt(id));

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error in getProjectById controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message,
    });
  }
};

/**
 * Create a new project
 * @route POST /api/projects
 */
const createProject = async (req, res) => {
  try {
    const { name, status, deadline, assigned_team_member, budget } = req.body;

    // Validation
    if (!name || !status || !deadline || !assigned_team_member || budget === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, status, deadline, assigned_team_member, budget',
      });
    }

    // Validate status
    const validStatuses = ['active', 'on hold', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    // Validate budget is a number
    if (isNaN(budget) || budget < 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget must be a positive number',
      });
    }

    // Validate deadline is a valid date
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Deadline must be a valid date',
      });
    }

    const projectData = {
      name,
      status,
      deadline,
      assigned_team_member,
      budget: parseFloat(budget),
    };

    const newProject = await projectService.createProject(projectData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: newProject,
    });
  } catch (error) {
    console.error('Error in createProject controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message,
    });
  }
};

/**
 * Update an existing project
 * @route PUT /api/projects/:id
 */
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, deadline, assigned_team_member, budget } = req.body;

    // Check if project exists
    const existingProject = await projectService.getProjectById(parseInt(id));
    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: `Project with ID ${id} not found`,
      });
    }

    // Validation - all fields are required for update
    if (!name || !status || !deadline || !assigned_team_member || budget === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, status, deadline, assigned_team_member, budget',
      });
    }

    // Validate status
    const validStatuses = ['active', 'on hold', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    // Validate budget is a number
    if (isNaN(budget) || budget < 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget must be a positive number',
      });
    }

    // Validate deadline is a valid date
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Deadline must be a valid date',
      });
    }

    const projectData = {
      name,
      status,
      deadline,
      assigned_team_member,
      budget: parseFloat(budget),
    };

    const updatedProject = await projectService.updateProject(parseInt(id), projectData);

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject,
    });
  } catch (error) {
    console.error('Error in updateProject controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating project',
      error: error.message,
    });
  }
};

/**
 * Delete a project
 * @route DELETE /api/projects/:id
 */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await projectService.deleteProject(parseInt(id));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Project with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteProject controller:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message,
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};

