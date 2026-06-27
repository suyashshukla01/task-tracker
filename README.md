# TaskFlow — Task Tracker App

A full-stack task tracker built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- JWT authentication (register / login / logout) via httpOnly cookies
- Full CRUD for tasks — create, view, update, delete
- Kanban board with three columns: Todo / In Progress / Done
- Priority levels: High, Medium, Low
- Filter by status and priority
- Form validation on both client and server
- Responsive UI
- Dynamic updates without page refresh

## Tech Stack

| Layer    | Tech                          |
|----------|-------------------------------|
| Frontend | React + Vite, Tailwind CSS, Axios, React Router |
| Backend  | Node.js, Express.js           |
| Database | MongoDB (Mongoose)            |
| Auth     | JWT + httpOnly cookies        |

## Project Structure

```
task-tracker/
├── backend/
│   ├── models/         # User, Task
│   ├── routes/         # auth.js, tasks.js
│   ├── middleware/     # authMiddleware.js
│   └── server.js
└── frontend/
    └── src/
        ├── api/        # axios instance
        ├── context/    # AuthContext
        ├── components/ # TaskCard, TaskModal
        └── pages/      # Login, Register, Dashboard
```

## Local Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev
```

**Required `.env` variables:**
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/tasktracker
JWT_SECRET=your_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

**Required `.env` variables:**
```
VITE_API_URL=http://localhost:5000/api
```

## Deployment

- **Backend** → [Render](https://render.com) (free tier, set env vars in dashboard)
- **Frontend** → [Vercel](https://vercel.com) (set `VITE_API_URL` to your Render backend URL)

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET  | `/api/auth/me` | Get current user |

### Tasks (all protected)
| Method | Route | Description |
|--------|-------|-------------|
| GET    | `/api/tasks` | Get all tasks (supports `?status=&priority=`) |
| POST   | `/api/tasks` | Create task |
| PUT    | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
