# TaskFlow — MERN Task Management Application

A full-stack Kanban-style task manager built with **MongoDB, Express, React, Node.js**.
Designed to be testable with **Selenium + JUnit 5** (15 test cases included).
   
---

## Application Overview

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React 18, React Router 6, Axios, React-Toastify |
| Backend   | Node.js, Express 4, JWT Auth, bcryptjs |
| Database  | MongoDB (via Mongoose)  |
| Testing   | Selenium WebDriver 4, JUnit 5, Maven |

### Features
- User registration & login (JWT-based)
- Dashboard with task statistics
- Full project CRUD (Create / Read / Update / Delete)
- Kanban board with 4 columns: **To Do → In Progress → Review → Done**
- Task CRUD with priority, assignee, due date, tags, comments
- Search & filter on Kanban board
- Role-based access control
- User profile page

---

## Prerequisites — Install These First

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | https://nodejs.org |
| MongoDB | 6+ | https://www.mongodb.com/try/download/community |
| Java JDK | 11+ | https://adoptium.net |
| Maven | 3.8+ | https://maven.apache.org/download.cgi |
| Google Chrome | Latest | https://www.google.com/chrome |

---

## Step-by-Step Setup

### Step 1 — Start MongoDB

Open **MongoDB Compass** and connect to:
```
mongodb://localhost:27017
```
The database `taskflow` will be created automatically when the app first runs.
You do **not** need to create anything manually.

---

### Step 2 — Install & Start the Backend

Open a terminal (Command Prompt or PowerShell):

```bash
cd taskflow/backend
npm install
npm run dev
```

You should see:
```
✅ MongoDB Connected to: mongodb://localhost:27017/taskflow
🚀 Server running on port 5000
```

---

### Step 3 — Install & Start the Frontend

Open a **second** terminal:

```bash
cd taskflow/frontend
npm install
npm start
```

React will open automatically at **http://localhost:3000**

---

### Step 4 — Use the Application

1. Open **http://localhost:3000**
2. Click **"Create one"** to register a new account
3. After registering you are logged in automatically
4. Click **"Projects"** in the navbar → **"+ New Project"**
5. Click your project card to open the **Kanban board**
6. Use the **+** button in any column to add tasks

---

### Step 5 — Verify with MongoDB Compass

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. You will see the **taskflow** database with three collections:
   - `users` — registered accounts
   - `projects` — your projects
   - `tasks` — all tasks

---

## Running Selenium + JUnit Tests

### Prerequisites for Tests
- Both backend (port 5000) and frontend (port 3000) must be running
- Google Chrome must be installed
- Java 11+ and Maven must be installed

### Step 1 — Create the Test User

Register the test account in the browser **once** before running any tests:

| Field | Value |
|-------|-------|
| Name | Test User |
| Email | testuser@taskflow.com |
| Password | test123456 |

Or run TC01 first — it registers a fresh unique user (but subsequent tests need the fixed credentials above).

### Step 2 — Run All Tests

```bash
cd taskflow/selenium-tests
mvn test
```

### Step 3 — Run a Specific Test Class

```bash
# Only auth tests
mvn test -Dtest=AuthTest

# Only project tests
mvn test -Dtest=ProjectTest

# Only task tests
mvn test -Dtest=TaskTest

# Only dashboard tests
mvn test -Dtest=DashboardNavigationTest
```

---

## Test Cases Summary

| ID   | Class                   | Description                                          |
|------|-------------------------|------------------------------------------------------|
| TC01 | AuthTest                | User can register a new account                     |
| TC02 | AuthTest                | Registration fails with mismatched passwords         |
| TC03 | AuthTest                | User can log in with valid credentials               |
| TC04 | AuthTest                | Login fails with wrong password                      |
| TC05 | AuthTest                | Unauthenticated user is redirected to /login         |
| TC06 | ProjectTest             | User can create a new project                        |
| TC07 | ProjectTest             | Projects page loads with all projects listed         |
| TC08 | ProjectTest             | User can edit an existing project                    |
| TC09 | ProjectTest             | User can delete a project                            |
| TC10 | TaskTest                | User can create a task in the Kanban board           |
| TC11 | TaskTest                | User can edit an existing task                       |
| TC12 | TaskTest                | User can move a task to 'In Progress'                |
| TC13 | TaskTest                | User can delete a task from the board                |
| TC14 | DashboardNavigationTest | Dashboard loads and displays stat cards              |
| TC15 | DashboardNavigationTest | Search filter on Kanban board filters tasks          |

---

## API Endpoints Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET  | /api/auth/me | Get current user |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | /api/projects | List all projects |
| POST | /api/projects | Create project |
| GET  | /api/projects/:id | Get project by ID |
| PUT  | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | /api/tasks?project=ID | List tasks (filterable) |
| POST | /api/tasks | Create task |
| GET  | /api/tasks/:id | Get task |
| PUT  | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| POST | /api/tasks/:id/comments | Add comment |
| DELETE | /api/tasks/:id/comments/:cid | Delete comment |

---

## Project Structure

```
taskflow/
├── backend/
│   ├── models/          # Mongoose schemas (User, Project, Task)
│   ├── routes/          # Express route handlers
│   ├── middleware/       # JWT auth middleware
│   ├── server.js         # App entry point
│   └── .env              # Environment variables
├── frontend/
│   ├── public/           # index.html
│   └── src/
│       ├── components/   # Navbar, TaskCard, TaskModal
│       ├── context/      # AuthContext (global auth state)
│       ├── pages/        # Login, Register, Dashboard, Projects, ProjectBoard, Profile
│       └── utils/        # Axios instance
└── selenium-tests/
    ├── pom.xml           # Maven config with Selenium + JUnit 5 deps
    └── src/test/java/com/taskflow/
        ├── utils/        # BaseTest (WebDriver setup, helpers)
        └── tests/        # AuthTest, ProjectTest, TaskTest, DashboardNavigationTest
```

---

## Troubleshooting

**MongoDB not connecting?**
- Make sure MongoDB service is running (Windows: check Services app)
- Or start it manually: `mongod --dbpath C:\data\db`

**Frontend can't reach backend?**
- Confirm backend is on port 5000 (`npm run dev` in `/backend`)
- The `"proxy": "http://localhost:5000"` in frontend/package.json handles CORS

**Selenium tests failing?**
- Make sure both servers are running before running tests
- Ensure the test user `testuser@taskflow.com` / `test123456` exists (register once)
- Chrome must be installed; WebDriverManager downloads ChromeDriver automatically

**npm install slow?**
- First install can take 2-5 minutes — this is normal
   
---

## Quick Start (Windows — one script)

```bash
cd taskflow
start-windows.bat
```

This opens two terminal windows for backend and frontend automatically.
