# Task Management Web Application

This is a simple Task Management Web Application developed for the Day 1 Ability Assessment Task.

The application allows users to create, view, edit, delete and manage tasks.

## Live Links

Frontend: https://task-management-app-chi-khaki-60.vercel.app/

Backend: https://task-management-backend-z2qc.onrender.com/

## Technologies Used

- React
- Vite
- JavaScript
- CSS
- Node.js
- Express.js
- MongoDB
- Mongoose

## Features

- Add a new task
- View all tasks
- Edit a task
- Delete a task
- Change task status
- Mark task as completed
- Set task priority
- Search tasks
- Filter tasks by status
- Basic validation
- Responsive design

## Task Details

Each task contains:

- Title
- Description
- Status
- Priority
- Created date
- Updated date

Status:
- Pending
- In Progress
- Completed

Priority:
- Low
- Medium
- High

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/tasks | Create task |
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/:id | Get one task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

## Project Structure

```text
task-management-app
│
├── frontend
│   └── src
│       ├── App.jsx
│       ├── App.css
│       └── main.jsx
│
├── backend
│   ├── controllers
│   │   └── taskController.js
│   ├── models
│   │   └── Task.js
│   ├── routes
│   │   └── taskRoutes.js
│   ├── server.js
│   └── package.json
│
└── README.md