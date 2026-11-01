# LearnSphere 🎓
### An Integrated Academic Resource Management and Industry Skill Development Platform
**Tagline:** *One platform. Endless possibilities.*  
**Academic Context:** College Problem Solving in Engineering (PSE) • Module 5 Capstone Project

---

## 🌟 Executive Summary

Engineering students frequently encounter two disconnected learning obstacles:
1. **Academic Fragmentation:** Essential notes, PPTs, lab manuals, and assignments are scattered across WhatsApp groups, Google Drive links, and college LMS portals.
2. **Skill-Gap Uncertainty:** Students lack clear insight into how their technical proficiencies compare against benchmark requirements for industry engineering roles.

**LearnSphere** solves both problems simultaneously within **ONE integrated platform**. Faculty upload and organize centralized course materials mapped to technical skills. Students select an industry career role, assess their proficiency on a 1–5 scale, receive transparent mathematical skill-gap diagnostics, get curated academic resources and mini-projects linked to their gaps, and follow a sequenced, persistent learning roadmap.

---

## 🚀 Key Features & Integrated Capabilities

- **Unified Authentication & RBAC:** Single sign-on with role-based access control protecting Student, Faculty, and Admin endpoints.
- **Centralized Academic Resource Hub:** Full-text search and multi-attribute filtering (subject, unit, topic, type, difficulty, skill) with secure downloads.
- **Rule-Based Skill-Gap Engine:** Deterministic calculation using exact formula:
  $$\text{Skill Gap} = \max(\text{Target Proficiency} - \text{Current Proficiency}, 0)$$
  $$\text{Gap Percentage} = \left(\frac{\text{Skill Gap}}{\text{Target}}\right) \times 100$$
- **Integrated Resource-to-Skill Recommendations:** Recommends actual academic notes and practice projects directly associated with identified gap skills.
- **Personalized Learning Roadmap:** Sequenced activities prioritizing highest gaps first, featuring dynamic progress tracking (Not Started $\rightarrow$ In Progress $\rightarrow$ Completed) that persists across sessions.
- **Administrative Governance:** System administrators configure target career roles, required proficiency levels (1–5), review platform statistics, and manage user accounts.

---

## 🛠️ Mandatory Technology Stack

- **Frontend:** React 19, JavaScript (ES6+), Tailwind CSS v4, React Router v7, Lucide Icons
- **Backend:** Node.js v22, Express.js REST API, JSON Web Tokens (JWT), bcryptjs password hashing, Multer file upload handling
- **Database:** MySQL 8.0 with `mysql2` connection pool, normalized 12-table relational schema with foreign key constraints and parameterized queries (includes embedded resilient fallback engine)
- **Environment:** Windows 11 local execution, 100% runnable without paid APIs or cloud dependencies

---

## ⚡ Quick Start Instructions (Windows PowerShell)

### 1. Prerequisites
Ensure Node.js and MySQL 8.0 are installed on your Windows machine.

### 2. Start the Backend API Server (Port 5000)
```powershell
cd C:\Users\Advit\.gemini\antigravity-ide\scratch\LearnSphere\backend
npm start
```
*The Express server will start on `http://localhost:5000`.*

### 3. Start the Frontend Application (Port 5173)
```powershell
cd C:\Users\Advit\.gemini\antigravity-ide\scratch\LearnSphere\frontend
npm run dev
```
*Open your browser to: **`http://localhost:5173`**.*

### 4. Run Automated Backend Test Suite
```powershell
cd C:\Users\Advit\.gemini\antigravity-ide\scratch\LearnSphere\backend
npm test
```
*(Runs 19 automated tests validating health, authentication, RBAC, calculations, and roadmap persistence).*

---

## 🔑 Pre-Configured Demonstration Accounts

| Role | Email | Password | What to Test |
|---|---|---|---|
| **Student** | `student@learnsphere.edu` | `Student@123` | Search resources, assess skills, view roadmap, update progress |
| **Faculty** | `faculty@learnsphere.edu` | `Faculty@123` | Upload resources, map to skills, version and archive materials |
| **Admin** | `admin@learnsphere.edu` | `Admin@123` | Manage accounts, configure career role benchmark requirements |

*(The login screen includes quick-fill buttons for instant demo evaluation).*

---

## 📊 End-to-End Demonstration Workflow

1. **Sign In as Student:** Use the quick-fill button to log in as Aarav Patel (`student@learnsphere.edu`).
2. **Explore Resource Library:** Click **Resource Library**, filter by subject or search `JavaScript` to view faculty notes and slides.
3. **Select Career Benchmark:** Navigate to **Career Roles** and click **Start Skill Assessment** on **Junior Web Developer**.
4. **Complete Assessment:** Review the 1–5 scale guidelines, adjust proficiency ratings, and click **Calculate Skill Gaps**.
5. **Review Diagnostics:** Inspect the calculated skill gaps (e.g. Target 4, Current 2 $\rightarrow$ 50% gap) and curated academic resource recommendations.
6. **Open Learning Roadmap:** Track your progress as you complete activities, toggle statuses to **In Progress** and **Completed**, and watch the completion meter update in real-time.
7. **Switch to Faculty:** Sign out and log in as `faculty@learnsphere.edu` to upload a lecture note or view uploaded resources.
8. **Switch to Admin:** Sign out and log in as `admin@learnsphere.edu` to inspect real platform statistics, manage user roles, and adjust required skill benchmark levels.

---

## 📑 Documentation Links

- [Setup & Installation Guide](docs/setup-guide.md)
- [System Architecture & Database Schema](docs/architecture.md)
- [REST API Reference](docs/api-guide.md)
- [Testing & Verification Checklist](docs/testing-checklist.md)

---

## ⚠️ Academic Disclaimer

LearnSphere is developed for college Problem Solving in Engineering (PSE) Module 5 to validate technical feasibility and usability of integrating academic resource management with skill-gap analysis. Skill assessments are self-reported diagnostic indicators designed to guide learning, not a guarantee of employment or verified industry competence.
