# LearnSphere — Setup & Installation Guide

## 1. Prerequisites (Windows 11)

- **Node.js**: v18.0.0 or higher (v22.20.0+ verified)
- **npm**: v9.0.0 or higher
- **MySQL**: MySQL 8.0 Server running locally on port 3306

---

## 2. Directory Structure

The project is structured into frontend, backend, SQL scripts, and documentation:

```text
LearnSphere/
├── frontend/             # React 19 + Tailwind CSS + Vite
│   ├── src/
│   │   ├── components/  # Navbar, Footer, RoleProtectedRoute
│   │   ├── context/     # AuthContext (JWT session management)
│   │   ├── pages/       # Student, Faculty, Admin, Auth views
│   │   ├── services/    # api.js fetch client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env
├── backend/              # Node.js + Express + MySQL / Relational Engine
│   ├── src/
│   │   ├── config/      # database.js, initialData.js
│   │   ├── controllers/ # auth, resource, assessment, roadmap, user
│   │   ├── middleware/  # JWT auth, RBAC, Multer upload, error handler
│   │   ├── repositories/# Relational database query repositories
│   │   ├── routes/      # Express REST routes
│   │   ├── services/    # Rule engine, recommendation, roadmap services
│   │   └── app.js       # Main server entrypoint
│   ├── sql/
│   │   ├── schema.sql   # Relational DDL schema script
│   │   └── seed.sql     # Seed data script
│   ├── uploads/         # Local file upload directory
│   ├── package.json
│   └── .env
└── docs/                # Project architecture & test documentation
```

---

## 3. Configuration (.env)

### Backend Configuration (`backend/.env`):

```ini
PORT=5000
NODE_ENV=development

# MySQL 8.0 Connection
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=learnsphere_db

# JWT Security
JWT_SECRET=learnsphere_jwt_super_secure_academic_dev_secret_2026_key
JWT_EXPIRES_IN=7d

# File Upload Settings
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=25

# Allowed Client Origin
CLIENT_ORIGIN=http://localhost:5173
```

> **Note on MySQL Connectivity:** If your local MySQL root password differs, update `DB_PASSWORD` in `backend/.env`. LearnSphere includes an embedded relational fallback engine so the application starts and operates with full fidelity even before credentials are set.

### Frontend Configuration (`frontend/.env`):

```ini
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 4. Database Initialization

To initialize the MySQL database schema and seed data manually using MySQL CLI:

```powershell
# Open Windows PowerShell
Get-Content backend\sql\schema.sql | & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
Get-Content backend\sql\seed.sql | & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

Or run the Node.js database initialization runner:

```powershell
cd backend
npm run db:init
```

---

## 5. Starting the Application

### Step 1: Start Backend (Port 5000)

```powershell
cd C:\Users\Advit\.gemini\antigravity-ide\scratch\LearnSphere\backend
npm start
```

### Step 2: Start Frontend (Port 5173)

```powershell
cd C:\Users\Advit\.gemini\antigravity-ide\scratch\LearnSphere\frontend
npm run dev
```

Open your browser to: **`http://localhost:5173`**

---

## 6. Pre-Configured Demonstration Accounts

| Role | Email | Password | Primary Capabilities |
|---|---|---|---|
| **Student** | `student@learnsphere.edu` | `Student@123` | Search resources, assess skills, view personalized roadmap, track progress |
| **Faculty** | `faculty@learnsphere.edu` | `Faculty@123` | Upload resources, categorize by unit/topic, map to skills, archive items |
| **Admin** | `admin@learnsphere.edu` | `Admin@123` | Manage all accounts, configure career role benchmark requirements (1–5) |

*(Quick-fill buttons are provided on the login page for instantaneous evaluation).*
