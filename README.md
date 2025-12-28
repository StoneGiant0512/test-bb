# Project Dashboard Backend API

Backend API for the Mini SaaS Dashboard project management system.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client for Node.js

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database connection and configuration
├── controllers/
│   └── projectController.js # Business logic and request handling
├── routes/
│   └── projectRoutes.js     # API route definitions
├── services/
│   └── projectService.js    # Database operations
├── seeders/
│   └── seedProjects.js      # Database seeding script
├── server.js                 # Express server entry point
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=project_dashboard
DB_USER=postgres
DB_PASSWORD=your_password_here

PORT=5000
NODE_ENV=development
```

3. Create the PostgreSQL database:
```sql
CREATE DATABASE project_dashboard;
```

4. Run the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

### Database Seeding

To populate the database with dummy data:

```bash
npm run seed
```

This will:
- Create the projects table if it doesn't exist
- Clear existing data
- Insert 15 sample projects with various statuses

## API Endpoints

### Base URL
```
http://localhost:5000/api/projects
```

### Get All Projects
```http
GET /api/projects
```

**Query Parameters:**
- `status` (optional): Filter by status (`active`, `on hold`, `completed`)
- `search` (optional): Search by project name or assigned team member

**Example:**
```http
GET /api/projects?status=active&search=Mobile
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "Mobile App Development",
      "status": "active",
      "deadline": "2024-04-20",
      "assigned_team_member": "Michael Chen",
      "budget": "75000.00",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Get Single Project
```http
GET /api/projects/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "E-Commerce Platform Redesign",
    "status": "active",
    "deadline": "2024-03-15",
    "assigned_team_member": "Sarah Johnson",
    "budget": "50000.00",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Create Project
```http
POST /api/projects
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Project",
  "status": "active",
  "deadline": "2024-05-01",
  "assigned_team_member": "John Doe",
  "budget": 30000.00
}
```

**Response:**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": 16,
    "name": "New Project",
    "status": "active",
    "deadline": "2024-05-01",
    "assigned_team_member": "John Doe",
    "budget": "30000.00",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Update Project
```http
PUT /api/projects/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "status": "on hold",
  "deadline": "2024-06-01",
  "assigned_team_member": "Jane Smith",
  "budget": 35000.00
}
```

### Delete Project
```http
DELETE /api/projects/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

## Project Model

Each project has the following fields:

- `id` (Integer, Primary Key, Auto-increment)
- `name` (String, Required)
- `status` (String, Required) - Must be one of: `active`, `on hold`, `completed`
- `deadline` (Date, Required)
- `assigned_team_member` (String, Required)
- `budget` (Decimal, Required)
- `created_at` (Timestamp, Auto-generated)
- `updated_at` (Timestamp, Auto-updated)

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Scripts

- `npm start` - Start the server
- `npm run dev` - Start the server with nodemon (auto-reload)
- `npm run seed` - Seed the database with dummy data

## License

ISC

